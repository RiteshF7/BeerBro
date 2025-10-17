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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LocationWithId, LocationFormData } from './types';

const LOCATIONS_COLLECTION = 'locations';

export async function getLocations(): Promise<LocationWithId[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const locationsRef = collection(db, LOCATIONS_COLLECTION);
  const q = query(locationsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as LocationWithId[];
}

export async function getLocation(id: string): Promise<LocationWithId | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const locationRef = doc(db, LOCATIONS_COLLECTION, id);
  const snapshot = await getDoc(locationRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
  } as LocationWithId;
}

export async function createLocation(locationData: LocationFormData): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  const locationRef = collection(db, LOCATIONS_COLLECTION);
  const docRef = await addDoc(locationRef, {
    ...locationData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function updateLocation(
  id: string,
  locationData: Partial<LocationFormData>
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const locationRef = doc(db, LOCATIONS_COLLECTION, id);
  await updateDoc(locationRef, {
    ...locationData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLocation(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const locationRef = doc(db, LOCATIONS_COLLECTION, id);
  await deleteDoc(locationRef);
}
