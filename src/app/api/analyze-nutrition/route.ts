import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';
import { headers } from 'next/headers';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function POST(request: NextRequest) {
  try {
    // Verify Firebase token
    const authHeader = headers().get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();
    const { foodItem } = body;

    if (!foodItem || typeof foodItem !== 'string') {
      return NextResponse.json(
        { error: 'Food item is required and must be a string' },
        { status: 400 }
      );
    }

    // Call Edamam API via RapidAPI
    const nutritionData = await analyzeNutrition(foodItem);

    // Save to Firestore (optional)
    await saveNutritionSearch(userId, foodItem, nutritionData);

    return NextResponse.json({
      success: true,
      data: nutritionData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in nutrition analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase token
    const authHeader = headers().get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const foodItem = searchParams.get('food');

    if (!foodItem) {
      return NextResponse.json(
        { error: 'Food item query parameter is required' },
        { status: 400 }
      );
    }

    // Call Edamam API via RapidAPI
    const nutritionData = await analyzeNutrition(foodItem);

    // Save to Firestore (optional)
    await saveNutritionSearch(userId, foodItem, nutritionData);

    return NextResponse.json({
      success: true,
      data: nutritionData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in nutrition analysis API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function analyzeNutrition(foodItem: string): Promise<any> {
  try {
    const response = await fetch('https://nutrition-analysis.p.rapidapi.com/nutrition-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.NUTRITION_API_KEY || '',
        'X-RapidAPI-Host': 'nutrition-analysis.p.rapidapi.com',
      },
      body: JSON.stringify({
        ingr: [foodItem],
      }),
    });

    if (!response.ok) {
      throw new Error(`Edamam API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      calories: data.totalNutrients.ENERC_KCAL?.quantity || 0,
      macros: {
        protein: data.totalNutrients.PROCNT?.quantity || 0,
        carbs: data.totalNutrients.CHOCDF?.quantity || 0,
        fat: data.totalNutrients.FAT?.quantity || 0,
        fiber: data.totalNutrients.FIBTG?.quantity || 0,
      },
      micronutrients: {
        vitamins: {
          vitaminA: data.totalNutrients.VITA_RAE?.quantity || 0,
          vitaminC: data.totalNutrients.VITC?.quantity || 0,
        },
        minerals: {
          calcium: data.totalNutrients.CA?.quantity || 0,
          iron: data.totalNutrients.FE?.quantity || 0,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching Edamam data:', error);
    throw new Error('Failed to analyze nutrition');
  }
}

async function saveNutritionSearch(userId: string, foodItem: string, nutritionData: any): Promise<void> {
  try {
    // Implement Firestore save if needed
    // Example:
    // import { getFirestore, collection, addDoc } from 'firebase/firestore';
    // const db = getFirestore();
    // await addDoc(collection(db, 'searches'), {
    //   userId,
    //   query: foodItem,
    //   results: nutritionData,
    //   timestamp: new Date(),
    //   type: 'nutrition',
    // });
  } catch (error) {
    console.error('Error saving nutrition search:', error);
  }
}