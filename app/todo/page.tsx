"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit2, Filter, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Todo {
  id: string
  title: string
  completed: boolean
  priority: "High" | "Medium" | "Low"
  createdAt: string
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "High" | "Medium" | "Low">("all")
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      })
      return
    }

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      priority: newPriority,
      createdAt: new Date().toISOString(),
    }

    setTodos((prev) => [todo, ...prev])
    setNewTodo("")
    setNewPriority("Medium")

    toast({
      title: "Task added",
      description: `"${todo.title}" has been added to your list`,
    })
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    setTodos((prev) => prev.filter((todo) => todo.id !== id))

    if (todo) {
      toast({
        title: "Task deleted",
        description: `"${todo.title}" has been removed`,
      })
    }
  }

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsDialogOpen(true)
  }

  const updateTodo = () => {
    if (!editingTodo || !editingTodo.title.trim()) return

    setTodos((prev) => prev.map((todo) => (todo.id === editingTodo.id ? editingTodo : todo)))

    setEditingTodo(null)
    setIsDialogOpen(false)

    toast({
      title: "Task updated",
      description: "Your task has been successfully updated",
    })
  }

  const clearCompleted = () => {
    const completedCount = todos.filter((todo) => todo.completed).length
    setTodos((prev) => prev.filter((todo) => !todo.completed))

    toast({
      title: "Completed tasks cleared",
      description: `${completedCount} completed tasks removed`,
    })
  }

  const filteredTodos = todos.filter((todo) => {
    const statusMatch =
      filter === "all" || (filter === "completed" && todo.completed) || (filter === "pending" && !todo.completed)

    const priorityMatch = priorityFilter === "all" || todo.priority === priorityFilter

    return statusMatch && priorityMatch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter task title..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Select value={newPriority} onValueChange={(value: "High" | "Medium" | "Low") => setNewPriority(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addTodo}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Tasks ({filteredTodos.length})
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {completedCount} of {todos.length} completed
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: todos.length > 0 ? `${(completedCount / todos.length) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Select value={filter} onValueChange={(value: "all" | "completed" | "pending") => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(value: "all" | "High" | "Medium" | "Low") => setPriorityFilter(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              {completedCount > 0 && (
                <Button variant="outline" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-white animate-in slide-in-from-left-2 duration-300"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
                  />

                  <div className="flex-1">
                    <span
                      className={`${todo.completed ? "line-through text-gray-500" : "text-gray-700"} transition-all duration-300`}
                    >
                      {todo.title}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{new Date(todo.createdAt).toLocaleDateString()}</div>
                  </div>

                  <Badge className={getPriorityColor(todo.priority)}>{todo.priority}</Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editTodo(todo)}
                    aria-label={`Edit "${todo.title}"`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete "${todo.title}"`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}

              {filteredTodos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks found</p>
                  <p className="text-sm">Add a new task to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update the task details below and click "Update Task" to save your changes.
              </DialogDescription>
            </DialogHeader>
            {editingTodo && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Task Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingTodo.priority}
                    onValueChange={(value: "High" | "Medium" | "Low") =>
                      setEditingTodo({ ...editingTodo, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateTodo} className="flex-1">
                    Update Task
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
