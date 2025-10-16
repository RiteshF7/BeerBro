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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ProductWithId, ProductFormData } from './types';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<ProductWithId[]> {
  if (!db) throw new Error('Firestore not initialized');
  
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as ProductWithId[];
}

export async function getProduct(id: string): Promise<ProductWithId | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(productRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
  } as ProductWithId;
}

export async function createProduct(
  productData: ProductFormData,
  imageFile?: File
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  
  let imageUrl: string | undefined;
  
  // Upload image if provided
  if (imageFile && storage) {
    const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(snapshot.ref);
  }
  
  const productRef = collection(db, PRODUCTS_COLLECTION);
  const docRef = await addDoc(productRef, {
    ...productData,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

export async function updateProduct(
  id: string,
  productData: Partial<ProductFormData>,
  imageFile?: File
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  const updateData: Record<string, unknown> = {
    ...productData,
    updatedAt: serverTimestamp(),
  };
  
  // Upload new image if provided
  if (imageFile && storage) {
    const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);
    updateData.imageUrl = imageUrl;
  }
  
  await updateDoc(productRef, updateData);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  // Get product to check for image
  const product = await getProduct(id);
  
  // Delete image from storage if exists
  if (product?.imageUrl && storage) {
    try {
      const imageRef = ref(storage, product.imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn('Failed to delete image from storage:', error);
    }
  }
  
  // Delete product document
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(productRef);
}
