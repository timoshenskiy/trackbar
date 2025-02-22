"use client"

import { useState } from "react"
import AccountSidebar from "@/modules/Account/components/account-sidebar"
import AccountSettings from "@/modules/Account/components/account-settings"
import AccountInfo from "@/modules/Account/components/account-info"
import GamesList from "@/modules/Account/components/games-list"
import ImportGamesModal from "@/modules/Account/components/import-games-modal"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("info")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <AccountSettings />
      case "info":
        return <AccountInfo />
      case "games":
        return <GamesList />
      default:
        return <AccountInfo />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <AccountSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onImportClick={() => setIsImportModalOpen(true)}
          />
          <div className="flex-1 bg-gray-800 rounded-lg p-6">{renderContent()}</div>
        </div>
      </div>
      <ImportGamesModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}

