"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Apple, ShieldQuestion, HistoryIcon, TrendingUp, Zap, Target, Loader2 } from "lucide-react"
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
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Header - mobile spacing */}
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {user ? `Welcome back, ${user.displayName || user.email}!` : "Welcome! Here's your nutrition overview."}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Searches</CardTitle>
                    <Zap className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{totalSearches}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All-time nutrition searches
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Myths Debunked</CardTitle>
                    <ShieldQuestion className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mythsDebunked}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Questions verified
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Daily Goal</CardTitle>
                    <Target className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{goalPercentage}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dailyGoal.current} / {dailyGoal.calories} calories
                    </p>
                  </CardContent>
                </Card>
              </div>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start analyzing nutrition or busting myths</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6 border-primary/20 hover:bg-primary/5 hover:border-primary/40 bg-transparent"
              >
                <Link href="/nutrition">
                  <Apple className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">Analyze Nutrition</div>
                    <div className="text-xs text-muted-foreground">Search any food item</div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6 border-secondary/20 hover:bg-secondary/5 hover:border-secondary/40 bg-transparent"
              >
                <Link href="/myths">
                  <ShieldQuestion className="h-8 w-8 text-secondary" />
                  <div className="text-center">
                    <div className="font-semibold">Bust a Myth</div>
                    <div className="text-xs text-muted-foreground">Ask any question</div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 p-6 border-accent/20 hover:bg-accent/5 hover:border-accent/40 bg-transparent"
              >
                <Link href="/history">
                  <HistoryIcon className="h-8 w-8 text-accent" />
                  <div className="text-center">
                    <div className="font-semibold">View History</div>
                    <div className="text-xs text-muted-foreground">See past searches</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>Your latest nutrition analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData && userData.searchHistory.length > 0 ? (
                  userData.searchHistory.slice(0, 5).map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0"
                    >
                      <div>
                        <div className="font-medium text-foreground">{item.foodName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.searchedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent searches. Start analyzing food to see your history here!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Favorite Foods</CardTitle>
                <CardDescription>Your saved nutrition items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData && userData.favorites.length > 0 ? (
                  userData.favorites.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0"
                    >
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{item.calories} cal</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No favorites yet. Add foods from your search results!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
            </>
          )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
