#!/usr/bin/env node

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
async function initializeFirebase() {
  try {
    const serviceAccount = require('../firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    console.log('');
    console.log('📝 Setup instructions:');
    console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
    console.log('2. Click "Generate new private key"');
    console.log('3. Download the JSON file');
    console.log('4. Rename it to "firebase-service-account.json"');
    console.log('5. Place it in the root directory of your project');
    console.log('6. Add "firebase-service-account.json" to your .gitignore file');
    return false;
  }
}

async function makeCurrentUserAdmin() {
  try {
    console.log('🚀 Making current user admin...');
    
    const initialized = await initializeFirebase();
    if (!initialized) {
      process.exit(1);
    }
    
    // Your current user email (from the Firestore data you showed earlier)
    const email = 'noip9211@gmail.com';
    
    console.log(`🔍 Looking for user: ${email}`);
    
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (${userRecord.uid})`);
    
    // Check current role
    const currentClaims = userRecord.customClaims || {};
    if (currentClaims.role === 'admin') {
      console.log('✅ User is already an admin!');
      console.log('');
      console.log('📋 Current Status:');
      console.log(`   Email: ${email}`);
      console.log(`   UID: ${userRecord.uid}`);
      console.log(`   Role: admin (custom claim)`);
      console.log(`   Custom Claims: ${JSON.stringify(currentClaims)}`);
      return;
    }
    
    // Set admin role
    console.log('🔧 Setting admin role...');
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    
    console.log('🎉 User is now an admin!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Role: admin (custom claim)`);
    console.log('');
    console.log('⚠️  Important: You must sign out and sign back in for changes to take effect.');
    console.log('   Custom claims are cached in the client-side token.');
    console.log('');
    console.log('🧪 Test the changes:');
    console.log('1. Sign out of your application');
    console.log('2. Sign back in');
    console.log('3. Go to /admin/dashboard');
    console.log('4. Check browser console for admin status logs');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
      console.log('💡 Make sure the user has signed up through your app first.');
    } else {
      console.error('❌ Error making user admin:', error.message);
      console.error('Error details:', {
        code: error.code,
        message: error.message
      });
    }
    process.exit(1);
  }
}

makeCurrentUserAdmin();
