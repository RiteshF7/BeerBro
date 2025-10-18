import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
   * Create a new payment record in Firestore
   */
  async createPayment(paymentData: Omit<PaymentStatus, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const paymentDoc = {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentDoc);
      const paymentId = docRef.id;

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
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const paymentRef = doc(db, 'payments', paymentId);
      
      await updateDoc(paymentRef, {
        status,
        message,
        updatedAt: serverTimestamp()
      });
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
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const paymentRef = doc(db, 'payments', paymentId);
      const snapshot = await getDoc(paymentRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
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
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const paymentRef = doc(db, 'payments', paymentId);
      
      const unsubscribe = onSnapshot(paymentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
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
      this.listeners.set(paymentId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up payment listener:', error);
      throw error;
    }
  }

  // REMOVED: simulatePaymentProcessing method - no automatic processing

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
