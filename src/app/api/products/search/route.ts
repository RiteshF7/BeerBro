import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stockQuantity: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  brand?: string;
  origin?: string;
  tags?: string[];
  [key: string]: unknown; // Allow additional properties
}

const PRODUCTS_COLLECTION = 'products';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Firestore doesn't support full-text search natively, so we'll fetch all products
    // and filter them on the client side. For production, consider using Algolia or similar
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const allProducts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Handle different field names
        image: data.imageUrl || data.image || '',
        stockQuantity: data.stock || data.stockQuantity || 0,
        inStock: data.status === 'active' || data.inStock || (data.stock > 0),
        rating: data.rating || 4.0,
        reviewCount: data.reviewCount || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ProductData;
    });

    const term = searchTerm.toLowerCase();
    const searchResults = allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.origin?.toLowerCase().includes(term) ||
      product.tags?.some(tag => tag.toLowerCase().includes(term))
    );

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
