import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OrderWithId, OrderFormData } from './types';

const ORDERS_COLLECTION = 'orders';

export async function getOrders(): Promise<OrderWithId[]> {
  console.log('🔥 OrdersAPI: Starting getOrders function');
  
  if (!db) {
    console.error('❌ OrdersAPI: Firestore not initialized');
    throw new Error('Firestore not initialized');
  }
  
  console.log('🔥 OrdersAPI: Firestore is initialized, proceeding with query');
  
  const ordersRef = collection(db, ORDERS_COLLECTION);
  console.log('🔥 OrdersAPI: Created collection reference for:', ORDERS_COLLECTION);
  
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  console.log('🔥 OrdersAPI: Created query with orderBy createdAt desc');
  
  console.log('🔥 OrdersAPI: Executing Firestore query...');
  const snapshot = await getDocs(q);
  console.log('🔥 OrdersAPI: Query executed, snapshot received');
  console.log('🔥 OrdersAPI: Snapshot size:', snapshot.size);
  console.log('🔥 OrdersAPI: Snapshot empty:', snapshot.empty);
  
  if (snapshot.empty) {
    console.log('⚠️ OrdersAPI: No orders found in Firestore');
    return [];
  }
  
  console.log('🔥 OrdersAPI: Processing', snapshot.docs.length, 'order documents');
  
  const orders = snapshot.docs.map((doc, index) => {
    const data = doc.data();
    console.log(`🔥 OrdersAPI: Processing order ${index + 1}:`, {
      id: doc.id,
      hasCreatedAt: !!data.createdAt,
      hasUpdatedAt: !!data.updatedAt,
      status: data.status,
      total: data.total,
      userEmail: data.userEmail,
      userName: data.userName
    });
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as OrderWithId;
  });
  
  console.log('✅ OrdersAPI: Successfully processed', orders.length, 'orders');
  console.log('✅ OrdersAPI: Final orders data:', orders);
  
  return orders;
}

export async function getOrdersByStatus(status: string): Promise<OrderWithId[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(
    ordersRef, 
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as OrderWithId[];
}

export async function getOrder(id: string): Promise<OrderWithId | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const orderRef = doc(db, ORDERS_COLLECTION, id);
  const snapshot = await getDoc(orderRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
  } as OrderWithId;
}

export async function createOrder(orderData: OrderFormData): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const orderRef = collection(db, ORDERS_COLLECTION);
  const docRef = await addDoc(orderRef, {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function updateOrderStatus(
  id: string, 
  status: string
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const orderRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrder(
  id: string,
  orderData: Partial<OrderFormData>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const orderRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(orderRef, {
    ...orderData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const orderRef = doc(db, ORDERS_COLLECTION, id);
  await deleteDoc(orderRef);
}
