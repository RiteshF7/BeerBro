import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ORDERS_COLLECTION = 'orders';

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

    const { id: orderId } = await params;
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const order = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      estimatedDelivery: data.estimatedDelivery?.toDate(),
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
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

    const { id: orderId } = await params;
    const body = await request.json();
    
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
