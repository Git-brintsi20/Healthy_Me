"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Clock, Apple, ShieldQuestion, Loader2, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserData } from "@/hooks/use-user-data"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase/config"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { toast } from "sonner"

type MythVerdict = "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE"

interface MythHistoryItem {
  id: string
  question: string
  verdict: MythVerdict
  askedAt: Date | null
}

export default function HistoryPage() {
  const { user } = useAuth()
  const { userData, loading: userDataLoading, addToFavorites } = useUserData()
  const [mythHistory, setMythHistory] = useState<MythHistoryItem[]>([])
  const [mythLoading, setMythLoading] = useState(true)
  
  const handleAddToFavorites = async (foodName: string) => {
    const isFavorited = userData?.favorites.some(f => f.name.toLowerCase() === foodName.toLowerCase())
    if (isFavorited) {
      toast.info("Already in favorites!")
      return
    }
    try {
      await addToFavorites({ name: foodName, calories: 0 })
      toast.success("Added to favorites!")
    } catch (error) {
      console.error("Error adding to favorites:", error)
      toast.error("Failed to add to favorites")
    }
  }

  useEffect(() => {
    if (!user) {
      setMythHistory([])
      setMythLoading(false)
      return
    }

    const mythsRef = collection(db, "myths")
    const q = query(
      mythsRef,
      where("askedBy", "==", user.uid),
      orderBy("askedAt", "desc"),
      limit(10),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: MythHistoryItem[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any
          return {
            id: doc.id,
            question: data.question ?? "",
            verdict: data.verdict as MythVerdict,
            askedAt: data.askedAt?.toDate ? data.askedAt.toDate() : null,
          }
        })
        setMythHistory(items)
        setMythLoading(false)
      },
      (error) => {
        console.error("Error loading myth history:", error)
        setMythHistory([])
        setMythLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const historyLoading = userDataLoading || mythLoading

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
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Nutrition history from userData */}
                  {userData?.searchHistory?.length
                    ? userData.searchHistory.slice(0, 10).map((item) => {
                        const isFavorited = userData?.favorites.some(f => f.name.toLowerCase() === item.foodName.toLowerCase())
                        return (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:bg-muted/30"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Apple className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-foreground leading-relaxed">{item.foodName}</h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddToFavorites(item.foodName)}
                                  className={`transition-all ${
                                    isFavorited ? 'text-pink-600' : ''
                                  }`}
                                >
                                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-pink-600' : ''}`} />
                                </Button>
                                <Badge variant="outline" className="shrink-0">Nutrition</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(item.searchedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )})
                    : null}

                  {/* Myth history from myths collection */}
                  {mythHistory.length
                    ? mythHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 rounded-lg border border-border/50 bg-background p-4 transition-colors hover:bg-muted/30"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                            <ShieldQuestion className="h-5 w-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-foreground leading-relaxed">{item.question}</h3>
                              <Badge
                                variant="outline"
                                className={`flex-shrink-0 ${
                                  item.verdict === "FALSE"
                                    ? "bg-red-500/10 text-red-700 border-red-500/20"
                                    : item.verdict === "TRUE"
                                      ? "bg-green-500/10 text-green-700 border-green-500/20"
                                      : "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                                }`}
                              >
                                {item.verdict.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.askedAt ? item.askedAt.toLocaleString() : "Just now"}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}

                  {!userData?.searchHistory?.length && !mythHistory.length && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No history yet. Start analyzing foods or busting myths to see them here!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
