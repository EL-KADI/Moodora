"use client"

import { useState, useEffect } from "react"
import { Cloud, MapPin, RefreshCw, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  location: string
  lastUpdated: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchWeather = async (lat?: number, lon?: number) => {
    setLoading(true)
    try {
      let coords = { lat, lon }

      if (!lat || !lon) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          })
        })
        coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
      }

      // Try the weather API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=8ea0147df5d086da6bf06cc3136135a2&units=metric`,
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API key invalid or expired")
        }
        throw new Error("Failed to fetch weather")
      }

      const data = await response.json()
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        location: data.name,
        lastUpdated: new Date().toISOString(),
      }

      setWeather(weatherData)
      localStorage.setItem("weatherData", JSON.stringify(weatherData))

      toast({
        title: "Weather updated",
        description: `Current conditions for ${weatherData.location}`,
      })
    } catch (error) {
      // Try to use cached weather first
      const cachedWeather = localStorage.getItem("weatherData")
      if (cachedWeather) {
        setWeather(JSON.parse(cachedWeather))
        toast({
          title: "Using cached weather",
          description: "Unable to fetch current weather data.",
          variant: "destructive",
        })
      } else {
        // Use fallback weather data
        const fallbackWeather: WeatherData = {
          temperature: 22,
          condition: "Clear",
          humidity: 65,
          location: "Your Location",
          lastUpdated: new Date().toISOString(),
        }

        setWeather(fallbackWeather)
        localStorage.setItem("weatherData", JSON.stringify(fallbackWeather))

        toast({
          title: "Weather service unavailable",
          description: "Showing sample weather data. Please check your API key.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cachedWeather = localStorage.getItem("weatherData")
    if (cachedWeather) {
      const data = JSON.parse(cachedWeather)
      const lastUpdated = new Date(data.lastUpdated)
      const now = new Date()
      const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

      if (hoursSinceUpdate < 1) {
        setWeather(data)
        return
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "☀️"
      case "clouds":
        return "☁️"
      case "rain":
        return "🌧️"
      case "snow":
        return "❄️"
      case "thunderstorm":
        return "⛈️"
      default:
        return "🌤️"
    }
  }

  return (
    <Card className="animate-in slide-in-from-right-5 duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          Weather
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchWeather()}
          disabled={loading}
          aria-label="Refresh weather"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {weather ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getWeatherIcon(weather.condition)}</span>
                <div>
                  <div className="text-2xl font-bold">{weather.temperature}°C</div>
                  <div className="text-sm text-gray-500">{weather.condition}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{weather.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{weather.humidity}%</span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
