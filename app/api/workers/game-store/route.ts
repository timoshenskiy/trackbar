import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { storeIGDBResults } from "@/utils/search/store";
import { GameSearchResult } from "@/utils/types/game";

// Number of messages to process in one batch
const BATCH_SIZE = 30;

export async function POST() {
  const supabase = await createClient();

  try {
    // Read messages from the queue
    const { data: messages, error: readError } = await supabase.rpc(
      "dequeue_games",
      {
        p_queue_name: "game_store_queue",
        p_count: BATCH_SIZE,
        p_visibility_timeout: 30,
      }
    );

    if (readError) {
      console.error("Error reading from queue:", readError);
      return NextResponse.json(
        { error: "Failed to read from queue", details: readError },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ message: "No messages to process" });
    }

    console.log("Received messages:", messages);

    // Process the messages
    const games: GameSearchResult[] = [];
    const processedMsgIds: number[] = [];

    for (const msg of messages) {
      try {
        // Parse the message content
        const game = JSON.parse(
          typeof msg.message === "string"
            ? msg.message
            : JSON.stringify(msg.message)
        );
        games.push(game);
        processedMsgIds.push(msg.msg_id);
      } catch (e) {
        console.error("Error parsing message:", e, "Message was:", msg);
      }
    }

    // Store the games in PostgreSQL
    if (games.length > 0) {
      console.log("Storing games:", games.length);
      await storeIGDBResults(games);
    }

    // Archive processed messages
    for (const msgId of processedMsgIds) {
      const { error: archiveError } = await supabase.rpc(
        "archive_game_message",
        {
          p_queue_name: "game_store_queue",
          p_msg_id: msgId,
        }
      );

      if (archiveError) {
        console.error(`Error archiving message ${msgId}:`, archiveError);
      }
    }

    return NextResponse.json({
      processed: processedMsgIds.length,
      remaining: messages.length - processedMsgIds.length,
      messages: messages, // Include messages in response for debugging
    });
  } catch (error) {
    console.error("Worker error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
