"use client";

import { motion } from "framer-motion";
import { Clock, Trophy, Gamepad2, Pencil, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Game {
  id: number;
  title: string;
  cover?: string;
  genres: string[];
  platform: string;
  status: "Want" | "Finished" | "Playing" | "Dropped";
  rating: number;
  playtime?: number;
  achievements?: {
    completed: number;
    total: number;
  };
  source: string;
  dateAdded: string;
}

interface GameCardProps {
  game: Game;
  isOwnProfile: boolean;
  viewMode: "grid" | "row";
  onGameClick: (game: Game) => void;
}

export function GameCard({
  game,
  isOwnProfile,
  viewMode,
  onGameClick,
}: GameCardProps) {
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Playing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Dropped":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Want":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-quokka-purple/20 text-quokka-purple border-quokka-purple/30";
    }
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-yellow-400" />
            <div className="absolute w-2 h-4 overflow-hidden">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400/30" />
        ))}
      </div>
    );
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl overflow-hidden hover:border-quokka-purple/30 transition-all hover:shadow-lg hover:shadow-quokka-purple/5 group ${
          isOwnProfile ? "cursor-pointer relative" : ""
        }`}
        onClick={() => isOwnProfile && onGameClick(game)}
      >
        {isOwnProfile && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-quokka-purple/80 text-white p-1 rounded-full">
              <Pencil size={14} />
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="flex gap-4">
            {/* Game Cover */}
            <div className="w-20 h-28 rounded-lg overflow-hidden bg-quokka-dark/50 flex-shrink-0">
              {game.cover ? (
                <img
                  src={`https:${game.cover.replace("t_thumb", "t_cover_big")}`}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-quokka-light/30">
                  <Gamepad2 className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-quokka-light truncate group-hover:text-quokka-cyan transition-colors">
                  {game.title}
                </h3>
                <Badge className={`${getStatusColor(game.status)} text-xs`}>
                  {game.status}
                </Badge>
              </div>

              <div className="mt-1 text-sm text-quokka-light/60">
                {game.platform}
              </div>

              <div className="mt-2 flex items-center gap-1">
                {getRatingStars(game.rating)}
                <span className="text-xs text-quokka-light/40 ml-1">
                  {game.rating.toFixed(1)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {game.genres.slice(0, 2).map((genre: string) => (
                  <span
                    key={genre}
                    className="px-2 py-0.5 bg-quokka-dark/50 rounded-full text-xs text-quokka-light/60"
                  >
                    {genre}
                  </span>
                ))}
                {game.genres.length > 2 && (
                  <span className="px-2 py-0.5 bg-quokka-dark/50 rounded-full text-xs text-quokka-light/60">
                    +{game.genres.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="mt-4 pt-3 border-t border-quokka-purple/5 grid grid-cols-3 gap-2 text-xs">
            {game.playtime !== undefined && (
              <div className="flex items-center gap-1.5 text-quokka-light/60">
                <Clock className="w-3 h-3 text-quokka-cyan" />
                <span>{game.playtime}h</span>
              </div>
            )}
            {game.achievements && (
              <div className="flex items-center gap-1.5 text-quokka-light/60">
                <Trophy className="w-3 h-3 text-quokka-cyan" />
                <span>
                  {game.achievements.completed}/{game.achievements.total}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-quokka-light/60 justify-self-end col-span-2 justify-end">
              <span>{game.dateAdded}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Row view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl overflow-hidden hover:border-quokka-purple/30 transition-all hover:shadow-lg hover:shadow-quokka-purple/5 group ${
        isOwnProfile ? "cursor-pointer relative" : ""
      }`}
      onClick={() => isOwnProfile && onGameClick(game)}
    >
      {isOwnProfile && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-quokka-purple/80 text-white p-1 rounded-full">
            <Pencil size={14} />
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-6">
          {/* Game Cover */}
          <div className="w-24 h-32 rounded-lg overflow-hidden bg-quokka-dark/50 flex-shrink-0">
            {game.cover ? (
              <img
                src={`https:${game.cover.replace("t_thumb", "t_cover_big")}`}
                alt={game.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-quokka-light/30">
                <Gamepad2 className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-lg text-quokka-light group-hover:text-quokka-cyan transition-colors">
                  {game.title}
                </h3>
                <div className="mt-1 text-sm text-quokka-light/60 flex items-center gap-2">
                  <span>{game.platform}</span>
                  <span className="text-quokka-light/20">•</span>
                  <span>{game.dateAdded}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(game.status)} text-xs`}>
                {game.status}
              </Badge>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {getRatingStars(game.rating)}
              <span className="text-xs text-quokka-light/40 ml-1">
                {game.rating.toFixed(1)}
              </span>
            </div>

            <div className="mt-auto pt-3 flex flex-wrap gap-2">
              {game.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 bg-quokka-dark/50 rounded-full text-xs text-quokka-light/60"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Game Stats */}
            <div className="mt-4 pt-3 border-t border-quokka-purple/5 flex gap-6 text-xs">
              {game.playtime !== undefined && (
                <div className="flex items-center gap-1.5 text-quokka-light/60">
                  <Clock className="w-3 h-3 text-quokka-cyan" />
                  <span>{game.playtime}h played</span>
                </div>
              )}
              {game.achievements && (
                <div className="flex items-center gap-1.5 text-quokka-light/60">
                  <Trophy className="w-3 h-3 text-quokka-cyan" />
                  <span>
                    {game.achievements.completed}/{game.achievements.total}{" "}
                    achievements
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-quokka-light/60 ml-auto">
                <span className="text-xs uppercase font-medium px-2 py-0.5 bg-quokka-dark/50 rounded-full">
                  {game.source}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
