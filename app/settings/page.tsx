import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { UserSettingsForm } from "./user-settings-form";
import Sidebar from "@/components/Sidebar";

const SettingsPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="flex">
        <Sidebar />
        <div className="space-y-8 w-[100%] p-8">
          <h1 className="text-3xl font-bold">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettingsForm
                initialData={{
                  fullName: user.user_metadata.full_name,
                  username: user.user_metadata.username,
                  bio: user.user_metadata.bio,
                  avatarUrl: user.user_metadata.avatar_url,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Connections</CardTitle>
              <CardDescription>Connect your gaming accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-green-500"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div>
                    <Label htmlFor="steam" className="font-semibold text-lg">
                      Steam
                    </Label>
                    <p className="text-sm text-green-500">Connected</p>
                  </div>
                </div>
                <Button variant="outline" className="w-32" disabled>
                  Connected
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-500/10 to-gray-500/5 rounded-lg border border-gray-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-500"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </div>
                  <div>
                    <Label htmlFor="gog" className="font-semibold text-lg">
                      GOG
                    </Label>
                    <p className="text-sm text-gray-500">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" className="w-32">
                  Connect GOG
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
