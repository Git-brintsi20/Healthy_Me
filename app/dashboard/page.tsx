"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Apple, ShieldQuestion, HistoryIcon, TrendingUp, Zap, Target, Loader2, Sparkles, Heart, Clock, Activity, Flame, Utensils, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useUserData } from "@/hooks/use-user-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const { userData, loading } = useUserData()

  const totalSearches = userData?.totalSearches || 0
  const mythsDebunked = userData?.mythsDebunked || 0
  const dailyGoal = userData?.dailyGoal || { calories: 2000, current: 0 }
  const goalPercentage = Math.round((dailyGoal.current / dailyGoal.calories) * 100)
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Enhanced Header with Gradient */}
        <div className="relative border-b border-border/40 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 backdrop-blur pt-16 lg:pt-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="relative px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {user ? `Welcome back, ${user.displayName || user.email?.split('@')[0]}! 👋` : "Welcome! Here's your nutrition overview."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pb-8 space-y-6">{loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
              </div>
              <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Enhanced Stats Grid with Animations */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Total Searches Card */}
                <Card className="relative overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Searches</CardTitle>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                      {totalSearches}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      All-time nutrition searches
                    </p>
                  </CardContent>
                </Card>

                {/* Myths Debunked Card */}
                <Card className="relative overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Myths Debunked</CardTitle>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30">
                      <ShieldQuestion className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                      {mythsDebunked}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Questions verified
                    </p>
                  </CardContent>
                </Card>

                {/* Daily Goal Card */}
                <Card className="relative overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daily Goal</CardTitle>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {goalPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {dailyGoal.current} / {dailyGoal.calories} calories
                    </p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Quick Actions */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-muted/5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  </div>
                  <CardDescription>Get started with your health journey</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/nutrition" className="group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex flex-col items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform">
                            <Utensils className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">Analyze Food</span>
                          <span className="text-xs text-muted-foreground text-center">Get instant nutrition insights</span>
                        </div>
                      </div>
                    </Link>

                    <Link href="/myths" className="group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/40 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex flex-col items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg group-hover:scale-110 transition-transform">
                            <ShieldQuestion className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">Bust a Myth</span>
                          <span className="text-xs text-muted-foreground text-center">Verify nutrition claims</span>
                        </div>
                      </div>
                    </Link>

                    <Link href="/settings" className="group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/40 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex flex-col items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform">
                            <Settings className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-semibold text-foreground">Adjust Goals</span>
                          <span className="text-xs text-muted-foreground text-center">Customize your targets</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {/* Recent Searches */}
            <Card className="border-2 border-border/40 bg-gradient-to-br from-card to-muted/5 shadow-lg">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-orange-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <CardTitle className="text-foreground">Recent Searches</CardTitle>
                </div>
                <CardDescription>Your latest nutrition analyses</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userData && userData.searchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {userData.searchHistory.slice(0, 5).map((item, i) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 group-hover:from-orange-500/30 group-hover:to-orange-600/20 transition-colors">
                            <Flame className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-orange-600 transition-colors">{item.foodName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(item.searchedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                          View
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">No recent searches yet</p>
                    <Button asChild variant="outline" size="sm" className="border-orange-500/20 hover:bg-orange-500/5">
                      <Link href="/nutrition">Start Analyzing</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Foods */}
            <Card className="border-2 border-border/40 bg-gradient-to-br from-card to-muted/5 shadow-lg">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-pink-500/5 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <Heart className="h-4 w-4 text-pink-600" />
                  </div>
                  <CardTitle className="text-foreground">Favorite Foods</CardTitle>
                </div>
                <CardDescription>Your saved nutrition items</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userData && userData.favorites.length > 0 ? (
                  <div className="space-y-3">
                    {userData.favorites.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-pink-500/40 hover:bg-pink-500/5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 group-hover:from-pink-500/30 group-hover:to-pink-600/20 transition-colors">
                            <Heart className="h-4 w-4 text-pink-600 fill-pink-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-pink-600 transition-colors">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground text-lg">{item.calories}</div>
                          <div className="text-xs text-muted-foreground">calories</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-pink-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">No favorites yet</p>
                    <Button asChild variant="outline" size="sm" className="border-pink-500/20 hover:bg-pink-500/5">
                      <Link href="/nutrition">Find Foods</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
