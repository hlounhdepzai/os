"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Monitor,
  Volume2,
  Wifi,
  Shield,
  Palette,
  User,
  HardDrive,
  Info,
  Smartphone,
  Upload,
  Lock,
  ImageIcon,
  Trash2,
} from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personalization")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hasPassword, setHasPassword] = useState(false)
  const [lockWallpapers, setLockWallpapers] = useState<string[]>([])
  const [selectedLockWallpaper, setSelectedLockWallpaper] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { theme, wallpaper, accentColor, transparency, animations, sounds, updateTheme, wallpapers, accentColors } =
    useTheme()

  useEffect(() => {
    const savedPassword = localStorage.getItem("hlounh_password")
    const savedLockWallpapers = localStorage.getItem("hlounh_lock_wallpapers")
    const savedSelectedLockWallpaper = localStorage.getItem("hlounh_lock_wallpaper")

    setHasPassword(!!savedPassword)

    if (savedLockWallpapers) {
      try {
        setLockWallpapers(JSON.parse(savedLockWallpapers))
      } catch (error) {
        console.error("Error loading lock wallpapers:", error)
      }
    } else {
      // Default lock wallpapers
      const defaultWallpapers = [
        "/placeholder.svg?height=1080&width=1920&text=Lock+Screen+1",
        "/placeholder.svg?height=1080&width=1920&text=Lock+Screen+2",
        "/placeholder.svg?height=1080&width=1920&text=Lock+Screen+3",
      ]
      setLockWallpapers(defaultWallpapers)
      localStorage.setItem("hlounh_lock_wallpapers", JSON.stringify(defaultWallpapers))
    }

    setSelectedLockWallpaper(savedSelectedLockWallpaper || lockWallpapers[0] || "")
  }, [])

  const settingsTabs = [
    { id: "personalization", name: "Cá nhân hóa", icon: Palette },
    { id: "lockscreen", name: "Màn hình khóa", icon: Lock },
    { id: "display", name: "Hiển thị", icon: Monitor },
    { id: "sound", name: "Âm thanh", icon: Volume2 },
    { id: "network", name: "Mạng", icon: Wifi },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "accounts", name: "Tài khoản", icon: User },
    { id: "storage", name: "Lưu trữ", icon: HardDrive },
    { id: "about", name: "Thông tin", icon: Info },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const newWallpapers = [...lockWallpapers, imageUrl]
        setLockWallpapers(newWallpapers)
        localStorage.setItem("hlounh_lock_wallpapers", JSON.stringify(newWallpapers))
        setSelectedLockWallpaper(imageUrl)
        localStorage.setItem("hlounh_lock_wallpaper", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLockWallpaper = (wallpaperToRemove: string) => {
    const newWallpapers = lockWallpapers.filter((wp) => wp !== wallpaperToRemove)
    setLockWallpapers(newWallpapers)
    localStorage.setItem("hlounh_lock_wallpapers", JSON.stringify(newWallpapers))

    if (selectedLockWallpaper === wallpaperToRemove) {
      const newSelected = newWallpapers[0] || ""
      setSelectedLockWallpaper(newSelected)
      localStorage.setItem("hlounh_lock_wallpaper", newSelected)
    }
  }

  const selectLockWallpaper = (wallpaper: string) => {
    setSelectedLockWallpaper(wallpaper)
    localStorage.setItem("hlounh_lock_wallpaper", wallpaper)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "lockscreen":
        return (
          <div className="space-y-6">
            {/* Lock Screen Wallpaper */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Hình nền màn hình khóa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center space-x-4">
                  <Button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Tải ảnh lên</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-600">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</span>
                </div>

                {/* Wallpaper Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {lockWallpapers.map((wp, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video border-2 rounded-lg cursor-pointer overflow-hidden transition-all group ${
                        selectedLockWallpaper === wp
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => selectLockWallpaper(wp)}
                    >
                      <img
                        src={wp || "/placeholder.svg"}
                        alt={`Lock Wallpaper ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Selection Indicator */}
                      {selectedLockWallpaper === wp && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {/* Delete Button */}
                      {lockWallpapers.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLockWallpaper(wp)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}

                      {/* Preview Label */}
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index === 0 && !wp.startsWith("data:") ? "Mặc định" : `Ảnh ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Xem trước màn hình khóa:</h4>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={selectedLockWallpaper || "/placeholder.svg"}
                      alt="Lock Screen Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl font-thin mb-1">12:34</div>
                        <div className="text-xs opacity-90">Thứ Hai, 1 tháng 1, 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lock Screen Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Mật khẩu màn hình khóa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasPassword ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Đặt mật khẩu để bảo vệ màn hình khóa. Khi khởi động, hệ thống sẽ yêu cầu nhập mật khẩu.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu..."
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (newPassword && newPassword === confirmPassword) {
                            localStorage.setItem("hlounh_password", newPassword)
                            setHasPassword(true)
                            setNewPassword("")
                            setConfirmPassword("")
                            alert("Đã đặt mật khẩu màn hình khóa thành công!")
                          } else {
                            alert("Mật khẩu không khớp!")
                          }
                        }}
                        disabled={!newPassword || newPassword !== confirmPassword}
                      >
                        Đặt mật khẩu
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Màn hình khóa đã được bảo vệ bằng mật khẩu.</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu hiện tại..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            const savedPassword = localStorage.getItem("hlounh_password")
                            if (currentPassword === savedPassword && newPassword && newPassword === confirmPassword) {
                              localStorage.setItem("hlounh_password", newPassword)
                              setCurrentPassword("")
                              setNewPassword("")
                              setConfirmPassword("")
                              alert("Đã thay đổi mật khẩu thành công!")
                            } else {
                              alert("Mật khẩu hiện tại không đúng hoặc mật khẩu mới không khớp!")
                            }
                          }}
                          disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                        >
                          Thay đổi
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const savedPassword = localStorage.getItem("hlounh_password")
                            if (currentPassword === savedPassword) {
                              localStorage.removeItem("hlounh_password")
                              setHasPassword(false)
                              setCurrentPassword("")
                              alert("Đã xóa mật khẩu màn hình khóa!")
                            } else {
                              alert("Mật khẩu hiện tại không đúng!")
                            }
                          }}
                        >
                          Xóa mật khẩu
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Mẹo bảo mật:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                    <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                    <li>• Thay đổi mật khẩu định kỳ</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "personalization":
        return (
          <div className="space-y-6">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Chế độ giao diện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                    onClick={() => updateTheme({ theme: "light" })}
                  >
                    <div className="w-full h-20 bg-gradient-to-br from-blue-100 to-white rounded mb-2"></div>
                    <p className="text-center font-medium">Sáng</p>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                    onClick={() => updateTheme({ theme: "dark" })}
                  >
                    <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-black rounded mb-2"></div>
                    <p className="text-center font-medium">Tối</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Wallpaper Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Hình nền desktop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {wallpapers.map((wp, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video border-2 rounded-lg cursor-pointer overflow-hidden transition-all ${
                        wallpaper === wp ? "border-blue-500" : "border-gray-300"
                      }`}
                      onClick={() => updateTheme({ wallpaper: wp })}
                    >
                      <img
                        src={wp || "/placeholder.svg"}
                        alt={`Wallpaper ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {wallpaper === wp && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accent Color */}
            <Card>
              <CardHeader>
                <CardTitle>Màu chủ đạo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-3">
                  {accentColors.map((color) => (
                    <div
                      key={color}
                      className={`w-12 h-12 rounded-full cursor-pointer border-4 transition-all ${
                        accentColor === color ? "border-gray-400 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateTheme({ accentColor: color })}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effects */}
            <Card>
              <CardHeader>
                <CardTitle>Hiệu ứng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Độ trong suốt</p>
                    <p className="text-sm text-gray-600">Điều chỉnh độ trong suốt của các cửa sổ</p>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={transparency}
                    onChange={(e) => updateTheme({ transparency: Number.parseInt(e.target.value) })}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hiệu ứng động</p>
                    <p className="text-sm text-gray-600">Bật/tắt các hiệu ứng chuyển động</p>
                  </div>
                  <Button
                    variant={animations ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateTheme({ animations: !animations })}
                  >
                    {animations ? "Bật" : "Tắt"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Âm thanh hệ thống</p>
                    <p className="text-sm text-gray-600">Phát âm thanh khi thực hiện thao tác</p>
                  </div>
                  <Button
                    variant={sounds ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateTheme({ sounds: !sounds })}
                  >
                    {sounds ? "Bật" : "Tắt"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "display":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Độ phân giải màn hình</CardTitle>
              </CardHeader>
              <CardContent>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>1920 x 1080 (Khuyến nghị)</option>
                  <option>1366 x 768</option>
                  <option>1280 x 720</option>
                  <option>2560 x 1440</option>
                  <option>3840 x 2160 (4K)</option>
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ hiển thị</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 125, 150, 175].map((scale) => (
                    <Button key={scale} variant="outline" className="text-center bg-transparent">
                      {scale}%
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Độ sáng</CardTitle>
              </CardHeader>
              <CardContent>
                <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
              </CardContent>
            </Card>
          </div>
        )

      case "sound":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Âm lượng chính</CardTitle>
              </CardHeader>
              <CardContent>
                <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thiết bị âm thanh</CardTitle>
              </CardHeader>
              <CardContent>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Loa (Realtek Audio)</option>
                  <option>Tai nghe</option>
                  <option>Bluetooth Audio</option>
                  <option>USB Audio</option>
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Âm thanh hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Âm thanh khởi động</span>
                  <Button variant="outline" size="sm">
                    Bật
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Âm thanh thông báo</span>
                  <Button variant="outline" size="sm">
                    Bật
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Âm thanh click chuột</span>
                  <Button variant="outline" size="sm">
                    Tắt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Trạng thái bảo mật:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Màn hình khóa: {hasPassword ? "Đã bảo vệ" : "Chưa bảo vệ"}</li>
                    <li>• Tường lửa: Đang hoạt động</li>
                    <li>• Cập nhật bảo mật: Mới nhất</li>
                    <li>• Quét virus: Sạch</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "about":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-6 h-6 mr-2" />
                  HLounh OS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Phiên bản</p>
                    <p className="font-semibold">1.0.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kiến trúc</p>
                    <p className="font-semibold">x64</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bộ nhớ RAM</p>
                    <p className="font-semibold">8 GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bộ xử lý</p>
                    <p className="font-semibold">Intel Core i5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày phát hành</p>
                    <p className="font-semibold">2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loại hệ thống</p>
                    <p className="font-semibold">Web OS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tính năng</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✅ Giao diện Windows 11 hiện đại</li>
                  <li>✅ Màn hình khóa với mật khẩu</li>
                  <li>✅ Cá nhân hóa như Linux</li>
                  <li>✅ Web Browser tích hợp</li>
                  <li>✅ Python Coder IDE</li>
                  <li>✅ File Manager hoàn chỉnh</li>
                  <li>✅ Widgets và Notifications</li>
                  <li>✅ Dark/Light Theme</li>
                  <li>✅ Multi-window support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div className="text-center py-8 text-gray-500">Tính năng đang được phát triển...</div>
    }
  }

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Cài đặt</h2>
        <div className="space-y-1">
          {settingsTabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">{settingsTabs.find((tab) => tab.id === activeTab)?.name}</h1>
        {renderTabContent()}
      </div>
    </div>
  )
}
