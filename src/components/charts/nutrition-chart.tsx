// src/components/charts/nutrition-chart.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { designTokens } from '@/lib/design-tokens';
import { NutritionAnalysis, BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface NutritionChartProps extends BaseComponentProps {
  data: NutritionAnalysis[];
  viewType?: 'pie' | 'bar';
  showLegend?: boolean;
  height?: number;
}

const NutritionChart: React.FC<NutritionChartProps> = ({
  data,
  viewType = 'pie',
  showLegend = true,
  height = 400,
  className,
}) => {
  // Prepare data for charts
  const prepareNutritionData = (analysis: NutritionAnalysis) => {
    const macroData = [
      {
        name: 'Protein',
        value: analysis.macros.protein,
        color: designTokens.colors.nutrition.protein,
        calories: analysis.macros.protein * 4, // 4 calories per gram
        percentage: 0
      },
      {
        name: 'Carbs',
        value: analysis.macros.carbs,
        color: designTokens.colors.nutrition.carbs,
        calories: analysis.macros.carbs * 4, // 4 calories per gram
        percentage: 0
      },
      {
        name: 'Fat',
        value: analysis.macros.fat,
        color: designTokens.colors.nutrition.fat,
        calories: analysis.macros.fat * 9, // 9 calories per gram
        percentage: 0
      },
      {
        name: 'Fiber',
        value: analysis.macros.fiber,
        color: designTokens.colors.nutrition.fiber,
        calories: analysis.macros.fiber * 2, // 2 calories per gram
        percentage: 0
      }
    ];

    // Calculate percentages
    const totalCalories = macroData.reduce((sum, item) => sum + item.calories, 0);
    macroData.forEach(item => {
      item.percentage = totalCalories > 0 ? Math.round((item.calories / totalCalories) * 100) : 0;
    });

    return macroData;
  };

  // For multiple foods comparison
  const prepareComparisonData = () => {
    return data.map(analysis => ({
      name: analysis.foodName,
      protein: analysis.macros.protein,
      carbs: analysis.macros.carbs,
      fat: analysis.macros.fat,
      fiber: analysis.macros.fiber,
      calories: analysis.calories
    }));
  };

  const singleFoodData = data.length > 0 ? prepareNutritionData(data[0]) : [];
  const comparisonData = prepareComparisonData();

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}g • {data.calories} cal ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}g
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>Nutrition Breakdown</CardTitle>
          <CardDescription>No nutrition data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {data.length === 1 ? 'Macronutrient Breakdown' : 'Nutrition Comparison'}
        </CardTitle>
        <CardDescription>
          {data.length === 1 
            ? `${data[0].foodName} - ${data[0].servingSize}`
            : `Comparing ${data.length} food items`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div style={{ height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'pie' && data.length === 1 ? (
              <PieChart>
                <Pie
                  data={singleFoodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="calories"
                >
                  {singleFoodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '14px'
                    }}
                  />
                )}
              </PieChart>
            ) : (
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                {showLegend && <Legend />}
                <Bar 
                  dataKey="protein" 
                  fill={designTokens.colors.nutrition.protein}
                  name="Protein (g)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="carbs" 
                  fill={designTokens.colors.nutrition.carbs}
                  name="Carbs (g)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="fat" 
                  fill={designTokens.colors.nutrition.fat}
                  name="Fat (g)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="fiber" 
                  fill={designTokens.colors.nutrition.fiber}
                  name="Fiber (g)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.length === 1 && singleFoodData.map((macro) => (
            <div key={macro.name} className="text-center">
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: macro.color }}
              />
              <div className="text-sm font-medium text-foreground">{macro.name}</div>
              <div className="text-xs text-muted-foreground">
                {macro.value}g ({macro.percentage}%)
              </div>
            </div>
          ))}
          
          {data.length > 1 && (
            <>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {data.reduce((sum, item) => sum + item.calories, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {data.reduce((sum, item) => sum + item.macros.protein, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Total Protein</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {data.reduce((sum, item) => sum + item.macros.carbs, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Total Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {data.reduce((sum, item) => sum + item.macros.fat, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Total Fat</div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;