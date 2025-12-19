import { useState } from "react";
import { NutritionData } from "@/types";

export function useNutrition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NutritionData | null>(null);

  const analyzeFood = async (foodName: string, servingSize: string = "100g") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName, servingSize }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze food");
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeFood, loading, error, data };
}
