"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function TextEditor() {
  const [content, setContent] = useState(
    "Chào mừng đến với HLounh OS Text Editor!\n\nBạn có thể bắt đầu viết văn bản tại đây...",
  )
  const [fileName, setFileName] = useState("untitled.txt")

  const handleSave = () => {
    // Simulate saving file
    alert(`Đã lưu tệp: ${fileName}`)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Lưu
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            Mở
          </Button>
        </div>

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200">
        <Button variant="ghost" size="sm">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <Button variant="ghost" size="sm">
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none border-none outline-none font-mono text-sm leading-relaxed"
          placeholder="Bắt đầu viết..."
        />
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-gray-200 text-xs text-gray-600 flex justify-between">
        <span>Dòng: 1, Cột: 1</span>
        <span>{content.length} ký tự</span>
      </div>
    </div>
  )
}
