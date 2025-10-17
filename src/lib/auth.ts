import { auth } from './firebase';
import { User } from 'firebase/auth';

// Admin email addresses - in production, this should be stored in Firestore or environment variables
const ADMIN_EMAILS = [
  'noip9211@gmail.com',
  'admin@example.com', // Add your admin emails here
];

export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email);
};

export const requireAdmin = async (): Promise<User> => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = auth!.onAuthStateChanged((user) => {
      unsubscribe();
      
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      if (!isAdmin(user)) {
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
