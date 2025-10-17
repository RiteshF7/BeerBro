import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
}

class OrdersService {
  private readonly ORDERS_COLLECTION = 'orders';

  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<string | null> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const order: Omit<Order, 'id'> = {
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, this.ORDERS_COLLECTION), {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get orders for a specific user
  async getUserOrders(userId: string, limitCount?: number): Promise<Order[]> {
    if (!db) {
      console.warn('Firestore not initialized, returning empty array');
      return [];
    }

    try {
      let q = query(
        collection(db, this.ORDERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: doc.data().estimatedDelivery?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  // Get a specific order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    if (!db) {
      console.warn('Firestore not initialized');
      return null;
    }

    try {
      const docRef = doc(db, this.ORDERS_COLLECTION, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDelivery: data.estimatedDelivery?.toDate(),
        } as Order;
      }
      
      return null;
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
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const docRef = doc(db, this.ORDERS_COLLECTION, orderId);
      const updateData: Record<string, unknown> = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (additionalData?.trackingNumber) {
        updateData.trackingNumber = additionalData.trackingNumber;
      }

      if (additionalData?.estimatedDelivery) {
        updateData.estimatedDelivery = additionalData.estimatedDelivery;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    if (!db) {
      console.warn('Firestore not initialized, returning empty array');
      return [];
    }

    try {
      let q = query(
        collection(db, this.ORDERS_COLLECTION),
        orderBy('createdAt', 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: doc.data().estimatedDelivery?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status'], limitCount?: number): Promise<Order[]> {
    if (!db) {
      console.warn('Firestore not initialized, returning empty array');
      return [];
    }

    try {
      let q = query(
        collection(db, this.ORDERS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: doc.data().estimatedDelivery?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'cancelled');
  }

  // Get order statistics
  async getOrderStats(userId?: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    if (!db) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };
    }

    try {
      let q = query(collection(db, this.ORDERS_COLLECTION));
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: doc.data().estimatedDelivery?.toDate(),
      })) as Order[];

      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      const pendingOrders = orders.filter(order => 
        ['pending', 'confirmed', 'processing'].includes(order.status)
      ).length;
      const completedOrders = orders.filter(order => 
        order.status === 'delivered'
      ).length;

      return {
        totalOrders,
        totalSpent,
        averageOrderValue,
        pendingOrders,
        completedOrders,
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };
    }
  }
}

// Export singleton instance
export const ordersService = new OrdersService();
