import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

// Get the generative model
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 1,
    topK: 32,
  },
});

// Advanced nutrition analysis with Vertex AI
export async function performAdvancedNutritionAnalysis(
  foodItem: string,
  userContext?: {
    age?: number;
    gender?: string;
    activityLevel?: string;
    healthConditions?: string[];
  }
): Promise<{
  basicNutrition: any;
  personalizedAdvice: string;
  healthImpact: string;
  recommendations: string[];
}> {
  try {
    const prompt = `
    Perform an advanced nutrition analysis for: ${foodItem}
    
    User Context: ${JSON.stringify(userContext || {})}
    
    Provide comprehensive analysis including:
    1. Basic nutritional information
    2. Personalized advice based on user context
    3. Health impact assessment
    4. Specific recommendations
    
    Return as JSON with the following structure:
    {
      "basicNutrition": {
        "calories": number,
        "macros": {"protein": number, "carbs": number, "fat": number, "fiber": number},
        "micronutrients": {"vitamins": {}, "minerals": {}}
      },
      "personalizedAdvice": "string",
      "healthImpact": "string",
      "recommendations": ["string"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in advanced nutrition analysis:', error);
    throw new Error('Failed to perform advanced nutrition analysis');
  }
}

// Batch analysis for multiple food items
export async function batchAnalyzeNutrition(
  foodItems: string[]
): Promise<Array<{
  foodName: string;
  analysis: any;
  confidence: number;
}>> {
  try {
    const prompt = `
    Analyze the following food items for nutrition content:
    ${foodItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}
    
    Return as JSON array with this structure:
    [
      {
        "foodName": "string",
        "analysis": {
          "calories": number,
          "macros": {"protein": number, "carbs": number, "fat": number},
          "healthScore": number
        },
        "confidence": number
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in batch nutrition analysis:', error);
    throw new Error('Failed to perform batch nutrition analysis');
  }
}

// Generate meal plan using Vertex AI
export async function generateMealPlan(
  preferences: {
    dietType: string;
    calories: number;
    meals: number;
    restrictions: string[];
  }
): Promise<{
  mealPlan: any;
  nutritionSummary: any;
  tips: string[];
}> {
  try {
    const prompt = `
    Generate a personalized meal plan with the following preferences:
    - Diet Type: ${preferences.dietType}
    - Target Calories: ${preferences.calories}
    - Number of Meals: ${preferences.meals}
    - Restrictions: ${preferences.restrictions.join(', ')}
    
    Return as JSON with this structure:
    {
      "mealPlan": {
        "breakfast": {"name": "string", "calories": number, "ingredients": ["string"]},
        "lunch": {"name": "string", "calories": number, "ingredients": ["string"]},
        "dinner": {"name": "string", "calories": number, "ingredients": ["string"]},
        "snacks": [{"name": "string", "calories": number}]
      },
      "nutritionSummary": {
        "totalCalories": number,
        "macroBreakdown": {"protein": number, "carbs": number, "fat": number}
      },
      "tips": ["string"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}

// Advanced myth analysis with scientific backing
export async function performAdvancedMythAnalysis(
  claim: string
): Promise<{
  verdict: string;
  confidence: number;
  scientificEvidence: string[];
  relatedStudies: string[];
  expertOpinions: string[];
}> {
  try {
    const prompt = `
    Perform advanced fact-checking analysis for this nutrition claim:
    "${claim}"
    
    Provide comprehensive analysis including:
    1. Verdict with confidence level
    2. Scientific evidence
    3. Related studies
    4. Expert opinions
    
    Return as JSON with this structure:
    {
      "verdict": "myth" | "fact" | "partially_true",
      "confidence": number,
      "scientificEvidence": ["string"],
      "relatedStudies": ["string"],
      "expertOpinions": ["string"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in advanced myth analysis:', error);
    throw new Error('Failed to perform advanced myth analysis');
  }
}

const vertexAI = {
  performAdvancedNutritionAnalysis,
  batchAnalyzeNutrition,
  generateMealPlan,
  performAdvancedMythAnalysis,
};

export default vertexAI;