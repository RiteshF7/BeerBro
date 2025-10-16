import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/features/orders/api';
import { orderSchema } from '@/features/orders/types';

export async function GET() {
  try {
    const orders = await getOrders();
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
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    
    const orderId = await createOrder(validatedData);
    return NextResponse.json({ id: orderId }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
