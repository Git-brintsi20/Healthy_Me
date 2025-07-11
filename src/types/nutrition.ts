// src/types/nutrition.ts

import { Timestamp } from 'firebase/firestore';

// =================================================================
// CORE NUTRITION TYPES
// =================================================================

export interface Macronutrients {
  protein: number;    // grams
  carbs: number;      // grams
  fat: number;        // grams
  fiber: number;      // grams
  sugar: number;      // grams
  saturatedFat: number; // grams
}

export interface Micronutrients {
  sodium: number;     // mg
  potassium: number;  // mg
  calcium: number;    // mg
  iron: number;       // mg
  vitaminC: number;   // mg
  vitaminA: number;   // IU
  vitaminD: number;   // IU
  vitaminB12: number; // mcg
}

export interface NutritionFacts {
  calories: number;
  macros: Macronutrients;
  micros: Micronutrients;
  servingSize: string;
  servingsPerContainer?: number;
}

// =================================================================
// FOOD ITEM TYPES
// =================================================================

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  category: FoodCategory;
  nutrition: NutritionFacts;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  verified: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  category: FoodCategory;
  calories: number;
  servingSize: string;
  confidence: number;
}

// =================================================================
// DIETARY PREFERENCES & RESTRICTIONS
// =================================================================

export const DIETARY_RESTRICTIONS = {
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  GLUTEN_FREE: 'gluten_free',
  DAIRY_FREE: 'dairy_free',
  NUT_FREE: 'nut_free',
  KETO: 'keto',
  PALEO: 'paleo',
  LOW_CARB: 'low_carb',
  LOW_SODIUM: 'low_sodium',
  HALAL: 'halal',
  KOSHER: 'kosher',
} as const;

export type DietaryRestriction = typeof DIETARY_RESTRICTIONS[keyof typeof DIETARY_RESTRICTIONS];

export const ALLERGENS = {
  MILK: 'milk',
  EGGS: 'eggs',
  FISH: 'fish',
  SHELLFISH: 'shellfish',
  TREE_NUTS: 'tree_nuts',
  PEANUTS: 'peanuts',
  WHEAT: 'wheat',
  SOYBEANS: 'soybeans',
  SESAME: 'sesame',
} as const;

export type Allergen = typeof ALLERGENS[keyof typeof ALLERGENS];

export const DIETARY_TAGS = {
  ORGANIC: 'organic',
  NON_GMO: 'non_gmo',
  WHOLE_GRAIN: 'whole_grain',
  HIGH_PROTEIN: 'high_protein',
  LOW_FAT: 'low_fat',
  HIGH_FIBER: 'high_fiber',
  SUGAR_FREE: 'sugar_free',
  FORTIFIED: 'fortified',
} as const;

export type DietaryTag = typeof DIETARY_TAGS[keyof typeof DIETARY_TAGS];

// =================================================================
// FOOD CATEGORIES
// =================================================================

export const FOOD_CATEGORIES = {
  FRUITS: 'fruits',
  VEGETABLES: 'vegetables',
  GRAINS: 'grains',
  PROTEINS: 'proteins',
  DAIRY: 'dairy',
  FATS_OILS: 'fats_oils',
  SNACKS: 'snacks',
  BEVERAGES: 'beverages',
  PREPARED_FOODS: 'prepared_foods',
  SUPPLEMENTS: 'supplements',
} as const;

export type FoodCategory = typeof FOOD_CATEGORIES[keyof typeof FOOD_CATEGORIES];

// =================================================================
// NUTRITION ANALYSIS TYPES
// =================================================================

export interface NutritionAnalysis {
  foodName: string;
  servingSize: string;
  calories: number;
  macros: Macronutrients;
  micros: Micronutrients;
  dailyValuePercentages: DailyValuePercentages;
  healthScore: number; // 0-100
  recommendations: string[];
  warnings: string[];
}

export interface DailyValuePercentages {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  vitaminA: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

// =================================================================
// API RESPONSE TYPES
// =================================================================

export interface NutritionApiResponse {
  success: boolean;
  data?: NutritionAnalysis;
  error?: string;
  confidence?: number;
}

export interface FoodSearchApiResponse {
  success: boolean;
  data?: FoodSearchResult[];
  error?: string;
  totalResults?: number;
  page?: number;
  pageSize?: number;
}

export interface ImageAnalysisResponse {
  success: boolean;
  data?: {
    detectedFoods: DetectedFood[];
    nutritionAnalysis: NutritionAnalysis;
  };
  error?: string;
  confidence?: number;
}

export interface DetectedFood {
  name: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  estimatedQuantity?: string;
}

// =================================================================
// MEAL TRACKING TYPES
// =================================================================

export interface MealEntry {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  mealType: MealType;
  nutrition: NutritionFacts;
  consumedAt: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

export type MealType = typeof MEAL_TYPES[keyof typeof MEAL_TYPES];

export interface DailyNutritionSummary {
  date: string;
  totalCalories: number;
  totalMacros: Macronutrients;
  totalMicros: Micronutrients;
  meals: MealEntry[];
  goals: NutritionGoals;
  achievements: string[];
}

// =================================================================
// CHART DATA TYPES
// =================================================================

export interface MacroChartData {
  name: string;
  value: number;
  color: string;
  calories: number;
  percentage: number;
}

export interface NutritionComparisonData {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calories: number;
}

export interface NutritionTrendData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// =================================================================
// RECIPE TYPES
// =================================================================

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutrition: NutritionFacts;
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: DietaryTag[];
  allergens: Allergen[];
  createdBy: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface RecipeIngredient {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  nutrition: NutritionFacts;
}

// =================================================================
// RECOMMENDATION TYPES
// =================================================================

export interface NutritionRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: RecommendationCategory;
  actionable: boolean;
  dueDate?: Date;
  relatedFoods?: string[];
}

export const RECOMMENDATION_TYPES = {
  INCREASE_PROTEIN: 'increase_protein',
  REDUCE_SODIUM: 'reduce_sodium',
  ADD_FIBER: 'add_fiber',
  BALANCE_MACROS: 'balance_macros',
  HYDRATION: 'hydration',
  VITAMIN_DEFICIENCY: 'vitamin_deficiency',
} as const;

export type RecommendationType = typeof RECOMMENDATION_TYPES[keyof typeof RECOMMENDATION_TYPES];

export const RECOMMENDATION_CATEGORIES = {
  MACROS: 'macros',
  MICROS: 'micros',
  CALORIES: 'calories',
  HYDRATION: 'hydration',
  GENERAL: 'general',
} as const;

export type RecommendationCategory = typeof RECOMMENDATION_CATEGORIES[keyof typeof RECOMMENDATION_CATEGORIES];

// =================================================================
// VALIDATION TYPES
// =================================================================

export interface NutritionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ServingSizeValidation {
  isValid: boolean;
  normalizedSize: string;
  unitType: 'weight' | 'volume' | 'count';
}

// =================================================================
// UTILITY TYPES
// =================================================================

export interface NutritionFormattingOptions {
  showZero?: boolean;
  unitType?: 'metric' | 'imperial';
  decimals?: number;
  showUnit?: boolean;
}

export interface NutritionSearchFilters {
  category?: FoodCategory;
  allergenFree?: Allergen[];
  dietaryTags?: DietaryTag[];
  maxCalories?: number;
  minProtein?: number;
  verified?: boolean;
}

// =================================================================
// CONSTANTS
// =================================================================

export const DAILY_VALUES = {
  CALORIES: 2000,
  PROTEIN: 50,      // grams
  CARBS: 300,       // grams
  FAT: 65,          // grams
  FIBER: 25,        // grams
  SODIUM: 2300,     // mg
  CALCIUM: 1000,    // mg
  IRON: 18,         // mg
  VITAMIN_C: 90,    // mg
  VITAMIN_A: 900,   // mcg
} as const;

export const NUTRITION_COLORS = {
  PROTEIN: '#FF6B6B',
  CARBS: '#4ECDC4',
  FAT: '#45B7D1',
  FIBER: '#96CEB4',
  CALORIES: '#FFEAA7',
  SODIUM: '#DDA0DD',
  CALCIUM: '#98D8C8',
  IRON: '#F7DC6F',
} as const;

// =================================================================
// TYPE GUARDS
// =================================================================

export function isValidNutritionFacts(data: any): data is NutritionFacts {
  return (
    data &&
    typeof data.calories === 'number' &&
    data.macros &&
    typeof data.macros.protein === 'number' &&
    typeof data.macros.carbs === 'number' &&
    typeof data.macros.fat === 'number'
  );
}

export function isValidFoodCategory(category: string): category is FoodCategory {
  return Object.values(FOOD_CATEGORIES).includes(category as FoodCategory);
}

export function isValidAllergen(allergen: string): allergen is Allergen {
  return Object.values(ALLERGENS).includes(allergen as Allergen);
}

export function isValidDietaryRestriction(restriction: string): restriction is DietaryRestriction {
  return Object.values(DIETARY_RESTRICTIONS).includes(restriction as DietaryRestriction);
}

// =================================================================
// EXPORTS
// =================================================================

export type {
  Timestamp,
};

export default {
  DAILY_VALUES,
  NUTRITION_COLORS,
  FOOD_CATEGORIES,
  ALLERGENS,
  DIETARY_RESTRICTIONS,
  DIETARY_TAGS,
  MEAL_TYPES,
  RECOMMENDATION_TYPES,
  RECOMMENDATION_CATEGORIES,
};