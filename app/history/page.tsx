import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Clock, Apple, ShieldQuestion } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HistoryPage() {
  const historyItems = [
    {
      type: "nutrition",
      title: "Grilled Chicken Breast",
      timestamp: "2 hours ago",
      calories: 165,
    },
    {
      type: "myth",
      title: "Does eating late at night cause weight gain?",
      timestamp: "3 hours ago",
      verdict: "false",
    },
    {
      type: "nutrition",
      title: "Brown Rice",
      timestamp: "5 hours ago",
      calories: 216,
    },
    {
      type: "myth",
      title: "Is breakfast the most important meal?",
      timestamp: "Yesterday",
      verdict: "partial",
    },
    {
      type: "nutrition",
      title: "Greek Yogurt",
      timestamp: "Yesterday",
      calories: 100,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">History</h1>
            <p className="text-muted-foreground mt-1">View your past nutrition analyses and myth-busting queries</p>
          </div>
        </div>

        <div className="p-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your search and analysis history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historyItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                        item.type === "nutrition" ? "bg-primary/10" : "bg-secondary/10"
                      }`}
                    >
                      {item.type === "nutrition" ? (
                        <Apple className={`h-5 w-5 text-primary`} />
                      ) : (
                        <ShieldQuestion className={`h-5 w-5 text-secondary`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-foreground leading-relaxed">{item.title}</h3>
                        {item.type === "nutrition" && item.calories && (
                          <Badge variant="outline" className="flex-shrink-0 font-semibold">
                            {item.calories} cal
                          </Badge>
                        )}
                        {item.type === "myth" && item.verdict && (
                          <Badge
                            variant="outline"
                            className={`flex-shrink-0 ${
                              item.verdict === "false"
                                ? "bg-red-500/10 text-red-700 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                            }`}
                          >
                            {item.verdict === "false" ? "FALSE" : "PARTIAL"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
