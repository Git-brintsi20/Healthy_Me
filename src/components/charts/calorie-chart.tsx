// src/components/charts/calorie-chart.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  ReferenceLine
} from 'recharts';
import { designTokens } from '@/lib/design-tokens';
import { BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface CalorieData {
  date: string;
  calories: number;
  target: number;
  foods: string[];
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}

interface CalorieChartProps extends BaseComponentProps {
  data: CalorieData[];
  targetCalories?: number;
  viewType?: 'line' | 'area';
  showTarget?: boolean;
  timeRange?: '7d' | '30d' | '90d';
  height?: number;
}

const CalorieChart: React.FC<CalorieChartProps> = ({
  data,
  targetCalories = 2000,
  viewType = 'area',
  showTarget = true,
  timeRange = '7d',
  height = 400,
  className,
}) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;

    const totalCalories = data.reduce((sum, day) => sum + day.calories, 0);
    const averageCalories = Math.round(totalCalories / data.length);
    const maxCalories = Math.max(...data.map(d => d.calories));
    const minCalories = Math.min(...data.map(d => d.calories));
    const daysOverTarget = data.filter(d => d.calories > targetCalories).length;
    const daysUnderTarget = data.filter(d => d.calories < targetCalories).length;

    return {
      average: averageCalories,
      max: maxCalories,
      min: minCalories,
      total: totalCalories,
      daysOverTarget,
      daysUnderTarget,
      onTargetDays: data.length - daysOverTarget - daysUnderTarget
    };
  }, [data, targetCalories]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const calorieData = payload[0];
      const targetData = payload.find((p: any) => p.dataKey === 'target');
      
      return (
        <div className="bg-card border rounded-lg p-4 shadow-lg min-w-[200px]">
          <p className="font-semibold text-foreground mb-2">{formatDate(label)}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Calories:</span>
              <span className="font-medium" style={{ color: calorieData.color }}>
                {calorieData.value}
              </span>
            </div>
            {targetData && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Target:</span>
                <span className="font-medium text-muted-foreground">
                  {targetData.value}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Difference:</span>
              <span className={cn(
                "font-medium text-sm",
                calorieData.value > targetCalories ? "text-orange-600" : "text-green-600"
              )}>
                {calorieData.value > targetCalories ? '+' : ''}
                {calorieData.value - targetCalories}
              </span>
            </div>
          </div>
          
          {/* Meal breakdown */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Meal Breakdown:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Breakfast: {data.meals.breakfast}</div>
              <div>Lunch: {data.meals.lunch}</div>
              <div>Dinner: {data.meals.dinner}</div>
              <div>Snacks: {data.meals.snacks}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>Daily Calorie Intake</CardTitle>
          <CardDescription>No calorie data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Start tracking your meals to see your calorie trends
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">Daily Calorie Intake</CardTitle>
            <CardDescription>
              {timeRange === '7d' && 'Last 7 days'}
              {timeRange === '30d' && 'Last 30 days'}
              {timeRange === '90d' && 'Last 90 days'}
            </CardDescription>
          </div>
          {stats && (
            <div className="flex gap-2">
              <Badge variant="outline">
                Avg: {stats.average} cal
              </Badge>
              <Badge 
                variant={stats.daysOverTarget > stats.daysUnderTarget ? "secondary" : "default"}
              >
                {stats.daysOverTarget} over target
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'area' ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatDate}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {showTarget && (
                  <ReferenceLine 
                    y={targetCalories} 
                    stroke={designTokens.colors.status.info}
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "insideTopRight" }}
                  />
                )}
                
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke={designTokens.colors.primary[600]}
                  fill={designTokens.colors.primary[100]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: designTokens.colors.primary[600] }}
                  activeDot={{ r: 6, fill: designTokens.colors.primary[600] }}
                />
                
                {showTarget && (
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="transparent"
                    fill="transparent"
                    strokeWidth={0}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatDate}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {showTarget && (
                  <ReferenceLine 
                    y={targetCalories} 
                    stroke={designTokens.colors.status.info}
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "insideTopRight" }}
                  />
                )}
                
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke={designTokens.colors.primary[600]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: designTokens.colors.primary[600] }}
                  activeDot={{ r: 6, fill: designTokens.colors.primary[600] }}
                />
                
                {showTarget && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="transparent"
                    strokeWidth={0}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Statistics Summary */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{stats.average}</div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{stats.max}</div>
              <div className="text-sm text-muted-foreground">Highest Day</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{stats.min}</div>
              <div className="text-sm text-muted-foreground">Lowest Day</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(((stats.average - targetCalories) / targetCalories) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">vs Target</div>
            </div>
          </div>
        )}

        {/* Weekly Progress */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3">Weekly Progress</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.daysUnderTarget}</div>
              <div className="text-muted-foreground">Days Under Target</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.onTargetDays}</div>
              <div className="text-muted-foreground">Days On Target</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.daysOverTarget}</div>
              <div className="text-muted-foreground">Days Over Target</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieChart;