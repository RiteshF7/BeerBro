const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdminUser() {
  try {
    const email = 'admin@beerbro.com';
    const password = 'admin123456';
    
    console.log('Creating admin user...');
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('User created:', user.uid);
    
    // Set custom claim for admin role
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('UID:', user.uid);
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists, setting admin role...');
      
      // Get the existing user
      const userRecord = await admin.auth().getUserByEmail('admin@beerbro.com');
      
      // Set custom claim for admin role
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
      
      console.log('✅ Admin role set for existing user!');
      console.log('Email: admin@beerbro.com');
      console.log('Password: admin123456');
      console.log('UID:', userRecord.uid);
      console.log('Role: admin');
      
      process.exit(0);
    } else {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
  }
}

createAdminUser();
