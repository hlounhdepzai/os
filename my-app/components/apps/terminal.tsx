"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface TerminalLine {
  type: "input" | "output" | "error"
  content: string
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "HLounh OS Terminal v1.0.0" },
    { type: "output", content: 'Nhập "help" để xem danh sách lệnh.' },
    { type: "output", content: "" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [fullScreenMessage, setFullScreenMessage] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: () => [
      "Danh sách lệnh có sẵn:",
      "  help     - Hiển thị danh sách lệnh",
      "  clear    - Xóa màn hình",
      "  date     - Hiển thị ngày giờ hiện tại",
      "  whoami   - Hiển thị tên người dùng",
      "  ls       - Liệt kê tệp và thư mục",
      "  pwd      - Hiển thị thư mục hiện tại",
      "  echo     - In ra văn bản",
      "  calc     - Máy tính đơn giản (vd: calc 2+2)",
      "  python   - Chạy lệnh Python đơn giản",
    ],
    clear: () => {
      setLines([])
      return []
    },
    date: () => [new Date().toLocaleString("vi-VN")],
    whoami: () => ["user@hlounh-os"],
    ls: () => ["Documents/", "Pictures/", "Music/", "Videos/", "readme.txt", "config.json"],
    pwd: () => ["/home/user"],
    echo: (args: string[]) => [args.join(" ")],
    calc: (args: string[]) => {
      try {
        const expression = args.join(" ")
        const result = Function('"use strict"; return (' + expression.replace(/[^0-9+\-*/().\s]/g, "") + ")")()
        return [expression + " = " + result]
      } catch {
        return ["Lỗi: Biểu thức không hợp lệ"]
      }
    },
    python: (args: string[]) => {
      const code = args.join(" ")
      if (code.includes("print(")) {
        try {
          const match = code.match(/print\s*\(\s*['"](.+?)['"]\s*\)/)
          if (match) {
            return [match[1]]
          }
        } catch {
          return ["Lỗi: Lệnh Python không hợp lệ"]
        }
      }
      return ["Python interpreter (chỉ hỗ trợ print cơ bản)"]
    },
  }

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    // Trigger full screen message if specific code entered
    if (trimmedInput === "typescriptmk120511") {
      setFullScreenMessage(true)
      return
    }

    setCommandHistory((prev) => [...prev, trimmedInput])
    setHistoryIndex(-1)

    setLines((prev) => [...prev, { type: "input", content: `user@hlounh-os:~$ ${trimmedInput}` }])

    const parts = trimmedInput.split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    if (command in commands) {
      const output = (commands as any)[command](args)
      if (Array.isArray(output)) {
        setLines((prev) => [...prev, ...output.map((line) => ({ type: "output" as const, content: line }))])
      }
    } else {
      setLines((prev) => [...prev, { type: "error", content: `Lệnh không tìm thấy: ${command}` }])
    }

    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreenMessage(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={terminalRef} className="flex-1 overflow-auto">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`${
              line.type === "error" ? "text-red-400" : line.type === "input" ? "text-white" : "text-green-400"
            }`}
          >
            {line.content}
          </div>
        ))}

        <div className="flex text-white">
          <span className="text-green-400">user@hlounh-os:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white"
            autoFocus
          />
        </div>
      </div>

      {fullScreenMessage && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-red-600 text-5xl font-bold animate-pulse text-center">
            HÀ BÁ ĂN CỨT
          </div>
        </div>
      )}
    </div>
  )
