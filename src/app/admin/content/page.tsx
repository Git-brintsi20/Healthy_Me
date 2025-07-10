'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  FileText, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { AdminGuard } from '@/components/auth/admin-guard'
import { useRouter } from 'next/navigation'
import { getDatabaseStats, getMyths, getNutritionFacts } from '@/lib/db'
import { MythDocument, NutritionFactDocument } from '@/lib/firebase'

interface ContentStats {
  totalUsers: number
  totalNutritionFacts: number
  totalMyths: number
  totalSearches: number
  pendingMyths: number
  verifiedMyths: number
  pendingNutrition: number
  verifiedNutrition: number
}

export default function AdminContentPage() {
  const router = useRouter()
  const [stats, setStats] = useState<ContentStats>({
    totalUsers: 0,
    totalNutritionFacts: 0,
    totalMyths: 0,
    totalSearches: 0,
    pendingMyths: 0,
    verifiedMyths: 0,
    pendingNutrition: 0,
    verifiedNutrition: 0
  })
  const [myths, setMyths] = useState<MythDocument[]>([])
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFactDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContentData()
  }, [])

  const loadContentData = async () => {
    try {
      setLoading(true)
      
      // Load database stats
      const dbStats = await getDatabaseStats()
      
      // Load myths with pagination
      const mythsData = await getMyths(20)
      const allMyths = mythsData.myths
      
      // Load nutrition facts (you'll need to implement this pagination)
      const nutritionData = await getNutritionFacts('') // This might need adjustment
      
      // Calculate content-specific stats
      const pendingMyths = allMyths.filter(myth => !myth.verified).length
      const verifiedMyths = allMyths.filter(myth => myth.verified).length
      const pendingNutrition = nutritionData.filter(fact => !fact.verified).length
      const verifiedNutrition = nutritionData.filter(fact => fact.verified).length
      
      setStats({
        ...dbStats,
        pendingMyths,
        verifiedMyths,
        pendingNutrition,
        verifiedNutrition
      })
      
      setMyths(allMyths)
      setNutritionFacts(nutritionData)
    } catch (error) {
      console.error('Error loading content data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyContent = async (id: string, type: 'myth' | 'nutrition') => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          contentType: type,
          contentId: id
        })
      })

      if (response.ok) {
        await loadContentData() // Refresh data
      }
    } catch (error) {
      console.error('Error verifying content:', error)
    }
  }

  const handleDeleteContent = async (id: string, type: 'myth' | 'nutrition') => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          contentType: type,
          contentId: id
        })
      })

      if (response.ok) {
        await loadContentData() // Refresh data
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage nutrition facts, myths, and content approval</p>
          </div>
          <Button onClick={() => router.push('/admin/content/myths/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Myths</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMyths}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {stats.verifiedMyths} verified
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nutrition Facts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNutritionFacts}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {stats.verifiedNutrition} verified
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingMyths + stats.pendingNutrition}</div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <XCircle className="h-3 w-3 mr-1 text-orange-500" />
                Needs attention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSearches}</div>
              <div className="text-sm text-muted-foreground mt-1">
                User queries
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="myths" className="space-y-4">
          <TabsList>
            <TabsTrigger value="myths">Myths</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
          </TabsList>

          <TabsContent value="myths" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Myth Management</h2>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/content/myths')}
              >
                View All Myths
              </Button>
            </div>

            <div className="grid gap-4">
              {myths.slice(0, 5).map((myth) => (
                <Card key={myth.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{myth.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={myth.verified ? "default" : "secondary"}>
                          {myth.verified ? "Verified" : "Pending"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!myth.verified && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVerifyContent(myth.id, 'myth')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteContent(myth.id, 'myth')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      {myth.explanation.slice(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Nutrition Facts Management</h2>
              <Button variant="outline">
                Add Nutrition Data
              </Button>
            </div>

            <div className="grid gap-4">
              {nutritionFacts.slice(0, 5).map((fact) => (
                <Card key={fact.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{fact.foodName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={fact.verified ? "default" : "secondary"}>
                          {fact.verified ? "Verified" : "Pending"}
                        </Badge>
                        <Badge variant="outline">
                          {fact.calories} cal
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!fact.verified && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVerifyContent(fact.id, 'nutrition')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteContent(fact.id, 'nutrition')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Protein: {fact.macros.protein}g | Carbs: {fact.macros.carbs}g | Fat: {fact.macros.fat}g
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}