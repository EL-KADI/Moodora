"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Smile, Palette, Save, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface MoodEntry {
  id: string
  mood: string
  drawing: string
  timestamp: string
}

const moods = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "excited", label: "Excited", emoji: "🤩" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "angry", label: "Angry", emoji: "😠" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries))
  }, [moodEntries])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#4F46E5"

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveMoodEntry = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today",
        variant: "destructive",
      })
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const drawing = canvas.toDataURL()

    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      drawing,
      timestamp: new Date().toISOString(),
    }

    setMoodEntries((prev) => [entry, ...prev])
    setSelectedMood("")
    clearCanvas()

    toast({
      title: "Mood saved",
      description: `Your ${selectedMood} mood has been recorded`,
    })
  }

  const deleteMoodEntry = (id: string) => {
    setMoodEntries((prev) => prev.filter((entry) => entry.id !== id))
    toast({
      title: "Entry deleted",
      description: "Mood entry has been removed",
    })
  }

  const downloadDrawing = (drawing: string, mood: string, timestamp: string) => {
    const link = document.createElement("a")
    link.download = `mood-${mood}-${new Date(timestamp).toDateString()}.png`
    link.href = drawing
    link.click()
  }

  const getMoodEmoji = (mood: string) => {
    const moodObj = moods.find((m) => m.value === mood)
    return moodObj ? moodObj.emoji : "😐"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mood Tracker</h1>
          <p className="text-gray-600">Express your feelings through art</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="w-5 h-5" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        <span className="flex items-center gap-2">
                          <span>{mood.emoji}</span>
                          <span>{mood.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMood && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg animate-in fade-in-50">
                    <span className="text-4xl">{getMoodEmoji(selectedMood)}</span>
                    <p className="text-lg font-medium text-gray-700 mt-2 capitalize">{selectedMood}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Draw your mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair w-full"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onMouseLeave={stopDrawing}
                  style={{ touchAction: "none" }}
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearCanvas} className="flex-1 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={saveMoodEntry} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            {moodEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moodEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 bg-white animate-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <div className="font-medium capitalize">{entry.mood}</div>
                          <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMoodEntry(entry.id)}
                        aria-label="Delete mood entry"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="relative group">
                      <img
                        src={entry.drawing || "/placeholder.svg"}
                        alt={`${entry.mood} mood drawing`}
                        className="w-full h-32 object-cover rounded border cursor-pointer"
                        onClick={() => downloadDrawing(entry.drawing, entry.mood, entry.timestamp)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                        <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No mood entries yet</p>
                <p className="text-sm">Start by selecting your mood and creating a drawing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
