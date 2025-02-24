import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProfileContent } from "./profile-content";
import Sidebar from "@/components/Sidebar";

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

  // Get user by username from metadata
  const { data: userData, error } = await supabase.rpc("get_user_by_username", {
    p_username: params.username,
  });

  // If no user found with this username, return 404
  if (!userData || error) {
    console.error("Error finding user:", error);
    notFound();
  }

  // Check if this is the current user's profile (for edit permissions)
  const isOwnProfile = currentUser?.user_metadata?.username === params.username;

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="flex">
        <Sidebar />
        <ProfileContent
          isOwnProfile={isOwnProfile}
          username={userData.username}
          fullName={userData.full_name}
          avatarUrl={userData.avatar_url}
        />
      </div>
    </div>
  );
}
