// app/api/analyze-nutrition/route.ts - Nutrition Analysis API
import { NextRequest, NextResponse } from 'next/server';
import { analyzeNutrition } from '@/lib/gemini';
import { auth } from '@/lib/firebase';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = headers().get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    // Extract the token (in a real app, you'd verify this token)
    const token = authHeader.split(' ')[1];
    
    // Parse request body
    const body = await request.json();
    const { foodItem, userId } = body;

    if (!foodItem || typeof foodItem !== 'string') {
      return NextResponse.json(
        { error: 'Food item is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Analyze nutrition using Gemini API
    const nutritionData = await analyzeNutrition(foodItem);

    // Optional: Save to Firestore (you can implement this based on your needs)
    // await saveNutritionSearch(userId, foodItem, nutritionData);

    return NextResponse.json({
      success: true,
      data: nutritionData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in nutrition analysis API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const foodItem = searchParams.get('food');
    const userId = searchParams.get('userId');

    if (!foodItem) {
      return NextResponse.json(
        { error: 'Food item query parameter is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID query parameter is required' },
        { status: 400 }
      );
    }

    // Analyze nutrition using Gemini API
    const nutritionData = await analyzeNutrition(foodItem);

    return NextResponse.json({
      success: true,
      data: nutritionData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in nutrition analysis API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to save nutrition search (implement based on your needs)
async function saveNutritionSearch(
  userId: string, 
  foodItem: string, 
  nutritionData: any
): Promise<void> {
  // This is where you would save the search to Firestore
  // Implementation depends on your specific requirements
  try {
    // Example implementation:
    // const searchDoc = {
    //   userId,
    //   query: foodItem,
    //   results: nutritionData,
    //   timestamp: new Date(),
    //   type: 'nutrition'
    // };
    // await addDoc(collection(db, COLLECTIONS.SEARCHES), searchDoc);
  } catch (error) {
    console.error('Error saving nutrition search:', error);
    // Don't throw here as it's not critical for the API response
  }
}