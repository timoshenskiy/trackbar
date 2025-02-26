"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trophy,
  Clock,
  Star,
  Gamepad2,
  Search,
  Filter,
  ChevronDown,
  Heart,
  BarChart3,
  Zap,
  Shield,
  X,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import AddGameModal from "@/components/AddGameModal";
import { GameSearchResult } from "@/utils/types/game";
import SearchModal from "@/components/search/search-modal";

interface Genre {
  name: string;
}

interface Game {
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

export interface ProfileContentProps {
  isOwnProfile: boolean;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

export function ProfileContent({
  isOwnProfile,
  username,
  fullName,
  avatarUrl,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Fetch user's games
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["userGames", username],
    queryFn: async () => {
      const supabase = createClient();

      // First get the user ID from the username
      const { data: userData } = await supabase.rpc("get_user_by_username", {
        p_username: username,
      });

      if (!userData) {
        throw new Error("User not found");
      }

      // Then fetch their games
      const { data: userGames, error } = await supabase
        .from("user_games")
        .select(
          `
          *,
          game:games (
            id,
            name,
            cover:covers (
              url
            ),
            game_to_genres (
              genres (
                name
              )
            ),
            game_to_platforms (
              platforms (
                name
              )
            )
          )
        `
        )
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return userGames.map((ug: any) => ({
        id: ug.game.id,
        title: ug.game.name,
        cover: ug.game.cover?.url,
        genres:
          ug.game.game_to_genres?.map(
            (g: { genres: Genre }) => g.genres.name
          ) || [],
        platform: ug.game.game_to_platforms?.[0]?.platforms.name || "Unknown",
        status:
          ug.status === "want_to_play"
            ? "Want"
            : ug.status.charAt(0).toUpperCase() + ug.status.slice(1),
        rating: ug.rating / 10, // Convert from 0-100 to 0-10
        playtime: Math.round(ug.playtime_minutes / 60),
        achievements:
          ug.achievements_total > 0
            ? {
                completed: ug.achievements_completed,
                total: ug.achievements_total,
              }
            : undefined,
        source: ug.source.toUpperCase(),
        dateAdded: new Date(ug.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));
    },
  });

  const getStatusCount = (status: string) => {
    if (status === "All") return games.length;
    return games.filter((game) => game.status === status).length;
  };

  const tabs = [
    {
      name: "All",
      count: getStatusCount("All"),
      icon: "🎮",
      color: "quokka-cyan",
    },
    {
      name: "Finished",
      count: getStatusCount("Finished"),
      icon: "✓",
      color: "green-500",
    },
    {
      name: "Playing",
      count: getStatusCount("Playing"),
      icon: "▶",
      color: "blue-500",
    },
    {
      name: "Dropped",
      count: getStatusCount("Dropped"),
      icon: "✕",
      color: "red-500",
    },
    {
      name: "Want",
      count: getStatusCount("Want"),
      icon: "⭐",
      color: "yellow-500",
    },
  ];

  const totalPlaytime = games.reduce(
    (sum, game) => sum + (game.playtime || 0),
    0
  );
  const completionRate =
    (games.filter((game) => game.status === "Finished").length / games.length) *
      100 || 0;
  const achievementsCompleted = games.reduce(
    (sum, game) => sum + (game.achievements?.completed || 0),
    0
  );
  const achievementsTotal = games.reduce(
    (sum, game) => sum + (game.achievements?.total || 0),
    0
  );

  // Filter games based on active tab and search term
  const filteredGames = games.filter((game) => {
    const matchesTab = activeTab === "All" || game.status === activeTab;
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genres.some((genre: string) =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

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

  // Function to handle opening the modal with the selected game
  const handleGameClick = (game: Game) => {
    if (!isOwnProfile) return; // Only allow editing on own profile

    // Convert Game to GameSearchResult format with additional properties for editing
    const gameForModal: GameSearchResult & {
      userStatus?: string;
      userRating?: number;
      userReview?: string;
      userGameId?: number;
    } = {
      id: game.id,
      name: game.title,
      slug: game.title.toLowerCase().replace(/\s+/g, "-"),
      cover: game.cover
        ? {
            id: 0,
            url: game.cover,
            width: 0,
            height: 0,
          }
        : undefined,
      genres: game.genres.map((name) => ({
        id: 0,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      })),
      platforms: [
        {
          id: 0,
          name: game.platform,
          slug: game.platform.toLowerCase().replace(/\s+/g, "-"),
        },
      ],
      created_at: Date.now(),
      // Add properties for editing
      userStatus:
        game.status.toLowerCase() === "want"
          ? "want_to_play"
          : game.status.toLowerCase(),
      userRating: game.rating,
      userReview: "", // We don't have this in the Game interface, so default to empty
      userGameId: game.id, // Use the game ID as the user game ID for now
    };

    setSelectedGame(gameForModal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
    // The queryClient in AddGameModal will invalidate the userGames query
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Skeleton */}
          <div className="flex items-center gap-6 mb-12 animate-pulse">
            <div className="w-24 h-24 rounded-xl bg-quokka-dark/50"></div>
            <div className="space-y-3">
              <div className="h-8 w-48 bg-quokka-dark/50 rounded-lg"></div>
              <div className="h-4 w-32 bg-quokka-dark/50 rounded-lg"></div>
              <div className="h-6 w-64 bg-quokka-dark/50 rounded-lg"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-quokka-dark/30 rounded-xl p-6 animate-pulse"
              >
                <div className="h-5 w-32 bg-quokka-dark/50 rounded-lg mb-4"></div>
                <div className="h-8 w-16 bg-quokka-dark/50 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 bg-quokka-dark/50 rounded-full"
              ></div>
            ))}
          </div>

          {/* Games Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-quokka-dark/30 rounded-xl p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-quokka-dark/50 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-full bg-quokka-dark/50 rounded-lg"></div>
                    <div className="h-4 w-3/4 bg-quokka-dark/50 rounded-lg"></div>
                    <div className="h-4 w-1/2 bg-quokka-dark/50 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-12">
          {/* Background gradient */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-quokka-purple/20 to-quokka-cyan/20 rounded-xl -z-10"></div>

          <div className="pt-8 px-6 flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-quokka-purple to-quokka-cyan p-1 shadow-xl shadow-quokka-purple/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${username}'s avatar`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-quokka-dark flex items-center justify-center">
                  <span className="text-3xl font-bold text-quokka-cyan">
                    {username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-quokka-light">
                    {fullName || username}
                    {isOwnProfile && (
                      <button className="ml-2 text-quokka-light/40 hover:text-quokka-cyan transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </h1>
                  <div className="text-quokka-light/60 text-sm mb-2">
                    @{username}
                  </div>

                  <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="bg-quokka-purple/10 border-quokka-purple/30 text-quokka-purple px-2 py-0.5"
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        Level 5
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-quokka-light/40">Following</span>
                        <span className="ml-1.5 text-quokka-light font-medium">
                          0
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-quokka-light/40">Followers</span>
                        <span className="ml-1.5 text-quokka-light font-medium">
                          0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isOwnProfile && (
                    <>
                      <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-quokka-purple to-quokka-cyan text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Game
                      </button>
                      <button className="px-4 py-2 bg-quokka-purple/20 hover:bg-quokka-purple/30 text-quokka-purple rounded-lg transition-colors text-sm font-medium">
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
                <Clock className="w-4 h-4 text-quokka-cyan" />
                Total Playtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-quokka-light">
                {totalPlaytime}h
              </div>
              <div className="text-xs text-quokka-light/40 mt-1">
                Across {games.length} games
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
                <Trophy className="w-4 h-4 text-quokka-cyan" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-quokka-light">
                {completionRate.toFixed(1)}%
              </div>
              <Progress
                value={completionRate}
                className="mt-2 h-1.5 bg-quokka-dark"
              />
            </CardContent>
          </Card>

          <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
                <Star className="w-4 h-4 text-quokka-cyan" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-quokka-light">
                {achievementsCompleted}/{achievementsTotal}
              </div>
              <Progress
                value={(achievementsCompleted / achievementsTotal) * 100 || 0}
                className="mt-2 h-1.5 bg-quokka-dark"
              />
            </CardContent>
          </Card>

          <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
            <CardHeader className="pb-2 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
                <Gamepad2 className="w-4 h-4 text-quokka-cyan" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1.5">
                {Array.from(new Set(games.map((g: Game) => g.platform)))
                  .slice(0, 3)
                  .map((platform: string) => {
                    const count = games.filter(
                      (g: Game) => g.platform === platform
                    ).length;
                    const percentage = (count / games.length) * 100;

                    return (
                      <div key={platform} className="flex items-center gap-2">
                        <div className="flex-1 flex justify-between">
                          <span className="text-quokka-light/70 truncate">
                            {platform}
                          </span>
                          <span className="text-quokka-light">{count}</span>
                        </div>
                        <div className="w-20 h-1.5 bg-quokka-dark rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-quokka-purple to-quokka-cyan"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                {Array.from(new Set(games.map((g: Game) => g.platform)))
                  .length > 3 && (
                  <div className="text-xs text-quokka-light/40 text-right">
                    +
                    {Array.from(new Set(games.map((g: Game) => g.platform)))
                      .length - 3}{" "}
                    more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div
            className={`relative flex-1 transition-all duration-300 ${
              isSearchFocused ? "ring-1 ring-quokka-purple" : ""
            }`}
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quokka-light/40"
              size={18}
            />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 bg-quokka-dark/30 border-quokka-purple/10 rounded-lg focus:border-quokka-purple/30 text-quokka-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-quokka-light/40 hover:text-quokka-light"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-quokka-dark/30 border border-quokka-purple/10 rounded-lg text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light transition-colors flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 bg-quokka-dark/30 border border-quokka-purple/10 rounded-lg text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light transition-colors flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Sort</span>
              <ChevronDown size={16} />
            </button>
            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-quokka-purple/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 flex items-center justify-center transition-colors ${
                  viewMode === "grid"
                    ? "bg-quokka-purple text-white"
                    : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("row")}
                className={`p-2 flex items-center justify-center transition-colors ${
                  viewMode === "row"
                    ? "bg-quokka-purple text-white"
                    : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50"
                }`}
                aria-label="Row view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.name
                  ? "bg-quokka-purple text-white"
                  : "bg-quokka-dark/30 text-quokka-light/70 hover:bg-quokka-dark/50 hover:text-quokka-light"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.name ? "bg-white/20" : "bg-quokka-dark/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Games Grid or Row View */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-quokka-light/40 mb-2">No games found</div>
            <div className="text-sm text-quokka-light/30">
              {searchTerm
                ? "Try a different search term"
                : "Add some games to your collection"}
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl overflow-hidden hover:border-quokka-purple/30 transition-all hover:shadow-lg hover:shadow-quokka-purple/5 group ${
                  isOwnProfile ? "cursor-pointer relative" : ""
                }`}
                onClick={() => isOwnProfile && handleGameClick(game)}
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
                          src={`https:${game.cover.replace(
                            "t_thumb",
                            "t_cover_big"
                          )}`}
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
                        <Badge
                          className={`${getStatusColor(game.status)} text-xs`}
                        >
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
                          {game.achievements.completed}/
                          {game.achievements.total}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-quokka-light/60 justify-self-end col-span-2 justify-end">
                      <span>{game.dateAdded}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-quokka-dark/30 border border-quokka-purple/10 rounded-xl overflow-hidden hover:border-quokka-purple/30 transition-all hover:shadow-lg hover:shadow-quokka-purple/5 group ${
                  isOwnProfile ? "cursor-pointer relative" : ""
                }`}
                onClick={() => isOwnProfile && handleGameClick(game)}
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
                          src={`https:${game.cover.replace(
                            "t_thumb",
                            "t_cover_big"
                          )}`}
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
                        <Badge
                          className={`${getStatusColor(game.status)} text-xs`}
                        >
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
                              {game.achievements.completed}/
                              {game.achievements.total} achievements
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
            ))}
          </div>
        )}

        {/* Add Game Modal */}
        {selectedGame && (
          <AddGameModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            game={selectedGame}
            isEditing={true}
          />
        )}

        {/* Game Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onGameSelect={(game: GameSearchResult) => {
            setSelectedGame(game);
            setIsModalOpen(true);
            setIsSearchModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
