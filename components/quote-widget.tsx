"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface QuoteData {
  content: string
  author: string
  dateAdded: string
}

export function QuoteWidget() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const { toast } = useToast()

  const fallbackQuotes = [
    {
      content: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
    },
    {
      content: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      content: "Your time is limited, so don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
    {
      content: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt",
    },
    {
      content: "If you look at what you have in life, you'll always have more.",
      author: "Oprah Winfrey",
    },
    {
      content: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      content: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      content: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      content: "Whoever is happy will make others happy too.",
      author: "Anne Frank",
    },
    {
      content: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      author: "Ralph Waldo Emerson",
    },
    {
      content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      content: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
    },
    {
      content: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      content: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      content: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
    },
    {
      content: "Stay hungry, stay foolish.",
      author: "Steve Jobs",
    },
    {
      content: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb",
    },
    {
      content: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      content: "Everything you've ever wanted is on the other side of fear.",
      author: "George Addair",
    },
  ]

  const fetchQuote = async () => {
    if (requestCount >= 5) {
      toast({
        title: "Rate limit reached",
        description: "Please wait before requesting a new quote.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Try multiple quote APIs with different approaches
      let quoteData: QuoteData | null = null

      // Method 1: Try ZenQuotes with CORS proxy
      try {
        const response = await fetch(
          "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"),
        )
        if (response.ok) {
          const data = await response.json()
          const quoteArray = JSON.parse(data.contents)
          if (quoteArray && quoteArray[0]) {
            quoteData = {
              content: quoteArray[0].q,
              author: quoteArray[0].a,
              dateAdded: new Date().toISOString(),
            }
          }
        }
      } catch (error) {
        console.log("ZenQuotes with proxy failed, trying alternative...")
      }

      // Method 2: Try Quotable API as backup
      if (!quoteData) {
        try {
          const response = await fetch("https://api.quotable.io/random")
          if (response.ok) {
            const data = await response.json()
            quoteData = {
              content: data.content,
              author: data.author,
              dateAdded: new Date().toISOString(),
            }
          }
        } catch (error) {
          console.log("Quotable API failed, using fallback...")
        }
      }

      // Method 3: Use local fallback quotes
      if (!quoteData) {
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
        quoteData = {
          content: randomQuote.content,
          author: randomQuote.author,
          dateAdded: new Date().toISOString(),
        }
      }

      setQuote(quoteData)
      localStorage.setItem("dailyQuote", JSON.stringify(quoteData))
      setRequestCount((prev) => prev + 1)

      toast({
        title: "Quote refreshed",
        description: "New inspiration loaded!",
      })
    } catch (error) {
      // Final fallback
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      const quoteData: QuoteData = {
        content: randomQuote.content,
        author: randomQuote.author,
        dateAdded: new Date().toISOString(),
      }

      setQuote(quoteData)
      localStorage.setItem("dailyQuote", JSON.stringify(quoteData))

      toast({
        title: "Offline quote",
        description: "Showing inspirational quote from our collection.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRandomFallbackQuote = () => {
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    return {
      content: randomQuote.content,
      author: randomQuote.author,
      dateAdded: new Date().toISOString(),
    }
  }

  useEffect(() => {
    const cachedQuote = localStorage.getItem("dailyQuote")
    const lastFetch = localStorage.getItem("lastQuoteFetch")
    const now = new Date()
    const today = now.toDateString()

    if (cachedQuote && lastFetch === today) {
      setQuote(JSON.parse(cachedQuote))
    } else {
      // Start with a fallback quote immediately for better UX
      const initialQuote = getRandomFallbackQuote()
      setQuote(initialQuote)

      // Then try to fetch a new quote in the background
      fetchQuote()
      localStorage.setItem("lastQuoteFetch", today)
    }

    // Reset request count every minute
    const resetCount = () => setRequestCount(0)
    const interval = setInterval(resetCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Quote className="w-4 h-4" />
          Daily Inspiration
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchQuote}
          disabled={loading || requestCount >= 5}
          aria-label="Get new quote"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {quote ? (
          <div className="space-y-2">
            <blockquote className="text-lg italic text-gray-700 leading-relaxed">"{quote.content}"</blockquote>
            <cite className="text-sm text-gray-500 block text-right">— {quote.author}</cite>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
