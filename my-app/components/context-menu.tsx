"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Palette, Monitor, Folder, Settings, ImageIcon, Grid3X3, List, SortAsc } from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onOpenApp: (appName: string, title: string) => void
}

export default function ContextMenu({ x, y, onClose, onOpenApp }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const menuItems = [
    {
      icon: RefreshCw,
      label: "Làm mới",
      action: () => window.location.reload(),
    },
    {
      icon: Grid3X3,
      label: "Xem theo lưới",
      action: () => {},
    },
    {
      icon: List,
      label: "Xem theo danh sách",
      action: () => {},
    },
    {
      icon: SortAsc,
      label: "Sắp xếp theo",
      submenu: ["Tên", "Kích thước", "Ngày tạo", "Loại"],
    },
    { type: "separator" },
    {
      icon: ImageIcon,
      label: "Thay đổi hình nền",
      action: () => onOpenApp("settings", "Cài đặt"),
    },
    {
      icon: Palette,
      label: "Cá nhân hóa",
      action: () => onOpenApp("settings", "Cài đặt"),
    },
    {
      icon: Monitor,
      label: "Cài đặt hiển thị",
      action: () => onOpenApp("settings", "Cài đặt"),
    },
    { type: "separator" },
    {
      icon: Folder,
      label: "Mở File Manager",
      action: () => onOpenApp("file-manager", "Quản lý tệp"),
    },
    {
      icon: Settings,
      label: "Mở Terminal tại đây",
      action: () => onOpenApp("terminal", "Terminal"),
    },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed bg-white/95 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl py-2 min-w-48 z-[9999]"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => {
        if (item.type === "separator") {
          return <div key={index} className="h-px bg-gray-200 my-1 mx-2" />
        }

        const IconComponent = item.icon!
        return (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm hover:bg-blue-50 rounded-none"
            onClick={() => {
              item.action?.()
              onClose()
            }}
          >
            <IconComponent className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}
