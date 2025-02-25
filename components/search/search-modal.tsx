"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Modal from "../ui/modal";
import { useGameSearch } from "@/hooks/useGameSearch";
import { GameSearchResult } from "@/utils/types/game";
import { useQuery } from "@tanstack/react-query";
import { igdbAdapter } from "@/adapters/igdb";
import AddGameModal from "../AddGameModal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
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
      <Modal isOpen={isOpen} onClose={onClose} title="Search Games">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-lg"
            />
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center text-gray-400">Searching...</div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((game) => (
                <div
                  key={game.id}
                  className="group flex overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300"
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="relative w-[180px] flex-shrink-0">
                    <img
                      src={game.cover?.url || "/placeholder.svg"}
                      alt={game.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {game.name}
                    </h3>
                    <div className="space-y-2">
                      {game.genres && (
                        <p className="text-sm text-gray-300">
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
                          {new Date(
                            game.first_release_date * 1000
                          ).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : searchQuery.length > 2 ? (
              <div className="text-center text-gray-400">No games found</div>
            ) : null}
          </div>
        </div>
      </Modal>

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
