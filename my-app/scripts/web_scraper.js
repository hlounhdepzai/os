class WebScraper {
  constructor() {
    this.userAgent = "HLounh-Browser/1.0.0"
  }

  async fetchPage(url) {
    try {
      console.log(`Đang tải trang: ${url}`)

      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      return {
        success: true,
        url: url,
        status: response.status,
        html: html,
        size: html.length,
      }
    } catch (error) {
      return {
        success: false,
        url: url,
        error: error.message,
      }
    }
  }

  extractMetadata(html) {
    const metadata = {
      title: "",
      description: "",
      keywords: "",
      author: "",
      favicon: "",
      images: [],
      links: [],
    }

    try {
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) {
        metadata.title = titleMatch[1].trim()
      }

      // Extract meta description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      if (descMatch) {
        metadata.description = descMatch[1].trim()
      }

      // Extract meta keywords
      const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i)
      if (keywordsMatch) {
        metadata.keywords = keywordsMatch[1].trim()
      }

      // Extract favicon
      const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)
      if (faviconMatch) {
        metadata.favicon = faviconMatch[1]
      }

      // Extract images
      const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)
      for (const match of imgMatches) {
        metadata.images.push(match[1])
      }

      // Extract links
      const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi)
      for (const match of linkMatches) {
        metadata.links.push({
          url: match[1],
          text: match[2].trim(),
        })
      }
    } catch (error) {
      console.error("Lỗi khi phân tích metadata:", error)
    }

    return metadata
  }

  async analyzeWebsite(url) {
    console.log("=== PHÂN TÍCH WEBSITE ===")
    console.log(`URL: ${url}`)

    const result = await this.fetchPage(url)

    if (!result.success) {
      console.log(`❌ Lỗi: ${result.error}`)
      return result
    }

    console.log(`✅ Tải thành công (${result.size} bytes)`)

    const metadata = this.extractMetadata(result.html)

    console.log("\n📋 THÔNG TIN TRANG:")
    console.log(`Tiêu đề: ${metadata.title || "Không có"}`)
    console.log(`Mô tả: ${metadata.description || "Không có"}`)
    console.log(`Từ khóa: ${metadata.keywords || "Không có"}`)
    console.log(`Favicon: ${metadata.favicon || "Không có"}`)

    console.log(`\n🖼️ HÌNH ẢNH: ${metadata.images.length} ảnh`)
    metadata.images.slice(0, 5).forEach((img, index) => {
      console.log(`  ${index + 1}. ${img}`)
    })
    if (metadata.images.length > 5) {
      console.log(`  ... và ${metadata.images.length - 5} ảnh khác`)
    }

    console.log(`\n🔗 LIÊN KẾT: ${metadata.links.length} link`)
    metadata.links.slice(0, 10).forEach((link, index) => {
      console.log(`  ${index + 1}. ${link.text} -> ${link.url}`)
    })
    if (metadata.links.length > 10) {
      console.log(`  ... và ${metadata.links.length - 10} link khác`)
    }

    return {
      ...result,
      metadata: metadata,
    }
  }

  async checkMultipleUrls(urls) {
    console.log("=== KIỂM TRA NHIỀU WEBSITE ===")

    const results = []

    for (const url of urls) {
      console.log(`\n${"=".repeat(50)}`)
      const result = await this.analyzeWebsite(url)
      results.push(result)

      // Delay để tránh spam
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("\n📊 TỔNG KẾT:")
    const successful = results.filter((r) => r.success).length
    console.log(`✅ Thành công: ${successful}/${urls.length}`)
    console.log(`❌ Thất bại: ${urls.length - successful}/${urls.length}`)

    return results
  }
}

// Sử dụng Web Scraper
const scraper = new WebScraper()

// Test với một số website phổ biến
const testUrls = [
  "https://www.google.com",
  "https://github.com",
  "https://stackoverflow.com",
  "https://developer.mozilla.org",
]

console.log("🌐 HLounh Browser Web Scraper")
console.log("Công cụ phân tích và thu thập thông tin website\n")

// Chạy test
scraper
  .checkMultipleUrls(testUrls)
  .then((results) => {
    console.log("\n🎉 Hoàn thành phân tích!")
  })
  .catch((error) => {
    console.error("❌ Lỗi:", error)
  })

export default WebScraper
