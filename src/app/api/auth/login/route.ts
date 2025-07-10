import { NextRequest, NextResponse } from 'next/server';
import { auth, getUserRole, USER_ROLES } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Get user role
    const role = getUserRole(email);

    const redirectUrl = ['admin', 'super_admin'].includes(role) ? '/admin' : '/dashboard';

    return NextResponse.json({
      success: true,
      token: idToken,
      user: {
        uid: user.uid,
        email: user.email,
        role,
      },
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}