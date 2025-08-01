import path from "path"

class FileManager {
  constructor() {
    this.currentPath = "/home/user"
    this.fileSystem = new Map()
    this.initializeFileSystem()
  }

  initializeFileSystem() {
    // Mô phỏng hệ thống tệp
    this.fileSystem.set("/home/user/Documents", {
      type: "directory",
      created: new Date(),
      modified: new Date(),
      children: ["report.txt", "presentation.pptx"],
    })

    this.fileSystem.set("/home/user/Pictures", {
      type: "directory",
      created: new Date(),
      modified: new Date(),
      children: ["vacation.jpg", "family.png"],
    })

    this.fileSystem.set("/home/user/Documents/report.txt", {
      type: "file",
      size: 2048,
      content: "Đây là nội dung báo cáo...",
      created: new Date(),
      modified: new Date(),
    })
  }

  async listFiles(directory = this.currentPath) {
    const dirInfo = this.fileSystem.get(directory)
    if (!dirInfo || dirInfo.type !== "directory") {
      throw new Error("Thư mục không tồn tại")
    }

    return dirInfo.children.map((child) => {
      const childPath = path.join(directory, child)
      const childInfo = this.fileSystem.get(childPath)
      return {
        name: child,
        type: childInfo?.type || "file",
        size: childInfo?.size || 0,
        modified: childInfo?.modified || new Date(),
      }
    })
  }

  async createFile(filename, content = "") {
    const filePath = path.join(this.currentPath, filename)
    this.fileSystem.set(filePath, {
      type: "file",
      size: content.length,
      content: content,
      created: new Date(),
      modified: new Date(),
    })

    // Cập nhật thư mục cha
    const parentDir = this.fileSystem.get(this.currentPath)
    if (parentDir) {
      parentDir.children.push(filename)
    }

    console.log(`Đã tạo tệp: ${filename}`)
  }

  async createDirectory(dirname) {
    const dirPath = path.join(this.currentPath, dirname)
    this.fileSystem.set(dirPath, {
      type: "directory",
      created: new Date(),
      modified: new Date(),
      children: [],
    })

    // Cập nhật thư mục cha
    const parentDir = this.fileSystem.get(this.currentPath)
    if (parentDir) {
      parentDir.children.push(dirname)
    }

    console.log(`Đã tạo thư mục: ${dirname}`)
  }

  async deleteFile(filename) {
    const filePath = path.join(this.currentPath, filename)
    if (this.fileSystem.has(filePath)) {
      this.fileSystem.delete(filePath)

      // Xóa khỏi thư mục cha
      const parentDir = this.fileSystem.get(this.currentPath)
      if (parentDir) {
        parentDir.children = parentDir.children.filter((child) => child !== filename)
      }

      console.log(`Đã xóa: ${filename}`)
    } else {
      throw new Error("Tệp không tồn tại")
    }
  }

  async readFile(filename) {
    const filePath = path.join(this.currentPath, filename)
    const fileInfo = this.fileSystem.get(filePath)

    if (!fileInfo || fileInfo.type !== "file") {
      throw new Error("Tệp không tồn tại")
    }

    return fileInfo.content
  }

  async writeFile(filename, content) {
    const filePath = path.join(this.currentPath, filename)
    const fileInfo = this.fileSystem.get(filePath)

    if (fileInfo && fileInfo.type === "file") {
      fileInfo.content = content
      fileInfo.size = content.length
      fileInfo.modified = new Date()
      console.log(`Đã cập nhật tệp: ${filename}`)
    } else {
      await this.createFile(filename, content)
    }
  }

  changeDirectory(path) {
    if (this.fileSystem.has(path)) {
      this.currentPath = path
      console.log(`Đã chuyển đến: ${path}`)
    } else {
      throw new Error("Thư mục không tồn tại")
    }
  }

  getCurrentPath() {
    return this.currentPath
  }
}

// Sử dụng
const fileManager = new FileManager()

console.log("=== HỆ THỐNG QUẢN LÝ TỆP HLOUNH OS ===")
console.log("Thư mục hiện tại:", fileManager.getCurrentPath())

try {
  const files = await fileManager.listFiles()
  console.log("\nDanh sách tệp:")
  files.forEach((file) => {
    console.log(`${file.type === "directory" ? "📁" : "📄"} ${file.name} (${file.size} bytes)`)
  })

  // Tạo tệp mới
  await fileManager.createFile("test.txt", "Đây là tệp thử nghiệm")

  // Đọc tệp
  const content = await fileManager.readFile("test.txt")
  console.log("\nNội dung tệp test.txt:", content)
} catch (error) {
  console.error("Lỗi:", error.message)
}

export default FileManager
