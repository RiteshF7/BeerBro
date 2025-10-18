import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
};

// Validate Firebase configuration
const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== 'demo-api-key' &&
    firebaseConfig.projectId !== 'demo-project' &&
    firebaseConfig.authDomain !== 'demo-project.firebaseapp.com'
  );
};

// Initialize Firebase only if we have valid configuration
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let database: Database | null = null;

try {
  if (getApps().length === 0 && isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else if (getApps().length > 0) {
    app = getApps()[0];
  }
  
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    database = getDatabase(app);
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.warn('Please check your environment variables and Firebase configuration.');
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firebase services
export { auth, db, storage, database, googleProvider, isFirebaseConfigured };

export default app;
