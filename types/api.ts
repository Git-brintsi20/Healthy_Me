import type { NutritionData } from "./nutrition";
import type { MythData } from "./myth";

export interface ImageNutritionSummary {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ImageAnalysisData {
  detectedFoods: string[];
  confidence: "high" | "medium" | "low";
  description: string;
  nutrition?: ImageNutritionSummary[];
}

export interface AnalyzeNutritionRequest {
  foodName: string;
  servingSize?: string;
}

export interface AnalyzeNutritionResponse extends NutritionData {}

export interface MythBustRequest {
  myth: string;
}

export interface MythBustResponse extends MythData {}


