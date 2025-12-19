export interface NutritionData {
  name: string;
  servingSize: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  vitamins: Array<{
    name: string;
    amount: string;
    dailyValue: number;
  }>;
  minerals: Array<{
    name: string;
    amount: string;
    dailyValue: number;
  }>;
}

export interface MythData {
  question?: string;
  verdict: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "INCONCLUSIVE";
  explanation: string;
  keyPoints: string[];
  sources: Array<{
    title: string;
    authors?: string;
    publication: string;
    year: number;
    url: string;
    summary: string;
  }>;
  recommendation: string;
}

export interface ImageAnalysisData {
  detectedFoods: string[];
  confidence: "high" | "medium" | "low";
  description: string;
  nutrition?: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }>;
}
