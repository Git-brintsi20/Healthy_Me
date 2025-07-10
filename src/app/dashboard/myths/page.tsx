// app/(dashboard)/myths/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/forms/search-bar';
import { InfoCard } from '@/components/features/info-card';
import { useMyths } from '@/hooks/use-myths';
import { Search, Filter, TrendingUp, BookOpen, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { MythInfo, SearchFilter } from '@/types';

const MYTH_CATEGORIES = [
  'All',
  'Weight Loss',
  'Macronutrients',
  'Vitamins',
  'Supplements',
  'Diet Plans',
  'Exercise',
  'Metabolism'
];

const FACT_CHECK_FILTERS = [
  { value: 'all', label: 'All', icon: Search },
  { value: 'true', label: 'True', icon: CheckCircle, color: 'text-green-600' },
  { value: 'false', label: 'False', icon: XCircle, color: 'text-red-600' },
  { value: 'partial', label: 'Partial', icon: AlertCircle, color: 'text-yellow-600' },
  { value: 'unverified', label: 'Unverified', icon: HelpCircle, color: 'text-gray-600' }
];

const SAMPLE_MYTHS = [
  {
    id: '1',
    title: 'Does eating fat make you fat?',
    description: 'A comprehensive look at the relationship between dietary fat and body weight gain',
    question: 'I heard that eating fat makes you gain weight. Is this true?',
    answer: 'This is largely false. Dietary fat doesn\'t directly cause weight gain - excess calories do. Fat is actually essential for hormone production, nutrient absorption, and satiety. The key is consuming healthy fats in appropriate portions.',
    mythInfo: {
      factCheck: 'false' as const,
      evidence: 'Multiple studies show that diets high in healthy fats can actually support weight management when calories are controlled.',
      sources: [
        'American Journal of Clinical Nutrition, 2018',
        'Harvard T.H. Chan School of Public Health',
        'New England Journal of Medicine, 2019'
      ],
      category: 'Weight Loss',
      lastUpdated: new Date('2024-01-15')
    },
    imageUrl: '/images/healthy-fats.jpg'
  },
  {
    id: '2',
    title: 'Are carbs bad for you?',
    description: 'Understanding the role of carbohydrates in a healthy diet',
    question: 'Should I avoid carbs to be healthy?',
    answer: 'This is partially true. Not all carbs are created equal. Simple, refined carbs can contribute to health issues, but complex carbs from whole foods are essential for energy and provide important nutrients and fiber.',
    mythInfo: {
      factCheck: 'partial' as const,
      evidence: 'Research shows that whole grain carbohydrates are associated with reduced risk of heart disease and diabetes.',
      sources: [
        'Nutrients Journal, 2020',
        'American Heart Association Guidelines',
        'Diabetologia, 2019'
      ],
      category: 'Macronutrients',
      lastUpdated: new Date('2024-01-12')
    },
    imageUrl: '/images/whole-grains.jpg'
  },
  {
    id: '3',
    title: 'Do you need to eat every 2-3 hours to boost metabolism?',
    description: 'Examining the myth about frequent meals and metabolic rate',
    question: 'Does eating frequently boost your metabolism?',
    answer: 'This is false. Meal frequency doesn\'t significantly impact metabolic rate. Total calorie intake and the thermic effect of food remain constant regardless of how often you eat.',
    mythInfo: {
      factCheck: 'false' as const,
      evidence: 'Studies comparing different meal frequencies show no significant difference in metabolic rate or weight loss.',
      sources: [
        'British Journal of Nutrition, 2017',
        'American Journal of Clinical Nutrition, 2015',
        'Obesity Reviews, 2019'
      ],
      category: 'Metabolism',
      lastUpdated: new Date('2024-01-10')
    },
    imageUrl: '/images/meal-timing.jpg'
  },
  {
    id: '4',
    title: 'Is detox tea effective for weight loss?',
    description: 'Analyzing the claims about detox teas and their weight loss benefits',
    question: 'Can detox teas help me lose weight quickly?',
    answer: 'This is largely false. Detox teas may cause temporary water weight loss through diuretic effects, but they don\'t burn fat or provide sustainable weight loss. Some may also have harmful side effects.',
    mythInfo: {
      factCheck: 'false' as const,
      evidence: 'No scientific evidence supports detox teas for fat loss. Weight loss is typically water weight that returns quickly.',
      sources: [
        'Journal of Human Nutrition and Dietetics, 2020',
        'FDA Consumer Updates',
        'Clinical Nutrition Reviews, 2018'
      ],
      category: 'Weight Loss',
      lastUpdated: new Date('2024-01-08')
    },
    imageUrl: '/images/detox-tea.jpg'
  }
];

export default function MythsPage() {
  const { myths, isLoading, searchMyths } = useMyths();
  const [filteredMyths, setFilteredMyths] = useState(SAMPLE_MYTHS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [factCheckFilter, setFactCheckFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    filterMyths();
  }, [selectedCategory, factCheckFilter, searchQuery]);

  const filterMyths = () => {
    let filtered = SAMPLE_MYTHS;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(myth => myth.mythInfo.category === selectedCategory);
    }

    // Filter by fact check status
    if (factCheckFilter !== 'all') {
      filtered = filtered.filter(myth => myth.mythInfo.factCheck === factCheckFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(myth => 
        myth.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        myth.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        myth.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        myth.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMyths(filtered);
  };

  const handleSearch = (query: string, filter?: SearchFilter) => {
    setSearchQuery(query);
  };

  const getFactCheckIcon = (status: string) => {
    const filter = FACT_CHECK_FILTERS.find(f => f.value === status);
    if (!filter) return null;
    
    const Icon = filter.icon;
    return <Icon className={`w-4 h-4 ${filter.color}`} />;
  };

  const getFactCheckStats = () => {
    const stats = SAMPLE_MYTHS.reduce((acc, myth) => {
      acc[myth.mythInfo.factCheck] = (acc[myth.mythInfo.factCheck] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  const stats = getFactCheckStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nutrition Myth Busting</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Get science-backed answers to common nutrition myths and misconceptions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="hidden sm:flex">
              <BookOpen className="w-4 h-4 mr-1" />
              {filteredMyths.length} Myths
            </Badge>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search myths, questions, or topics..."
          showFilters={false}
          className="w-full"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FACT_CHECK_FILTERS.slice(1).map((filter) => {
          const Icon = filter.icon;
          const count = stats[filter.value] || 0;
          return (
            <Card key={filter.value} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${filter.color}`} />
                  <div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{filter.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {MYTH_CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Fact Check Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fact Check Status</label>
            <div className="flex flex-wrap gap-2">
              {FACT_CHECK_FILTERS.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Badge
                    key={filter.value}
                    variant={factCheckFilter === filter.value ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => setFactCheckFilter(filter.value)}
                  >
                    <Icon className={`w-3 h-3 mr-1 ${filter.color}`} />
                    {filter.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredMyths.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredMyths.length} Myth{filteredMyths.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Sorted by popularity</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMyths.map((myth) => (
              <InfoCard
                key={myth.id}
                type="myth"
                title={myth.title}
                description={myth.description}
                mythInfo={myth.mythInfo}
                question={myth.question}
                answer={myth.answer}
                imageUrl={myth.imageUrl}
                className="hover:scale-105 transition-transform cursor-pointer"
                onFavorite={() => {
                  // TODO: Implement favorite functionality
                  console.log('Favorited:', myth.id);
                }}
                onShare={() => {
                  // TODO: Implement share functionality
                  console.log('Shared:', myth.id);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">No myths found</CardTitle>
            <CardDescription>
              Try adjusting your filters or search terms to find more myths.
            </CardDescription>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedCategory('All');
                setFactCheckFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}