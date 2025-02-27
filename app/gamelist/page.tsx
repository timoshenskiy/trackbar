"use client";

import React from "react";
import Header from "@/components/main/header";
import Footer from "@/components/main/footer";
import GameSlider from "@/components/main/game-slider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Gamepad2,
  BarChart3,
  PieChart as PieChartIcon,
  Trophy,
  Clock,
  Calendar,
} from "lucide-react";

// Static data for the game slider
const staticGames = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    cover: {
      id: 1,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 1,
      checksum: "checksum",
      image_id: "co4jni",
    },
    first_release_date: 1607558400,
    genres: [
      { id: 5, name: "Shooter", slug: "shooter" },
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
      { id: 31, name: "Adventure", slug: "adventure" },
    ],
    summary:
      "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    total_rating: 85,
    platforms: [
      { id: 6, name: "PC", slug: "pc" },
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 49, name: "Xbox Series X|S", slug: "xbox-series-x" },
    ],
    slug: "cyberpunk-2077",
    created_at: 1607558400,
  },
  {
    id: 2,
    name: "The Witcher 3: Wild Hunt",
    cover: {
      id: 2,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 2,
      checksum: "checksum",
      image_id: "co1wyy",
    },
    first_release_date: 1431993600,
    genres: [
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
      { id: 31, name: "Adventure", slug: "adventure" },
    ],
    summary:
      "The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    total_rating: 93,
    platforms: [
      { id: 6, name: "PC", slug: "pc" },
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 49, name: "Xbox Series X|S", slug: "xbox-series-x" },
    ],
    slug: "the-witcher-3-wild-hunt",
    created_at: 1431993600,
  },
  {
    id: 3,
    name: "Red Dead Redemption 2",
    cover: {
      id: 3,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1q9f.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 3,
      checksum: "checksum",
      image_id: "co1q9f",
    },
    first_release_date: 1540512000,
    genres: [
      { id: 31, name: "Adventure", slug: "adventure" },
      { id: 5, name: "Shooter", slug: "shooter" },
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
    ],
    summary:
      "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed.",
    total_rating: 95,
    platforms: [
      { id: 6, name: "PC", slug: "pc" },
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 49, name: "Xbox Series X|S", slug: "xbox-series-x" },
    ],
    slug: "red-dead-redemption-2",
    created_at: 1540512000,
  },
  {
    id: 4,
    name: "Elden Ring",
    cover: {
      id: 4,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 4,
      checksum: "checksum",
      image_id: "co4jni",
    },
    first_release_date: 1645747200,
    genres: [
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
      { id: 31, name: "Adventure", slug: "adventure" },
    ],
    summary:
      "Elden Ring is an action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring.",
    total_rating: 96,
    platforms: [
      { id: 6, name: "PC", slug: "pc" },
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 49, name: "Xbox Series X|S", slug: "xbox-series-x" },
    ],
    slug: "elden-ring",
    created_at: 1645747200,
  },
  {
    id: 5,
    name: "God of War Ragnarök",
    cover: {
      id: 5,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 5,
      checksum: "checksum",
      image_id: "co5s5v",
    },
    first_release_date: 1667952000,
    genres: [
      { id: 31, name: "Adventure", slug: "adventure" },
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
    ],
    summary:
      "God of War Ragnarök is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment.",
    total_rating: 94,
    platforms: [
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 9, name: "PlayStation 4", slug: "ps4" },
    ],
    slug: "god-of-war-ragnarok",
    created_at: 1667952000,
  },
  {
    id: 6,
    name: "Horizon Forbidden West",
    cover: {
      id: 6,
      url: "//images.igdb.com/igdb/image/upload/t_cover_big/co2gvu.jpg",
      width: 264,
      height: 374,
      alpha_channel: true,
      animated: false,
      game: 6,
      checksum: "checksum",
      image_id: "co2gvu",
    },
    first_release_date: 1645142400,
    genres: [
      { id: 31, name: "Adventure", slug: "adventure" },
      { id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg" },
    ],
    summary:
      "Horizon Forbidden West continues Aloy's story as she moves west to a far-future America to brave a majestic, but dangerous frontier where she'll face awe-inspiring machines and mysterious new threats.",
    total_rating: 88,
    platforms: [
      { id: 48, name: "PlayStation 5", slug: "ps5" },
      { id: 9, name: "PlayStation 4", slug: "ps4" },
    ],
    slug: "horizon-forbidden-west",
    created_at: 1645142400,
  },
];

// Static data for charts
const genreData = [
  { name: "RPG", count: 42 },
  { name: "Action", count: 28 },
  { name: "Adventure", count: 35 },
  { name: "Strategy", count: 15 },
  { name: "Simulation", count: 12 },
  { name: "Sports", count: 8 },
  { name: "Puzzle", count: 10 },
];

const platformData = [
  { name: "PC", value: 45 },
  { name: "PlayStation", value: 30 },
  { name: "Xbox", value: 20 },
  { name: "Switch", value: 15 },
  { name: "Mobile", value: 10 },
];

const monthlyPlaytimeData = [
  { month: "Jan", hours: 45 },
  { month: "Feb", hours: 38 },
  { month: "Mar", hours: 52 },
  { month: "Apr", hours: 35 },
  { month: "May", hours: 60 },
  { month: "Jun", hours: 48 },
  { month: "Jul", hours: 55 },
  { month: "Aug", hours: 65 },
  { month: "Sep", hours: 50 },
  { month: "Oct", hours: 70 },
  { month: "Nov", hours: 58 },
  { month: "Dec", hours: 75 },
];

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
];

export default function GameListPage() {
  return (
    <div className="min-h-screen bg-quokka-darker text-quokka-light">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-quokka-purple bg-gradient-to-r from-quokka-purple to-quokka-cyan bg-clip-text text-transparent">
          My Game Collection
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-quokka-purple/20 p-3 rounded-full">
                <Gamepad2 className="w-6 h-6 text-quokka-purple" />
              </div>
              <div>
                <h3 className="text-sm text-quokka-light/70">Total Games</h3>
                <p className="text-2xl font-bold text-quokka-light">128</p>
              </div>
            </div>
          </div>

          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-quokka-purple/20 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-quokka-purple" />
              </div>
              <div>
                <h3 className="text-sm text-quokka-light/70">Completed</h3>
                <p className="text-2xl font-bold text-quokka-light">42</p>
              </div>
            </div>
          </div>

          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-quokka-purple/20 p-3 rounded-full">
                <Clock className="w-6 h-6 text-quokka-purple" />
              </div>
              <div>
                <h3 className="text-sm text-quokka-light/70">Total Playtime</h3>
                <p className="text-2xl font-bold text-quokka-light">
                  1,248 hrs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-quokka-purple/20 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-quokka-purple" />
              </div>
              <div>
                <h3 className="text-sm text-quokka-light/70">
                  Added This Month
                </h3>
                <p className="text-2xl font-bold text-quokka-light">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Genre Distribution Chart */}
          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-quokka-cyan" />
              <h2 className="text-xl font-semibold text-quokka-cyan">
                Genre Distribution
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genreData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f2e",
                      borderColor: "#8b5cf6",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Distribution Chart */}
          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-quokka-cyan" />
              <h2 className="text-xl font-semibold text-quokka-cyan">
                Platform Distribution
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {platformData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f2e",
                      borderColor: "#8b5cf6",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Playtime Chart */}
          <div className="bg-quokka-dark rounded-xl p-6 border border-quokka-purple/20 shadow-lg lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-quokka-cyan" />
              <h2 className="text-xl font-semibold text-quokka-cyan">
                Monthly Playtime
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyPlaytimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f2e",
                      borderColor: "#8b5cf6",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hours"
                    name="Hours Played"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recently Added Games Slider */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Gamepad2 className="w-6 h-6 text-quokka-cyan" />
            <h2 className="text-2xl font-semibold text-quokka-cyan">
              Recently Added Games
            </h2>
          </div>
          <GameSlider
            games={staticGames}
            title=""
            autoScroll={true}
            direction="right"
            scrollInterval={5000}
            visibleCount={4}
          />
        </div>

        {/* Most Played Games Slider */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-quokka-cyan" />
            <h2 className="text-2xl font-semibold text-quokka-cyan">
              Most Played Games
            </h2>
          </div>
          <GameSlider
            games={staticGames.slice().reverse()}
            title=""
            autoScroll={true}
            direction="left"
            scrollInterval={6000}
            visibleCount={4}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
