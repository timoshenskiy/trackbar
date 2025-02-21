"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Camera, Trophy, Clock, X } from "lucide-react"

interface GameStat {
  icon: React.ElementType
  label: string
  value: number
}

export default function AccountInfo() {
  const [avatar, setAvatar] = useState("/placeholder.svg?height=200&width=200")
  const [nickname, setNickname] = useState("GamerPro123")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const registrationDate = new Date("2023-01-01").toLocaleDateString()

  const gameStats: GameStat[] = [
    { icon: Trophy, label: "Games Beaten", value: 42 },
    { icon: Clock, label: "Games in Progress", value: 7 },
    { icon: X, label: "Games Dropped", value: 3 },
  ]

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative group">
          <Image
            src={avatar || "/placeholder.svg"}
            alt="User Avatar"
            width={200}
            height={200}
            className="rounded-full object-cover cursor-pointer"
            onClick={handleAvatarClick}
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Camera className="text-white w-8 h-8" />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <div className="space-y-4 flex-grow">
          <div>
            <Label htmlFor="nickname" className="text-white">
              Nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-white">Registration Date</Label>
            <p className="text-gray-300">{registrationDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameStats.map((stat) => (
          <div key={stat.label} className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
            <stat.icon className="text-purple-400 w-8 h-8" />
            <div>
              <p className="text-gray-300">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
    </div>
  )
}

