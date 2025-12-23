export interface UserPreferences {
  dailyCalories: number;
  macroGoals: {
    protein: number;
    carbs: number;
    fats: number;
  };
  dietType: "omnivore" | "vegetarian" | "vegan" | "pescatarian";
  allergies: string[];
}

export interface UserStats {
  totalSearches: number;
  favoritesCount: number;
  mythsBusted: number;
}

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: any;
  preferences: UserPreferences;
  stats: UserStats;
}


