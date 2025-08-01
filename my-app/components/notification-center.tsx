"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Bell, Settings, Wifi, Volume2, Bluetooth, LightbulbIcon as Brightness, Moon, Sun } from "lucide-react"

interface NotificationCenterProps {
  onClose: () => void
  theme: "light" | "dark"
}

const notifications = [
  {
    id: 1,
    title: "HLounh OS",
    message: "Hệ thống đã được cập nhật thành công",
    time: "5 phút trước",
    type: "system",
  },
  {
    id: 2,
    title: "Python Coder",
    message: "Code của bạn đã chạy thành công",
    time: "10 phút trước",
    type: "app",
  },
  {
    id: 3,
    title: "Web Browser",
    message: "Trang web đã tải xong",
    time: "15 phút trước",
    type: "app",
  },
]

export default function NotificationCenter({ onClose, theme }: NotificationCenterProps) {
  const [quickSettings, setQuickSettings] = useState({
    wifi: true,
    bluetooth: false,
    darkMode: theme === "dark",
    doNotDisturb: false,
  })

  const panelBg = theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
  const textColor = theme === "dark" ? "text-white" : "text-gray-800"
  const secondaryText = theme === "dark" ? "text-gray-300" : "text-gray-600"

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-end pt-14 pr-4 z-[9999]">
      <div className={`w-80 ${panelBg} backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className={`${textColor} font-semibold`}>Thông báo</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className={`${textColor} hover:bg-white/20`}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Settings */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-3 h-auto ${
                quickSettings.wifi ? "bg-blue-500 text-white" : `${textColor} hover:bg-white/20`
              }`}
              onClick={() => setQuickSettings((prev) => ({ ...prev, wifi: !prev.wifi }))}
            >
              <Wifi className="w-5 h-5 mb-1" />
              <span className="text-xs">WiFi</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-3 h-auto ${
                quickSettings.bluetooth ? "bg-blue-500 text-white" : `${textColor} hover:bg-white/20`
              }`}
              onClick={() => setQuickSettings((prev) => ({ ...prev, bluetooth: !prev.bluetooth }))}
            >
              <Bluetooth className="w-5 h-5 mb-1" />
              <span className="text-xs">Bluetooth</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-3 h-auto ${
                quickSettings.darkMode ? "bg-blue-500 text-white" : `${textColor} hover:bg-white/20`
              }`}
              onClick={() => setQuickSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
            >
              {quickSettings.darkMode ? <Moon className="w-5 h-5 mb-1" /> : <Sun className="w-5 h-5 mb-1" />}
              <span className="text-xs">Theme</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-3 h-auto ${textColor} hover:bg-white/20`}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Brightness className={`w-4 h-4 ${secondaryText}`} />
              <input type="range" min="0" max="100" defaultValue="75" className="flex-1" />
            </div>
            <div className="flex items-center space-x-3">
              <Volume2 className={`w-4 h-4 ${secondaryText}`} />
              <input type="range" min="0" max="100" defaultValue="50" className="flex-1" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="max-h-96 overflow-auto">
          {notifications.length === 0 ? (
            <div className={`p-8 text-center ${secondaryText}`}>
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không có thông báo mới</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`${textColor} font-medium text-sm`}>{notification.title}</h4>
                      <span className={`${secondaryText} text-xs`}>{notification.time}</span>
                    </div>
                    <p className={`${secondaryText} text-sm`}>{notification.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Button variant="ghost" size="sm" className={`w-full ${textColor} hover:bg-white/20`}>
            Xóa tất cả thông báo
          </Button>
        </div>
      </div>
    </div>
  )
}
