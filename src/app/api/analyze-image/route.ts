import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageContent } from '@/lib/gemini';
import { performAdvancedNutritionAnalysis } from '@/lib/vertex-ai';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, includeNutrition = true } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Analyze image content using Gemini
    const imageAnalysis = await analyzeImageContent(imageBase64);

    let nutritionAnalysis = null;
    
    if (includeNutrition && imageAnalysis.identifiedFoods.length > 0) {
      // Get nutrition analysis for the first identified food
      const primaryFood = imageAnalysis.identifiedFoods[0].name;
      
      try {
        nutritionAnalysis = await performAdvancedNutritionAnalysis(primaryFood);
      } catch (error) {
        console.error('Error getting nutrition analysis:', error);
        // Continue without nutrition analysis if it fails
      }
    }

    // Log the analysis for analytics
    console.log('Image analysis completed', {
      userId: decodedToken.uid,
      identifiedFoods: imageAnalysis.identifiedFoods.length,
      confidence: imageAnalysis.overallConfidence,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        imageAnalysis,
        nutritionAnalysis,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error in image analysis:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// GET method to check API health
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'image-analysis',
    timestamp: new Date().toISOString(),
  });
}