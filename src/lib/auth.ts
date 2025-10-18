import { auth } from './firebase';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) {
    console.log('isAdmin: No user provided');
    return false;
  }
  
  try {
    if (!db) {
      console.error('isAdmin: Firestore not initialized');
      return false;
    }
    
    // Check user role from Firestore document
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('isAdmin: User document not found in Firestore');
      return false;
    }
    
    const userData = userDoc.data();
    const userRole = userData.role;
    
    console.log('isAdmin: User email:', user.email);
    console.log('isAdmin: User UID:', user.uid);
    console.log('isAdmin: User role from Firestore:', userRole);
    
    const isAdminUser = userRole === 'admin';
    console.log('isAdmin: Is admin?', isAdminUser);
    
    return isAdminUser;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const requireAdmin = async (): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  return new Promise(async (resolve, reject) => {
    const unsubscribe = auth!.onAuthStateChanged(async (user) => {
      unsubscribe();
      
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      const userIsAdmin = await isAdmin(user);
      if (!userIsAdmin) {
        reject(new Error('Access denied: Admin privileges required'));
        return;
      }

      resolve(user);
    }); 
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  if (!auth) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const unsubscribe = auth!.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
