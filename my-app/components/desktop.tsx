"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Taskbar from "@/components/taskbar"
import WindowManager from "@/components/window-manager"
import DesktopIcons from "@/components/desktop-icons"
import PasswordPrompt from "@/components/password-prompt"
import ContextMenu from "@/components/context-menu"
import Widgets from "@/components/widgets"
import { useTheme } from "@/hooks/use-theme"

interface DesktopProps {
  currentTime: Date
}

export interface AppWindow {
  id: string
  title: string
  component: string
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export default function Desktop({ currentTime }: DesktopProps) {
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)
  const [hasPassword, setHasPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [pendingApp, setPendingApp] = useState<{ name: string; title: string } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({
    x: 0,
    y: 0,
    show: false,
  })
  const [showWidgets, setShowWidgets] = useState(false)
  const { theme, wallpaper, accentColor } = useTheme()

  useEffect(() => {
    const savedPassword = localStorage.getItem("hlounh_password")
    setHasPassword(!!savedPassword)
  }, [])

  const openApp = (appName: string, title: string) => {
    if (appName === "settings" && hasPassword && !isAuthenticated) {
      setPendingApp({ name: appName, title })
      setShowPasswordPrompt(true)
      return
    }

    const existingWindow = windows.find((w) => w.component === appName)
    if (existingWindow) {
      setWindows((prev) =>
        prev.map((w) => (w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w)),
      )
      setNextZIndex((prev) => prev + 1)
      return
    }

    const newWindow: AppWindow = {
      id: `${appName}-${Date.now()}`,
      title,
      component: appName,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 1000, height: 700 },
      zIndex: nextZIndex,
    }

    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
  }

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              position: w.isMaximized ? { x: 100, y: 100 } : { x: 0, y: 0 },
              size: w.isMaximized
                ? { width: 1000, height: 700 }
                : { width: window.innerWidth, height: window.innerHeight - 48 },
            }
          : w,
      ),
    )
  }

  const restoreWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const updateWindow = (id: string, updates: Partial<AppWindow>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const bringToFront = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      show: true,
    })
  }

  const handleDesktopClick = () => {
    setContextMenu({ x: 0, y: 0, show: false })
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${theme === "dark" ? "bg-gray-900" : "bg-blue-50"}`}
      onContextMenu={handleDesktopRightClick}
      onClick={handleDesktopClick}
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Desktop Background Overlay */}
      <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/20" : "bg-white/10"} backdrop-blur-[1px]`} />

      {/* Widgets Panel */}
      {showWidgets && (
        <div className="absolute top-0 right-0 w-80 h-full bg-black/20 backdrop-blur-xl border-l border-white/20 z-40">
          <Widgets currentTime={currentTime} onClose={() => setShowWidgets(false)} />
        </div>
      )}

      {/* Desktop Icons */}
      <DesktopIcons onOpenApp={openApp} theme={theme} />

      {/* Window Manager */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onUpdate={updateWindow}
        onBringToFront={bringToFront}
        theme={theme}
        accentColor={accentColor}
      />

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu({ x: 0, y: 0, show: false })}
          onOpenApp={openApp}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        currentTime={currentTime}
        windows={windows}
        onOpenApp={openApp}
        onRestoreWindow={restoreWindow}
        onToggleWidgets={() => setShowWidgets(!showWidgets)}
        theme={theme}
        accentColor={accentColor}
      />

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <PasswordPrompt
          onClose={() => {
            setShowPasswordPrompt(false)
            setPendingApp(null)
          }}
          onSuccess={() => {
            setIsAuthenticated(true)
            if (pendingApp) {
              const newWindow: AppWindow = {
                id: `${pendingApp.name}-${Date.now()}`,
                title: pendingApp.title,
                component: pendingApp.name,
                isMinimized: false,
                isMaximized: false,
                position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
                size: { width: 1000, height: 700 },
                zIndex: nextZIndex,
              }
              setWindows((prev) => [...prev, newWindow])
              setNextZIndex((prev) => prev + 1)
              setPendingApp(null)
            }
          }}
          title="Truy cập Cài đặt"
        />
      )}
    </div>
  )
}
