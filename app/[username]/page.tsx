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

  // Check if this is the current user's profile
  const isOwnProfile = currentUser?.user_metadata?.username === params.username;

  // If it's not the user's own profile, we'll add support for viewing other profiles later
  // For now, only allow viewing your own profile
  if (!isOwnProfile) {
    notFound();
  }

  return <ProfileContent isOwnProfile={true} username={params.username} />;
}
