"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import GameSearchModal from "./GameSearchModal";

export function SidebarSearch() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="w-full bg-quokka-cyan text-quokka-dark rounded-full py-3 px-4 mb-8 flex items-center gap-2 hover:bg-quokka-cyan/80 transition-colors"
      >
        <Search className="w-5 h-5" />
        Search Games
      </button>

      <GameSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
