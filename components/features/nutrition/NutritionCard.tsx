"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Scale } from "lucide-react"
import type { NutritionData } from "@/types"

interface NutritionCardProps {
  data: NutritionData
}

export function NutritionCard({ data }: NutritionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          {data.name}
        </CardTitle>
        <CardDescription>Serving size: {data.servingSize}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-orange-900 dark:text-orange-100">
              Calories
            </span>
          </div>
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {data.calories}
          </span>
        </div>

        {/* Macros */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Macronutrients (g)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-blue-900 dark:text-blue-100">Protein</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {data.macros.protein}g
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-green-900 dark:text-green-100">Carbs</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {data.macros.carbs}g
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-xs text-yellow-900 dark:text-yellow-100">Fats</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {data.macros.fats}g
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs text-purple-900 dark:text-purple-100">Fiber</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {data.macros.fiber}g
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
