"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Search, Camera, Flame, Beef, Wheat, Droplet, Loader2, Sparkles, TrendingUp, Award, Star, Heart } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useNutrition } from "@/hooks/use-nutrition"
import { useImageUpload } from "@/hooks/use-image-upload"
import { useUserData } from "@/hooks/use-user-data"
import { toast } from "sonner"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ProtectedPage } from "@/components/protected-page"

export default function NutritionPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { analyzeFood, loading, data } = useNutrition()
  const { analyzeImage, loading: imageLoading } = useImageUpload()
  const { addSearchHistory, addToFavorites, userData, updateDailyGoal } = useUserData()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const isFavorited = React.useMemo(() => {
    if (!data || !userData?.favorites) return false
    return userData.favorites.some(f => f.name.toLowerCase() === data.name.toLowerCase())
  }, [data, userData?.favorites])

  const macroData = data?.macros
    ? [
        { name: "Protein", value: data.macros.protein || 0, color: "#ef4444", gradient: "from-red-500 to-red-600" },
        { name: "Carbs", value: data.macros.carbs || 0, color: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
        { name: "Fats", value: data.macros.fats || 0, color: "#8b5cf6", gradient: "from-violet-500 to-purple-600" },
      ]
    : []

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      try {
        await analyzeFood(searchQuery)
        await addSearchHistory(searchQuery)
        toast.success("Food analyzed successfully!")
      } catch (error) {
        console.error("Nutrition analysis error:", error)
        toast.error("Failed to analyze food. Please try again.")
      }
    }
  }

  const handleAddToFavorites = async () => {
    if (data) {
      if (isFavorited) {
        toast.info("Already in favorites!")
        return
      }
      try {
        await addToFavorites({ name: data.name, calories: data.calories })
        toast.success("Added to favorites!")
      } catch (error) {
        toast.error("Failed to add to favorites")
      }
    }
  }

  const handleAddToDailyGoal = async () => {
    if (data && userData) {
      try {
        const currentCalories = userData.dailyGoal?.current || 0
        const goalCalories = userData.dailyGoal?.calories || 2000
        const newCurrent = currentCalories + data.calories
        await updateDailyGoal(goalCalories, newCurrent)
        toast.success(`Added ${data.calories} calories to your daily goal!`)
      } catch (error) {
        console.error("Error updating daily goal:", error)
        toast.error("Failed to update daily goal")
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
    <ProtectedPage>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto lg:ml-0">
          {/* Enhanced Header with Gradient */}
          <div className="relative border-b border-border/40 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 backdrop-blur pt-16 lg:pt-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
            <div className="relative px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                <Flame className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Nutrition Analysis
              </h1>
            </div>
            <p className="text-muted-foreground ml-14">Powered by AI • Instant results • Comprehensive data</p>
          </div>
        </div>

        <div className="p-6 pb-8 space-y-6">
          {/* Enhanced Search Bar with Gradient Border */}
          <Card className="border-2 border-transparent bg-gradient-to-br from-card via-card to-muted/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="🍎 Search for any food item... (e.g., Grilled Chicken Breast)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 text-base border-2 focus:border-primary/50 transition-all"
                      disabled={loading || imageLoading}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-initial h-12" 
                    disabled={loading || imageLoading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageUpload}
                    className="flex-1 sm:flex-initial border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-12"
                    disabled={loading || imageLoading}
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        Scan
                      </>
                    )}
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

          {/* Results with Animations */}
          {data && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Enhanced Calorie Hero Card */}
              <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="relative text-center pb-3 pt-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddToFavorites}
                      className={`hover:bg-primary/10 transition-all ${
                        isFavorited ? 'text-pink-600' : ''
                      }`}
                      title="Add to favorites"
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-pink-600' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddToDailyGoal}
                      className="hover:bg-green-500/10 text-green-600 transition-all"
                      title="Add to daily goal"
                    >
                      <Flame className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-7xl font-bold bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent animate-pulse">
                    {data.calories}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2 font-medium">
                    Calories per <span className="text-primary font-semibold">{data.servingSize}</span> serving
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-center py-4 px-6 bg-background/60 backdrop-blur rounded-xl border border-border/50">
                    <p className="text-xl font-bold text-foreground tracking-wide">{data.name}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {data.macros.protein > 15 ? "High Protein" : "Low Protein"}
                      </Badge>
                      {data.macros.fiber && data.macros.fiber > 5 && (
                        <Badge variant="outline" className="text-xs">High Fiber</Badge>
                      )}
                      {data.calories < 200 && (
                        <Badge variant="outline" className="text-xs">Low Cal</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Macros and Chart with Enhanced Styling */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Macro Chart with Glow Effect */}
                <Card className="relative overflow-hidden border-2 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Macronutrient Breakdown
                      </CardTitle>
                      <CardDescription className="mt-1">Per {data.servingSize} serving</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[320px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                            </linearGradient>
                            <linearGradient id="carbsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                            </linearGradient>
                            <linearGradient id="fatsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="100%" stopColor="#7c3aed" stopOpacity={1}/>
                            </linearGradient>
                          </defs>
                          <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${value}g (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={90}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="hsl(var(--background))" />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Total: {data.macros.protein + data.macros.carbs + data.macros.fats}g
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Macro Details with Gradients */}
                <Card className="border-2 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Detailed Macros
                    </CardTitle>
                    <CardDescription>Nutritional breakdown with daily values</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="group relative overflow-hidden rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-5 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                            <Beef className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground">Protein</div>
                            <div className="text-sm text-muted-foreground">Essential amino acids</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-br from-red-500 to-red-600 bg-clip-text text-transparent">
                            {data.macros.protein}g
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {Math.round((data.macros.protein / 50) * 100)}% DV
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((data.macros.protein / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 hover:border-amber-500/50 transition-all duration-300 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                            <Wheat className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground">Carbohydrates</div>
                            <div className="text-sm text-muted-foreground">Primary energy source</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            {data.macros.carbs}g
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {Math.round((data.macros.carbs / 300) * 100)}% DV
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((data.macros.carbs / 300) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-5 hover:border-violet-500/50 transition-all duration-300 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                            <Droplet className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground">Fats</div>
                            <div className="text-sm text-muted-foreground">Healthy fats & omega</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-br from-violet-500 to-purple-600 bg-clip-text text-transparent">
                            {data.macros.fats}g
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {Math.round((data.macros.fats / 70) * 100)}% DV
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((data.macros.fats / 70) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Vitamins & Minerals Table */}
              <Card className="border-2 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Vitamins & Minerals
                      </CardTitle>
                      <CardDescription className="mt-2">Complete micronutrient profile per {data.servingSize} serving</CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {data.vitamins.length + data.minerals.length} Nutrients
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/70">
                          <TableHead className="font-bold">Nutrient</TableHead>
                          <TableHead className="text-right font-bold">Amount</TableHead>
                          <TableHead className="text-right font-bold">% Daily Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.vitamins.map((vitamin, i) => (
                          <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${vitamin.dailyValue > 10 ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                                {vitamin.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{vitamin.amount}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={vitamin.dailyValue > 10 ? "default" : "secondary"}
                                className={
                                  vitamin.dailyValue > 20 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                                    : vitamin.dailyValue > 10
                                    ? "bg-green-500/20 text-green-700 border-green-500/30"
                                    : ""
                                }
                              >
                                {vitamin.dailyValue}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {data.minerals.map((mineral, i) => (
                          <TableRow key={`mineral-${i}`} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${mineral.dailyValue > 10 ? 'bg-blue-500' : 'bg-muted-foreground/30'}`} />
                                {mineral.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{mineral.amount}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={mineral.dailyValue > 10 ? "default" : "secondary"}
                                className={
                                  mineral.dailyValue > 20 
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white" 
                                    : mineral.dailyValue > 10
                                    ? "bg-blue-500/20 text-blue-700 border-blue-500/30"
                                    : ""
                                }
                              >
                                {mineral.dailyValue}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced AI Insights */}
              <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-purple/10 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                      <Flame className="h-6 w-6 text-primary-foreground" />
                    </div>
                    AI Nutrition Insights
                  </CardTitle>
                  <CardDescription className="text-base">Smart analysis for {data.name}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur p-6 shadow-lg">
                    <p className="text-base text-foreground leading-relaxed font-medium">
                      This food contains <span className="text-primary font-bold">{data.calories} calories</span> per {data.servingSize}, 
                      with <span className="text-red-500 font-bold">{data.macros.protein}g protein</span>, 
                      <span className="text-amber-500 font-bold"> {data.macros.carbs}g carbs</span>, 
                      and <span className="text-violet-500 font-bold">{data.macros.fats}g fat</span>.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.macros.protein > 20 && (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-green-700">High Protein</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Excellent for muscle building and recovery</p>
                      </div>
                    )}
                    
                    {data.macros.fiber && data.macros.fiber > 5 && (
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="font-bold text-blue-700">High Fiber</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Great for digestive health and satiety</p>
                      </div>
                    )}
                    
                    {data.calories < 200 && (
                      <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <span className="font-bold text-purple-700">Low Calorie</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Perfect for weight management goals</p>
                      </div>
                    )}
                    
                    {data.macros.fats < 10 && (
                      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-5 w-5 text-cyan-600" />
                          <span className="font-bold text-cyan-700">Low Fat</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Heart-healthy choice</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Empty State */}
          {!data && !loading && !imageLoading && (
            <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
              <CardContent className="relative flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 shadow-xl">
                    <Search className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">Start Your Nutrition Journey</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed text-lg mb-6">
                  Enter any food item or upload an image to get instant AI-powered nutritional analysis with comprehensive data
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="text-sm">🥗 100,000+ Foods</Badge>
                  <Badge variant="secondary" className="text-sm">⚡ Instant Results</Badge>
                  <Badge variant="secondary" className="text-sm">🎯 AI Powered</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
    </ProtectedPage>
  )
}
