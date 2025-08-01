"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music } from "lucide-react"

const playlist = [
  { id: 1, title: "Bài hát 1", artist: "Nghệ sĩ A", duration: "3:45" },
  { id: 2, title: "Bài hát 2", artist: "Nghệ sĩ B", duration: "4:12" },
  { id: 3, title: "Bài hát 3", artist: "Nghệ sĩ C", duration: "3:28" },
  { id: 4, title: "Bài hát 4", artist: "Nghệ sĩ D", duration: "5:03" },
  { id: 5, title: "Bài hát 5", artist: "Nghệ sĩ E", duration: "2:56" },
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(75)
  const [progress, setProgress] = useState(45)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const currentSong = playlist[currentTrack]

  const togglePlay = () => setIsPlaying(!isPlaying)
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length)
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 to-blue-900 text-white">
      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
          <Music className="w-24 h-24 text-white/80" />
        </div>

        <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
        <p className="text-lg text-white/80 mb-6">{currentSong.artist}</p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>1:{String(Math.floor(progress)).padStart(2, "0")}</span>
            <span>{currentSong.duration}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(progress / 225) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/20 ${shuffle ? "text-green-400" : ""}`}
            onClick={() => setShuffle(!shuffle)}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={prevTrack}>
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 w-16 h-16 rounded-full bg-white/10"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>

          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={nextTrack}>
            <SkipForward className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/20 ${repeat ? "text-green-400" : ""}`}
            onClick={() => setRepeat(!repeat)}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3 mt-6">
          <Volume2 className="w-5 h-5" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-white"
          />
          <span className="text-sm w-8">{volume}</span>
        </div>
      </div>

      {/* Playlist */}
      <div className="h-48 bg-black/30 backdrop-blur-sm border-t border-white/20 overflow-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Danh sách phát</h3>
          <div className="space-y-2">
            {playlist.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-white/10 ${
                  index === currentTrack ? "bg-white/20" : ""
                }`}
                onClick={() => setCurrentTrack(index)}
              >
                <div>
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-white/60">{song.artist}</div>
                </div>
                <div className="text-sm text-white/60">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
