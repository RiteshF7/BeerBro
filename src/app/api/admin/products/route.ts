import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/adminconsole/products/api';
import { productSchema } from '@/lib/adminconsole/products/types';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);
    
    const productId = await createProduct(validatedData);
    return NextResponse.json({ id: productId }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
