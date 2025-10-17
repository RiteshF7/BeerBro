import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
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
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const isOnSale = searchParams.get('isOnSale');
    const isNew = searchParams.get('isNew');
    const limitCount = searchParams.get('limit');
    const orderByField = searchParams.get('orderBy');
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || 'desc';

    let q = query(collection(db, PRODUCTS_COLLECTION));

    // Apply filters
    if (category) {
      q = query(q, where('category', '==', category));
    }

    if (isOnSale !== null) {
      q = query(q, where('isOnSale', '==', isOnSale === 'true'));
    }

    if (isNew !== null) {
      q = query(q, where('isNew', '==', isNew === 'true'));
    }

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(parseInt(limitCount)));
    }

    const querySnapshot = await getDocs(q);
    
    let products = querySnapshot.docs.map(doc => {
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

    // Apply client-side filtering for inStock to avoid index requirements
    if (inStock !== null) {
      const inStockFilter = inStock === 'true';
      products = products.filter(product => product.inStock === inStockFilter);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
