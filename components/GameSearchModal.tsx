"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGameSearch } from "@/hooks/useGameSearch";
import AddGameModal from "./AddGameModal";
import { GameSearchResult } from "@/utils/types/game";
import { useQuery } from "@tanstack/react-query";
import { igdbAdapter } from "@/adapters/igdb";

interface GameSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameSearchModal({
  isOpen,
  onClose,
}: GameSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: searchResults, isLoading } = useGameSearch({
    query: searchQuery,
    enabled: searchQuery.length > 2,
  });

  const handleGameSelect = (game: GameSearchResult) => {
    setSelectedGame(game);
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setSelectedGame(null);
  };

  const handleGameAdded = () => {
    handleAddModalClose();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-quokka-dark border-0 text-quokka-light max-w-2xl p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2C2C2C] border-none text-white placeholder:text-gray-400"
            />
          </div>

          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center text-gray-400">Searching...</div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((game) => (
                <div
                  key={game.id}
                  className="flex gap-4 bg-[#2C2C2C] rounded-lg p-4 hover:bg-[#3C3C3C] cursor-pointer transition-colors"
                  onClick={() => handleGameSelect(game)}
                >
                  <img
                    src={game.cover?.url || "/placeholder.svg"}
                    alt={game.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{game.name}</h3>
                    {game.genres && (
                      <p className="text-sm text-gray-400">
                        {game.genres.map((g) => g.name).join(", ")}
                      </p>
                    )}
                    {game.platforms && (
                      <p className="text-sm text-gray-400">
                        {game.platforms.map((p) => p.name).join(", ")}
                      </p>
                    )}
                    {game.first_release_date && (
                      <p className="text-sm text-gray-400">
                        {new Date(game.first_release_date * 1000).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : searchQuery.length > 2 ? (
              <div className="text-center text-gray-400">No games found</div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {selectedGame && (
        <AddGameModal
          isOpen={isAddModalOpen}
          onClose={handleAddModalClose}
          onSuccess={handleGameAdded}
          game={selectedGame}
        />
      )}
    </>
  );
}
