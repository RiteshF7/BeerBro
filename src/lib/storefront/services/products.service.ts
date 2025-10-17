import { apiService } from './api.service';

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
    console.log('Fetching products with filters:', filters);

    try {
      const products = await apiService.getProducts(filters) as Product[];
      console.log('Products loaded from API:', products.length);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await apiService.getProduct(id) as Product;
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const products = await apiService.searchProducts(searchTerm) as Product[];
      return products;
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
    try {
      const categories = await apiService.getCategories() as Category[];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await apiService.getCategory(id) as Category;
      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  // Note: Admin methods (create, update, delete) are handled by the admin API
  // and should not be called directly from the storefront
}

// Export singleton instance
export const productsService = new ProductsService();
