"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, WorkflowIcon as Widgets, Wifi, Volume2, Battery, ChevronUp } from "lucide-react"
import StartMenu from "@/components/start-menu"
import SearchPanel from "@/components/search-panel"
import NotificationCenter from "@/components/notification-center"
import type { AppWindow } from "@/components/desktop"

interface TaskbarProps {
  currentTime: Date
  windows: AppWindow[]
  onOpenApp: (appName: string, title: string) => void
  onRestoreWindow: (id: string) => void
  onToggleWidgets: () => void
  theme: "light" | "dark"
  accentColor: string
}

export default function Taskbar({
  currentTime,
  windows,
  onOpenApp,
  onRestoreWindow,
  onToggleWidgets,
  theme,
  accentColor,
}: TaskbarProps) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const taskbarBg = theme === "dark" ? "bg-gray-900/90" : "bg-white/90"
  const textColor = theme === "dark" ? "text-white" : "text-gray-800"

  return (
    <>
      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu
          onOpenApp={onOpenApp}
          onClose={() => setShowStartMenu(false)}
          theme={theme}
          accentColor={accentColor}
        />
      )}

      {/* Search Panel */}
      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} onOpenApp={onOpenApp} theme={theme} />}

      {/* Notification Center */}
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} theme={theme} />}

      {/* Taskbar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-12 ${taskbarBg} backdrop-blur-xl border-t border-white/20 flex items-center px-2 z-50`}
      >
        {/* Start Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`${textColor} hover:bg-white/20 rounded-lg transition-all duration-200`}
          onClick={() => setShowStartMenu(!showStartMenu)}
          style={{ backgroundColor: showStartMenu ? `${accentColor}20` : undefined }}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`${textColor} hover:bg-white/20 rounded-lg ml-1`}
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Task View Button */}
        <Button variant="ghost" size="sm" className={`${textColor} hover:bg-white/20 rounded-lg ml-1`}>
          <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
            <div className="bg-current rounded-sm opacity-60"></div>
            <div className="bg-current rounded-sm opacity-60"></div>
            <div className="bg-current rounded-sm opacity-60"></div>
            <div className="bg-current rounded-sm opacity-60"></div>
          </div>
        </Button>

        {/* Widgets Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`${textColor} hover:bg-white/20 rounded-lg ml-1`}
          onClick={onToggleWidgets}
        >
          <Widgets className="w-5 h-5" />
        </Button>

        {/* Window Buttons */}
        <div className="flex-1 flex items-center justify-center space-x-1 mx-4">
          {windows.map((window) => (
            <Button
              key={window.id}
              variant="ghost"
              size="sm"
              className={`${textColor} hover:bg-white/20 max-w-48 truncate rounded-lg transition-all duration-200 ${
                window.isMinimized ? "opacity-60" : ""
              }`}
              onClick={() => onRestoreWindow(window.id)}
              style={{
                backgroundColor: !window.isMinimized ? `${accentColor}20` : undefined,
                borderBottom: !window.isMinimized ? `2px solid ${accentColor}` : undefined,
              }}
            >
              {window.title}
            </Button>
          ))}
        </div>

        {/* System Tray */}
        <div className={`flex items-center space-x-2 ${textColor}`}>
          <Button variant="ghost" size="sm" className="hover:bg-white/20 rounded">
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/20 rounded">
            <Wifi className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/20 rounded">
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white/20 rounded">
            <Battery className="w-4 h-4" />
          </Button>

          {/* Date and Time */}
          <Button
            variant="ghost"
            size="sm"
            className={`${textColor} hover:bg-white/20 rounded flex flex-col items-center py-1 px-3`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="text-xs font-medium">
              {currentTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-xs opacity-75">
              {currentTime.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}
