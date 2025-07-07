'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/forms/search-bar';
import { InfoCard } from '@/components/features/info-card';
import NutritionDisplay from '@/components/features/nutrition-display';
import { useAuth } from '@/components/auth/auth-provider';
import { useNutrition } from '@/hooks/use-nutrition';
import { TrendingUp, Star, Clock, BookOpen, Camera, Zap, AlertTriangle } from 'lucide-react';
import { NutritionAnalysis, SearchFilter } from '@/types';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const POPULAR_SEARCHES = [
  'chicken breast nutrition',
  'avocado benefits',
  'protein powder',
  'quinoa vs rice',
  'keto diet myths',
  'vitamin d deficiency'
];

const FEATURED_MYTHS = [
  {
    id: '1',
    title: 'Does eating fat make you fat?',
    description: 'Exploring the relationship between dietary fat and body weight',
    factCheck: 'false' as const,
    category: 'Weight Loss',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Are carbs bad for you?',
    description: 'Understanding the role of carbohydrates in a healthy diet',
    factCheck: 'partial' as const,
    category: 'Macronutrients',
    lastUpdated: new Date('2024-01-10')
  }
];

export default function DashboardHome() {
  const { user } = useAuth();
  const { analyzeNutrition, isLoading, error, clearError } = useNutrition();
  const [searchResults, setSearchResults] = useState<NutritionAnalysis | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on initial render
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = async (query: string) => {
    // Clear previous results and errors before starting a new search
    setSearchResults(null);
    clearError();
    
    try {
      const result = await analyzeNutrition(query);
      setSearchResults(result);
      
      // Update recent searches
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    } catch (searchError) {
      // The useNutrition hook now handles setting the error state,
      // so we just log it here for debugging.
      console.error('Search error caught in component:', searchError);
    }
  };

  const handlePopularSearch = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.displayName || 'there'}! 👋
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              What would you like to learn about nutrition today?
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="hidden sm:flex">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>

        {/* Main Search */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for nutrition facts, e.g., '1 cup of blueberries'"
          recentSearches={recentSearches}
          className="w-full"
          isLoading={isLoading}
        />
      </div>

      {/* --- NEW: Loading State --- */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 p-12 text-center">
          <LoadingSpinner size={32} />
          <p className="mt-4 text-lg font-semibold text-foreground">Analyzing...</p>
          <p className="mt-1 text-sm text-muted-foreground">Our AI is crunching the numbers. This may take a moment.</p>
        </div>
      )}

      {/* --- NEW: Error State --- */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Analysis Failed:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* --- UPDATED: Search Results --- */}
      {searchResults && !isLoading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Nutrition Analysis</h2>
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Save to Favorites
            </Button>
          </div>
          {/* Pass isLoading=false to ensure the display component doesn't show its own skeleton */}
          <NutritionDisplay data={searchResults} isLoading={false} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Analyze Photo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Take a photo of your meal and get instant nutrition facts
            </p>
            <Button className="w-full mt-3" variant="outline">
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Myth Busting</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get science-backed answers to common nutrition myths
            </p>
            <Button className="w-full mt-3" variant="outline">
              Browse Myths
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">My Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your nutrition learning journey and favorites
            </p>
            <Button className="w-full mt-3" variant="outline">
              View Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Popular Searches */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Popular Searches</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((search, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handlePopularSearch(search)}
            >
              {search}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Myths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Featured Myth-Busting</h2>
          </div>
          <Button variant="outline" size="sm">
            View All Myths
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURED_MYTHS.map((myth) => (
            <InfoCard
              key={myth.id}
              type="myth"
              title={myth.title}
              description={myth.description}
              mythInfo={{
                factCheck: myth.factCheck,
                category: myth.category,
                lastUpdated: myth.lastUpdated
              }}
              question={myth.title}
              answer={myth.description}
              className="hover:scale-105 transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentSearches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Recent Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handlePopularSearch(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}