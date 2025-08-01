"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, X } from "lucide-react"

interface PasswordPromptProps {
  onClose: () => void
  onSuccess: () => void
  title?: string
}

export default function PasswordPrompt({ onClose, onSuccess, title = "Nhập mật khẩu" }: PasswordPromptProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Lấy mật khẩu đã lưu từ localStorage
    const savedPassword = localStorage.getItem("hlounh_password")

    if (password === savedPassword) {
      onSuccess()
      onClose()
    } else {
      setError("Mật khẩu không đúng!")
      setPassword("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <Card className="w-96 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-500" : ""}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Xác nhận
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
