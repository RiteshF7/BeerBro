import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PRODUCTS_COLLECTION = 'products';

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

    const { id: productId } = await params;
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const product = {
      id: docSnap.id,
      ...data,
      // Handle different field names
      image: data.imageUrl || data.image || '',
      stockQuantity: data.stock || data.stockQuantity || 0,
      inStock: data.status === 'active' || data.inStock || (data.stock > 0),
      rating: data.rating || 4.0,
      reviewCount: data.reviewCount || 0,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
