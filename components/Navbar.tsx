import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Game Tracker
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
