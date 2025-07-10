"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { InfoCard } from "@/components/features/info-card"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  deleteDoc,
  Timestamp
} from "firebase/firestore"
import { 
  Heart, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  Share2,
  BookOpen,
  Apple,
  HelpCircle,
  Calendar,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteItem {
  id: string
  type: 'nutrition' | 'myth' | 'recipe'
  title: string
  description?: string
  data: any
  createdAt: Timestamp
  tags?: string[]
  imageUrl?: string
}

type FilterType = 'all' | 'nutrition' | 'myth' | 'recipe'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')

  // Fetch favorites from Firestore
  useEffect(() => {
    if (!user) return

    const favoritesRef = collection(db, 'favorites')
    const q = query(
      favoritesRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favoritesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FavoriteItem[]

      setFavorites(favoritesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Filter and sort favorites
  const filteredFavorites = React.useMemo(() => {
    let filtered = favorites

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        break
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return filtered
  }, [favorites, searchTerm, filterType, sortBy])

  // Remove from favorites
  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  // Share favorite
  const handleShareFavorite = async (item: FavoriteItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || 'Check out this nutrition info!',
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${item.title}\n${item.description || ''}\n${window.location.href}`
      navigator.clipboard.writeText(shareText)
    }
  }

  // Export favorites
  const handleExportFavorites = () => {
    const dataStr = JSON.stringify(filteredFavorites, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `healthyme-favorites-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign in to view favorites</h2>
            <p className="text-muted-foreground text-center">
              Create an account to save your favorite nutrition facts and myths
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              {favorites.length} saved items
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button onClick={handleExportFavorites} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <FilterButton
              active={filterType === 'all'}
              onClick={() => setFilterType('all')}
              icon={Filter}
            >
              All
            </FilterButton>
            <FilterButton
              active={filterType === 'nutrition'}
              onClick={() => setFilterType('nutrition')}
              icon={Apple}
            >
              Nutrition
            </FilterButton>
            <FilterButton
              active={filterType === 'myth'}
              onClick={() => setFilterType('myth')}
              icon={HelpCircle}
            >
              Myths
            </FilterButton>
            <FilterButton
              active={filterType === 'recipe'}
              onClick={() => setFilterType('recipe')}
              icon={BookOpen}
            >
              Recipes
            </FilterButton>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Newest
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('oldest')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Oldest
            </Button>
            <Button
              variant={sortBy === 'alphabetical' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('alphabetical')}
            >
              <Star className="h-4 w-4 mr-1" />
              A-Z
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredFavorites.length === 0 ? (
        <EmptyState searchTerm={searchTerm} filterType={filterType} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              onRemove={() => handleRemoveFavorite(item.id)}
              onShare={() => handleShareFavorite(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

function FilterButton({ active, onClick, icon: Icon, children }: FilterButtonProps) {
  return (
    <Button
      variant={active ? "secondary" : "outline"}
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Button>
  )
}

interface FavoriteCardProps {
  item: FavoriteItem
  onRemove: () => void
  onShare: () => void
}

function FavoriteCard({ item, onRemove, onShare }: FavoriteCardProps) {
  const typeIcon = {
    nutrition: Apple,
    myth: HelpCircle,
    recipe: BookOpen
  }[item.type]

  const TypeIcon = typeIcon

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="h-8 w-8"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        {item.description && (
          <CardDescription className="line-clamp-2">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {item.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Saved {item.createdAt.toDate().toLocaleDateString()}
          </span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  searchTerm: string
  filterType: FilterType
}

function EmptyState({ searchTerm, filterType }: EmptyStateProps) {
  const isFiltered = searchTerm || filterType !== 'all'
  
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          {isFiltered ? 'No favorites found' : 'No favorites yet'}
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {isFiltered 
            ? 'Try adjusting your search or filter to find what you\'re looking for.'
            : 'Start exploring nutrition facts and myths to add your first favorites!'
          }
        </p>
        {!isFiltered && (
          <Button className="mt-4" asChild>
            <a href="/dashboard">
              Start Exploring
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}