"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface MacroChartProps {
  protein: number
  carbs: number
  fats: number
}

const COLORS = {
  protein: "#3b82f6", // blue
  carbs: "#10b981",   // green
  fats: "#f59e0b",    // yellow
}

export function MacroChart({ protein, carbs, fats }: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein, color: COLORS.protein },
    { name: "Carbs", value: carbs, color: COLORS.carbs },
    { name: "Fats", value: fats, color: COLORS.fats },
  ]

  const total = protein + carbs + fats

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-muted-foreground mb-4">
        Macronutrient Distribution
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => {
              const percentage = ((value / total) * 100).toFixed(0)
              return `${name}: ${percentage}%`
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value}g`}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
