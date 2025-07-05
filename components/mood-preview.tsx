"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Smile, ArrowRight, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MoodEntry {
  id: string
  mood: string
  drawing: string
  timestamp: string
}

export function MoodPreview() {
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])

  useEffect(() => {
    const savedMoods = localStorage.getItem("moodEntries")
    if (savedMoods) {
      const moods = JSON.parse(savedMoods)
      setRecentMoods(moods.slice(0, 3))
    }
  }, [])

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "😊"
      case "sad":
        return "😢"
      case "excited":
        return "🤩"
      case "calm":
        return "😌"
      case "anxious":
        return "😰"
      case "angry":
        return "😠"
      default:
        return "😐"
    }
  }

  return (
    <Card className="animate-in slide-in-from-right-5 duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Smile className="w-4 h-4" />
          Mood Tracker
        </CardTitle>
        <Link href="/mood">
          <Button variant="ghost" size="icon" aria-label="View mood tracker">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentMoods.length > 0 ? (
            <div className="space-y-2">
              {recentMoods.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-gray-50 animate-in slide-in-from-right-2"
                >
                  <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">{entry.mood}</div>
                    <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  </div>
                  {entry.drawing && (
                    <div className="w-8 h-8 bg-white rounded border overflow-hidden">
                      <img
                        src={entry.drawing || "/placeholder.svg"}
                        alt="Mood drawing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No mood entries yet</p>
            </div>
          )}

          <Link href="/mood">
            <Button className="w-full" size="sm">
              <Smile className="w-4 h-4 mr-2" />
              Track Mood
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
