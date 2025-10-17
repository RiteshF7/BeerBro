import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ORDERS_COLLECTION = 'orders';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limitCount = searchParams.get('limit');

    let q = query(collection(db, ORDERS_COLLECTION));

    // Apply filters
    if (userId) {
      q = query(q, where('userId', '==', userId));
    }

    if (status) {
      q = query(q, where('status', '==', status));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    if (limitCount) {
      q = query(q, limit(parseInt(limitCount)));
    }

    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      estimatedDelivery: doc.data().estimatedDelivery?.toDate(),
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const orderData = {
      ...body,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
