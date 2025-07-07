import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the model
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });

// Nutrition analysis prompt template
const NUTRITION_ANALYSIS_PROMPT = `
You are a nutrition expert AI. Analyze the following food item and provide comprehensive nutrition information.

Food Item: {foodItem}

Please provide the following information in JSON format:
{
  "foodName": "string",
  "calories": number,
  "macros": {
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  },
  "vitamins": {
    "vitaminA": number,
    "vitaminC": number,
    "vitaminD": number,
    "vitaminE": number,
    "vitaminK": number,
    "thiamine": number,
    "riboflavin": number,
    "niacin": number,
    "vitaminB6": number,
    "folate": number,
    "vitaminB12": number
  },
  "minerals": {
    "calcium": number,
    "iron": number,
    "magnesium": number,
    "phosphorus": number,
    "potassium": number,
    "sodium": number,
    "zinc": number
  },
  "healthBenefits": ["string"],
  "allergens": ["string"],
  "servingSize": "string",
  "confidence": number
}

Only return valid JSON. Use 0 for unknown values.
`;

// Myth-busting prompt template
const MYTH_BUSTING_PROMPT = `
You are a nutrition scientist and fact-checker. Analyze the following nutrition claim and determine if it's a myth or fact.

Claim: {claim}

Please provide the following information in JSON format:
{
  "claim": "string",
  "verdict": "myth" | "fact" | "partially_true",
  "explanation": "string",
  "scientificEvidence": "string",
  "sources": ["string"],
  "confidence": number,
  "category": "string"
}

Only return valid JSON.
`;

// Image analysis prompt template
const IMAGE_ANALYSIS_PROMPT = `
You are a food recognition AI. Analyze the provided image and identify the food items.

Please provide the following information in JSON format:
{
  "identifiedFoods": [
    {
      "name": "string",
      "confidence": number,
      "description": "string"
    }
  ],
  "overallConfidence": number,
  "suggestions": ["string"]
}

Only return valid JSON.
`;

export interface NutritionAnalysisResult {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  healthBenefits: string[];
  allergens: string[];
  servingSize: string;
  confidence: number;
}

export interface MythBustingResult {
  claim: string;
  verdict: 'myth' | 'fact' | 'partially_true';
  explanation: string;
  scientificEvidence: string;
  sources: string[];
  confidence: number;
  category: string;
}

export interface ImageAnalysisResult {
  identifiedFoods: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
  overallConfidence: number;
  suggestions: string[];
}

// Analyze nutrition information for a food item
export async function analyzeNutrition(foodItem: string): Promise<NutritionAnalysisResult> {
  try {
    const prompt = NUTRITION_ANALYSIS_PROMPT.replace('{foodItem}', foodItem);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const nutritionData = JSON.parse(text);
    
    return {
      foodName: nutritionData.foodName,
      calories: nutritionData.calories || 0,
      macros: {
        protein: nutritionData.macros?.protein || 0,
        carbs: nutritionData.macros?.carbs || 0,
        fat: nutritionData.macros?.fat || 0,
        fiber: nutritionData.macros?.fiber || 0,
      },
      vitamins: nutritionData.vitamins || {},
      minerals: nutritionData.minerals || {},
      healthBenefits: nutritionData.healthBenefits || [],
      allergens: nutritionData.allergens || [],
      servingSize: nutritionData.servingSize || '100g',
      confidence: nutritionData.confidence || 0.8,
    };
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    throw new Error('Failed to analyze nutrition information');
  }
}

// Analyze and fact-check nutrition myths
export async function analyzeMythClaim(claim: string): Promise<MythBustingResult> {
  try {
    const prompt = MYTH_BUSTING_PROMPT.replace('{claim}', claim);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const mythData = JSON.parse(text);
    
    return {
      claim: mythData.claim,
      verdict: mythData.verdict || 'partially_true',
      explanation: mythData.explanation || '',
      scientificEvidence: mythData.scientificEvidence || '',
      sources: mythData.sources || [],
      confidence: mythData.confidence || 0.7,
      category: mythData.category || 'general',
    };
  } catch (error) {
    console.error('Error analyzing myth claim:', error);
    throw new Error('Failed to analyze myth claim');
  }
}

// Analyze food image
export async function analyzeImageContent(imageBase64: string): Promise<ImageAnalysisResult> {
  try {
    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      },
    ];
    
    const result = await model.generateContent([IMAGE_ANALYSIS_PROMPT, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const imageData = JSON.parse(text);
    
    return {
      identifiedFoods: imageData.identifiedFoods || [],
      overallConfidence: imageData.overallConfidence || 0.5,
      suggestions: imageData.suggestions || [],
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
}

// Generate smart recommendations based on user preferences
export async function generateRecommendations(
  userPreferences: {
    dietaryRestrictions: string[];
    healthGoals: string[];
    dislikedFoods: string[];
  }
): Promise<string[]> {
  try {
    const prompt = `
    Based on the following user preferences, generate 5 personalized nutrition recommendations:
    
    Dietary Restrictions: ${userPreferences.dietaryRestrictions.join(', ')}
    Health Goals: ${userPreferences.healthGoals.join(', ')}
    Disliked Foods: ${userPreferences.dislikedFoods.join(', ')}
    
    Return only a JSON array of recommendation strings.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
  }
}

// Search suggestions for auto-complete
export async function generateSearchSuggestions(query: string): Promise<string[]> {
  try {
    const prompt = `
    Given the partial search query: "${query}"
    Generate 5 relevant food/nutrition search suggestions.
    Return only a JSON array of suggestion strings.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return [];
  }
}

const gemini = {
  analyzeNutrition,
  analyzeMythClaim,
  analyzeImageContent,
  generateRecommendations,
  generateSearchSuggestions,
};

export default gemini;