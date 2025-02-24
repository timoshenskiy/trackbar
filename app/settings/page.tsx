import { getServerUser } from "@/utils/supabase/server-auth";
import { redirect } from "next/navigation";
import { UserSettingsForm } from "./user-settings-form";
import Header from "@/components/main/header";
import Footer from "@/components/main/footer";
import Sidebar from "@/components/Sidebar";
import { Shield, User, Bell, Gamepad2, CreditCard } from "lucide-react";

export default async function SettingsPage() {
  const user = await getServerUser();

  // If no user is logged in, redirect to auth page
  if (!user) {
    redirect("/auth");
  }

  const initialData = {
    fullName: user.user_metadata.full_name,
    username: user.user_metadata.username,
    bio: user.user_metadata.bio,
    avatarUrl: user.user_metadata.avatar_url,
  };

  const settingsTabs = [
    { name: "Profile", icon: User, active: true },
    { name: "Account", icon: Shield, active: false },
    { name: "Notifications", icon: Bell, active: false },
    { name: "Gaming", icon: Gamepad2, active: false },
    { name: "Billing", icon: CreditCard, active: false },
  ];

  return (
    <div className="min-h-screen bg-quokka-darker text-quokka-light">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Settings Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-quokka-light">Settings</h1>
              <p className="text-quokka-light/60 mt-2">Manage your account preferences and profile</p>
            </div>
            
            {/* Settings Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                    tab.active
                      ? "bg-quokka-purple text-white"
                      : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
            
            {/* Settings Content */}
            <UserSettingsForm initialData={initialData} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
