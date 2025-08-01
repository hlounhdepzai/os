"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder, File, Home, HardDrive, ArrowLeft, ArrowRight, Search, Grid, List } from "lucide-react"

interface FileItem {
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
}

const mockFiles: FileItem[] = [
  { name: "Documents", type: "folder", modified: "2024-01-15" },
  { name: "Pictures", type: "folder", modified: "2024-01-14" },
  { name: "Music", type: "folder", modified: "2024-01-13" },
  { name: "Videos", type: "folder", modified: "2024-01-12" },
  { name: "readme.txt", type: "file", size: "2.5 KB", modified: "2024-01-15" },
  { name: "config.json", type: "file", size: "1.2 KB", modified: "2024-01-14" },
  { name: "image.png", type: "file", size: "256 KB", modified: "2024-01-13" },
]

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath(`${currentPath}/${item.name}`)
    }
  }

  const handleItemSelect = (itemName: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 mx-4">
          <div className="flex items-center bg-gray-100 rounded px-3 py-1">
            <HardDrive className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{currentPath}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-6 gap-4">
            {mockFiles.map((item) => (
              <div
                key={item.name}
                className={`flex flex-col items-center p-3 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedItems.includes(item.name) ? "bg-blue-100" : ""
                }`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleItemSelect(item.name)
                }}
              >
                {item.type === "folder" ? (
                  <Folder className="w-12 h-12 text-blue-500 mb-2" />
                ) : (
                  <File className="w-12 h-12 text-gray-500 mb-2" />
                )}
                <span className="text-xs text-center truncate w-full">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-4 p-2 text-sm font-medium text-gray-600 border-b">
              <span>Tên</span>
              <span>Kích thước</span>
              <span>Loại</span>
              <span>Sửa đổi</span>
            </div>
            {mockFiles.map((item) => (
              <div
                key={item.name}
                className={`grid grid-cols-4 gap-4 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedItems.includes(item.name) ? "bg-blue-100" : ""
                }`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleItemSelect(item.name)
                }}
              >
                <div className="flex items-center">
                  {item.type === "folder" ? (
                    <Folder className="w-4 h-4 text-blue-500 mr-2" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500 mr-2" />
                  )}
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.size || "-"}</span>
                <span className="text-sm text-gray-600">{item.type === "folder" ? "Thư mục" : "Tệp"}</span>
                <span className="text-sm text-gray-600">{item.modified}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-gray-200 text-xs text-gray-600">
        {mockFiles.length} mục | {selectedItems.length} đã chọn
      </div>
    </div>
  )
}
