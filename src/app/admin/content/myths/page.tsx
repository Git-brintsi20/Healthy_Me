'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Eye
} from 'lucide-react'
import { AdminGuard } from '@/components/auth/admin-guard'
import { MythDocument, COLLECTIONS } from '@/lib/firebase' // Import COLLECTIONS
import { getMyths, getMythsByCategory, batchUpdateDocuments, batchDeleteDocuments } from '@/lib/db' // Import batch operations
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { formatDate } from '@/utils/format' // Assume this exists per your plan

interface MythWithActions extends MythDocument {
  actions: {
    canEdit: boolean
    canDelete: boolean
    canVerify: boolean
  }
}

export default function AdminMythsPage() {
  const router = useRouter()
  const [myths, setMyths] = useState<MythWithActions[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedMyth, setSelectedMyth] = useState<MythWithActions | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const categories = [
    'general', 'weight_loss', 'supplements', 'diet_trends', 'vitamins', 'exercise', 'metabolism', 'food_safety'
  ]

  useEffect(() => {
    loadMyths()
  }, [statusFilter, categoryFilter])

  const loadMyths = async () => {
    try {
      setLoading(true)
      let mythsData: MythDocument[] = []

      // In a real app, you'd implement server-side filtering.
      // For simplicity here, we fetch all and filter client-side.
      const result = await getMyths(200) // Fetch a larger number for admin view
      mythsData = result.myths

      // Apply filters
      if (categoryFilter !== 'all') {
        mythsData = mythsData.filter(myth => myth.category === categoryFilter);
      }
      if (statusFilter !== 'all') {
        mythsData = mythsData.filter(myth => statusFilter === 'verified' ? myth.verified : !myth.verified)
      }

      const mythsWithActions: MythWithActions[] = mythsData.map(myth => ({
        ...myth,
        actions: { canEdit: true, canDelete: true, canVerify: !myth.verified }
      }))

      setMyths(mythsWithActions)
    } catch (error) {
      console.error('Error loading myths:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyMyth = async (mythId: string) => {
    try {
      setActionLoading(mythId)
      // Use the batch update function for consistency
      await batchUpdateDocuments([{
        collection: COLLECTIONS.MYTHS,
        id: mythId,
        data: { verified: true }
      }])
      await loadMyths()
    } catch (error) {
      console.error('Error verifying myth:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteMyth = async (mythId: string) => {
    if (!confirm('Are you sure you want to delete this myth? This action cannot be undone.')) return

    try {
      setActionLoading(mythId)
      await batchDeleteDocuments([{
        collection: COLLECTIONS.MYTHS,
        id: mythId
      }])
      await loadMyths()
    } catch (error) {
      console.error('Error deleting myth:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkVerify = async () => {
    const pendingMyths = myths.filter(myth => !myth.verified)
    if (pendingMyths.length === 0) return

    if (!confirm(`Are you sure you want to verify ${pendingMyths.length} pending myths?`)) return

    try {
      setActionLoading('bulk-verify')
      const updates = pendingMyths.map(myth => ({
        collection: COLLECTIONS.MYTHS,
        id: myth.id,
        data: { verified: true }
      }))
      await batchUpdateDocuments(updates)
      await loadMyths()
    } catch (error) {
      console.error('Error during bulk verification:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredMyths = useMemo(() => {
    if (!searchTerm) return myths
    return myths.filter(myth =>
      myth.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myth.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [myths, searchTerm])

  const pendingCount = useMemo(() => myths.filter(m => !m.verified).length, [myths])

  return (
    <AdminGuard>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Myths Content Management</CardTitle>
            <CardDescription>View, filter, verify, and delete nutrition myths.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => router.push('/admin/content/myths/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Myth
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBulkVerify}
                disabled={pendingCount === 0 || !!actionLoading}
              >
                {actionLoading === 'bulk-verify' ? <LoadingSpinner size={16} /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Verify All Pending ({pendingCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="text-right w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <LoadingSpinner />
                    </TableCell>
                  </TableRow>
                ) : filteredMyths.length > 0 ? (
                  filteredMyths.map(myth => (
                    <TableRow key={myth.id}>
                      <TableCell>
                        <Badge variant={myth.verified ? 'default' : 'secondary'}>
                          {myth.verified ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                          {myth.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{myth.title}</TableCell>
                      <TableCell className="capitalize">{myth.category.replace('_', ' ')}</TableCell>
                      <TableCell>{formatDate(myth.createdAt.toDate())}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMyth(myth)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/content/myths/${myth.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {myth.actions.canVerify && (
                          <Button variant="ghost" size="icon" onClick={() => handleVerifyMyth(myth.id)} disabled={!!actionLoading}>
                            {actionLoading === myth.id ? <LoadingSpinner size={16} /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMyth(myth.id)} disabled={!!actionLoading}>
                          {actionLoading === myth.id ? <LoadingSpinner size={16} /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No myths found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedMyth && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMyth.title}</DialogTitle>
              <DialogDescription>
                Category: {selectedMyth.category} | Status: {selectedMyth.verified ? 'Verified' : 'Pending'}
              </DialogDescription>
            </DialogHeader>
            <div className="prose dark:prose-invert max-h-[60vh] overflow-y-auto p-4">
              <h4>Myth Claim</h4>
              <p>{selectedMyth.myth}</p>
              <h4>Factual Explanation</h4>
              <p>{selectedMyth.explanation}</p>
              <h4>Sources</h4>
              <ul>
                {selectedMyth.sources.map((source, i) => (
                  <li key={i}><a href={source} target="_blank" rel="noopener noreferrer">{source}</a></li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedMyth(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </div>
    </AdminGuard>
  )
}