"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog"
import { GamepadIcon, ComputerIcon as Steam } from "lucide-react"
import SteamGamesList from "./steam-games-list"

interface ImportGamesModalProps {
  isOpen: boolean
  onClose: () => void
}

const gameCards = [
  { id: 1, title: "Steam", icon: Steam },
  { id: 2, title: "Epic Games", icon: GamepadIcon },
  { id: 3, title: "GOG", icon: GamepadIcon },
  { id: 4, title: "Xbox", icon: GamepadIcon },
  { id: 5, title: "PlayStation", icon: GamepadIcon },
  { id: 6, title: "Nintendo", icon: GamepadIcon },
]

export default function ImportGamesModal({ isOpen, onClose }: ImportGamesModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const handlePlatformSelect = (platformTitle: string) => {
    setSelectedPlatform(platformTitle)
  }

  const handleBack = () => {
    setSelectedPlatform(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white border-gray-700 max-w-full h-full max-h-full m-0 rounded-none backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{selectedPlatform ? `Import ${selectedPlatform} Games` : "Import Your Games"}</DialogTitle>
        </DialogHeader>
        {!selectedPlatform ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {gameCards.map((platform) => (
              <button
                key={platform.id}
                className="flex flex-col items-center justify-center p-6 bg-gray-800/90 rounded-lg hover:bg-gray-700/90 transition-colors border border-gray-700"
                onClick={() => handlePlatformSelect(platform.title)}
              >
                <platform.icon className="w-8 h-8 mb-2" />
                <span>{platform.title}</span>
              </button>
            ))}
          </div>
        ) : (
          selectedPlatform === "Steam" && <SteamGamesList onBack={handleBack} />
        )}
      </DialogContent>
    </Dialog>
  )
}

