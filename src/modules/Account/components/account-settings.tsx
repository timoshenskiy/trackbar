"use client"

import { useState } from "react"
import { Label } from "@/ui/label"
import { Switch } from "@/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"

export default function AccountSettings() {
  const [isPublic, setIsPublic] = useState(false)
  const [language, setLanguage] = useState("en")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Public Profile</Label>
            <p className="text-sm text-gray-400">Allow other users to view your profile and game activity</p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

