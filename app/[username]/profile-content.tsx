"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil, Trophy, Clock, Star, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Game {
  id: number;
  title: string;
  cover: string;
  genres: string[];
  year: number;
  type: string;
  dateAdded: string;
  rating: number;
  status: "Want" | "Finished" | "Playing" | "Dropped";
  playtime: number;
  achievements?: {
    completed: number;
    total: number;
  };
  metacritic?: {
    score: number;
    userScore: number;
  };
  platform: string;
  source: "Steam" | "GOG" | "Manual";
}

const games: Game[] = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    cover:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CleanShot%202025-02-22%20at%2002.41.58@2x-8LNxRD2sWNuP5Pl3hf5qN4QjS8BMaX.png",
    genres: ["Shooter", "Role-playing (RPG)", "Adventure"],
    year: 2020,
    type: "Main Game",
    dateAdded: "Feb 20, 2025",
    rating: 7.9,
    status: "Want",
    playtime: 0,
    achievements: { completed: 0, total: 50 },
    metacritic: { score: 86, userScore: 7.4 },
    platform: "PC",
    source: "Steam",
  },
  // ... other games
];

interface ProfileContentProps {
  isOwnProfile: boolean;
  username: string;
}

export function ProfileContent({
  isOwnProfile,
  username,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const totalPlaytime = games.reduce((sum, game) => sum + game.playtime, 0);
  const completionRate =
    (games.filter((game) => game.status === "Finished").length / games.length) *
    100;
  const achievementsCompleted = games.reduce(
    (sum, game) => sum + (game.achievements?.completed || 0),
    0
  );
  const achievementsTotal = games.reduce(
    (sum, game) => sum + (game.achievements?.total || 0),
    0
  );

  return (
    <div className="p-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
            {username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{username}</h1>
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
              <div className="flex justify-between">
                <span>PC</span>
                <span>{games.filter((g) => g.platform === "PC").length}</span>
              </div>
              <div className="flex justify-between">
                <span>PS5</span>
                <span>{games.filter((g) => g.platform === "PS5").length}</span>
              </div>
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
      <div className="grid grid-cols-1 gap-4">
        {games
          .filter(
            (game) =>
              (activeTab === "All" || game.status === activeTab) &&
              game.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((game) => (
            <div
              key={game.id}
              className="flex gap-4 bg-[#2C2C2C] p-4 rounded-lg"
            >
              <img
                src={game.cover}
                alt={game.title}
                className="w-32 h-44 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{game.title}</h3>
                    <div className="text-sm text-gray-400">
                      {game.genres.join(", ")} • {game.year}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-400">{game.rating}</div>
                    {isOwnProfile && (
                      <button className="text-gray-400 hover:text-white">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Status</div>
                    <div className="text-white">{game.status}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Playtime</div>
                    <div className="text-white">{game.playtime}h</div>
                  </div>
                  {game.achievements && (
                    <div>
                      <div className="text-gray-400">Achievements</div>
                      <div className="text-white">
                        {game.achievements.completed}/{game.achievements.total}
                      </div>
                    </div>
                  )}
                  {game.metacritic && (
                    <div>
                      <div className="text-gray-400">Metacritic</div>
                      <div className="text-white">
                        {game.metacritic.score} • {game.metacritic.userScore}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
