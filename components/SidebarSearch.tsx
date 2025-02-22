"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import AddGameModal from "./AddGameModal";

export function SidebarSearch() {
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsAddGameModalOpen(true)}
        className="w-full bg-[#7FFFD4] text-black rounded-full py-3 px-4 mb-8 flex items-center gap-2 hover:bg-[#6FE5C4] transition-colors"
      >
        <Search className="w-5 h-5" />
        Game
      </button>

      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
      />
    </>
  );
}
