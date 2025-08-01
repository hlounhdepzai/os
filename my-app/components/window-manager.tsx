"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Minus, Square, SquareCheck } from "lucide-react"
import type { AppWindow } from "@/components/desktop"

// Import app components
import FileManager from "@/components/apps/file-manager"
import TextEditor from "@/components/apps/text-editor"
import Calculator from "@/components/apps/calculator"
import WebBrowser from "@/components/apps/web-browser"
import PythonCoder from "@/components/apps/python-coder"
import Settings from "@/components/apps/settings"
import Terminal from "@/components/apps/terminal"
import ImageViewer from "@/components/apps/image-viewer"
import MusicPlayer from "@/components/apps/music-player"

interface WindowManagerProps {
  windows: AppWindow[]
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onUpdate: (id: string, updates: Partial<AppWindow>) => void
  onBringToFront: (id: string) => void
  theme: "light" | "dark"
  accentColor: string
}

const appComponents = {
  "file-manager": FileManager,
  "text-editor": TextEditor,
  calculator: Calculator,
  "web-browser": WebBrowser,
  "python-coder": PythonCoder,
  settings: Settings,
  terminal: Terminal,
  "image-viewer": ImageViewer,
  "music-player": MusicPlayer,
}

export default function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onUpdate,
  onBringToFront,
  theme,
  accentColor,
}: WindowManagerProps) {
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    windowId: string | null
    offset: { x: number; y: number }
  }>({
    isDragging: false,
    windowId: null,
    offset: { x: 0, y: 0 },
  })

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setDragState({
      isDragging: true,
      windowId,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    })
    onBringToFront(windowId)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragState.isDragging && dragState.windowId) {
      const newX = e.clientX - dragState.offset.x
      const newY = e.clientY - dragState.offset.y

      onUpdate(dragState.windowId, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) },
      })
    }
  }

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      windowId: null,
      offset: { x: 0, y: 0 },
    })
  }

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [dragState.isDragging])

  const windowBg = theme === "dark" ? "bg-gray-800" : "bg-white"
  const headerBg = theme === "dark" ? "bg-gray-700" : "bg-gray-50"
  const textColor = theme === "dark" ? "text-white" : "text-gray-800"
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-200"

  return (
    <>
      {windows.map((window) => {
        if (window.isMinimized) return null

        const AppComponent = appComponents[window.component as keyof typeof appComponents]

        return (
          <div
            key={window.id}
            className={`absolute ${windowBg} rounded-xl shadow-2xl border ${borderColor} overflow-hidden transition-all duration-200`}
            style={{
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              zIndex: window.zIndex,
            }}
            onClick={() => onBringToFront(window.id)}
          >
            {/* Window Header */}
            <div
              className={`h-10 ${headerBg} border-b ${borderColor} flex items-center justify-between px-4 cursor-move select-none`}
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <span className={`text-sm font-medium ${textColor} truncate`}>{window.title}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-gray-200 ${textColor}`}
                  onClick={() => onMinimize(window.id)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-gray-200 ${textColor}`}
                  onClick={() => onMaximize(window.id)}
                >
                  {window.isMaximized ? <SquareCheck className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 ${textColor}`}
                  onClick={() => onClose(window.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Window Content */}
            <div className="h-full overflow-hidden" style={{ height: "calc(100% - 40px)" }}>
              {AppComponent && <AppComponent />}
            </div>
          </div>
        )
      })}
    </>
  )
}
