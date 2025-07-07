// src/components/features/nutrition-display.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { designTokens } from '@/lib/design-tokens';
import { NutritionAnalysis, BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface NutritionDisplayProps extends BaseComponentProps {
  data: NutritionAnalysis;
  isLoading?: boolean;
  showDetails?: boolean;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  data,
  isLoading = false,
  showDetails = true,
  className,
}) => {
  if (isLoading) {
    return (
      <Card variant="nutrition" className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const macroData = [
    { name: 'Protein', value: data.macros.protein, color: designTokens.colors.nutrition.protein, unit: 'g' },
    { name: 'Carbs', value: data.macros.carbs, color: designTokens.colors.nutrition.carbs, unit: 'g' },
    { name: 'Fat', value: data.macros.fat, color: designTokens.colors.nutrition.fat, unit: 'g' },
    { name: 'Fiber', value: data.macros.fiber, color: designTokens.colors.nutrition.fiber, unit: 'g' },
  ];

  const totalMacros = data.macros.protein + data.macros.carbs + data.macros.fat;

  return (
    <Card variant="nutrition" className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {data.foodName}
            </CardTitle>
            <CardDescription className="text-base">
              {data.servingSize} • {data.calories} calories
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={data.confidence > 0.8 ? "default" : "secondary"}
              className="font-medium"
            >
              {Math.round(data.confidence * 100)}% confidence
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Macronutrients Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Macronutrients</h3>
          <div className="grid grid-cols-2 gap-4">
            {macroData.map((macro) => (
              <div key={macro.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{macro.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {macro.value}{macro.unit}
                  </span>
                </div>
                <Progress 
                  value={totalMacros > 0 ? (macro.value / totalMacros) * 100 : 0}
                  className="h-2"
                  style={{ 
                    '--progress-background': macro.color,
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Vitamins & Minerals */}
        {showDetails && (
          <>
            {Object.keys(data.vitamins).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Vitamins</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(data.vitamins).map(([vitamin, value]) => (
                    <div key={vitamin} className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-foreground">{vitamin}</div>
                      <div className="text-xs text-muted-foreground">{value}mg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(data.minerals).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Minerals</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(data.minerals).map(([mineral, value]) => (
                    <div key={mineral} className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-foreground">{mineral}</div>
                      <div className="text-xs text-muted-foreground">{value}mg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Benefits */}
            {data.healthBenefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Health Benefits</h3>
                <div className="space-y-2">
                  {data.healthBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {data.allergens.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {data.allergens.map((allergen, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Calories Visualization */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">{data.calories}</span>
              <span className="text-sm text-muted-foreground ml-1">calories</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Per serving</div>
              <div className="text-sm font-medium text-foreground">{data.servingSize}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionDisplay;