import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/gemini';
import { generateMealPlan } from '@/lib/vertex-ai';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

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
    const { 
      type = 'general', // 'general', 'meal-plan', 'personalized'
      preferences = {},
      userContext = {}
    } = body;

    let recommendations = [];
    let mealPlan = null;

    switch (type) {
      case 'general':
        recommendations = await generateRecommendations({
          dietaryRestrictions: preferences.dietaryRestrictions || [],
          healthGoals: preferences.healthGoals || [],
          dislikedFoods: preferences.dislikedFoods || [],
        });
        break;

      case 'meal-plan':
        mealPlan = await generateMealPlan({
          dietType: preferences.dietType || 'balanced',
          calories: preferences.calories || 2000,
          meals: preferences.meals || 3,
          restrictions: preferences.restrictions || [],
        });
        break;

      case 'personalized':
        // Get user's history and preferences from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();
        
        if (userData) {
          const userPreferences = {
            dietaryRestrictions: userData.dietaryRestrictions || [],
            healthGoals: userData.healthGoals || [],
            dislikedFoods: userData.dislikedFoods || [],
          };
          
          recommendations = await generateRecommendations(userPreferences);
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid recommendation type' }, { status: 400 });
    }

    // Save recommendation request to user's history
    await db.collection('users').doc(decodedToken.uid).collection('recommendations').add({
      type,
      preferences,
      recommendations,
      mealPlan,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        type,
        recommendations,
        mealPlan,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// GET method to fetch user's recommendation history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const recommendationsSnapshot = await db
      .collection('users')
      .doc(decodedToken.uid)
      .collection('recommendations')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const recommendations = recommendationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: recommendations,
      pagination: {
        limit,
        offset,
        total: recommendationsSnapshot.size,
      },
    });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}