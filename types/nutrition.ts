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


