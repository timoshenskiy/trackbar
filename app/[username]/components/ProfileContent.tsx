"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { StatsCards } from "./StatsCards";
import { ProfileTabs } from "./ProfileTabs";
import { SearchAndFilter } from "./SearchAndFilter";
import { GamesList } from "./GamesList";
import { Game } from "./GameCard";
import { GameSearchResult } from "@/utils/types/game";
import AddGameModal from "@/components/AddGameModal";
import SearchModal from "@/components/search/search-modal";

// Mock data based on the provided JSON structure
const mockData = {
  games: [
    {
      id: "cd77a3b1-9ec6-4d77-8445-12c99309cdf9",
      user_id: "26f3b5fc-f2f4-4efe-b9b0-ccaa41948c0e",
      game_id: 304232,
      status: "want_to_play",
      rating: 2.7,
      review: "",
      platform_id: 411,
      source: "manual",
      playtime_minutes: 0,
      achievements_total: 0,
      achievements_completed: 0,
      created_at: "2025-02-26T15:10:09.408",
      updated_at: "2025-02-26T15:10:09.408",
      games: {
        id: 304232,
        name: "Lexibook Batman Compact Cyber Arcade Portable Console",
        slug: "lexibook-batman-compact-cyber-arcade-portable-console",
        cover: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co8amt.jpg",
        },
        summary:
          "Introducing the Lexibook Batman Compact Cyber Arcade Portable Console, your gateway to a world of endless entertainment!",
        total_rating: null,
        game_to_genres: [
          {
            genres: {
              name: "Arcade",
            },
          },
        ],
        game_to_platforms: [
          {
            platforms: {
              name: "Handheld Electronic LCD",
            },
          },
        ],
        first_release_date: "2024-03-06T00:00:00+00:00",
      },
      platforms: {
        id: 411,
        name: "Handheld Electronic LCD",
        slug: "handheld-electronic-lcd",
      },
    },
    {
      id: "cd77a3b1-9ec6-4d77-8445-12c99309cdf8",
      user_id: "26f3b5fc-f2f4-4efe-b9b0-ccaa41948c0e",
      game_id: 304233,
      status: "finished",
      rating: 4.5,
      review: "Great game!",
      platform_id: 48,
      source: "steam",
      playtime_minutes: 1200,
      achievements_total: 50,
      achievements_completed: 45,
      created_at: "2025-01-15T10:20:30.408",
      updated_at: "2025-01-15T10:20:30.408",
      games: {
        id: 304233,
        name: "Elden Ring",
        slug: "elden-ring",
        cover: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co4jni.jpg",
        },
        summary:
          "Elden Ring is an action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
        total_rating: 95,
        game_to_genres: [
          {
            genres: {
              name: "RPG",
            },
          },
          {
            genres: {
              name: "Action",
            },
          },
        ],
        game_to_platforms: [
          {
            platforms: {
              name: "PC",
            },
          },
        ],
        first_release_date: "2022-02-25T00:00:00+00:00",
      },
      platforms: {
        id: 48,
        name: "PC",
        slug: "pc",
      },
    },
    {
      id: "cd77a3b1-9ec6-4d77-8445-12c99309cdf7",
      user_id: "26f3b5fc-f2f4-4efe-b9b0-ccaa41948c0e",
      game_id: 304234,
      status: "playing",
      rating: 4.0,
      review: "",
      platform_id: 167,
      source: "playstation",
      playtime_minutes: 600,
      achievements_total: 40,
      achievements_completed: 15,
      created_at: "2025-02-10T08:15:20.408",
      updated_at: "2025-02-10T08:15:20.408",
      games: {
        id: 304234,
        name: "God of War Ragnarök",
        slug: "god-of-war-ragnarok",
        cover: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co5s5v.jpg",
        },
        summary:
          "God of War Ragnarök is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment.",
        total_rating: 94,
        game_to_genres: [
          {
            genres: {
              name: "Action",
            },
          },
          {
            genres: {
              name: "Adventure",
            },
          },
        ],
        game_to_platforms: [
          {
            platforms: {
              name: "PlayStation 5",
            },
          },
        ],
        first_release_date: "2022-11-09T00:00:00+00:00",
      },
      platforms: {
        id: 167,
        name: "PlayStation 5",
        slug: "ps5",
      },
    },
    {
      id: "cd77a3b1-9ec6-4d77-8445-12c99309cdf6",
      user_id: "26f3b5fc-f2f4-4efe-b9b0-ccaa41948c0e",
      game_id: 304235,
      status: "dropped",
      rating: 2.0,
      review: "Couldn't get into it",
      platform_id: 49,
      source: "xbox",
      playtime_minutes: 120,
      achievements_total: 30,
      achievements_completed: 5,
      created_at: "2024-12-05T14:30:45.408",
      updated_at: "2024-12-05T14:30:45.408",
      games: {
        id: 304235,
        name: "Cyberpunk 2077",
        slug: "cyberpunk-2077",
        cover: {
          url: "//images.igdb.com/igdb/image/upload/t_thumb/co4hk8.jpg",
        },
        summary:
          "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City.",
        total_rating: 85,
        game_to_genres: [
          {
            genres: {
              name: "RPG",
            },
          },
          {
            genres: {
              name: "FPS",
            },
          },
        ],
        game_to_platforms: [
          {
            platforms: {
              name: "Xbox Series X",
            },
          },
        ],
        first_release_date: "2020-12-10T00:00:00+00:00",
      },
      platforms: {
        id: 49,
        name: "Xbox Series X",
        slug: "xbox-series-x",
      },
    },
  ],
};

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
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
  const [selectedGame, setSelectedGame] = useState<GameSearchResult | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Transform the data for the UI
  const transformedGames = mockData.games.map((game) => ({
    id: parseInt(game.game_id.toString()),
    title: game.games.name,
    cover: game.games.cover.url,
    genres: game.games.game_to_genres.map((g) => g.genres.name),
    platform: game.platforms.name,
    status: (game.status === "want_to_play"
      ? "Want"
      : game.status === "finished"
        ? "Finished"
        : game.status === "playing"
          ? "Playing"
          : game.status === "dropped"
            ? "Dropped"
            : game.status) as "Want" | "Finished" | "Playing" | "Dropped",
    rating: game.rating,
    playtime: Math.round(game.playtime_minutes / 60),
    achievements: {
      completed: game.achievements_completed,
      total: game.achievements_total,
    },
    source: game.source,
    dateAdded: new Date(game.created_at).toLocaleDateString(),
  }));

  const getStatusCount = (status: string) => {
    if (status === "All") return transformedGames.length;
    return transformedGames.filter((game) =>
      status === "want_to_play"
        ? game.status === "Want"
        : status === "finished"
          ? game.status === "Finished"
          : status === "playing"
            ? game.status === "Playing"
            : status === "dropped"
              ? game.status === "Dropped"
              : game.status === status
    ).length;
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
      count: getStatusCount("finished"),
      icon: "✓",
      color: "green-500",
    },
    {
      name: "Playing",
      count: getStatusCount("playing"),
      icon: "▶",
      color: "blue-500",
    },
    {
      name: "Dropped",
      count: getStatusCount("dropped"),
      icon: "✕",
      color: "red-500",
    },
    {
      name: "Want",
      count: getStatusCount("want_to_play"),
      icon: "⭐",
      color: "yellow-500",
    },
  ];

  const totalPlaytime = transformedGames.reduce(
    (sum, game) => sum + (game.playtime || 0),
    0
  );

  const completionRate =
    (transformedGames.filter((game) => game.status === "Finished").length /
      transformedGames.length) *
      100 || 0;

  const achievementsCompleted = transformedGames.reduce(
    (sum, game) => sum + (game.achievements?.completed || 0),
    0
  );

  const achievementsTotal = transformedGames.reduce(
    (sum, game) => sum + (game.achievements?.total || 0),
    0
  );

  // Calculate platform distribution
  const platformDistribution = Array.from(
    new Set(transformedGames.map((g) => g.platform))
  ).map((platform) => {
    const count = transformedGames.filter(
      (g) => g.platform === platform
    ).length;
    const percentage = (count / transformedGames.length) * 100;
    return { platform, count, percentage };
  });

  // Filter games based on active tab and search term
  const filteredGames = transformedGames.filter((game) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Finished" && game.status === "Finished") ||
      (activeTab === "Playing" && game.status === "Playing") ||
      (activeTab === "Dropped" && game.status === "Dropped") ||
      (activeTab === "Want" && game.status === "Want");

    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genres.some((genre: string) =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

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
      genres: game.genres.map((name: string) => ({
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
    // No need to invalidate queries since we're using mock data
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          username={username}
          fullName={fullName}
          avatarUrl={avatarUrl}
          onAddGameClick={handleSearchModalOpen}
        />

        <StatsCards
          totalPlaytime={totalPlaytime}
          completionRate={completionRate}
          achievementsCompleted={achievementsCompleted}
          achievementsTotal={achievementsTotal}
          totalGames={transformedGames.length}
          platformDistribution={platformDistribution}
        />

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <GamesList
          games={filteredGames}
          isOwnProfile={isOwnProfile}
          viewMode={viewMode}
          onGameClick={handleGameClick}
        />

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
