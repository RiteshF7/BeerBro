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
  if (!db) throw new Error('Firestore not initialized');
  
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as OrderWithId[];
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
