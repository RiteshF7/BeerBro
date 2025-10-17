import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CATEGORIES_COLLECTION = 'categories';

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

    const { id: categoryId } = await params;
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const category = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
