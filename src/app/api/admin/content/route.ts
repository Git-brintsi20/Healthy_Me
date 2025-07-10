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

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type') // 'myths' or 'nutrition'
    const status = searchParams.get('status') // 'verified', 'pending', 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = db.collection(contentType === 'myths' ? 'myths' : 'nutrition_facts')

    // Apply status filter
    if (status === 'verified') {
      query = query.where('verified', '==', true)
    } else if (status === 'pending') {
      query = query.where('verified', '==', false)
    }

    // Apply pagination
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get()

    const content = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    }))

    return NextResponse.json({ content, total: snapshot.size })
  } catch (error) {
    console.error('Error fetching content:', error)
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
    const { action, contentType, contentId, data } = body

    const collectionName = contentType === 'myth' ? 'myths' : 'nutrition_facts'
    const docRef = db.collection(collectionName).doc(contentId)

    switch (action) {
      case 'verify':
        await docRef.update({
          verified: true,
          verifiedBy: userId,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        
        // Log the verification action
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_verified',
          contentType,
          contentId,
          timestamp: new Date(),
        })
        break

      case 'unverify':
        await docRef.update({
          verified: false,
          verifiedBy: null,
          verifiedAt: null,
          updatedAt: new Date(),
        })
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_unverified',
          contentType,
          contentId,
          timestamp: new Date(),
        })
        break

      case 'update':
        await docRef.update({
          ...data,
          updatedAt: new Date(),
          lastEditedBy: userId,
        })
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_updated',
          contentType,
          contentId,
          timestamp: new Date(),
        })
        break

      case 'delete':
        // Soft delete by adding deleted flag
        await docRef.update({
          deleted: true,
          deletedBy: userId,
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_deleted',
          contentType,
          contentId,
          timestamp: new Date(),
        })
        break

      case 'restore':
        await docRef.update({
          deleted: false,
          deletedBy: null,
          deletedAt: null,
          updatedAt: new Date(),
        })
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_restored',
          contentType,
          contentId,
          timestamp: new Date(),
        })
        break

      case 'create':
        // Create new content
        const newDocRef = db.collection(collectionName).doc()
        await newDocRef.set({
          id: newDocRef.id,
          ...data,
          createdBy: userId,
          verified: false,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'content_created',
          contentType,
          contentId: newDocRef.id,
          timestamp: new Date(),
        })
        
        return NextResponse.json({ success: true, id: newDocRef.id })

      case 'bulk_verify':
        const { contentIds } = data
        const batch = db.batch()
        
        contentIds.forEach((id: string) => {
          const ref = db.collection(collectionName).doc(id)
          batch.update(ref, {
            verified: true,
            verifiedBy: userId,
            verifiedAt: new Date(),
            updatedAt: new Date(),
          })
        })
        
        await batch.commit()
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'bulk_content_verified',
          contentType,
          contentIds,
          timestamp: new Date(),
        })
        break

      case 'bulk_delete':
        const { contentIds: deleteIds } = data
        const deleteBatch = db.batch()
        
        deleteIds.forEach((id: string) => {
          const ref = db.collection(collectionName).doc(id)
          deleteBatch.update(ref, {
            deleted: true,
            deletedBy: userId,
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
        })
        
        await deleteBatch.commit()
        
        await db.collection('admin_actions').add({
          adminId: userId,
          action: 'bulk_content_deleted',
          contentType,
          contentIds: deleteIds,
          timestamp: new Date(),
        })
        break

      case 'get_analytics':
        // Get content analytics
        const [mythsSnapshot, nutritionSnapshot] = await Promise.all([
          db.collection('myths').get(),
          db.collection('nutrition_facts').get()
        ])

        const mythsData = mythsSnapshot.docs.map(doc => doc.data())
        const nutritionData = nutritionSnapshot.docs.map(doc => doc.data())

        const analytics = {
          myths: {
            total: mythsData.length,
            verified: mythsData.filter(m => m.verified).length,
            pending: mythsData.filter(m => !m.verified).length,
            deleted: mythsData.filter(m => m.deleted).length,
          },
          nutrition: {
            total: nutritionData.length,
            verified: nutritionData.filter(n => n.verified).length,
            pending: nutritionData.filter(n => !n.verified).length,
            deleted: nutritionData.filter(n => n.deleted).length,
          }
        }

        return NextResponse.json({ analytics })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error managing content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await auth().verifySessionCookie(sessionToken)
    const userId = decodedToken.uid

    // Check if user is super admin for permanent deletion
    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.data()

    if (!userData || userData.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden - Super admin required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type')
    const contentId = searchParams.get('id')

    if (!contentType || !contentId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const collectionName = contentType === 'myth' ? 'myths' : 'nutrition_facts'
    
    // Permanently delete the document
    await db.collection(collectionName).doc(contentId).delete()
    
    // Log the permanent deletion
    await db.collection('admin_actions').add({
      adminId: userId,
      action: 'content_permanently_deleted',
      contentType,
      contentId,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error permanently deleting content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}