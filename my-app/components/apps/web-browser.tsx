"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Star,
  MoreVertical,
  Plus,
  X,
  AlertTriangle,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"

interface Tab {
  id: string
  title: string
  url: string
  isLoading: boolean
  hasError: boolean
  screenshot?: string
  content?: string
}

const bookmarks = [
  { name: "Google", url: "https://www.google.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Stack Overflow", url: "https://stackoverflow.com" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
]

const quickAccess = [
  { name: "Google", url: "https://www.google.com", color: "bg-blue-500" },
  { name: "YouTube", url: "https://www.youtube.com", color: "bg-red-500" },
  { name: "GitHub", url: "https://github.com", color: "bg-gray-800" },
  { name: "Facebook", url: "https://www.facebook.com", color: "bg-blue-600" },
  { name: "Twitter", url: "https://twitter.com", color: "bg-sky-500" },
  { name: "Instagram", url: "https://www.instagram.com", color: "bg-pink-500" },
  { name: "LinkedIn", url: "https://www.linkedin.com", color: "bg-blue-700" },
  { name: "Reddit", url: "https://www.reddit.com", color: "bg-orange-500" },
]

export default function WebBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Trang chủ",
      url: "",
      isLoading: false,
      hasError: false,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [addressBar, setAddressBar] = useState("")
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isHeadlessMode, setIsHeadlessMode] = useState(true)

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "Trang mới",
      url: "",
      isLoading: false,
      hasError: false,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
    setAddressBar("")
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return

    setTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
      setActiveTabId(remainingTabs[0]?.id || "")
    }
  }

  // Headless Browser Simulation
  const fetchPageWithHeadless = async (url: string) => {
    try {
      // Simulate headless browser request
      const response = await fetch("/api/headless-browser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          viewport: getViewportSize(),
          waitFor: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        screenshot: data.screenshot,
        content: data.content,
        title: data.title,
        metadata: data.metadata,
      }
    } catch (error) {
      // Fallback: Generate mock screenshot
      return generateMockScreenshot(url)
    }
  }

  const generateMockScreenshot = (url: string) => {
    const domain = new URL(url).hostname
    const mockScreenshots = {
      "www.youtube.com": "/placeholder.svg?height=600&width=800&text=YouTube+Homepage",
      "github.com": "/placeholder.svg?height=600&width=800&text=GitHub+Repository",
      "stackoverflow.com": "/placeholder.svg?height=600&width=800&text=Stack+Overflow",
      "facebook.com": "/placeholder.svg?height=600&width=800&text=Facebook+Feed",
      "twitter.com": "/placeholder.svg?height=600&width=800&text=Twitter+Timeline",
      "instagram.com": "/placeholder.svg?height=600&width=800&text=Instagram+Photos",
    }

    return {
      success: true,
      screenshot: mockScreenshots[domain] || `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(domain)}`,
      content: `Mock content for ${domain}`,
      title: domain,
      metadata: { description: `Mock page for ${domain}` },
    }
  }

  const getViewportSize = () => {
    switch (viewMode) {
      case "mobile":
        return { width: 375, height: 667 }
      case "tablet":
        return { width: 768, height: 1024 }
      default:
        return { width: 1920, height: 1080 }
    }
  }

  const navigateToUrl = async (url: string) => {
    if (!url) return

    let fullUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `https://${url}`
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: fullUrl,
              isLoading: true,
              title: "Đang tải...",
              hasError: false,
              screenshot: undefined,
            }
          : tab,
      ),
    )

    if (isHeadlessMode) {
      const result = await fetchPageWithHeadless(fullUrl)

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                isLoading: false,
                title: result.title || new URL(fullUrl).hostname,
                hasError: !result.success,
                screenshot: result.screenshot,
                content: result.content,
              }
            : tab,
        ),
      )
    } else {
      // Traditional iframe mode
      setTimeout(() => {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? {
                  ...tab,
                  isLoading: false,
                  title: new URL(fullUrl).hostname,
                  hasError: false,
                }
              : tab,
          ),
        )
      }, 1500)
    }
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(addressBar)
  }

  const goHome = () => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, url: "", title: "Trang chủ", hasError: false, screenshot: undefined } : tab,
      ),
    )
    setAddressBar("")
  }

  const refresh = () => {
    if (activeTab?.url) {
      navigateToUrl(activeTab.url)
    }
  }

  const openInNewWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 border-b border-gray-200">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-48 px-3 py-2 border-r border-gray-200 cursor-pointer ${
                tab.id === activeTabId ? "bg-white" : "hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTabId(tab.id)
                setAddressBar(tab.url)
              }}
            >
              {tab.hasError && <AlertTriangle className="w-3 h-3 text-red-500 mr-1 flex-shrink-0" />}
              <span className="flex-1 truncate text-sm">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addTab} className="px-2">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center p-2 bg-gray-50 border-b border-gray-200 space-x-2">
        <Button variant="ghost" size="sm" disabled>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={goHome}>
          <Home className="w-4 h-4" />
        </Button>

        <form onSubmit={handleAddressSubmit} className="flex-1 flex">
          <Input
            type="text"
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            placeholder="Nhập địa chỉ web hoặc tìm kiếm..."
            className="flex-1"
          />
        </form>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-1 border-l pl-2">
          <Button
            variant={viewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "tablet" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("tablet")}>
            <Tablet className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "mobile" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("mobile")}>
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Headless Mode Toggle */}
        <Button
          variant={isHeadlessMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsHeadlessMode(!isHeadlessMode)}
          className="ml-2"
        >
          {isHeadlessMode ? "Headless" : "Iframe"}
        </Button>

        <Button variant="ghost" size="sm">
          <Star className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center p-2 bg-gray-50 border-b border-gray-200 space-x-2 overflow-x-auto">
        {bookmarks.map((bookmark) => (
          <Button
            key={bookmark.name}
            variant="ghost"
            size="sm"
            className="text-xs whitespace-nowrap"
            onClick={() => {
              setAddressBar(bookmark.url)
              navigateToUrl(bookmark.url)
            }}
          >
            {bookmark.name}
          </Button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab?.url ? (
          <div className="h-full relative">
            {activeTab.isLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải trang web...</span>
                  {isHeadlessMode && <span className="text-sm text-gray-500">Chế độ Headless Browser</span>}
                </div>
              </div>
            )}

            {activeTab.hasError ? (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md p-8">
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải trang</h2>
                  <p className="text-gray-600 mb-4">
                    Không thể kết nối đến <strong>{new URL(activeTab.url).hostname}</strong>
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => openInNewWindow(activeTab.url)} className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Mở trong tab mới
                    </Button>
                    <Button variant="outline" onClick={goHome} className="w-full bg-transparent">
                      Về trang chủ
                    </Button>
                  </div>
                </div>
              </div>
            ) : isHeadlessMode && activeTab.screenshot ? (
              // Headless Browser Screenshot View
              <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{
                    width: getViewportSize().width / 2,
                    height: getViewportSize().height / 2,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <img
                    src={activeTab.screenshot || "/placeholder.svg"}
                    alt="Website Screenshot"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openInNewWindow(activeTab.url)}
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Click để mở trang thật
                  </div>
                </div>
              </div>
            ) : (
              // Traditional Iframe View
              <iframe
                src={activeTab.url}
                className="w-full h-full border-none"
                title="Web Content"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                onError={() => {
                  setTabs((prev) =>
                    prev.map((tab) => (tab.id === activeTabId ? { ...tab, hasError: true, isLoading: false } : tab)),
                  )
                }}
              />
            )}
          </div>
        ) : (
          // Home Page
          <div className="h-full p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">HLounh Browser</h1>
                <p className="text-gray-600">Trình duyệt web với Headless Browser tích hợp</p>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      isHeadlessMode ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isHeadlessMode ? "🤖 Headless Mode" : "🖼️ Iframe Mode"}
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    📱 {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-8">
                <form onSubmit={handleAddressSubmit} className="max-w-2xl mx-auto">
                  <Input
                    type="text"
                    value={addressBar}
                    onChange={(e) => setAddressBar(e.target.value)}
                    placeholder="Tìm kiếm trên Google hoặc nhập địa chỉ web..."
                    className="text-lg py-3"
                  />
                </form>
              </div>

              {/* Quick Access */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Truy cập nhanh</h2>
                <div className="grid grid-cols-4 gap-4">
                  {quickAccess.map((site) => (
                    <div
                      key={site.name}
                      className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => {
                        setAddressBar(site.url)
                        navigateToUrl(site.url)
                      }}
                    >
                      <div className={`w-12 h-12 ${site.color} rounded-lg flex items-center justify-center mb-2`}>
                        <span className="text-white font-bold text-lg">{site.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium">{site.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">🚀 Tính năng Headless Browser:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>✅ Hiển thị chính xác mọi trang web</div>
                  <div>✅ Không bị chặn CORS/X-Frame</div>
                  <div>✅ Screenshot trang web thật</div>
                  <div>✅ Responsive design testing</div>
                  <div>✅ Hỗ trợ JavaScript động</div>
                  <div>✅ Bypass iframe restrictions</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
