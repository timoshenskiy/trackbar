"use client"

import { useState } from "react"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import { Input } from "@/ui/input"
import { ArrowLeft, Search } from "lucide-react"

interface Game {
  id: number
  title: string
  image: string
}

interface SteamGamesListProps {
  onBack: () => void
}

// Mock data for Steam games
const mockSteamGames: Game[] = [
  { id: 1, title: "Half-Life 2", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, title: "Portal 2", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, title: "Counter-Strike: Global Offensive", image: "/placeholder.svg?height=100&width=100" },
  { id: 4, title: "Dota 2", image: "/placeholder.svg?height=100&width=100" },
  { id: 5, title: "Team Fortress 2", image: "/placeholder.svg?height=100&width=100" },
  // Add more mock games as needed
]

export default function SteamGamesList({ onBack }: SteamGamesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGames, setSelectedGames] = useState<number[]>([])

  const filteredGames = mockSteamGames.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleGameToggle = (gameId: number) => {
    setSelectedGames((prev) => (prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]))
  }

  const handleImportSelected = () => {
    console.log("Importing selected games:", selectedGames)
    // Implement the actual import logic here
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-grow relative">
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/90 border-gray-700 text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="flex items-center bg-gray-800/90 border border-gray-700 p-4 rounded-lg hover:bg-gray-700/90 transition-colors">
              <Checkbox
                checked={selectedGames.includes(game.id)}
                onCheckedChange={() => handleGameToggle(game.id)}
                className="mr-4"
              />
              <img
                src={game.image || "/placeholder.svg"}
                alt={game.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <span className="flex-grow">{game.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleImportSelected} disabled={selectedGames.length === 0}>
          Import Selected Games
        </Button>
      </div>
    </div>
  )
}

