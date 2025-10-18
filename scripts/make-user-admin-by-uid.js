#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } = require('firebase/firestore');
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

async function makeUserAdminByUID() {
  try {
    const uid = process.argv[2];
    
    if (!uid) {
      console.log('Usage: node scripts/make-user-admin-by-uid.js <user-uid>');
      console.log('Example: node scripts/make-user-admin-by-uid.js F6qic9mdF6fB9KPQB0QaUvekWRF2');
      console.log('');
      console.log('This script will:');
      console.log('1. Find the user document by UID in Firestore');
      console.log('2. Update their role to "admin"');
      console.log('3. Allow them to access admin features');
      console.log('');
      console.log('💡 To find a user\'s UID:');
      console.log('1. Go to Firebase Console → Authentication → Users');
      console.log('2. Find the user and copy their UID');
      console.log('3. Or check the browser console when the user is logged in');
      process.exit(1);
    }
    
    console.log('🚀 Starting to make user admin...');
    console.log(`🆔 User UID: ${uid}`);
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    
    // Check if user document exists
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found in Firestore!');
      console.log('');
      console.log('📝 The user needs to have a document in the "users" collection first.');
      console.log('   This usually happens when a user:');
      console.log('   1. Signs up through your app');
      console.log('   2. Completes their profile');
      console.log('   3. Or when you create their document manually');
      console.log('');
      console.log('🔧 To create the user document:');
      console.log('   1. Have the user sign up/login to your app');
      console.log('   2. Or create the document manually in Firebase Console');
      console.log('   3. Then run this script again');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    console.log('👤 Found user:', {
      email: userData.email,
      displayName: userData.displayName,
      currentRole: userData.role || 'user',
      uid: uid
    });
    
    // Update the user's role to admin
    await updateDoc(userDocRef, {
      role: 'admin',
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ User role updated to admin successfully!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${userData.email}`);
    console.log(`   Name: ${userData.displayName || 'No name'}`);
    console.log(`   UID: ${uid}`);
    console.log(`   Role: admin`);
    console.log('');
    console.log('🎉 The user can now access admin features!');
    console.log('   They may need to refresh the page or sign out/in for changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

makeUserAdminByUID();
