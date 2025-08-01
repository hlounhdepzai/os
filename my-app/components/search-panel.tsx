"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Star, FileText, Calculator, Folder, Globe, Code } from "lucide-react"

interface SearchPanelProps {
  onClose: () => void
  onOpenApp: (appName: string, title: string) => void
  theme: "light" | "dark"
}

const searchableItems = [
  { type: "app", name: "file-manager", title: "Quản lý tệp", icon: Folder },
  { type: "app", name: "text-editor", title: "Soạn thảo văn bản", icon: FileText },
  { type: "app", name: "calculator", title: "Máy tính", icon: Calculator },
  { type: "app", name: "web-browser", title: "Trình duyệt", icon: Globe },
  { type: "app", name: "python-coder", title: "Python Coder", icon: Code },
  { type: "file", name: "Document.txt", path: "/Documents/Document.txt", icon: FileText },
  { type: "file", name: "Project.py", path: "/Documents/Project.py", icon: Code },
  { type: "setting", name: "Cài đặt hiển thị", path: "settings/display", icon: Star },
  { type: "setting", name: "Cài đặt âm thanh", path: "settings/sound", icon: Star },
]

export default function SearchPanel({ onClose, onOpenApp, theme }: SearchPanelProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(searchableItems)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim() === "") {
      setResults(searchableItems)
    } else {
      const filtered = searchableItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.name.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
    }
  }, [query])

  const handleItemClick = (item: any) => {
    if (item.type === "app") {
      onOpenApp(item.name, item.title)
    } else if (item.type === "setting") {
      onOpenApp("settings", "Cài đặt")
    }
    onClose()
  }

  const panelBg = theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
  const textColor = theme === "dark" ? "text-white" : "text-gray-800"
  const secondaryText = theme === "dark" ? "text-gray-300" : "text-gray-600"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-[9999]">
      <div
        className={`w-[600px] ${panelBg} backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden`}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${secondaryText}`} />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm ứng dụng, tệp tin, cài đặt..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`pl-12 pr-10 py-3 text-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"} ${textColor}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${textColor} hover:bg-white/20`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-auto">
          {results.length === 0 ? (
            <div className={`p-8 text-center ${secondaryText}`}>
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không tìm thấy kết quả nào</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3 text-white">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`${textColor} font-medium`}>{item.title || item.name}</div>
                      <div className={`${secondaryText} text-sm`}>
                        {item.type === "app" && "Ứng dụng"}
                        {item.type === "file" && `Tệp tin • ${item.path}`}
                        {item.type === "setting" && "Cài đặt"}
                      </div>
                    </div>
                    <div className={`${secondaryText} text-xs`}>{item.type === "app" && "Enter"}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t border-white/10 ${secondaryText} text-xs text-center`}>
          Nhấn Enter để mở • Esc để đóng
        </div>
      </div>
    </div>
  )
}
