"use client"

import Image from "next/image"
import { useState } from "react"

interface Screenshot {
  id: number
  url: string
}

interface ScreenshotsProps {
  screenshots: Screenshot[]
}

export function Screenshots({ screenshots }: ScreenshotsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {screenshots.map((screenshot) => (
          <div
            key={screenshot.id}
            className="cursor-pointer"
            onClick={() => setSelectedImage(`https:${screenshot.url.replace("t_thumb", "t_1080p")}`)}
          >
            <Image
              src={`https:${screenshot.url.replace("t_thumb", "t_cover_big")}`}
              alt="Game screenshot"
              width={300}
              height={169}
              className="rounded-lg shadow-md hover:opacity-80 transition-opacity"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-darker bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Full size screenshot"
              width={1920}
              height={1080}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}