// app/(dashboard)/history/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InfoCard } from '@/components/features/info-card';
import { SearchBar } from '@/components/forms/search-bar';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase';
import { Search, Calendar, Clock, Trash2, Download, Filter, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  type: 'nutrition' | 'myth' | 'recipe';
  title: string;
  query: string;
  timestamp: Date;
  data: any;
  favorite: boolean;
}

interface HistoryFilters {
  type: 'all' | 'nutrition' | 'myth' | 'recipe';
  timeRange: 'all' | 'today' | 'week' | 'month';
  searchQuery: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<HistoryFilters>({
    type: 'all',
    timeRange: 'all',
    searchQuery: ''
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user's search history
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [historyItems, filters]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const historyQuery = query(
        collection(db, COLLECTIONS.SEARCH_HISTORY),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(historyQuery);
      const items: HistoryItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          title: data.title,
          query: data.query,
          timestamp: data.timestamp.toDate(),
          data: data.data,
          favorite: data.favorite || false
        };
      });

      setHistoryItems(items);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...historyItems];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const now = new Date();
      let cutoffDate: Date;

      switch (filters.timeRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      filtered = filtered.filter(item => item.timestamp >= cutoffDate);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.query.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(filtered);
  };

  const deleteHistoryItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SEARCH_HISTORY, itemId));
      setHistoryItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const deleteSelectedItems = async () => {
    try {
      const deletePromises = selectedItems.map(id => 
        deleteDoc(doc(db, COLLECTIONS.SEARCH_HISTORY, id))
      );
      await Promise.all(deletePromises);
      
      setHistoryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting selected items:', error);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nutrition':
        return '🍎';
      case 'myth':
        return '❓';
      case 'recipe':
        return '🍳';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition':
        return 'bg-green-100 text-green-800';
      case 'myth':
        return 'bg-blue-100 text-blue-800';
      case 'recipe':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const exportHistory = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Type,Title,Query,Timestamp\n" +
      filteredItems.map(item => 
        `${item.type},"${item.title}","${item.query}","${item.timestamp.toISOString()}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "search_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Search History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past searches and insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              disabled={filteredItems.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHistory}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'nutrition', 'myth', 'recipe'].map(type => (
                      <Badge
                        key={type}
                        variant={filters.type === type ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, type: type as any }))}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All Time' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' }
                    ].map(option => (
                      <Badge
                        key={option.value}
                        variant={filters.timeRange === option.value ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setFilters(prev => ({ ...prev, timeRange: option.value as any }))}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Search Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Filter by title or query..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Actions */}
        {filteredItems.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllItems}
                  >
                    {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedItems.length} of {filteredItems.length} selected
                  </span>
                </div>
                {selectedItems.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelectedItems}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No search history found</h3>
                <p className="text-muted-foreground">
                  {historyItems.length === 0 
                    ? "Start searching to see your history here"
                    : "No items match your current filters"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={cn(
                  "cursor-pointer hover:shadow-md transition-shadow",
                  selectedItems.includes(item.id) && "ring-2 ring-primary"
                )}
                onClick={() => toggleItemSelection(item.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(item.type)}</span>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Search className="w-4 h-4 mr-1" />
                        Query: "{item.query}"
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredItems.length > 0 && filteredItems.length % 20 === 0 && (
          <div className="text-center">
            <Button variant="outline" onClick={fetchHistory}>
              Load More History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}