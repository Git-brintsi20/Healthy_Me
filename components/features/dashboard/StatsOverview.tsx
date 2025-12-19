"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Zap, Target } from "lucide-react"

interface StatsOverviewProps {
  totalSearches: number
  mythsDebunked: number
  goalPercentage: number
}

export function StatsOverview({ totalSearches, mythsDebunked, goalPercentage }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSearches}</p>
              <p className="text-sm text-muted-foreground">Foods Searched</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mythsDebunked}</p>
              <p className="text-sm text-muted-foreground">Myths Debunked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{goalPercentage}%</p>
              <p className="text-sm text-muted-foreground">Daily Goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
