import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, Users, Bell, Settings } from "lucide-react";
import SignOutButton from "./SignOutButton";
import { SidebarSearch } from "./SidebarSearch";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";

const Sidebar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    ...(user
      ? [
          {
            name: "My Games",
            href: `/${user.user_metadata.username}`,
            icon: Gamepad2,
          },
        ]
      : []),
    // { name: "Community", href: "/community", icon: Users },
    // { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-quokka-dark/10 p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-quokka-cyan flex items-center justify-center">
          🎮
        </div>
        <span className="text-quokka-light font-bold text-xl">PLAYING QUOKKA</span>
        <span className="text-xs text-quokka-light/40">beta</span>
      </div>

      {/* User Profile */}
      {user ? (
        <div className="flex items-center gap-3 mb-6">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={`${user.user_metadata.username}'s avatar`}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user.user_metadata.username?.[0].toUpperCase() ?? "U"}
            </div>
          )}

          <div>
            <div className="font-medium">
              {user.user_metadata.full_name || user.user_metadata.username}
            </div>
            <div className="text-sm text-gray-400">
              @{user.user_metadata.username}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/auth">Sign in</Link>
          </Button>
        </div>
      )}

      <SidebarSearch />

      <nav className="space-y-1 flex-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
              "text-quokka-light/40 hover:text-quokka-light hover:bg-quokka-purple/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <SignOutButton />
    </div>
  );
};

export default Sidebar;
