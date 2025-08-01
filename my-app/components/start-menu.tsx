"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Calculator,
  Folder,
  Settings,
  Terminal,
  ImageIcon,
  Music,
  Power,
  User,
  Search,
  Globe,
  Code,
  Star,
  Clock,
} from "lucide-react"

interface StartMenuProps {
  onOpenApp: (appName: string, title: string) => void
  onClose: () => void
  theme: "light" | "dark"
  accentColor: string
}

const pinnedApps = [
  { name: "web-browser", title: "Trình duyệt", icon: Globe },
  { name: "python-coder", title: "Python Coder", icon: Code },
  { name: "file-manager", title: "Quản lý tệp", icon: Folder },
  { name: "text-editor", title: "Soạn thảo văn bản", icon: FileText },
  { name: "calculator", title: "Máy tính", icon: Calculator },
  { name: "settings", title: "Cài đặt", icon: Settings },
]

const allApps = [
  { name: "file-manager", title: "Quản lý tệp", icon: Folder },
  { name: "text-editor", title: "Soạn thảo văn bản", icon: FileText },
  { name: "calculator", title: "Máy tính", icon: Calculator },
  { name: "web-browser", title: "Trình duyệt", icon: Globe },
  { name: "python-coder", title: "Python Coder", icon: Code },
  { name: "settings", title: "Cài đặt", icon: Settings },
  { name: "terminal", title: "Terminal", icon: Terminal },
  { name: "image-viewer", title: "Xem ảnh", icon: ImageIcon },
  { name: "music-player", title: "Nghe nhạc", icon: Music },
]

const recentFiles = [
  { name: "Document.txt", app: "text-editor", time: "2 phút trước" },
  { name: "Project.py", app: "python-coder", time: "15 phút trước" },
  { name: "Image.jpg", app: "image-viewer", time: "1 giờ trước" },
]

export default function StartMenu({ onOpenApp, onClose, theme, accentColor }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"pinned" | "all" | "recent">("pinned")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleAppClick = (appName: string, title: string) => {
    onOpenApp(appName, title)
    onClose()
  }

  const filteredApps = allApps.filter((app) => app.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const menuBg = theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
  const textColor = theme === "dark" ? "text-white" : "text-gray-800"
  const secondaryText = theme === "dark" ? "text-gray-300" : "text-gray-600"

  return (
    <div
      ref={menuRef}
      className={`absolute bottom-14 left-2 w-[640px] h-[720px] ${menuBg} backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-2xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: accentColor }}
          >
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className={`${textColor} font-semibold text-lg`}>Người dùng</div>
            <div className={`${secondaryText} text-sm`}>HLounh OS</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${secondaryText}`} />
          <Input
            type="text"
            placeholder="Tìm kiếm ứng dụng, tệp tin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"} ${textColor}`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: "pinned", label: "Ghim", icon: Star },
            { id: "all", label: "Tất cả", icon: null },
            { id: "recent", label: "Gần đây", icon: Clock },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 rounded-none py-3 ${textColor} ${activeTab === tab.id ? `border-b-2` : ""}`}
              style={{
                borderBottomColor: activeTab === tab.id ? accentColor : undefined,
                backgroundColor: activeTab === tab.id ? `${accentColor}10` : undefined,
              }}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* App Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "pinned" && (
            <div className="grid grid-cols-6 gap-4">
              {pinnedApps.map((app) => {
                const IconComponent = app.icon
                return (
                  <div
                    key={app.name}
                    className={`flex flex-col items-center p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200`}
                    onClick={() => handleAppClick(app.name, app.title)}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-xs text-center ${textColor}`}>{app.title}</span>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "all" && (
            <div className="grid grid-cols-6 gap-4">
              {(searchQuery ? filteredApps : allApps).map((app) => {
                const IconComponent = app.icon
                return (
                  <div
                    key={app.name}
                    className={`flex flex-col items-center p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200`}
                    onClick={() => handleAppClick(app.name, app.title)}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-xs text-center ${textColor}`}>{app.title}</span>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "recent" && (
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200`}
                  onClick={() => handleAppClick(file.app, file.name)}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`${textColor} font-medium`}>{file.name}</div>
                    <div className={`${secondaryText} text-sm`}>{file.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className={`${textColor} hover:bg-white/10`}>
            <User className="w-4 h-4 mr-2" />
            Tài khoản
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`${textColor} hover:bg-white/10`}
          onClick={() => window.location.reload()}
        >
          <Power className="w-4 h-4 mr-2" />
          Nguồn
        </Button>
      </div>
    </div>
  )
}
