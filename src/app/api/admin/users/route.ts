import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { cookies } from 'next/headers'
import { admin } from '@/lib/firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

const db = getFirestore()

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the session token
    const decodedToken = await auth().verifySessionCookie(sessionToken)
    const userId = decodedToken.uid

    // Check if user is admin
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()

    if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all users from Firestore
    const usersSnapshot = await db.collection('users').get()
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastLogin: doc.data().lastLogin?.toDate() || new Date(),
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await auth().verifySessionCookie(sessionToken)
    const userId = decodedToken.uid

    // Check if user is admin
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()

    if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action, targetUserId, data } = body

    switch (action) {
      case 'updateRole':
        await db.collection('users').doc(targetUserId).update({
          role: data.role,
          updatedAt: new Date(),
        })
        break

      case 'deactivate':
        await db.collection('users').doc(targetUserId).update({
          isActive: false,
          updatedAt: new Date(),
        })
        break

      case 'activate':
        await db.collection('users').doc(targetUserId).update({
          isActive: true,
          updatedAt: new Date(),
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}