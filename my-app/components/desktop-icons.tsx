"use client"

import { FileText, Calculator, Folder, Settings, Terminal, ImageIcon, Music, Globe, Code, Trash2 } from "lucide-react"

interface DesktopIconsProps {
  onOpenApp: (appName: string, title: string) => void
  theme: "light" | "dark"
}

const desktopApps = [
  { name: "file-manager", title: "Quản lý tệp", icon: Folder },
  { name: "web-browser", title: "Trình duyệt", icon: Globe },
  { name: "python-coder", title: "Python Coder", icon: Code },
  { name: "text-editor", title: "Soạn thảo văn bản", icon: FileText },
  { name: "calculator", title: "Máy tính", icon: Calculator },
  { name: "image-viewer", title: "Xem ảnh", icon: ImageIcon },
  { name: "music-player", title: "Nghe nhạc", icon: Music },
  { name: "terminal", title: "Terminal", icon: Terminal },
  { name: "settings", title: "Cài đặt", icon: Settings },
]

export default function DesktopIcons({ onOpenApp, theme }: DesktopIconsProps) {
  const iconTextColor = theme === "dark" ? "text-white" : "text-gray-800"
  const iconBg = theme === "dark" ? "bg-white/10" : "bg-white/20"
  const iconHoverBg = theme === "dark" ? "bg-white/20" : "bg-white/30"

  return (
    <>
      {/* Main Apps */}
      <div className="absolute top-6 left-6 grid grid-cols-1 gap-4">
        {desktopApps.map((app, index) => {
          const IconComponent = app.icon
          return (
            <div
              key={app.name}
              className="flex flex-col items-center cursor-pointer group"
              onDoubleClick={() => onOpenApp(app.name, app.title)}
            >
              <div
                className={`p-3 ${iconBg} backdrop-blur-sm rounded-xl group-hover:${iconHoverBg} transition-all duration-200 shadow-lg`}
              >
                <IconComponent className={`w-8 h-8 ${iconTextColor}`} />
              </div>
              <span
                className={`${iconTextColor} text-xs mt-2 text-center max-w-20 truncate font-medium drop-shadow-sm`}
              >
                {app.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Recycle Bin */}
      <div className="absolute bottom-20 right-6">
        <div className="flex flex-col items-center cursor-pointer group">
          <div
            className={`p-3 ${iconBg} backdrop-blur-sm rounded-xl group-hover:${iconHoverBg} transition-all duration-200 shadow-lg`}
          >
            <Trash2 className={`w-8 h-8 ${iconTextColor}`} />
          </div>
          <span className={`${iconTextColor} text-xs mt-2 text-center font-medium drop-shadow-sm`}>Thùng rác</span>
        </div>
      </div>
    </>
  )
}
