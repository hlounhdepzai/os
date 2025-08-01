"use client"

import { useState, useEffect } from "react"

export interface ThemeConfig {
  theme: "light" | "dark"
  wallpaper: string
  accentColor: string
  transparency: number
  animations: boolean
  sounds: boolean
}

const defaultTheme: ThemeConfig = {
  theme: "light",
  wallpaper: "/placeholder.svg?height=1080&width=1920&text=HLounh+OS+Wallpaper",
  accentColor: "#0078d4",
  transparency: 80,
  animations: true,
  sounds: true,
}

const wallpapers = [
  "/placeholder.svg?height=1080&width=1920&text=Default+Blue",
  "/placeholder.svg?height=1080&width=1920&text=Dark+Mountains",
  "/placeholder.svg?height=1080&width=1920&text=Abstract+Waves",
  "/placeholder.svg?height=1080&width=1920&text=Sunset+Sky",
  "/placeholder.svg?height=1080&width=1920&text=Forest+Path",
  "/placeholder.svg?height=1080&width=1920&text=City+Lights",
]

const accentColors = [
  "#0078d4", // Blue
  "#107c10", // Green
  "#d13438", // Red
  "#ff8c00", // Orange
  "#5c2d91", // Purple
  "#00bcf2", // Cyan
  "#e81123", // Crimson
  "#00cc6a", // Mint
]

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>(defaultTheme)

  useEffect(() => {
    const saved = localStorage.getItem("hlounh_theme")
    if (saved) {
      try {
        setConfig({ ...defaultTheme, ...JSON.parse(saved) })
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }
  }, [])

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    localStorage.setItem("hlounh_theme", JSON.stringify(newConfig))
  }

  return {
    ...config,
    updateTheme,
    wallpapers,
    accentColors,
  }
}
