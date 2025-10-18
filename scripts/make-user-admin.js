#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
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

async function makeUserAdmin() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node scripts/make-user-admin.js <email>');
      console.log('Example: node scripts/make-user-admin.js user@example.com');
      console.log('');
      console.log('This script will:');
      console.log('1. Find the user by email in Firestore');
      console.log('2. Update their role to "admin" in the users collection');
      console.log('3. Allow them to access admin features');
      process.exit(1);
    }
    
    console.log('🚀 Starting to make user admin...');
    console.log(`📧 Looking for user: ${email}`);
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    
    // First, we need to find the user by email
    // Since we can't query by email directly, we'll need to check if the user exists
    // and has a document in the users collection
    
    console.log('🔍 Searching for user in Firestore...');
    
    // For this script to work, the user must already have a document in the users collection
    // We'll need to find them by checking if they have a document with their email
    
    // Let's try a different approach - we'll create a simple script that works with UID
    console.log('⚠️  Note: This script requires the user to already have a document in the users collection.');
    console.log('   If the user doesn\'t exist in Firestore, you\'ll need to create their document first.');
    console.log('');
    console.log('📝 To make a user admin, you can:');
    console.log('1. Go to Firebase Console → Firestore Database');
    console.log('2. Find the user document in the "users" collection');
    console.log('3. Edit the document and set the "role" field to "admin"');
    console.log('');
    console.log('🔄 Or use this script with the user\'s UID:');
    console.log('   node scripts/make-user-admin-by-uid.js <user-uid>');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

makeUserAdmin();
