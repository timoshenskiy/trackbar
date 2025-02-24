"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil, Trophy, Clock, Star, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

      return userGames.map((ug) => ({
        id: ug.game.id,
        title: ug.game.name,
        cover: ug.game.cover?.url,
        genres: ug.game.game_to_genres?.map((g) => g.genres.name) || [],
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
    { name: "All", count: getStatusCount("All"), icon: "🎮" },
    { name: "Finished", count: getStatusCount("Finished"), icon: "✓" },
    { name: "Playing", count: getStatusCount("Playing"), icon: "▶" },
    { name: "Dropped", count: getStatusCount("Dropped"), icon: "✕" },
    { name: "Want", count: getStatusCount("Want"), icon: "⭐" },
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

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${username}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-white">
                {username[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {fullName || username}
            </h1>
            <div className="text-gray-400 text-sm">@{username}</div>
            <div className="flex gap-8 mt-2">
              <div>
                <span className="text-gray-400">Following</span>
                <span className="ml-2 text-white">0</span>
              </div>
              <div>
                <span className="text-gray-400">Followers</span>
                <span className="ml-2 text-white">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#2C2C2C] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Playtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlaytime}h</div>
          </CardContent>
        </Card>
        <Card className="bg-[#2C2C2C] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#2C2C2C] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievementsCompleted}/{achievementsTotal}
            </div>
            <Progress
              value={(achievementsCompleted / achievementsTotal) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card className="bg-[#2C2C2C] border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {Array.from(new Set(games.map((g: Game) => g.platform))).map(
                (platform: string) => (
                  <div key={platform} className="flex justify-between">
                    <span>{platform}</span>
                    <span>
                      {
                        games.filter((g: Game) => g.platform === platform)
                          .length
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "flex items-center gap-2",
                activeTab === tab.name ? "text-white" : "text-gray-400"
              )}
            >
              {tab.name}
              <span className="text-gray-400">{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Sort by</span>
          <select className="bg-transparent text-white border-none outline-none">
            <option>Rating</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search in list"
          className="bg-[#2C2C2C] border-none text-white placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Game List */}
      <div className="space-y-4">
        {games
          .filter(
            (game) =>
              (activeTab === "All" || game.status === activeTab) &&
              game.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((game, index) => (
            <div
              key={game.id}
              className="bg-[#2C2C2C] rounded-lg p-4 flex items-center gap-4"
            >
              <span className="text-gray-400 w-6">{index + 1}</span>
              <img
                src={game.cover || "/placeholder.svg"}
                alt={game.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-white">{game.title}</h3>
                <div className="text-sm text-gray-400">
                  {game.genres.join(", ")}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="text-sm text-gray-400">{game.dateAdded}</div>
                  {game.achievements && (
                    <div className="text-sm text-gray-400">
                      🏆 {game.achievements.completed}/{game.achievements.total}
                    </div>
                  )}
                  {game.playtime > 0 && (
                    <div className="text-sm text-gray-400">
                      ⏱️ {game.playtime}h
                    </div>
                  )}
                  {game.source !== "MANUAL" && (
                    <div className="text-sm text-gray-400">
                      {game.source === "STEAM" ? "🎮" : "🎯"} {game.source}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white">
                  {game.rating.toFixed(1)}
                </div>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    game.status === "Want" && "bg-blue-500 text-white",
                    game.status === "Finished" && "bg-[#7FFFD4] text-black",
                    game.status === "Playing" && "bg-purple-500 text-white",
                    game.status === "Dropped" && "bg-red-500 text-white"
                  )}
                >
                  {game.status}
                </div>
                {isOwnProfile && (
                  <button className="text-gray-400 hover:text-white">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
