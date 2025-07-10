'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Heart, 
  Target, 
  Zap, 
  Loader2, 
  RefreshCw,
  BookOpen,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface UserPreferences {
  dietaryRestrictions: string[];
  healthGoals: string[];
  dislikedFoods: string[];
  activityLevel?: 'low' | 'moderate' | 'high';
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

interface RecommendationData {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'lifestyle' | 'food';
  priority: 'high' | 'medium' | 'low';
  personalizedFor: string[];
  tips: string[];
  benefits: string[];
  timeframe?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  source?: string;
}

interface RecommendationCardProps {
  userPreferences?: UserPreferences;
  recommendations?: RecommendationData[];
  onRecommendationUpdate?: (recommendations: RecommendationData[]) => void;
  maxRecommendations?: number;
  showRefresh?: boolean;
}

export default function RecommendationCard({
  userPreferences,
  recommendations: propRecommendations,
  onRecommendationUpdate,
  maxRecommendations = 5,
  showRefresh = true
}: RecommendationCardProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(propRecommendations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Default preferences if none provided
  const defaultPreferences: UserPreferences = {
    dietaryRestrictions: [],
    healthGoals: ['general_health'],
    dislikedFoods: [],
    activityLevel: 'moderate',
  };

  const effectivePreferences = userPreferences || defaultPreferences;

  const generateRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userPreferences: effectivePreferences,
          maxRecommendations,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recommendations');
      }

      const data = await response.json();
      
      if (data.success) {
        const newRecommendations = data.recommendations.map((rec: any, index: number) => ({
          id: `rec_${Date.now()}_${index}`,
          title: rec.title || `Recommendation ${index + 1}`,
          description: rec.description || rec.content || rec,
          category: rec.category || 'nutrition',
          priority: rec.priority || 'medium',
          personalizedFor: rec.personalizedFor || effectivePreferences.healthGoals,
          tips: rec.tips || [],
          benefits: rec.benefits || [],
          timeframe: rec.timeframe,
          difficulty: rec.difficulty,
          source: rec.source || 'AI Generated',
        }));

        setRecommendations(newRecommendations);
        setLastUpdated(new Date());
        onRecommendationUpdate?.(newRecommendations);
      } else {
        throw new Error(data.error || 'Failed to generate recommendations');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate recommendations on mount if none provided
  useEffect(() => {
    if (!propRecommendations && user && recommendations.length === 0) {
      generateRecommendations();
    }
  }, [user, propRecommendations]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Target className="w-4 h-4" />;
      case 'exercise':
        return <TrendingUp className="w-4 h-4" />;
      case 'lifestyle':
        return <Heart className="w-4 h-4" />;
      case 'food':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exercise':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lifestyle':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'food':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRecommendationCard = (recommendation: RecommendationData) => (
    <Card key={recommendation.id} className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${getCategoryColor(recommendation.category)}`}>
              {getCategoryIcon(recommendation.category)}
            </div>
            <div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getPriorityColor(recommendation.priority)}>
                  {recommendation.priority} priority
                </Badge>
                {recommendation.difficulty && (
                  <Badge variant="outline" className={getDifficultyColor(recommendation.difficulty)}>
                    {recommendation.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {recommendation.description}
        </p>

        {recommendation.personalizedFor.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recommendation.personalizedFor.map((goal, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                {goal.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        )}

        {recommendation.tips.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Tips:</h4>
            <ul className="text-sm space-y-1">
              {recommendation.tips.slice(0, 3).map((tip, index) => (
                <li key={index} className="text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Benefits:
            </h4>
            <div className="flex flex-wrap gap-1">
              {recommendation.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {recommendation.timeframe && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recommendation.timeframe}
            </div>
          )}
          {recommendation.source && (
            <div className="text-right">
              {recommendation.source}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Personalized Recommendations
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered suggestions based on your preferences and goals
              </p>
            </div>
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateRecommendations}
                disabled={loading || !user}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {loading ? 'Generating...' : 'Refresh'}
              </Button>
            )}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* User Preferences Summary */}
          {effectivePreferences && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Your Preferences:</h4>
              <div className="space-y-2">
                {effectivePreferences.healthGoals.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Goals:</span>
                    <div className="flex flex-wrap gap-1">
                      {effectivePreferences.healthGoals.map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {effectivePreferences.dietaryRestrictions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Dietary:</span>
                    <div className="flex flex-wrap gap-1">
                      {effectivePreferences.dietaryRestrictions.map((restriction, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {loading && recommendations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Generating personalized recommendations...
                </p>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map(renderRecommendationCard)}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No recommendations available yet.
              </p>
              {user && (
                <Button onClick={generateRecommendations} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate Recommendations
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}