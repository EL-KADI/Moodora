"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckSquare, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Todo {
  id: string
  title: string
  completed: boolean
  priority: "High" | "Medium" | "Low"
  createdAt: string
}

export function TodoPreview() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const recentTodos = todos.slice(0, 3)
  const completedCount = todos.filter((todo) => todo.completed).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="animate-in slide-in-from-left-5 duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Tasks
        </CardTitle>
        <Link href="/todo">
          <Button variant="ghost" size="icon" aria-label="View all tasks">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedCount} of {todos.length} completed
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: todos.length > 0 ? `${(completedCount / todos.length) * 100}%` : "0%",
                }}
              ></div>
            </div>
          </div>

          {recentTodos.length > 0 ? (
            <div className="space-y-2">
              {recentTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-50 animate-in slide-in-from-left-2"
                >
                  <div className={`w-2 h-2 rounded-full ${todo.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                    {todo.title}
                  </span>
                  <Badge variant="secondary" className={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks yet</p>
            </div>
          )}

          <Link href="/todo">
            <Button className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
