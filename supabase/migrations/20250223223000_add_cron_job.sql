-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to process the game queue
CREATE OR REPLACE FUNCTION public.process_game_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_batch_size INTEGER := 25;  -- Number of messages to process in one batch
    v_processed INTEGER := 0;
    v_msg RECORD;
    v_game JSONB;
    v_queue_name TEXT := 'game_store_queue';
BEGIN
    -- Log start of processing
    RAISE NOTICE 'Starting to process game queue at %', now();
    
    -- Process up to v_batch_size messages
    FOR v_msg IN 
        SELECT * FROM pgmq.read(v_queue_name, 60, v_batch_size)
    LOOP
        BEGIN
            v_processed := v_processed + 1;
            v_game := v_msg.message::jsonb;
            
            RAISE NOTICE 'Processing message % with game ID %', v_msg.msg_id, v_game->>'id';
            
            -- Insert or update the game in the database
            INSERT INTO public.games (
                id, 
                name, 
                slug, 
                summary, 
                storyline, 
                first_release_date,
                created_at,
                updated_at
            ) VALUES (
                (v_game->>'id')::integer,
                v_game->>'name',
                v_game->>'slug',
                v_game->>'summary',
                v_game->>'storyline',
                (v_game->>'first_release_date')::bigint,
                (v_game->>'created_at')::bigint,
                now()
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                slug = EXCLUDED.slug,
                summary = EXCLUDED.summary,
                storyline = EXCLUDED.storyline,
                first_release_date = EXCLUDED.first_release_date,
                updated_at = now();
                
            -- Archive the message
            PERFORM pgmq.archive(v_queue_name, v_msg.msg_id);
            RAISE NOTICE 'Successfully processed and archived message %', v_msg.msg_id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log the error and continue
            RAISE WARNING 'Error processing message %: %', v_msg.msg_id, SQLERRM;
        END;
    END LOOP;
    
    -- Log completion
    RAISE NOTICE 'Finished processing game queue at %. Processed % messages.', now(), v_processed;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.process_game_queue() TO postgres;
-- Only service_role should be able to directly call the process function
GRANT EXECUTE ON FUNCTION public.process_game_queue() TO service_role;

-- Drop existing cron job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('process-game-queue');
EXCEPTION WHEN OTHERS THEN
    -- Job doesn't exist, that's fine
END $$;

-- Schedule the cron job to run every minute
-- Note: pg_cron runs jobs as the user who created the job (postgres in this case)
SELECT cron.schedule(
    'process-game-queue',           -- job name
    '* * * * *',                    -- cron schedule (every minute)
    $$SELECT public.process_game_queue()$$  -- SQL command to execute
);

-- Add a comment to the job
COMMENT ON FUNCTION public.process_game_queue() IS 'Processes messages from the game_store_queue and stores them in the games table';

-- Create a function to manually check queue status
CREATE OR REPLACE FUNCTION public.check_queue_status()
RETURNS TABLE (
    queue_name TEXT,
    active_messages BIGINT,
    archived_messages BIGINT,
    deadletter_messages BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_active BIGINT;
    v_archived BIGINT;
    v_deadletter BIGINT;
BEGIN
    -- Check if tables exist and get counts
    BEGIN
        SELECT count(*) INTO v_active FROM pgmq.q_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_active := 0;
    END;
    
    BEGIN
        SELECT count(*) INTO v_archived FROM pgmq.a_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_archived := 0;
    END;
    
    BEGIN
        SELECT count(*) INTO v_deadletter FROM pgmq.d_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_deadletter := 0;
    END;
    
    -- Return the results
    queue_name := 'game_store_queue';
    active_messages := v_active;
    archived_messages := v_archived;
    deadletter_messages := v_deadletter;
    RETURN NEXT;
    RETURN;
END;
$$;

-- Create a function to manually trigger the queue processing
CREATE OR REPLACE FUNCTION public.trigger_process_game_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.process_game_queue();
END;
$$;

-- Grant execute permission on the status and trigger functions
-- Status function can be accessed by all roles since it's read-only
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO postgres;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO anon;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO service_role;

-- Only grant trigger function to postgres and service_role
GRANT EXECUTE ON FUNCTION public.trigger_process_game_queue() TO postgres;
GRANT EXECUTE ON FUNCTION public.trigger_process_game_queue() TO service_role; 