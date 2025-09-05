"use client"

import React, { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

const hints = [
  "Scouting for hidden gems...",
  "Consulting local experts...",
  "Charting the best course...",
  "Checking the local forecast...",
  "Translating the menu...",
  "Finding the perfect view...",
]

export function Loader() {
  const [hint, setHint] = useState("")

  useEffect(() => {
    setHint(hints[Math.floor(Math.random() * hints.length)])
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="relative">
        <MapPin className="h-12 w-12 text-primary animate-bounce" />
      </div>
      <p className="text-lg font-semibold text-primary font-headline animate-pulse">
        Finding Recommendations...
      </p>
      {hint && <p className="text-muted-foreground">{hint}</p>}
    </div>
  )
}
