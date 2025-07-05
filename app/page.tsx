import { QuoteWidget } from "@/components/quote-widget"
import { WeatherWidget } from "@/components/weather-widget"
import { TodoPreview } from "@/components/todo-preview"
import { MoodPreview } from "@/components/mood-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Moodora</h1>
          <p className="text-gray-600">Your daily productivity and well-being companion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <QuoteWidget />
          <WeatherWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodoPreview />
          <MoodPreview />
        </div>
      </div>
    </div>
  )
}
