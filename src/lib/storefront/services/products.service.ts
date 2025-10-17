import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl?: string; // Support both field names
  category: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  status?: string; // Support status field
  isNew?: boolean;
  isOnSale?: boolean;
  stockQuantity: number;
  stock?: number; // Support both field names
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  alcoholContent?: number;
  volume?: number;
  brand?: string;
  origin?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isPopular?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductsService {
  private readonly PRODUCTS_COLLECTION = 'products';
  private readonly CATEGORIES_COLLECTION = 'categories';

  // Products methods
  async getProducts(filters?: {
    category?: string;
    inStock?: boolean;
    isOnSale?: boolean;
    isNew?: boolean;
    limit?: number;
    orderBy?: 'price' | 'rating' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
  }): Promise<Product[]> {
    if (!db) {
      console.warn('Firestore not initialized. Please check your Firebase configuration.');
      return [];
    }

    console.log('Fetching products with filters:', filters);

    try {
      let q = query(collection(db, this.PRODUCTS_COLLECTION));

      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }

      // Note: We'll filter inStock on the client side to avoid index requirements
      // if (filters?.inStock !== undefined) {
      //   // Handle both inStock boolean and status string fields
      //   if (filters.inStock) {
      //     q = query(q, where('status', '==', 'active'));
      //   } else {
      //     q = query(q, where('status', '!=', 'active'));
      //   }
      // }

      if (filters?.isOnSale !== undefined) {
        q = query(q, where('isOnSale', '==', filters.isOnSale));
      }

      if (filters?.isNew !== undefined) {
        q = query(q, where('isNew', '==', filters.isNew));
      }

      if (filters?.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'desc'));
      }

      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);
      console.log('Raw documents:', querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      
      let products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const transformedProduct = {
          id: doc.id,
          ...data,
          // Handle different field names
          image: data.imageUrl || data.image || '',
          stockQuantity: data.stock || data.stockQuantity || 0,
          inStock: data.status === 'active' || data.inStock || (data.stock > 0),
          rating: data.rating || 4.0, // Default rating if not provided
          reviewCount: data.reviewCount || 0, // Default review count if not provided
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        console.log('Transformed product:', transformedProduct);
        return transformedProduct;
      }) as Product[];

      // Apply client-side filtering for inStock to avoid index requirements
      if (filters?.inStock !== undefined) {
        products = products.filter(product => product.inStock === filters.inStock);
      }

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    try {
      const docRef = doc(db, this.PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
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
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    if (!db) {
      console.warn('Firestore not initialized, returning empty array');
      return [];
    }

    try {
      // Firestore doesn't support full-text search natively, so we'll fetch all products
      // and filter them on the client side. For production, consider using Algolia or similar
      const allProducts = await this.getProducts();
      const term = searchTerm.toLowerCase();
      
      return allProducts.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term) ||
        product.origin?.toLowerCase().includes(term) ||
        product.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.getProducts({ 
      inStock: true, 
      limit: 4,
      orderBy: 'rating',
      orderDirection: 'desc'
    });
  }

  async getNewProducts(): Promise<Product[]> {
    return this.getProducts({ 
      isNew: true, 
      inStock: true, 
      limit: 4,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  async getOnSaleProducts(): Promise<Product[]> {
    return this.getProducts({ 
      isOnSale: true, 
      inStock: true,
      orderBy: 'price',
      orderDirection: 'asc'
    });
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    if (!db) {
      console.warn('Firestore not initialized. Please check your Firebase configuration.');
      return [];
    }

    try {
      const q = query(collection(db, this.CATEGORIES_COLLECTION), orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    try {
      const docRef = doc(db, this.CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Category;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  // Admin methods (for creating/updating products)
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const docRef = await addDoc(collection(db, this.PRODUCTS_COLLECTION), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const docRef = doc(db, this.PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const docRef = doc(db, this.PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productsService = new ProductsService();
