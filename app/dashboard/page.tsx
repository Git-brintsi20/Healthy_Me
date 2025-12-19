import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Apple, ShieldQuestion, HistoryIcon, TrendingUp, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Header - mobile spacing */}
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your nutrition overview.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Searches</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">127</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Myths Debunked</CardTitle>
                <ShieldQuestion className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">43</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+8</span> this week
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Goal</CardTitle>
                <Target className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">85%</div>
                <p className="text-xs text-muted-foreground mt-1">1,700 / 2,000 calories</p>
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
                {[
                  { name: "Grilled Chicken Breast", calories: 165, time: "2 hours ago" },
                  { name: "Brown Rice", calories: 216, time: "5 hours ago" },
                  { name: "Greek Yogurt", calories: 100, time: "Yesterday" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{item.calories} cal</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Nutrition Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Protein Intake</div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        You're 15g below your protein goal. Consider adding lean proteins to your next meal.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Hydration Reminder</div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Remember to drink water throughout the day. Aim for 8 glasses.
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
