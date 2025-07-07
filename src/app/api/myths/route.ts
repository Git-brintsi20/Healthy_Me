import { NextRequest, NextResponse } from 'next/server';
import { analyzeMythClaim } from '@/lib/gemini';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the request body
    const { claim } = await request.json();

    if (!claim) {
      return NextResponse.json({ error: 'Claim is required' }, { status: 400 });
    }

    // Analyze the myth claim using Gemini
    const analysis = await analyzeMythClaim(claim);

    // Store the analysis in Firestore
    const mythDoc = await db.collection('myths').add({
      userId,
      claim,
      analysis,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update user's search history
    await db.collection('users').doc(userId).update({
      lastMythSearch: new Date(),
      mythSearchCount: db.FieldValue.increment(1),
    });

    return NextResponse.json({
      id: mythDoc.id,
      ...analysis,
    });
  } catch (error) {
    console.error('Error analyzing myth:', error);
    return NextResponse.json(
      { error: 'Failed to analyze myth claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    // Build query
    let query = db.collection('myths').where('userId', '==', userId);
    
    if (category) {
      query = query.where('analysis.category', '==', category);
    }

    // Execute query
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const myths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ myths });
  } catch (error) {
    console.error('Error fetching myths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch myths' },
      { status: 500 }
    );
  }
}