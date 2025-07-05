import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Moodora",
  description:
    "Streamline your daily productivity and well-being with inspirational quotes, weather updates, task management, mood tracking, and calendar.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <Navigation />
        <main className="pt-16">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
