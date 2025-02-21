import { Settings, Import, Info, GamepadIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onImportClick: () => void
}

const menuItems = [
  { id: "info", label: "Account Info", icon: Info },
  { id: "games", label: "Games", icon: GamepadIcon },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function AccountSidebar({ activeTab, onTabChange, onImportClick }: AccountSidebarProps) {
  return (
    <div className="w-64 bg-gray-900/95 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors",
              activeTab === item.id ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-gray-800/80",
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
        <button
          onClick={onImportClick}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <Import className="w-5 h-5" />
          Import Games
        </button>
      </nav>
    </div>
  )
}

