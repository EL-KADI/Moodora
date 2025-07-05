"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, Edit2, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  createdAt: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events))
  }, [events])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEventsForDate = (dateString: string) => {
    return events.filter((event) => event.date === dateString)
  }

  const openEventDialog = (dateString: string) => {
    setSelectedDate(dateString)
    setNewEvent({ title: "", description: "", time: "" })
    setEditingEvent(null)
    setIsDialogOpen(true)
  }

  const editEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description,
      time: event.time,
    })
    setIsDialogOpen(true)
  }

  const saveEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive",
      })
      return
    }

    if (editingEvent) {
      setEvents((prev) => prev.map((event) => (event.id === editingEvent.id ? { ...event, ...newEvent } : event)))
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated",
      })
    } else {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: selectedDate!,
        time: newEvent.time,
        createdAt: new Date().toISOString(),
      }

      setEvents((prev) => [...prev, event])
      toast({
        title: "Event created",
        description: `"${event.title}" has been added to your calendar`,
      })
    }

    setIsDialogOpen(false)
    setNewEvent({ title: "", description: "", time: "" })
    setEditingEvent(null)
  }

  const deleteEvent = (id: string) => {
    const event = events.find((e) => e.id === id)
    setEvents((prev) => prev.filter((event) => event.id !== id))

    if (event) {
      toast({
        title: "Event deleted",
        description: `"${event.title}" has been removed from your calendar`,
      })
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const today = new Date()
  const todayString = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
          <p className="text-gray-600">Organize your schedule and events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      ←
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-24"></div>
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const dayEvents = getEventsForDate(dateString)
                    const isToday = dateString === todayString

                    return (
                      <div
                        key={day}
                        className={`p-2 h-24 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:scale-105 ${
                          isToday ? "bg-indigo-100 border-indigo-300" : "bg-white border-gray-200"
                        }`}
                        onClick={() => openEventDialog(dateString)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && openEventDialog(dateString)}
                        aria-label={`${day} ${monthNames[currentDate.getMonth()]}, ${dayEvents.length} events`}
                      >
                        <div className={`text-sm font-medium ${isToday ? "text-indigo-700" : "text-gray-700"}`}>
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded truncate animate-in slide-in-from-bottom-1"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter((event) => new Date(event.date) >= new Date(todayString))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg bg-white animate-in slide-in-from-right-2 duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{event.title}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()}
                              {event.time && (
                                <>
                                  <Clock className="w-3 h-3 ml-2" />
                                  {event.time}
                                </>
                              )}
                            </div>
                            {event.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editEvent(event)}
                              aria-label={`Edit ${event.title}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEvent(event.id)}
                              aria-label={`Delete ${event.title}`}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {events.filter((event) => new Date(event.date) >= new Date(todayString)).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No upcoming events</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Create Event"}
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {new Date(selectedDate).toLocaleDateString()}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {editingEvent
                  ? "Update the event details below and click 'Update Event' to save your changes."
                  : "Fill in the event details below and click 'Create Event' to add it to your calendar."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  placeholder="Enter event title..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="event-time">Time (optional)</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="event-description">Description (optional)</Label>
                <Textarea
                  id="event-description"
                  placeholder="Add event details..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEvent} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
