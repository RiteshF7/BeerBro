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
import { UserWithId, UserFormData } from './types';

const USERS_COLLECTION = 'users';

export async function getUsers(): Promise<UserWithId[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  })) as UserWithId[];
}

export async function getUser(id: string): Promise<UserWithId | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, USERS_COLLECTION, id);
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    lastLoginAt: snapshot.data().lastLoginAt?.toDate(),
  } as UserWithId;
}

export async function getUserByEmail(email: string): Promise<UserWithId | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  } as UserWithId;
}

export async function createUser(userData: UserFormData): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = collection(db, USERS_COLLECTION);
  const docRef = await addDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function updateUser(
  id: string,
  userData: Partial<UserFormData>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, USERS_COLLECTION, id);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserRole(
  id: string, 
  role: string
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, USERS_COLLECTION, id);
  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function toggleUserStatus(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, USERS_COLLECTION, id);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const currentStatus = userDoc.data().isActive;
  await updateDoc(userRef, {
    isActive: !currentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUser(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, USERS_COLLECTION, id);
  await deleteDoc(userRef);
}
