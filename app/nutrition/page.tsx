"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Camera, Flame, Beef, Wheat, Droplet, Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNutrition } from "@/hooks/use-nutrition"
import { useImageUpload } from "@/hooks/use-image-upload"
import { toast } from "sonner"

export default function NutritionPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { analyzeFood, loading, data } = useNutrition()
  const { analyzeImage, loading: imageLoading } = useImageUpload()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const macroData = data
    ? [
        { name: "Protein", value: data.macros.protein, color: "#640000" },
        { name: "Carbs", value: data.macros.carbs, color: "#B67E7D" },
        { name: "Fats", value: data.macros.fats, color: "#420001" },
      ]
    : []

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      try {
        await analyzeFood(searchQuery)
        toast.success("Food analyzed successfully!")
      } catch (error) {
        toast.error("Failed to analyze food. Please try again.")
      }
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      try {
        const result = await analyzeImage(base64)
        if (result.detectedFoods && result.detectedFoods.length > 0) {
          // Analyze the first detected food
          await analyzeFood(result.detectedFoods[0])
          toast.success(`Detected: ${result.detectedFoods.join(", ")}`)
        }
      } catch (error) {
        toast.error("Failed to analyze image. Please try again.")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Header */}
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Nutrition Analysis</h1>
            <p className="text-muted-foreground mt-1">Search any food or upload an image for instant analysis</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for any food item (e.g., Grilled Chicken Breast)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={loading || imageLoading}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1 sm:flex-initial" disabled={loading || imageLoading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Analyze
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageUpload}
                    className="flex-1 sm:flex-initial bg-transparent"
                    disabled={loading || imageLoading}
                  >
                    {imageLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                    Scan Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {data && (
            <>
              {/* Calorie Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-5xl font-bold text-primary">{data.calories}</CardTitle>
                  <CardDescription className="text-base">Calories per {data.servingSize} serving</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{data.name}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Macros and Chart */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Macro Chart */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Macronutrient Breakdown</CardTitle>
                    <CardDescription>Per 100g serving</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}g`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Macro Details */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Detailed Macros</CardTitle>
                    <CardDescription>Nutritional breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <Beef className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Protein</div>
                          <div className="text-sm text-muted-foreground">Essential amino acids</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{data.macros.protein}g</div>
                        <div className="text-xs text-muted-foreground">{Math.round((data.macros.protein / 50) * 100)}% DV</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                          <Wheat className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Carbohydrates</div>
                          <div className="text-sm text-muted-foreground">Energy source</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-secondary">{data.macros.carbs}g</div>
                        <div className="text-xs text-muted-foreground">{Math.round((data.macros.carbs / 300) * 100)}% DV</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                          <Droplet className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Fats</div>
                          <div className="text-sm text-muted-foreground">Healthy fats</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{data.macros.fats}g</div>
                        <div className="text-xs text-muted-foreground">{Math.round((data.macros.fats / 70) * 100)}% DV</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vitamins & Minerals Table */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Vitamins & Minerals</CardTitle>
                  <CardDescription>Micronutrient profile per {data.servingSize} serving</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nutrient</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">% Daily Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.vitamins.map((vitamin, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{vitamin.name}</TableCell>
                            <TableCell className="text-right">{vitamin.amount}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  vitamin.dailyValue > 10
                                    ? "text-green-600 font-semibold"
                                    : "text-muted-foreground"
                                }
                              >
                                {vitamin.dailyValue}%
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {data.minerals.map((mineral, i) => (
                          <TableRow key={`mineral-${i}`}>
                            <TableCell className="font-medium">{mineral.name}</TableCell>
                            <TableCell className="text-right">{mineral.amount}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={
                                  mineral.dailyValue > 10
                                    ? "text-green-600 font-semibold"
                                    : "text-muted-foreground"
                                }
                              >
                                {mineral.dailyValue}%
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    Nutrition Summary
                  </CardTitle>
                  <CardDescription>AI-powered analysis for {data.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border/50 bg-background p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This food contains {data.calories} calories per {data.servingSize}, with {data.macros.protein}g protein, {data.macros.carbs}g carbs, and {data.macros.fats}g fat.
                      {data.macros.protein > 20 && " It's an excellent source of protein."}
                      {data.macros.fiber > 5 && " High in fiber for digestive health."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!data && !loading && !imageLoading && (
            <Card className="border-dashed border-2 border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Start Your Analysis</h3>
                <p className="text-muted-foreground max-w-sm leading-relaxed">
                  Enter a food item above or upload an image to get detailed nutritional information powered by AI
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
