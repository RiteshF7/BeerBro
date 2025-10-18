#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCva9OrKnu9UhWXmjJClVnNOeD5hgyfP3g',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'pleasebringmebooze.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pleasebringmebooze',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'pleasebringmebooze.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '610788097923',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:610788097923:web:c5a63159312eac8af400b6',
};

async function listUsers() {
  try {
    console.log('🚀 Fetching all users from Firestore...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    
    // Get all users from Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('📭 No users found in Firestore.');
      console.log('');
      console.log('💡 Users will appear here when they:');
      console.log('   1. Sign up through your app');
      console.log('   2. Complete their profile');
      console.log('   3. Or when you create their document manually');
      process.exit(0);
    }
    
    console.log(`👥 Found ${snapshot.size} users:`);
    console.log('');
    
    snapshot.docs.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`${index + 1}. ${userData.displayName || 'No name'}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🆔 UID: ${doc.id}`);
      console.log(`   👑 Role: ${userData.role || 'user'}`);
      console.log(`   📅 Created: ${userData.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}`);
      console.log(`   📱 Phone: ${userData.phone || 'Not provided'}`);
      console.log('');
    });
    
    console.log('💡 To make a user admin, use:');
    console.log('   node scripts/make-user-admin-by-uid.js <UID>');
    console.log('');
    console.log('Example:');
    if (snapshot.docs.length > 0) {
      const firstUser = snapshot.docs[0];
      console.log(`   node scripts/make-user-admin-by-uid.js ${firstUser.id}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

listUsers();
