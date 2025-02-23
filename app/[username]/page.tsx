import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProfileContent } from "./profile-content";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  // Get the current logged-in user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // Check if this is the current user's profile (for edit permissions)
  const isOwnProfile = currentUser?.user_metadata?.username === params.username;

  return (
    <ProfileContent
      isOwnProfile={isOwnProfile}
      username={params.username}
      fullName={currentUser?.user_metadata?.full_name}
    />
  );
}
