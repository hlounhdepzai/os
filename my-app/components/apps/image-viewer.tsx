"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, Folder } from "lucide-react"

const sampleImages = [
  { name: "landscape.jpg", url: "/placeholder.svg?height=400&width=600" },
  { name: "portrait.jpg", url: "/placeholder.svg?height=600&width=400" },
  { name: "abstract.jpg", url: "/placeholder.svg?height=500&width=500" },
]

export default function ImageViewer() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const currentImage = sampleImages[currentImageIndex]

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Folder className="w-4 h-4 mr-1" />
            Mở
          </Button>
          <div className="w-px h-6 bg-gray-300" />
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-mono">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          {currentImageIndex + 1} / {sampleImages.length} - {currentImage.name}
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <img
          src={currentImage.url || "/placeholder.svg"}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          }}
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {sampleImages.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 cursor-pointer border-2 rounded ${
                index === currentImageIndex ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-16 h-16 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
