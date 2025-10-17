/**
 * Admin API Service
 * 
 * This service handles all API calls related to the admin console.
 * It provides a centralized way to manage admin-specific API operations.
 */

import { ADMIN_API_ENDPOINTS, ADMIN_ERROR_CODES } from '../constants';
import type { AdminStats, Product, Order, User, ServiceLocation } from '../types';

/**
 * Base API response interface
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Admin API service class
 */
export class AdminApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic API request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      return result.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Handle API errors and convert to admin console error format
   */
  private handleApiError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return new Error(ADMIN_ERROR_CODES.UNAUTHORIZED);
      }
      if (error.message.includes('403')) {
        return new Error(ADMIN_ERROR_CODES.FORBIDDEN);
      }
      if (error.message.includes('404')) {
        return new Error(ADMIN_ERROR_CODES.NOT_FOUND);
      }
      if (error.message.includes('400')) {
        return new Error(ADMIN_ERROR_CODES.VALIDATION_ERROR);
      }
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        return new Error(ADMIN_ERROR_CODES.NETWORK_ERROR);
      }
    }
    return new Error(ADMIN_ERROR_CODES.UNKNOWN_ERROR);
  }

  /**
   * Dashboard API methods
   */
  async getDashboardStats(): Promise<AdminStats> {
    return this.request<AdminStats>(ADMIN_API_ENDPOINTS.DASHBOARD_STATS);
  }

  /**
   * Products API methods
   */
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>(ADMIN_API_ENDPOINTS.PRODUCTS);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`${ADMIN_API_ENDPOINTS.PRODUCTS}/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.request<Product>(ADMIN_API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`${ADMIN_API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`${ADMIN_API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Orders API methods
   */
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>(ADMIN_API_ENDPOINTS.ORDERS);
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`${ADMIN_API_ENDPOINTS.ORDERS}/${id}`);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.request<Order>(`${ADMIN_API_ENDPOINTS.ORDERS}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string): Promise<void> {
    return this.request<void>(`${ADMIN_API_ENDPOINTS.ORDERS}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Users API methods
   */
  async getUsers(): Promise<User[]> {
    return this.request<User[]>(ADMIN_API_ENDPOINTS.USERS);
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`${ADMIN_API_ENDPOINTS.USERS}/${id}`);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.request<User>(`${ADMIN_API_ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`${ADMIN_API_ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Locations API methods
   */
  async getLocations(): Promise<ServiceLocation[]> {
    return this.request<ServiceLocation[]>(ADMIN_API_ENDPOINTS.LOCATIONS);
  }

  async getLocation(id: string): Promise<ServiceLocation> {
    return this.request<ServiceLocation>(`${ADMIN_API_ENDPOINTS.LOCATIONS}/${id}`);
  }

  async createLocation(location: Omit<ServiceLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceLocation> {
    return this.request<ServiceLocation>(ADMIN_API_ENDPOINTS.LOCATIONS, {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async updateLocation(id: string, location: Partial<ServiceLocation>): Promise<ServiceLocation> {
    return this.request<ServiceLocation>(`${ADMIN_API_ENDPOINTS.LOCATIONS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  }

  async deleteLocation(id: string): Promise<void> {
    return this.request<void>(`${ADMIN_API_ENDPOINTS.LOCATIONS}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Analytics API methods
   */
  async getAnalyticsData(timeRange: string = '30d'): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(
      `${ADMIN_API_ENDPOINTS.ANALYTICS}?timeRange=${timeRange}`
    );
  }

  /**
   * Reports API methods
   */
  async generateReport(type: string, params: Record<string, unknown> = {}): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${ADMIN_API_ENDPOINTS.REPORTS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, params }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate report: ${response.statusText}`);
    }

    return response.blob();
  }
}

/**
 * Default admin API service instance
 */
export const adminApiService = new AdminApiService();