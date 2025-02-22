"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Slider } from "@/ui/slider"
import { Textarea } from "@/ui/textarea"
import { Star, Clock, Calendar, Trophy } from "lucide-react"

interface Game {
  id: number
  title: string
  image: string
  status: "Playing" | "Completed" | "On Hold" | "Dropped" | "Plan to Play"
  rating: number
  review: string
  category: string
  playTime: number
  lastPlayed: string
  achievements: number
  totalAchievements: number
  platform: string
}

const mockGames: Game[] = [
  {
    id: 1,
    title: "The Witcher 3: Wild Hunt",
    image: "/placeholder.svg?height=400&width=300",
    status: "Completed",
    rating: 9,
    review: "An epic journey through a beautifully crafted world.",
    category: "RPG",
    playTime: 120,
    lastPlayed: "2023-05-15",
    achievements: 45,
    totalAchievements: 50,
    platform: "PC",
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    image: "/placeholder.svg?height=400&width=300",
    status: "Playing",
    rating: 8,
    review: "A visually stunning game with an immersive storyline.",
    category: "RPG",
    playTime: 80,
    lastPlayed: "2023-06-01",
    achievements: 30,
    totalAchievements: 60,
    platform: "PlayStation",
  },
  {
    id: 3,
    title: "Elden Ring",
    image: "/placeholder.svg?height=400&width=300",
    status: "Completed",
    rating: 10,
    review: "A masterpiece that redefines open-world gaming.",
    category: "Action RPG",
    playTime: 150,
    lastPlayed: "2023-04-20",
    achievements: 38,
    totalAchievements: 42,
    platform: "Xbox",
  },
  {
    id: 4,
    title: "Red Dead Redemption 2",
    image: "/placeholder.svg?height=400&width=300",
    status: "Plan to Play",
    rating: 0,
    review: "",
    category: "Action-Adventure",
    playTime: 0,
    lastPlayed: "",
    achievements: 0,
    totalAchievements: 70,
    platform: "PlayStation",
  },
  {
    id: 5,
    title: "Hades",
    image: "/placeholder.svg?height=400&width=300",
    status: "Completed",
    rating: 9,
    review: "An addictive roguelike with fantastic art and storytelling.",
    category: "Roguelike",
    playTime: 60,
    lastPlayed: "2023-05-30",
    achievements: 25,
    totalAchievements: 30,
    platform: "Nintendo Switch",
  },
]

const allPlatforms = Array.from(new Set(mockGames.map((game) => game.platform)))

export default function GamesList() {
  const [games, setGames] = useState<Game[]>(mockGames)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"rating" | "category" | "lastPlayed">("rating")
  const [blurredImageUrls, setBlurredImageUrls] = useState<{ [key: number]: string }>({})
  const [activePlatforms, setActivePlatforms] = useState<string[]>(allPlatforms)

  useEffect(() => {
    // In a real application, you would generate these server-side
    // This is just a mock-up for demonstration purposes
    const blurredUrls = games.reduce(
      (acc, game) => {
        acc[game.id] = `/api/blur?url=${encodeURIComponent(game.image)}`
        return acc
      },
      {} as { [key: number]: string },
    )
    setBlurredImageUrls(blurredUrls)
  }, [games])

  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setIsModalOpen(true)
  }

  const handleStatusChange = (status: Game["status"]) => {
    if (selectedGame) {
      const updatedGame = { ...selectedGame, status }
      updateGame(updatedGame)
    }
  }

  const handleRatingChange = (rating: number) => {
    if (selectedGame) {
      const updatedGame = { ...selectedGame, rating }
      updateGame(updatedGame)
    }
  }

  const handleReviewChange = (review: string) => {
    if (selectedGame) {
      const updatedGame = { ...selectedGame, review }
      updateGame(updatedGame)
    }
  }

  const updateGame = (updatedGame: Game) => {
    setGames(games.map((game) => (game.id === updatedGame.id ? updatedGame : game)))
    setSelectedGame(updatedGame)
  }

  const togglePlatform = (platform: string) => {
    setActivePlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const filteredGames = games.filter((game) => activePlatforms.includes(game.platform))

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category)
    } else {
      return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-white">My Games</h2>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map((platform) => (
            <Button
              key={platform}
              onClick={() => togglePlatform(platform)}
              variant={activePlatforms.includes(platform) ? "default" : "outline"}
              className="text-sm"
            >
              {platform}
            </Button>
          ))}
        </div>
        <Select value={sortBy} onValueChange={(value: "rating" | "category" | "lastPlayed") => setSortBy(value)}>
          <SelectTrigger className="w-[180px] bg-gray-900/90 border-gray-700 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="category">Sort by Category</SelectItem>
            <SelectItem value="lastPlayed">Sort by Last Played</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGames.map((game) => (
          <div
            key={game.id}
            className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700 rounded-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
            onClick={() => handleGameClick(game)}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={blurredImageUrls[game.id] || game.image}
                alt={`${game.title} background`}
                layout="fill"
                objectFit="cover"
                className="opacity-30"
              />
            </div>
            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{game.category}</p>
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-white text-lg font-semibold">{game.rating}/10</span>
                </div>
                <p className="text-sm text-gray-300 mb-4">Status: {game.status}</p>
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">{game.playTime} hours played</span>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">Last played: {game.lastPlayed || "Never"}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Trophy className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">
                    {game.achievements}/{game.totalAchievements} achievements
                  </span>
                </div>
                <div className="text-sm text-gray-300">Platform: {game.platform}</div>
              </div>
              <p className="text-sm text-gray-400 mt-4 line-clamp-3">{game.review || "No review yet."}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 text-white border-gray-700 max-w-3xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedGame?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Image
                src={selectedGame?.image || "/placeholder.svg"}
                alt={selectedGame?.title || "Game cover"}
                width={300}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Status</label>
                <Select value={selectedGame?.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full bg-gray-900/90 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Playing">Playing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Dropped">Dropped</SelectItem>
                    <SelectItem value="Plan to Play">Plan to Play</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Rating</label>
                <div className="flex items-center">
                  <Slider
                    value={[selectedGame?.rating || 0]}
                    onValueChange={([value]) => handleRatingChange(value)}
                    max={10}
                    step={1}
                    className="flex-grow mr-4 [&>[role=slider]]:bg-blue-600 [&>[role=slider]]:border-2 [&>[role=slider]]:border-white [&>[role=slider]]:w-4 [&>[role=slider]]:h-4 [&_[data-orientation=horizontal]]:h-2 [&_[data-orientation=horizontal]]:bg-gray-700 [&_[data-orientation=horizontal]>[role=slider]]:hover:bg-blue-500"
                  />
                  <span className="text-white text-lg font-semibold">{selectedGame?.rating}/10</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Review</label>
                <Textarea
                  value={selectedGame?.review}
                  onChange={(e) => handleReviewChange(e.target.value)}
                  className="w-full bg-gray-900/90 border-gray-700 text-white"
                  rows={4}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

