import { NextRequest, NextResponse } from 'next/server';
import { auth, db, getUserRole, USER_ROLES, UserDocument, COLLECTIONS } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth, setCustomUserClaims } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determine role
    const role = email === process.env.ADMIN_EMAIL ? USER_ROLES.ADMIN : getUserRole(email);

    // Set custom claims for role (using Firebase Admin SDK)
    await getAuth().setCustomUserClaims(user.uid, { role });

    // Store user data in Firestore
    const userDoc: UserDocument = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      role,
      preferences: {
        theme: 'light',
        notifications: true,
        dietary_restrictions: [],
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userDoc);

    const idToken = await user.getIdToken();

    return NextResponse.json({
      success: true,
      token: idToken,
      user: {
        uid: user.uid,
        email: user.email,
        role,
        displayName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 400 }
    );
  }
}