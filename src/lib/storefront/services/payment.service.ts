import { 
  ref, 
  set, 
  get, 
  onValue, 
  off, 
  push, 
  serverTimestamp 
} from 'firebase/database';
import { database } from '@/lib/firebase';

export interface PaymentStatus {
  id: string;
  orderId: string;
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  message?: string;
}

class PaymentService {
  private listeners: Map<string, () => void> = new Map();

  /**
   * Create a new payment record in Firebase Realtime Database
   */
  async createPayment(paymentData: Omit<PaymentStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!database) {
        throw new Error('Firebase Realtime Database not initialized');
      }

      const paymentRef = push(ref(database, 'payments'));
      const paymentId = paymentRef.key!;

      const payment: PaymentStatus = {
        id: paymentId,
        ...paymentData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await set(paymentRef, {
        ...payment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return paymentId;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    paymentId: string, 
    status: PaymentStatus['status'], 
    message?: string
  ): Promise<void> {
    try {
      if (!database) {
        throw new Error('Firebase Realtime Database not initialized');
      }

      const paymentRef = ref(database, `payments/${paymentId}`);
      
      await set(paymentRef, {
        status,
        message,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<PaymentStatus | null> {
    try {
      if (!database) {
        throw new Error('Firebase Realtime Database not initialized');
      }

      const paymentRef = ref(database, `payments/${paymentId}`);
      const snapshot = await get(paymentRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id: paymentId,
          orderId: data.orderId,
          paymentId: data.paymentId,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          userId: data.userId,
          message: data.message
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Listen to payment status changes in real-time
   */
  listenToPaymentStatus(
    paymentId: string, 
    callback: (payment: PaymentStatus | null) => void
  ): () => void {
    try {
      if (!database) {
        throw new Error('Firebase Realtime Database not initialized');
      }

      const paymentRef = ref(database, `payments/${paymentId}`);
      
      const listener = onValue(paymentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const payment: PaymentStatus = {
            id: paymentId,
            orderId: data.orderId,
            paymentId: data.paymentId,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            userId: data.userId,
            message: data.message
          };
          callback(payment);
        } else {
          callback(null);
        }
      });

      // Store the unsubscribe function
      const unsubscribe = () => {
        off(paymentRef, 'value', listener);
        this.listeners.delete(paymentId);
      };

      this.listeners.set(paymentId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up payment listener:', error);
      throw error;
    }
  }

  /**
   * Simulate payment processing (for demo purposes)
   * In a real app, this would be triggered by external payment gateway webhooks
   */
  async simulatePaymentProcessing(paymentId: string): Promise<void> {
    try {
      // Update to processing status
      await this.updatePaymentStatus(paymentId, 'processing', 'Payment is being processed...');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate completion (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        await this.updatePaymentStatus(paymentId, 'completed', 'Payment completed successfully!');
      } else {
        await this.updatePaymentStatus(paymentId, 'failed', 'Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Error simulating payment processing:', error);
      await this.updatePaymentStatus(paymentId, 'failed', 'Payment processing failed. Please try again.');
    }
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
