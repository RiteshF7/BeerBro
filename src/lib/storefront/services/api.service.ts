/**
 * API Service Layer
 * This service provides a centralized way to make API calls to our backend endpoints
 * instead of directly calling Firestore from the frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Products API
  async getProducts(params?: {
    category?: string;
    inStock?: boolean;
    isOnSale?: boolean;
    isNew?: boolean;
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.set('category', params.category);
    if (params?.inStock !== undefined) searchParams.set('inStock', params.inStock.toString());
    if (params?.isOnSale !== undefined) searchParams.set('isOnSale', params.isOnSale.toString());
    if (params?.isNew !== undefined) searchParams.set('isNew', params.isNew.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.orderBy) searchParams.set('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.set('orderDirection', params.orderDirection);

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async searchProducts(searchTerm: string) {
    return this.request(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // Categories API
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategory(id: string) {
    return this.request(`/api/categories/${id}`);
  }

  // Orders API
  async getOrders(params?: {
    userId?: string;
    status?: string;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getOrder(id: string) {
    return this.request(`/api/orders/${id}`);
  }

  async createOrder(orderData: Record<string, unknown>) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, updates: Record<string, unknown>) {
    return this.request(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Users API
  async getUser(id: string) {
    return this.request(`/api/users/${id}`);
  }

  async createUser(id: string, userData: Record<string, unknown>) {
    return this.request(`/api/users/${id}`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: Record<string, unknown>) {
    return this.request(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
