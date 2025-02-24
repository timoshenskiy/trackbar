"use client"

import { useState } from "react"
import { Search, Star } from "lucide-react"
import Modal from "../ui/modal"

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

interface GameResult {
    id: number
    title: string
    coverImage: string
    releaseDate: string
    rating: number
    genre: string
    platform: string
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("")
    
    // Mock data - replace with actual game API call
    const searchResults: GameResult[] = [
        {
            id: 1,
            title: "The Last Journey",
            coverImage: "https://via.placeholder.com/300x400",
            releaseDate: "2023",
            rating: 4.5,
            genre: "Action RPG",
            platform: "PC, PS5, Xbox Series X"
        },
        {
            id: 2,
            title: "Space Warriors",
            coverImage: "https://via.placeholder.com/300x400",
            releaseDate: "2023",
            rating: 4.8,
            genre: "Sci-fi FPS",
            platform: "PC, PS5"
        }
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Search Games">
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-lg"
                    />
                </div>

                <div className="space-y-4">
                    {searchResults.map((game) => (
                        <div
                            key={game.id}
                            className="group flex overflow-hidden rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300"
                        >
                            <div className="relative w-[180px] flex-shrink-0">
                                <img
                                    src={game.coverImage}
                                    alt={game.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 p-4">
                                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-300">{game.genre}</p>
                                    <p className="text-sm text-gray-400">{game.platform}</p>
                                    <p className="text-sm text-gray-400">Released: {game.releaseDate}</p>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-yellow-400 font-semibold">{game.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}
