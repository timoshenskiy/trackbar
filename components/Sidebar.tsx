import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, Users, Bell, Settings } from "lucide-react";
import SignOutButton from "./SignOutButton";
import { SidebarSearch } from "./SidebarSearch";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

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
        <div className="w-12 h-12 rounded-full bg-quokka-cyan flex items-center justify-center">
          <Logo size={50} />
        </div>
        <span className="text-quokka-light font-bold text-xl">QUOKKA</span>
        <span className="text-xs text-quokka-light/40">beta</span>
      </div>
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
