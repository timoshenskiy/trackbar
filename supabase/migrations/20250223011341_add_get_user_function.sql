-- Create the function
create or replace function public.get_user_by_username(p_username text)
returns json
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_result json;
begin
  -- Get the user metadata
  select json_build_object(
    'id', au.id,
    'full_name', au.raw_user_meta_data->>'full_name',
    'avatar_url', au.raw_user_meta_data->>'avatar_url',
    'username', au.raw_user_meta_data->>'username'
  )
  into v_result
  from auth.users au
  where (au.raw_user_meta_data->>'username')::text = p_username;

  -- Return the result (will be null if no user found)
  return v_result;
end;
$$; 