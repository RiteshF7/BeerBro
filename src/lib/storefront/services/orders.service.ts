import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, ShippingAddress, PaymentMethod } from './cart.service';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

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
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      console.log('🔄 OrdersService: Creating order...', { userId: orderData.userId, total: orderData.total });

      const orderDoc = {
        ...orderData,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.ORDERS_COLLECTION), orderDoc);
      console.log('✅ OrdersService: Order created successfully', { orderId: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error('❌ OrdersService: Error creating order:', error);
      throw error;
    }
  }

  // Get orders for a specific user
  async getUserOrders(userId: string, limitCount?: number): Promise<Order[]> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return [];
      }

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
    try {
      if (!db) {
        console.error('❌ OrdersService: Firestore not initialized');
        return null;
      }

      console.log('🔄 OrdersService: Fetching order by ID...', { orderId });

      const orderRef = doc(db, this.ORDERS_COLLECTION, orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        console.log('❌ OrdersService: Order not found', { orderId });
        return null;
      }

      const order = {
        id: orderDoc.id,
        ...orderDoc.data(),
        createdAt: orderDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: orderDoc.data().updatedAt?.toDate() || new Date(),
        estimatedDelivery: orderDoc.data().estimatedDelivery?.toDate(),
      } as Order;

      console.log('✅ OrdersService: Order found', { orderId, status: order.status, paymentStatus: order.paymentStatus });
      return order;
    } catch (error) {
      console.error('❌ OrdersService: Error fetching order:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], additionalData?: {
    trackingNumber?: string;
    estimatedDelivery?: Date;
  }): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

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

      const orderRef = doc(db, this.ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status in order
  async updateOrderPaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const orderRef = doc(db, this.ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order payment status:', error);
      throw error;
    }
  }

  // Get all orders (admin only)
  async getAllOrders(limitCount?: number): Promise<Order[]> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return [];
      }

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
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return [];
      }

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

  // Note: Order statistics should be calculated on the server side
  // and exposed through a dedicated API endpoint for better performance
}

// Export singleton instance
export const ordersService = new OrdersService();
