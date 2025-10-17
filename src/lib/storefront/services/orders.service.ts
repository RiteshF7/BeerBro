import { apiService } from './api.service';
import { CartItem, ShippingAddress, PaymentMethod, Order } from './cart.service';

export interface CreateOrderData {
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  [key: string]: unknown; // Allow additional properties for API compatibility
}

class OrdersService {
  private readonly ORDERS_COLLECTION = 'orders';

  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<string | null> {
    try {
      const result = await apiService.createOrder(orderData) as { id: string };
      return result.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get orders for a specific user
  async getUserOrders(userId: string, limitCount?: number): Promise<Order[]> {
    try {
      const orders = await apiService.getOrders({ userId, limit: limitCount }) as Order[];
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  // Get a specific order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const order = await apiService.getOrder(orderId) as Order;
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], additionalData?: {
    trackingNumber?: string;
    estimatedDelivery?: Date;
  }): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {
        status,
      };

      if (additionalData?.trackingNumber) {
        updateData.trackingNumber = additionalData.trackingNumber;
      }

      if (additionalData?.estimatedDelivery) {
        updateData.estimatedDelivery = additionalData.estimatedDelivery;
      }

      await apiService.updateOrder(orderId, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    try {
      const orders = await apiService.getOrders({ limit: limitCount }) as Order[];
      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status'], limitCount?: number): Promise<Order[]> {
    try {
      const orders = await apiService.getOrders({ status, limit: limitCount }) as Order[];
      return orders;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'cancelled');
  }

  // Note: Order statistics should be calculated on the server side
  // and exposed through a dedicated API endpoint for better performance
}

// Export singleton instance
export const ordersService = new OrdersService();
