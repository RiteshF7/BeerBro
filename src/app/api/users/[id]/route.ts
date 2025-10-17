import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const USERS_COLLECTION = 'users';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { id: userId } = await params;
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const user = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate(),
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { id: userId } = await params;
    const body = await request.json();
    
    const userData = {
      ...body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), userData);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { id: userId } = await params;
    const body = await request.json();
    
    const docRef = doc(db, USERS_COLLECTION, userId);
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
