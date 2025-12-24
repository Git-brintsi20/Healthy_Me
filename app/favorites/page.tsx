"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useUserData } from "@/hooks/use-user-data"
import { Heart, Trash2, Loader2, Apple, Clock, Flame } from "lucide-react"
import { toast } from "sonner"
import { ProtectedPage } from "@/components/protected-page"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { userData, loading, removeFromFavorites } = useUserData()

  const favorites = userData?.favorites || []

  const handleRemoveFavorite = async (foodId: string, foodName: string) => {
    try {
      await removeFromFavorites(foodId)
      toast.success(`Removed ${foodName} from favorites`)
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast.error("Failed to remove from favorites")
    }
  }

  const formatDate = (date: any) => {
    if (!date) return "Recently"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    })
  }

  return (
    <ProtectedPage>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto lg:ml-0">
          {/* Header */}
          <div className="border-b border-border/40 bg-background/95 backdrop-blur pt-16 lg:pt-0">
            <div className="px-6 py-6">
              <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/20">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Favorites
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your saved foods for quick access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No favorites yet</h3>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                  Start adding your favorite foods from the nutrition search page to see them here for quick access.
                </p>
                <Button className="mt-6" asChild>
                  <a href="/nutrition">
                    <Apple className="mr-2 h-4 w-4" />
                    Search Foods
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="relative group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Apple className="h-5 w-5 text-green-600" />
                          {favorite.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          Added {formatDate(favorite.addedAt)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFavorite(favorite.id, favorite.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Calories */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                            Calories
                          </span>
                        </div>
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {favorite.calories}
                        </span>
                      </div>

                      {/* Quick view badge */}
                      <div className="flex items-center justify-center">
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="mr-1 h-3 w-3 fill-current" />
                          Favorite
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
    </ProtectedPage>
  )
}
