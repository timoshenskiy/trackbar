import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Gamepad2, Users, Bell, Settings, LogOut, Search, Plus, Trophy, Flame, Heart } from "lucide-react";
import SignOutButton from "./SignOutButton";
import { SidebarSearch } from "./SidebarSearch";
import { getServerUser } from "@/utils/supabase/server-auth";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

const Sidebar = async () => {
  const user = await getServerUser();

  const navigation = [
    { name: "Home", href: "/", icon: Home, description: "Dashboard" },
    ...(user
      ? [
        {
          name: "My Games",
          href: `/${user.user_metadata.username}`,
          icon: Gamepad2,
          description: "Your collection"
        },
      ]
      : []),
    { name: "Discover", href: "/discover", icon: Flame, description: "Find new games" },
    { name: "Trending", href: "/trending", icon: Trophy, description: "Popular now" },
    { name: "Wishlist", href: "/wishlist", icon: Heart, description: "Games you want" },
    { name: "Community", href: "/community", icon: Users, description: "Connect with others" },
    { name: "Settings", href: "/settings", icon: Settings, description: "Preferences" },
  ];

  return (
    <div className="w-20 md:w-64 border-r border-quokka-purple/10 bg-quokka-darker/50 flex flex-col h-screen sticky top-0 pt-20">
      {/* Main Navigation */}
      <div className="px-3 py-6 flex-1 overflow-y-auto scrollbar-hide">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = item.href === `/${user?.user_metadata.username}` && user;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                  isActive 
                    ? "text-quokka-cyan bg-quokka-purple/10 border-l-2 border-quokka-cyan" 
                    : "text-quokka-light/60 hover:text-quokka-light hover:bg-quokka-purple/5"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-quokka-purple/20 text-quokka-cyan" 
                    : "text-quokka-light/40 group-hover:text-quokka-cyan"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="hidden md:block">{item.name}</span>
                
                {/* Tooltip for mobile view */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-quokka-dark text-quokka-light text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 md:hidden">
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Add Game Button */}
      <div className="p-3 border-t border-quokka-purple/10">
        <Button 
          className="w-full bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 transition-opacity text-white rounded-lg flex items-center justify-center gap-2 py-2.5"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:block">Add Game</span>
        </Button>
      </div>
      
      {/* User Section */}
      {user && (
        <div className="p-3 border-t border-quokka-purple/10">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-quokka-dark/30 hover:bg-quokka-dark/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-quokka-purple/20 flex items-center justify-center text-quokka-cyan font-bold">
              {user.user_metadata.username?.[0].toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block overflow-hidden">
              <div className="text-sm font-medium text-quokka-light truncate">
                {user.user_metadata.username || user.user_metadata.full_name || user.email}
              </div>
              <div className="text-xs text-quokka-light/40 truncate">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
