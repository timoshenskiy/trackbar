"use client"

import { Card } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { PlusCircle, Calendar } from "lucide-react"
import { format } from "date-fns"

interface GameCover {
  alpha_channel: boolean
  animated: boolean
  checksum: string
  game: number
  height: number
  id: number
  image_id: string
  url: string
  width: number
}

interface Genre {
  id: number
  name: string
}

interface Game {
  cover: GameCover
  first_release_date: number
  id: number
  name: string
  genres: Genre[]
  summary: string
}

interface GameCardProps {
  game: Game
}

const GameCard = ({ game }: GameCardProps) => {
  if (!game?.cover) return null
  const formattedDate = format(new Date(game.first_release_date * 1000), "MMM d, yyyy")
  const imageUrl = `https:${game.cover.url.replace("t_thumb", "t_720p")}`
  
  // Calculate aspect ratio for proper scaling
  const aspectRatio = game.cover.width / game.cover.height
  const imageStyles = {
    objectFit: aspectRatio < 0.7 ? 'contain' : 'cover'
  } as const

  return (
    <Card className="relative overflow-hidden group/card hover:bg-gray-900 transition-colors h-[320px] border-0">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl brightness-50 scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-950/40" />

      {/* Content */}
      <div className="relative h-full p-4 flex gap-6">
        {/* Game cover image */}
        <div className="relative w-1/2 flex-shrink-0 bg-black/40 rounded-lg">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={game.name}
            className="h-full w-full rounded-lg shadow-lg"
            style={imageStyles}
          />
          <button className="absolute top-3 right-3 bg-gray-950/60 p-1.5 rounded-full opacity-0 group-hover/card:opacity-100 hover:bg-gray-800 transition-all duration-200 z-10">
            <PlusCircle className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Game information */}
        <div className="flex-1 flex flex-col text-white">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{game.name}</h3>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            {game.summary && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {game.summary}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {game.genres?.map((genre) => (
              <Badge key={genre.id} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                {genre.name}
              </Badge>
            ))}
            {game.cover.animated && (
              <Badge variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                Animated
              </Badge>
            )}
            {game.cover.alpha_channel && (
              <Badge variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                Alpha Channel
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GameCard