"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import LockScreen from "@/components/lock-screen"

export default function HLounhOS() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLocked, setIsLocked] = useState(true)
  const [showLockScreen, setShowLockScreen] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check if we should show lock screen on startup
    const hasPassword = localStorage.getItem("hlounh_password")
    setShowLockScreen(!!hasPassword || isLocked)
  }, [])

  const handleUnlock = () => {
    setIsLocked(false)
    setShowLockScreen(false)
  }

  if (showLockScreen) {
    return <LockScreen onUnlock={handleUnlock} currentTime={currentTime} />
  }

  return <Desktop currentTime={currentTime} />
}
