import gemini from '@/lib/gemini';
import vertexAI from '@/lib/vertex-ai';

// Enhanced search suggestions with context awareness
export async function generateEnhancedSearchSuggestions(
  query: string,
  context?: {
    previousSearches?: string[];
    userPreferences?: string[];
    category?: 'nutrition' | 'myths' | 'recipes' | 'general';
  }
): Promise<string[]> {
  try {
    const suggestions = await gemini.generateSearchSuggestions(query);
    
    // Filter and enhance suggestions based on context
    if (context?.category) {
      const filteredSuggestions = suggestions.filter(suggestion => {
        switch (context.category) {
          case 'nutrition':
            return suggestion.toLowerCase().includes('nutrition') || 
                   suggestion.toLowerCase().includes('calories') ||
                   suggestion.toLowerCase().includes('vitamin');
          case 'myths':
            return suggestion.toLowerCase().includes('myth') ||
                   suggestion.toLowerCase().includes('fact') ||
                   suggestion.toLowerCase().includes('truth');
          case 'recipes':
            return suggestion.toLowerCase().includes('recipe') ||
                   suggestion.toLowerCase().includes('cook') ||
                   suggestion.toLowerCase().includes('ingredients');
          default:
            return true;
        }
      });
      
      return filteredSuggestions.length > 0 ? filteredSuggestions : suggestions;
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error generating enhanced search suggestions:', error);
    return [];
  }
}

// Smart nutrition comparison
export async function compareNutritionProfiles(
  foods: string[]
): Promise<{
  comparison: any;
  winner: string;
  insights: string[];
}> {
  try {
    const analyses = await vertexAI.batchAnalyzeNutrition(foods);
    
    // Find the food with the highest health score
    const winner = analyses.reduce((best, current) => 
      current.analysis.healthScore > best.analysis.healthScore ? current : best
    );
    
    const insights = [
      `${winner.foodName} has the highest overall health score`,
      `Comparison based on ${analyses.length} food items`,
      'Consider portion sizes when making dietary choices',
    ];
    
    return {
      comparison: analyses,
      winner: winner.foodName,
      insights,
    };
  } catch (error) {
    console.error('Error comparing nutrition profiles:', error);
    throw new Error('Failed to compare nutrition profiles');
  }
}

// Intelligent fact-checking with confidence scoring
export async function performIntelligentFactCheck(
  claim: string,
  context?: {
    source?: string;
    category?: string;
    userLevel?: 'beginner' | 'intermediate' | 'expert';
  }
): Promise<{
  result: any;
  explanation: string;
  confidence: number;
  relatedClaims: string[];
}> {
  try {
    const basicAnalysis = await gemini.analyzeMythClaim(claim);
    const advancedAnalysis = await vertexAI.performAdvancedMythAnalysis(claim);
    
    // Combine analyses for more robust result
    const combinedConfidence = (basicAnalysis.confidence + advancedAnalysis.confidence) / 2;
    
    const explanation = context?.userLevel === 'expert' 
      ? advancedAnalysis.scientificEvidence.join(' ')
      : basicAnalysis.explanation;
    
    return {
      result: {
        ...basicAnalysis,
        ...advancedAnalysis,
        combinedConfidence,
      },
      explanation,
      confidence: combinedConfidence,
      relatedClaims: await generateRelatedClaims(claim),
    };
  } catch (error) {
    console.error('Error in intelligent fact-checking:', error);
    throw new Error('Failed to perform intelligent fact-checking');
  }
}

// Generate related claims for exploration
async function generateRelatedClaims(claim: string): Promise<string[]> {
  try {
    const suggestions = await gemini.generateSearchSuggestions(claim);
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error('Error generating related claims:', error);
    return [];
  }
}

// Smart image analysis with nutrition context
export async function analyzeImageWithNutritionContext(
  imageBase64: string,
  context?: {
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    dietGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance';
    restrictions?: string[];
  }
): Promise<{
  imageAnalysis: any;
  nutritionAnalysis: any;
  recommendations: string[];
  warnings: string[];
}> {
  try {
    const imageAnalysis = await gemini.analyzeImageContent(imageBase64);
    
    if (imageAnalysis.identifiedFoods.length === 0) {
      return {
        imageAnalysis,
        nutritionAnalysis: null,
        recommendations: ['Try taking a clearer photo of the food item'],
        warnings: ['Could not identify any food items in the image'],
      };
    }
    
    const primaryFood = imageAnalysis.identifiedFoods[0].name;
    const nutritionAnalysis = await vertexAI.performAdvancedNutritionAnalysis(
      primaryFood,
      context
    );
    
    const recommendations = generateContextualRecommendations(
      nutritionAnalysis,
      context
    );
    
    const warnings = generateNutritionalWarnings(
      nutritionAnalysis,
      context?.restrictions || []
    );
    
    return {
      imageAnalysis,
      nutritionAnalysis,
      recommendations,
      warnings,
    };
  } catch (error) {
    console.error('Error in smart image analysis:', error);
    throw new Error('Failed to analyze image with nutrition context');
  }
}

// Generate contextual recommendations
function generateContextualRecommendations(
  nutritionAnalysis: any,
  context?: {
    mealType?: string;
    dietGoal?: string;
    restrictions?: string[];
  }
): string[] {
  const recommendations = [];
  
  if (context?.mealType === 'breakfast' && nutritionAnalysis.basicNutrition.macros.protein < 20) {
    recommendations.push('Consider adding a protein source for a more balanced breakfast');
  }
  
  if (context?.dietGoal === 'weight_loss' && nutritionAnalysis.basicNutrition.calories > 500) {
    recommendations.push('This is a high-calorie option - consider portion control');
  }
  
  if (context?.dietGoal === 'muscle_gain' && nutritionAnalysis.basicNutrition.macros.protein < 30) {
    recommendations.push('Add more protein to support muscle growth');
  }
  
  return recommendations.length > 0 ? recommendations : nutritionAnalysis.recommendations;
}

// Generate nutritional warnings
function generateNutritionalWarnings(
  nutritionAnalysis: any,
  restrictions: string[]
): string[] {
  const warnings = [];
  
  if (nutritionAnalysis.basicNutrition.macros.sodium > 2000) {
    warnings.push('High sodium content - consider if you have blood pressure concerns');
  }
  
  if (nutritionAnalysis.basicNutrition.macros.sugar > 25) {
    warnings.push('High sugar content - may affect blood sugar levels');
  }
  
  restrictions.forEach(restriction => {
    if (nutritionAnalysis.healthImpact.toLowerCase().includes(restriction.toLowerCase())) {
      warnings.push(`May not be suitable for ${restriction} restrictions`);
    }
  });
  
  return warnings;
}

// Batch process multiple AI operations
export async function batchProcessAIOperations(
  operations: Array<{
    type: 'nutrition' | 'myth' | 'image' | 'recommendation';
    data: any;
    priority: 'high' | 'medium' | 'low';
  }>
): Promise<any[]> {
  try {
    // Sort by priority
    const sortedOperations = operations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    const results = [];
    
    for (const operation of sortedOperations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'nutrition':
            result = await gemini.analyzeNutrition(operation.data);
            break;
          case 'myth':
            result = await gemini.analyzeMythClaim(operation.data);
            break;
          case 'image':
            result = await gemini.analyzeImageContent(operation.data);
            break;
          case 'recommendation':
            result = await gemini.generateRecommendations(operation.data);
            break;
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({
          type: operation.type,
          success: true,
          data: result,
        });
      } catch (error) {
        results.push({
          type: operation.type,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in batch AI operations:', error);
    throw new Error('Failed to process batch AI operations');
  }
}

const aiHelpers = {
  generateEnhancedSearchSuggestions,
  compareNutritionProfiles,
  performIntelligentFactCheck,
  analyzeImageWithNutritionContext,
  batchProcessAIOperations,
};

export default aiHelpers;