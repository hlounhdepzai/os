"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, Cloud, Cpu, HardDrive, Wifi } from "lucide-react"

interface WidgetsProps {
  currentTime: Date
  onClose: () => void
}

export default function Widgets({ currentTime, onClose }: WidgetsProps) {
  const [weather, setWeather] = useState({
    temp: 25,
    condition: "Nắng",
    humidity: 65,
    wind: 12,
  })

  const [systemInfo, setSystemInfo] = useState({
    cpu: 45,
    memory: 68,
    disk: 72,
    network: "Kết nối",
  })

  const [calendar, setCalendar] = useState({
    today: new Date(),
    events: [
      { time: "09:00", title: "Họp team" },
      { time: "14:30", title: "Presentation" },
      { time: "16:00", title: "Code review" },
    ],
  })

  return (
    <div className="h-full p-4 space-y-4 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-semibold">Widgets</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Clock Widget */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {currentTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm opacity-75">
              {currentTime.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Cloud className="w-4 h-4 mr-2" />
            Thời tiết
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{weather.temp}°C</div>
              <div className="text-sm opacity-75">{weather.condition}</div>
            </div>
            <div className="text-right text-sm">
              <div>Độ ẩm: {weather.humidity}%</div>
              <div>Gió: {weather.wind} km/h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info Widget */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            Hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">CPU</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${systemInfo.cpu}%` }}
                />
              </div>
              <span className="text-sm">{systemInfo.cpu}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">RAM</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${systemInfo.memory}%` }}
                />
              </div>
              <span className="text-sm">{systemInfo.memory}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Disk</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${systemInfo.disk}%` }}
                />
              </div>
              <span className="text-sm">{systemInfo.disk}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Widget */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Lịch hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {calendar.events.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-12 text-xs opacity-75">{event.time}</div>
                <div className="flex-1">{event.title}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Wifi className="w-4 h-4 mr-2" />
              WiFi
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <HardDrive className="w-4 h-4 mr-2" />
              Storage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
