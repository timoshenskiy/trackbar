import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProfileContent } from "./profile-content";
import Sidebar from "@/components/Sidebar";
import { getServerUser } from "@/utils/supabase/server-auth";
import Header from "@/components/main/header";
import Footer from "@/components/main/footer";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();

  // Get the current logged-in user
  const currentUser = await getServerUser();

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
    <div className="min-h-screen bg-quokka-darker text-quokka-light">
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
