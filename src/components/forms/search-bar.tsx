// src/components/forms/search-bar.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDebounce } from '@/hooks/use-debounce';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase';
import gemini from '@/lib/gemini';

export interface SearchBarProps {
  onSearch: (query: string, filter?: SearchFilter) => void;
  placeholder?: string;
  initialQuery?: string;
  className?: string;
  showFilters?: boolean;
  recentSearches?: string[];
}

export type SearchFilter = 'all' | 'nutrition' | 'myths' | 'recipes';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggestion' | 'popular';
  category?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search for nutrition facts, myths, or recipes...",
  initialQuery = "",
  className,
  showFilters = true,
  recentSearches = []
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions = [
    { value: 'all' as SearchFilter, label: 'All', icon: Search },
    { value: 'nutrition' as SearchFilter, label: 'Nutrition', icon: Search },
    { value: 'myths' as SearchFilter, label: 'Myths', icon: Search },
    { value: 'recipes' as SearchFilter, label: 'Recipes', icon: Search }
  ];

  // Generate suggestions based on query
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      generateSuggestions(debouncedQuery);
    } else {
      setSuggestions(getRecentAndPopularSuggestions());
    }
  }, [debouncedQuery]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRecentAndPopularSuggestions = (): SearchSuggestion[] => {
    const recent = recentSearches.slice(0, 3).map((search, index) => ({
      id: `recent-${index}`,
      text: search,
      type: 'recent' as const
    }));

    const popular = [
      { id: 'pop-1', text: 'protein powder benefits', type: 'popular' as const, category: 'nutrition' },
      { id: 'pop-2', text: 'carbs make you fat myth', type: 'popular' as const, category: 'myths' },
      { id: 'pop-3', text: 'high protein breakfast', type: 'popular' as const, category: 'recipes' },
      { id: 'pop-4', text: 'vitamin D deficiency', type: 'popular' as const, category: 'nutrition' }
    ];

    return [...recent, ...popular];
  };

  const generateSuggestions = async (searchQuery: string) => {
    setIsGeneratingSuggestions(true);
    
    try {
      // Get AI-powered suggestions
      const aiSuggestions = await gemini.generateSearchSuggestions(searchQuery);
      
      // Get suggestions from Firestore
      const firestoreSuggestions = await getFirestoreSuggestions(searchQuery);
      
      // Combine and format suggestions
      const allSuggestions: SearchSuggestion[] = [
        ...firestoreSuggestions,
        ...aiSuggestions.map((suggestion, index) => ({
          id: `ai-${index}`,
          text: suggestion,
          type: 'suggestion' as const
        }))
      ];

      setSuggestions(allSuggestions.slice(0, 8)); // Limit to 8 suggestions
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions(getRecentAndPopularSuggestions());
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const getFirestoreSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    try {
      const suggestions: SearchSuggestion[] = [];
      
      // Search in nutrition facts
      const nutritionQuery = query(
        collection(db, COLLECTIONS.NUTRITION_FACTS),
        where('foodName', '>=', searchQuery),
        where('foodName', '<=', searchQuery + '\uf8ff'),
        orderBy('foodName'),
        limit(3)
      );
      
      const nutritionDocs = await getDocs(nutritionQuery);
      nutritionDocs.forEach(doc => {
        const data = doc.data();
        suggestions.push({
          id: `nutrition-${doc.id}`,
          text: data.foodName,
          type: 'suggestion',
          category: 'nutrition'
        });
      });

      // Search in myths
      const mythQuery = query(
        collection(db, COLLECTIONS.MYTHS),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff'),
        orderBy('title'),
        limit(3)
      );
      
      const mythDocs = await getDocs(mythQuery);
      mythDocs.forEach(doc => {
        const data = doc.data();
        suggestions.push({
          id: `myth-${doc.id}`,
          text: data.title,
          type: 'suggestion',
          category: 'myths'
        });
      });

      return suggestions;
    } catch (error) {
      console.error('Error fetching Firestore suggestions:', error);
      return [];
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      onSearch(searchQuery.trim(), filter);
      setShowSuggestions(false);
      
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFilterChange = (newFilter: SearchFilter) => {
    setFilter(newFilter);
    if (query.trim()) {
      handleSearch();
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'popular':
        return <Search className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-base"
          disabled={isLoading}
        />
        
        {/* Clear and Search buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            size="sm"
            className="h-8"
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center space-x-2 mt-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            {filterOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filter === option.value ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            {isGeneratingSuggestions && (
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-2 text-sm text-muted-foreground">Generating suggestions...</span>
              </div>
            )}
            
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {getSuggestionIcon(suggestion.type)}
                <span className="flex-1 text-sm">{suggestion.text}</span>
                {suggestion.category && (
                  <Badge variant="outline" className="text-xs">
                    {suggestion.category}
                  </Badge>
                )}
                {suggestion.type === 'recent' && (
                  <Badge variant="secondary" className="text-xs">
                    Recent
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}