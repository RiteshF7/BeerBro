import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
};

// Initialize Firebase only if we have valid configuration
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (getApps().length === 0 && firebaseConfig.apiKey !== 'demo-api-key') {
    app = initializeApp(firebaseConfig);
  } else if (getApps().length > 0) {
    app = getApps()[0];
  }
  
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed. Please check your environment variables.');
}

// Initialize Firebase services
export { auth, db, storage };

export default app;
