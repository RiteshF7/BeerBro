import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  limit,
  WhereFilterOp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from './firebase';

// Auth utilities
export const authUtils = {
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Create user with email and password
  createUserWithEmail: async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    return await signInWithPopup(auth, provider);
  },

  // Sign out
  signOut: async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    return await signOut(auth);
  },

  // Reset password
  resetPassword: async (email: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    return await sendPasswordResetEmail(auth, email);
  },

  // Update user profile
  updateUserProfile: async (user: User, updates: { displayName?: string; photoURL?: string }) => {
    return await updateProfile(user, updates);
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    return onAuthStateChanged(auth, callback);
  },

  // Update user email
  updateUserEmail: async (newEmail: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (auth.currentUser) {
      return await updateEmail(auth.currentUser, newEmail);
    }
    throw new Error('No user is currently signed in');
  },

  // Update user password
  updateUserPassword: async (newPassword: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (auth.currentUser) {
      return await updatePassword(auth.currentUser, newPassword);
    }
    throw new Error('No user is currently signed in');
  },

  // Reauthenticate user (required for sensitive operations)
  reauthenticateUser: async (password: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (auth.currentUser && auth.currentUser.email) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      return await reauthenticateWithCredential(auth.currentUser, credential);
    }
    throw new Error('No user is currently signed in or user has no email');
  },

  // Delete user account
  deleteUserAccount: async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    if (auth.currentUser) {
      return await deleteUser(auth.currentUser);
    }
    throw new Error('No user is currently signed in');
  }
};

// Firestore utilities
export const firestoreUtils = {
  // Create document
  createDocument: async (collectionName: string, data: Record<string, unknown>, docId?: string) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    if (docId) {
      return await setDoc(doc(db, collectionName, docId), data);
    } else {
      return await addDoc(collection(db, collectionName), data);
    }
  },

  // Get document
  getDocument: async (collectionName: string, docId: string) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update document
  updateDocument: async (collectionName: string, docId: string, data: Record<string, unknown>) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    return await updateDoc(doc(db, collectionName, docId), data);
  },

  // Delete document
  deleteDocument: async (collectionName: string, docId: string) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    return await deleteDoc(doc(db, collectionName, docId));
  },

  // Get collection
  getCollection: async (collectionName: string, limitCount?: number) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    let q = query(collection(db, collectionName));
    if (limitCount) {
      q = query(collection(db, collectionName), limit(limitCount));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Query collection
  queryCollection: async (
    collectionName: string, 
    field: string, 
    operator: WhereFilterOp, 
    value: unknown
  ) => {
    if (!db) throw new Error('Firebase Firestore is not initialized. Please check your environment variables.');
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Storage utilities
export const storageUtils = {
  // Upload file
  uploadFile: async (file: File, path: string) => {
    if (!storage) throw new Error('Firebase Storage is not initialized. Please check your environment variables.');
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Get download URL
  getDownloadURL: async (path: string) => {
    if (!storage) throw new Error('Firebase Storage is not initialized. Please check your environment variables.');
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // Delete file
  deleteFile: async (path: string) => {
    if (!storage) throw new Error('Firebase Storage is not initialized. Please check your environment variables.');
    const storageRef = ref(storage, path);
    return await deleteObject(storageRef);
  }
};
