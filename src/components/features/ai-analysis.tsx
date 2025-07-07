'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Brain, Zap, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NutritionAnalysis {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  healthBenefits: string[];
  allergens: string[];
  servingSize: string;
  confidence: number;
}

interface MythAnalysis {
  claim: string;
  verdict: 'myth' | 'fact' | 'partially_true';
  explanation: string;
  scientificEvidence: string;
  sources: string[];
  confidence: number;
  category: string;
}

interface ImageAnalysis {
  identifiedFoods: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
  overallConfidence: number;
  suggestions: string[];
}

interface AIAnalysisProps {
  type: 'nutrition' | 'myth' | 'image';
  input?: string;
  imageFile?: File;
  onAnalysisComplete?: (result: any) => void;
}

export default function AIAnalysis({ type, input, imageFile, onAnalysisComplete }: AIAnalysisProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | MythAnalysis | ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeNutrition = useCallback(async (foodItem: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodItem }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze nutrition');
      }

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [onAnalysisComplete]);

  const analyzeMythClaim = useCallback(async (claim: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/myths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claim }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze myth claim');
      }

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [onAnalysisComplete]);

  const analyzeImage = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [onAnalysisComplete]);

  const handleAnalyze = useCallback(() => {
    if (type === 'nutrition' && input) {
      analyzeNutrition(input);
    } else if (type === 'myth' && input) {
      analyzeMythClaim(input);
    } else if (type === 'image' && imageFile) {
      analyzeImage(imageFile);
    }
  }, [type, input, imageFile, analyzeNutrition, analyzeMythClaim, analyzeImage]);

  const renderVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'fact':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'myth':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'partially_true':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderVerdictBadge = (verdict: string) => {
    const variants = {
      fact: 'default',
      myth: 'destructive',
      partially_true: 'secondary',
    };
    return (
      <Badge variant={variants[verdict as keyof typeof variants] || 'outline'}>
        {verdict.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI-Powered Analysis
        </CardTitle>
        <CardDescription>
          Advanced analysis using Google Cloud AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Analysis Trigger */}
          <div className="flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={loading || (!input && !imageFile)}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4">
              {/* Nutrition Analysis Results */}
              {type === 'nutrition' && 'calories' in analysis && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="macros">Macros</TabsTrigger>
                    <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
                    <TabsTrigger value="minerals">Minerals</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{analysis.foodName}</CardTitle>
                          <CardDescription>Per {analysis.servingSize}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">
                            {analysis.calories} cal
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Progress value={analysis.confidence * 100} className="mb-2" />
                          <div className="text-sm text-muted-foreground">
                            {Math.round(analysis.confidence * 100)}% accurate
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {analysis.healthBenefits.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Health Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.healthBenefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {analysis.allergens.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Allergens
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.allergens.map((allergen, index) => (
                              <Badge key={index} variant="destructive">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="macros">
                    <Card>
                      <CardHeader>
                        <CardTitle>Macronutrients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Protein</span>
                              <span className="font-semibold">{analysis.macros.protein}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Carbs</span>
                              <span className="font-semibold">{analysis.macros.carbs}g</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Fat</span>
                              <span className="font-semibold">{analysis.macros.fat}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fiber</span>
                              <span className="font-semibold">{analysis.macros.fiber}g</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="vitamins">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vitamins</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(analysis.vitamins).map(([vitamin, value]) => (
                            <div key={vitamin} className="flex justify-between text-sm">
                              <span className="capitalize">{vitamin.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span>{value}mg</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="minerals">
                    <Card>
                      <CardHeader>
                        <CardTitle>Minerals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(analysis.minerals).map(([mineral, value]) => (
                            <div key={mineral} className="flex justify-between text-sm">
                              <span className="capitalize">{mineral}</span>
                              <span>{value}mg</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {/* Myth Analysis Results */}
              {type === 'myth' && 'verdict' in analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {renderVerdictIcon(analysis.verdict)}
                      Fact Check Results
                    </CardTitle>
                    <CardDescription>
                      {renderVerdictBadge(analysis.verdict)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Claim:</h4>
                      <p className="text-sm text-muted-foreground">{analysis.claim}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-sm">{analysis.explanation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Scientific Evidence:</h4>
                      <p className="text-sm">{analysis.scientificEvidence}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{analysis.category}</Badge>
                      <div className="flex items-center gap-2">
                        <Progress value={analysis.confidence * 100} className="w-20" />
                        <span className="text-sm">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    </div>
                    
                    {analysis.sources.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Sources:</h4>
                        <ul className="text-sm space-y-1">
                          {analysis.sources.map((source, index) => (
                            <li key={index} className="text-muted-foreground">
                              • {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Image Analysis Results */}
              {type === 'image' && 'identifiedFoods' in analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Image Analysis Results</CardTitle>
                    <CardDescription>
                      Overall confidence: {Math.round(analysis.overallConfidence * 100)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Identified Foods:</h4>
                      <div className="space-y-2">
                        {analysis.identifiedFoods.map((food, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{food.name}</span>
                              <p className="text-sm text-muted-foreground">{food.description}</p>
                            </div>
                            <Badge variant="secondary">
                              {Math.round(food.confidence * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {analysis.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Suggestions:</h4>
                        <ul className="text-sm space-y-1">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-muted-foreground">
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}