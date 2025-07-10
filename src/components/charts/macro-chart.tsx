// src/components/charts/macro-chart.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  StackedBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { designTokens } from '@/lib/design-tokens';
import { BaseComponentProps } from '@/types';
import { cn } from '@/lib/utils';

interface MacroData {
  date: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  totalCalories: number;
}

interface MacroTarget {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber: number;   // grams
}

interface MacroChartProps extends BaseComponentProps {
  data: MacroData[];
  targets?: MacroTarget;
  viewType?: 'stacked' | 'pie' | 'progress';
  showTargets?: boolean;
  height?: number;
}

const MacroChart: React.FC<MacroChartProps> = ({
  data,
  targets = { protein: 150, carbs: 250, fat: 80, fiber: 25 },
  viewType = 'stacked',
  showTargets = true,
  height = 400,
  className,
}) => {
  // Calculate latest day data for pie chart and progress view
  const latestData = data.length > 0 ? data[data.length - 1] : null;
  
  // Prepare pie chart data
  const pieData = React.useMemo(() => {
    if (!latestData) return [];
    
    return [
      {
        name: 'Protein',
        value: latestData.protein,
        calories: latestData.protein * 4,
        color: designTokens.colors.nutrition.protein,
        target: targets.protein
      },
      {
        name: 'Carbs',
        value: latestData.carbs,
        calories: latestData.carbs * 4,
        color: designTokens.colors.nutrition.carbs,
        target: targets.carbs
      },
      {
        name: 'Fat',
        value: latestData.fat,
        calories: latestData.fat * 9,
        color: designTokens.colors.nutrition.fat,
        target: targets.fat
      },
      {
        name: 'Fiber',
        value: latestData.fiber,
        calories: latestData.fiber * 2,
        color: designTokens.colors.nutrition.fiber,
        target: targets.fiber
      }
    ];
  }, [latestData, targets]);

  // Calculate averages and statistics
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;

    const totals = data.reduce((acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fat: acc.fat + day.fat,
      fiber: acc.fiber + day.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const averages = {
      protein: Math.round(totals.protein / data.length),
      carbs: Math.round(totals.carbs / data.length),
      fat: Math.round(totals.fat / data.length),
      fiber: Math.round(totals.fiber / data.length)
    };

    return {
      averages,
      totals,
      daysCount: data.length
    };
  }, [data]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Custom tooltip for stacked bar chart
  const CustomStackedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const day = payload[0].payload;
      
      return (
        <div className="bg-card border rounded-lg p-4 shadow-lg min-w-[200px]">
          <p className="font-semibold text-foreground mb-2">{formatDate(label)}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: entry.color }}>
                  {entry.dataKey}:
                </span>
                <span className="font-medium" style={{ color: entry.color }}>
                  {entry.value}g
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Calories:</span>
              <span className="font-medium text-foreground">
                {day.totalCalories}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalCalories = pieData.reduce((sum, item) => sum + item.calories, 0);
      const percentage = totalCalories > 0 ? Math.round((data.calories / totalCalories) * 100) : 0;
      
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}g • {data.calories} cal ({percentage}%)
          </p>
          {showTargets && (
            <p className="text-xs text-muted-foreground">
              Target: {data.target}g
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
       <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>Macronutrient Breakdown</CardTitle>
          <CardDescription>No data available to display.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Please provide data to render the chart.</p>
        </CardContent>
      </Card>
    );
  }

  // Stacked Bar Chart View
  const renderStackedBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <StackedBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip content={<CustomStackedTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
        <Legend />
        <Bar dataKey="protein" stackId="a" fill={designTokens.colors.nutrition.protein} name="Protein" />
        <Bar dataKey="carbs" stackId="a" fill={designTokens.colors.nutrition.carbs} name="Carbs" />
        <Bar dataKey="fat" stackId="a" fill={designTokens.colors.nutrition.fat} name="Fat" />
        <Bar dataKey="fiber" stackId="a" fill={designTokens.colors.nutrition.fiber} name="Fiber" />
      </StackedBarChart>
    </ResponsiveContainer>
  );

  // Pie Chart View
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="calories"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${ (percent * 100).toFixed(0) }%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  // Progress View
  const renderProgressView = () => (
    <div className="space-y-4">
      {pieData.map((macro) => (
        <div key={macro.name}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">{macro.name}</span>
            <span className="text-sm text-muted-foreground">
              {macro.value}g / {macro.target}g
            </span>
          </div>
          <Progress
            value={(macro.value / macro.target) * 100}
            className="h-3"
            indicatorClassName={cn({
              'bg-nutrition-protein': macro.name === 'Protein',
              'bg-nutrition-carbs': macro.name === 'Carbs',
              'bg-nutrition-fat': macro.name === 'Fat',
              'bg-nutrition-fiber': macro.name === 'Fiber',
            })}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Macronutrient Breakdown</CardTitle>
            <CardDescription>
              {viewType === 'stacked'
                ? `Daily intake over the last ${stats?.daysCount} days`
                : `Today's intake vs. your targets`}
            </CardDescription>
          </div>
          {stats && (
            <Badge variant="outline">
              Avg Calories: {Math.round(stats.averages.protein * 4 + stats.averages.carbs * 4 + stats.averages.fat * 9)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {viewType === 'stacked' && renderStackedBarChart()}
        {viewType === 'pie' && renderPieChart()}
        {view.type === 'progress' && renderProgressView()}
      </CardContent>
    </Card>
  );
};

export default MacroChart;