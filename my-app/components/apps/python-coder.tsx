"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Save, Folder, RotateCcw, Terminal, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeExample {
  title: string
  description: string
  code: string
  category: string
}

const codeExamples: CodeExample[] = [
  {
    title: "Hello World",
    description: "Chương trình Python đầu tiên",
    code: `# Chương trình Hello World đầu tiên
print("Xin chào, HLounh OS!")
print("Chào mừng đến với Python Coder!")

# Thông tin hệ thống
import sys
print(f"Python version: {sys.version}")`,
    category: "Cơ bản",
  },
  {
    title: "Biến và kiểu dữ liệu",
    description: "Làm việc với các kiểu dữ liệu cơ bản",
    code: `# Các kiểu dữ liệu cơ bản trong Python
name = "HLounh OS"
version = 1.0
is_active = True
users = ["admin", "user", "guest"]

print(f"Tên: {name}")
print(f"Phiên bản: {version}")
print(f"Đang hoạt động: {is_active}")
print(f"Người dùng: {users}")

# Kiểm tra kiểu dữ liệu
print(f"Kiểu của name: {type(name).__name__}")
print(f"Kiểu của version: {type(version).__name__}")

# Thao tác với chuỗi
print(f"Độ dài tên: {len(name)}")
print(f"Tên viết hoa: {name.upper()}")`,
    category: "Cơ bản",
  },
  {
    title: "Vòng lặp và điều kiện",
    description: "Cấu trúc điều khiển trong Python",
    code: `# Vòng lặp for
print("Đếm từ 1 đến 5:")
for i in range(1, 6):
    print(f"Số {i}")

# Điều kiện if-else
age = 18
if age >= 18:
    print("Bạn đã đủ tuổi trưởng thành")
else:
    print("Bạn chưa đủ tuổi trưởng thành")

# Vòng lặp while với break
count = 0
print("\\nĐếm ngược:")
while True:
    if count >= 3:
        break
    print(f"Còn {3-count} giây...")
    count += 1
print("Hoàn thành!")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Bình phương: {squares}")`,
    category: "Cơ bản",
  },
  {
    title: "Hàm (Functions)",
    description: "Tạo và sử dụng hàm trong Python",
    code: `# Định nghĩa hàm
def chao_mung(ten, tuoi=18):
    """Hàm chào mừng người dùng"""
    return f"Xin chào {ten}, bạn {tuoi} tuổi!"

def tinh_tong(a, b):
    """Hàm tính tổng hai số"""
    return a + b

def tinh_giai_thua(n):
    """Hàm tính giai thừa"""
    if n <= 1:
        return 1
    return n * tinh_giai_thua(n - 1)

def fibonacci(n):
    """Hàm tính số Fibonacci"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Sử dụng hàm
print(chao_mung("HLounh"))
print(chao_mung("Python", 30))
print(f"5 + 3 = {tinh_tong(5, 3)}")
print(f"5! = {tinh_giai_thua(5)}")
print(f"Fibonacci(7) = {fibonacci(7)}")

# Lambda function
square = lambda x: x**2
print(f"Lambda square(4) = {square(4)}")`,
    category: "Trung bình",
  },
  {
    title: "Làm việc với danh sách",
    description: "Các thao tác với list trong Python",
    code: `# Tạo và thao tác với danh sách
fruits = ["táo", "chuối", "cam", "nho"]
print(f"Danh sách trái cây: {fruits}")

# Thêm phần tử
fruits.append("dưa hấu")
fruits.insert(1, "xoài")
print(f"Sau khi thêm: {fruits}")

# Xóa phần tử
fruits.remove("cam")
popped = fruits.pop()
print(f"Sau khi xóa cam và pop: {fruits}")
print(f"Phần tử đã pop: {popped}")

# List comprehension
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in numbers]
even_numbers = [x for x in numbers if x % 2 == 0]
print(f"Bình phương: {squares}")
print(f"Số chẵn: {even_numbers}")

# Sắp xếp và đảo ngược
numbers_copy = numbers.copy()
numbers_copy.sort(reverse=True)
print(f"Sắp xếp giảm dần: {numbers_copy}")

# Slicing
print(f"3 phần tử đầu: {numbers[:3]}")
print(f"3 phần tử cuối: {numbers[-3:]}")`,
    category: "Trung bình",
  },
  {
    title: "Dictionary và Set",
    description: "Làm việc với dictionary và set",
    code: `# Dictionary
student = {
    "name": "Nguyễn Văn A",
    "age": 20,
    "grades": [8.5, 9.0, 7.5, 8.0],
    "is_active": True
}

print(f"Thông tin sinh viên: {student}")
print(f"Tên: {student['name']}")
print(f"Điểm trung bình: {sum(student['grades']) / len(student['grades']):.2f}")

# Thêm và cập nhật
student["email"] = "nguyenvana@email.com"
student["age"] = 21
print(f"Sau khi cập nhật: {student}")

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(1, 6)}
print(f"Dictionary bình phương: {squares_dict}")

# Set operations
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

print(f"Set 1: {set1}")
print(f"Set 2: {set2}")
print(f"Hợp: {set1 | set2}")
print(f"Giao: {set1 & set2}")
print(f"Hiệu: {set1 - set2}")`,
    category: "Trung bình",
  },
  {
    title: "Class và Object",
    description: "Lập trình hướng đối tượng",
    code: `# Định nghĩa class
class NguoiDung:
    def __init__(self, ten, tuoi, email):
        self.ten = ten
        self.tuoi = tuoi
        self.email = email
        self.dang_hoat_dong = True
        self.so_lan_dang_nhap = 0
    
    def chao(self):
        return f"Xin chào, tôi là {self.ten}"
    
    def sinh_nhat(self):
        self.tuoi += 1
        print(f"Chúc mừng sinh nhật! Bây giờ bạn {self.tuoi} tuổi")
    
    def dang_nhap(self):
        self.so_lan_dang_nhap += 1
        print(f"Đăng nhập lần thứ {self.so_lan_dang_nhap}")
    
    def __str__(self):
        return f"NguoiDung(ten='{self.ten}', tuoi={self.tuoi}, email='{self.email}')"
    
    def __repr__(self):
        return self.__str__()

# Inheritance
class Admin(NguoiDung):
    def __init__(self, ten, tuoi, email, cap_do_quyen="admin"):
        super().__init__(ten, tuoi, email)
        self.cap_do_quyen = cap_do_quyen
    
    def quan_ly_he_thong(self):
        return f"{self.ten} đang quản lý hệ thống với quyền {self.cap_do_quyen}"

# Tạo đối tượng
user1 = NguoiDung("Alice", 25, "alice@example.com")
user2 = NguoiDung("Bob", 30, "bob@example.com")
admin1 = Admin("Charlie", 35, "charlie@admin.com")

print(user1.chao())
print(user2.chao())
user1.sinh_nhat()
user1.dang_nhap()
user1.dang_nhap()
print(user1)
print(admin1.quan_ly_he_thong())`,
    category: "Nâng cao",
  },
  {
    title: "Xử lý file và JSON",
    description: "Đọc, ghi file và làm việc với JSON",
    code: `import json
from datetime import datetime

# Tạo dữ liệu mẫu
data = {
    "app_name": "HLounh OS",
    "version": "1.0.0",
    "features": ["File Manager", "Python Coder", "Web Browser"],
    "users": [
        {"name": "Admin", "role": "administrator", "active": True},
        {"name": "User", "role": "user", "active": True}
    ],
    "created_at": datetime.now().isoformat(),
    "settings": {
        "theme": "dark",
        "language": "vi-VN",
        "auto_save": True
    }
}

# Chuyển đổi sang JSON
json_string = json.dumps(data, ensure_ascii=False, indent=2)
print("Dữ liệu JSON:")
print(json_string)

# Mô phỏng đọc/ghi file
print("\\n" + "="*50)
print("MÔ PHỎNG XỬ LÝ FILE:")

# Mô phỏng ghi file
file_content = """# HLounh OS Configuration
app_name = "HLounh OS"
version = "1.0.0"
debug = True

# User settings
users = [
    "admin",
    "user",
    "guest"
]

# System info
import platform
print(f"Platform: {platform.system()}")
"""

print("Nội dung file config.py:")
print(file_content)

# Xử lý từng dòng
lines = file_content.strip().split('\\n')
print(f"\\nFile có {len(lines)} dòng")
for i, line in enumerate(lines[:5], 1):
    print(f"Dòng {i}: {line}")

# JSON parsing
try:
    parsed_data = json.loads(json_string)
    print(f"\\nParsed JSON - App: {parsed_data['app_name']}")
    print(f"Features: {', '.join(parsed_data['features'])}")
    print(f"Active users: {len([u for u in parsed_data['users'] if u['active']])}")
except json.JSONDecodeError as e:
    print(f"JSON Error: {e}")`,
    category: "Nâng cao",
  },
]

export default function PythonCoder() {
  const [code, setCode] = useState(`# Chào mừng đến với Python Coder!
# Viết code Python của bạn tại đây

print("Xin chào từ HLounh OS!")
print("Python IDE đã sẵn sàng!")

# Thử một số lệnh cơ bản
import datetime
print(f"Thời gian hiện tại: {datetime.datetime.now()}")

# Tính toán đơn giản
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Tổng của {numbers} = {total}")`)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [showExamples, setShowExamples] = useState(true)
  const [executionMode, setExecutionMode] = useState<"local" | "server">("local")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const categories = ["Tất cả", "Cơ bản", "Trung bình", "Nâng cao"]

  const filteredExamples =
    selectedCategory === "Tất cả"
      ? codeExamples
      : codeExamples.filter((example) => example.category === selectedCategory)

  // Enhanced Python execution with better parsing
  const executePythonCode = async (code: string) => {
    if (executionMode === "server") {
      return await executeOnServer(code)
    } else {
      return executeLocally(code)
    }
  }

  const executeOnServer = async (code: string) => {
    try {
      const response = await fetch("/api/python-executor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result = await response.json()
      return result.output || "Code executed successfully (no output)"
    } catch (error) {
      return `Server execution failed: ${error}\nFalling back to local execution...\n\n${executeLocally(code)}`
    }
  }

  const executeLocally = (code: string): string => {
    let output = ""
    const lines = code.split("\n")
    const variables: { [key: string]: any } = {}
    const functions: { [key: string]: Function } = {}

    // Built-in functions simulation
    const builtins = {
      print: (...args: any[]) => {
        const formatted = args
          .map((arg) => {
            if (typeof arg === "string") return arg
            if (typeof arg === "object") return JSON.stringify(arg)
            return String(arg)
          })
          .join(" ")
        output += formatted + "\n"
      },
      len: (obj: any) => {
        if (Array.isArray(obj) || typeof obj === "string") return obj.length
        if (typeof obj === "object") return Object.keys(obj).length
        return 0
      },
      sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
      range: (start: number, end?: number, step = 1) => {
        if (end === undefined) {
          end = start
          start = 0
        }
        const result = []
        for (let i = start; i < end; i += step) {
          result.push(i)
        }
        return result
      },
      type: (obj: any) => ({ __name__: typeof obj }),
      str: (obj: any) => String(obj),
      int: (obj: any) => Number.parseInt(obj),
      float: (obj: any) => Number.parseFloat(obj),
      bool: (obj: any) => Boolean(obj),
      list: (obj: any) => (Array.isArray(obj) ? obj : [obj]),
      dict: (obj: any) => (typeof obj === "object" ? obj : {}),
    }

    // Add datetime module simulation
    const datetime = {
      datetime: {
        now: () => ({
          isoformat: () => new Date().toISOString(),
          toString: () => new Date().toString(),
        }),
      },
    }

    const sys = {
      version: "3.9.0 (HLounh OS Python Simulator)",
    }

    const json = {
      dumps: (obj: any, ensure_ascii = true, indent?: number) => {
        return JSON.stringify(obj, null, indent)
      },
      loads: (str: string) => JSON.parse(str),
    }

    const platform = {
      system: () => "HLounh OS",
    }

    // Enhanced execution context
    const context = {
      ...builtins,
      ...variables,
      datetime,
      sys,
      json,
      platform,
    }

    try {
      let i = 0
      while (i < lines.length) {
        const line = lines[i].trim()

        // Skip empty lines and comments
        if (!line || line.startsWith("#")) {
          i++
          continue
        }

        // Handle imports
        if (line.startsWith("import ") || line.startsWith("from ")) {
          // Simulate import success
          i++
          continue
        }

        // Handle print statements with f-strings
        const printMatch = line.match(/print\s*$$\s*(.+)\s*$$/)
        if (printMatch) {
          let content = printMatch[1]

          // Handle f-strings
          if (content.startsWith('f"') || content.startsWith("f'")) {
            content = content.substring(2, content.length - 1)
            content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
              try {
                // Simple expression evaluation
                const result = evaluateExpression(expr, context)
                return String(result)
              } catch {
                return match
              }
            })
          } else if (content.startsWith('"') || content.startsWith("'")) {
            content = content.substring(1, content.length - 1)
          }

          // Handle escape characters
          content = content.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
          output += content + "\n"
          i++
          continue
        }

        // Handle variable assignments
        const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/)
        if (assignMatch) {
          const [, varName, value] = assignMatch
          try {
            context[varName] = evaluateExpression(value, context)
          } catch {
            // Fallback for complex expressions
            if (value.startsWith('"') || value.startsWith("'")) {
              context[varName] = value.substring(1, value.length - 1)
            } else if (!isNaN(Number(value))) {
              context[varName] = Number(value)
            } else if (value === "True") {
              context[varName] = true
            } else if (value === "False") {
              context[varName] = false
            } else if (value.startsWith("[") && value.endsWith("]")) {
              try {
                context[varName] = JSON.parse(value.replace(/'/g, '"'))
              } catch {
                context[varName] = value
              }
            }
          }
          i++
          continue
        }

        // Handle for loops
        const forMatch = line.match(/^for\s+(\w+)\s+in\s+(.+):$/)
        if (forMatch) {
          const [, varName, iterable] = forMatch
          const iterableValue = evaluateExpression(iterable, context)
          if (Array.isArray(iterableValue)) {
            let j = i + 1
            const loopBody = []
            while (j < lines.length && (lines[j].startsWith("    ") || lines[j].trim() === "")) {
              if (lines[j].trim()) {
                loopBody.push(lines[j].substring(4)) // Remove indentation
              }
              j++
            }

            for (const item of iterableValue) {
              context[varName] = item
              for (const bodyLine of loopBody) {
                // Execute loop body (simplified)
                const bodyPrintMatch = bodyLine.match(/print\s*$$\s*(.+)\s*$$/)
                if (bodyPrintMatch) {
                  let content = bodyPrintMatch[1]
                  if (content.startsWith('f"') || content.startsWith("f'")) {
                    content = content.substring(2, content.length - 1)
                    content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
                      try {
                        return String(evaluateExpression(expr, context))
                      } catch {
                        return match
                      }
                    })
                  }
                  output += content + "\n"
                }
              }
            }
            i = j
            continue
          }
        }

        // Handle function calls
        const funcCallMatch = line.match(/^(\w+)\s*$$([^)]*)$$$/)
        if (funcCallMatch) {
          const [, funcName, args] = funcCallMatch
          if (context[funcName] && typeof context[funcName] === "function") {
            try {
              const argValues = args
                .split(",")
                .map((arg) => evaluateExpression(arg.trim(), context))
                .filter((arg) => arg !== undefined)
              context[funcName](...argValues)
            } catch (error) {
              output += `Error calling ${funcName}: ${error}\n`
            }
          }
          i++
          continue
        }

        i++
      }

      if (output === "") {
        output = "Code executed successfully (no output)\n"
      }
    } catch (error) {
      output += `Execution error: ${error}\n`
    }

    return output
  }

  const evaluateExpression = (expr: string, context: any): any => {
    expr = expr.trim()

    // Handle string literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.substring(1, expr.length - 1)
    }

    // Handle numbers
    if (!isNaN(Number(expr))) {
      return Number(expr)
    }

    // Handle booleans
    if (expr === "True") return true
    if (expr === "False") return false

    // Handle variables
    if (context[expr] !== undefined) {
      return context[expr]
    }

    // Handle function calls
    const funcMatch = expr.match(/^(\w+)$$([^)]*)$$$/)
    if (funcMatch) {
      const [, funcName, args] = funcMatch
      if (context[funcName] && typeof context[funcName] === "function") {
        const argValues = args
          .split(",")
          .map((arg) => evaluateExpression(arg.trim(), context))
          .filter((arg) => arg !== undefined)
        return context[funcName](...argValues)
      }
    }

    // Handle property access
    const propMatch = expr.match(/^(\w+)\.(\w+)(?:$$$$)?$/)
    if (propMatch) {
      const [, obj, prop] = propMatch
      if (context[obj] && context[obj][prop] !== undefined) {
        const value = context[obj][prop]
        return typeof value === "function" ? value() : value
      }
    }

    // Handle array/list literals
    if (expr.startsWith("[") && expr.endsWith("]")) {
      try {
        return JSON.parse(expr.replace(/'/g, '"'))
      } catch {
        return []
      }
    }

    // Handle simple arithmetic
    if (expr.includes("+") || expr.includes("-") || expr.includes("*") || expr.includes("/")) {
      try {
        // Very basic arithmetic evaluation (unsafe in real apps)
        const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, "")
        return Function(`"use strict"; return (${sanitized})`)()
      } catch {
        return expr
      }
    }

    return expr
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("🚀 Đang thực thi code Python...\n")

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const result = await executePythonCode(code)
      setOutput(result)
    } catch (error) {
      setOutput(`❌ Lỗi thực thi: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const clearOutput = () => {
    setOutput("")
  }

  const loadExample = (example: CodeExample) => {
    setCode(example.code)
    setShowExamples(false)
  }

  const saveCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "python_code.py"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex bg-gray-100">
      {/* Sidebar - Examples */}
      {showExamples && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-3">Ví dụ Python</h2>
            <div className="flex flex-wrap gap-1 mb-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={executionMode === "local" ? "default" : "outline"}
                size="sm"
                onClick={() => setExecutionMode("local")}
              >
                Local
              </Button>
              <Button
                variant={executionMode === "server" ? "default" : "outline"}
                size="sm"
                onClick={() => setExecutionMode("server")}
              >
                Server
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {filteredExamples.map((example, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 mb-2">{example.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{example.category}</span>
                    <Button size="sm" onClick={() => loadExample(example)}>
                      Tải
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? "Đang chạy..." : "Chạy"}
            </Button>
            <Button variant="outline" onClick={clearOutput}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Xóa output
            </Button>
            <Button variant="outline" onClick={saveCode}>
              <Save className="w-4 h-4 mr-1" />
              Lưu
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`px-2 py-1 rounded text-xs ${
                executionMode === "server" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {executionMode === "server" ? "🖥️ Server Mode" : "💻 Local Mode"}
            </div>
            <Button variant="outline" onClick={() => setShowExamples(!showExamples)}>
              <Folder className="w-4 h-4 mr-1" />
              {showExamples ? "Ẩn" : "Hiện"} ví dụ
            </Button>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Code Editor</span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none border-none outline-none"
              placeholder="Viết code Python của bạn tại đây..."
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/2 flex flex-col border-l border-gray-200">
            <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Output</span>
            </div>
            <div className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">{output || "Chưa có output. Nhấn 'Chạy' để thực thi code."}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
