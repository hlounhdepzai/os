"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, Eye, EyeOff, ArrowRight, Wifi, Battery, Volume2 } from "lucide-react"

interface LockScreenProps {
  onUnlock: () => void
  currentTime: Date
}

export default function LockScreen({ onUnlock, currentTime }: LockScreenProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isShaking, setIsShaking] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const [wallpaper, setWallpaper] = useState("")
  const [hasPassword, setHasPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load lock screen settings
    const savedWallpaper = localStorage.getItem("hlounh_lock_wallpaper")
    const savedPassword = localStorage.getItem("hlounh_password")

    setWallpaper(savedWallpaper || "/placeholder.svg?height=1080&width=1920&text=HLounh+OS+Lock+Screen")
    setHasPassword(!!savedPassword)

    // Focus input when component mounts
    setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            setAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, lockTimeRemaining])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) return

    const savedPassword = localStorage.getItem("hlounh_password")

    if (!savedPassword) {
      onUnlock()
      return
    }

    if (password === savedPassword) {
      setError("")
      setAttempts(0)
      onUnlock()
    } else {
      setError("Mật khẩu không đúng!")
      setPassword("")
      setIsShaking(true)
      setAttempts((prev) => prev + 1)

      // Lock after 5 failed attempts
      if (attempts >= 4) {
        setIsLocked(true)
        setLockTimeRemaining(30) // 30 seconds lockout
        setError("Quá nhiều lần thử sai. Vui lòng chờ 30 giây.")
      }

      setTimeout(() => {
        setIsShaking(false)
        if (!isLocked) {
          inputRef.current?.focus()
        }
      }, 500)
    }
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (time: Date) => {
    return time.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatLockTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="fixed inset-0 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Status Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-4">
          <div className="text-sm opacity-90">HLounh OS</div>
        </div>
        <div className="flex items-center space-x-3">
          <Wifi className="w-4 h-4 opacity-90" />
          <Volume2 className="w-4 h-4 opacity-90" />
          <Battery className="w-4 h-4 opacity-90" />
          <div className="text-sm opacity-90">100%</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        {/* Time and Date */}
        <div className="text-center mb-12">
          <div className="text-8xl font-thin text-white mb-2 drop-shadow-lg">{formatTime(currentTime)}</div>
          <div className="text-xl text-white/90 drop-shadow-md">{formatDate(currentTime)}</div>
        </div>

        {/* Login Form */}
        {hasPassword && (
          <Card className={`w-96 bg-white/10 backdrop-blur-xl border-white/20 ${isShaking ? "animate-shake" : ""}`}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                {/* User Avatar */}
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-10 h-10 text-white" />
                </div>

                {/* User Name */}
                <div className="text-white text-lg font-medium">Người dùng</div>

                {/* Password Input */}
                <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      placeholder={isLocked ? "Đã khóa" : "Nhập mật khẩu..."}
                      disabled={isLocked}
                      className="bg-white/20 border-white/30 text-white placeholder-white/70 pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLocked}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20"
                        disabled={isLocked || !password}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-300 text-sm text-center bg-red-500/20 rounded p-2 backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  {/* Lock Timer */}
                  {isLocked && (
                    <div className="text-center">
                      <div className="text-orange-300 text-sm mb-2">
                        Thử lại sau: {formatLockTime(lockTimeRemaining)}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-orange-400 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${((30 - lockTimeRemaining) / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Attempts Counter */}
                  {attempts > 0 && !isLocked && (
                    <div className="text-yellow-300 text-xs text-center">Còn {5 - attempts} lần thử</div>
                  )}
                </form>

                {/* Hint */}
                <div className="text-white/60 text-xs text-center">Nhấn Enter hoặc click mũi tên để đăng nhập</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Password - Click to Enter */}
        {!hasPassword && (
          <Card
            className="w-96 bg-white/10 backdrop-blur-xl border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
            onClick={onUnlock}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-lg font-medium">Người dùng</div>
                <div className="text-white/80 text-center">
                  <div className="mb-2">Chưa đặt mật khẩu</div>
                  <div className="text-sm text-white/60">Click để vào hệ thống</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex items-center justify-between p-6 text-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/20">
            Khẩn cấp
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/20">
            Tắt máy
          </Button>
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/20">
            Khởi động lại
          </Button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
