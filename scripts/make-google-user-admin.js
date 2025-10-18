#!/usr/bin/env node

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
async function initializeFirebase() {
  try {
    const serviceAccount = require('./firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
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
    console.log('5. Place it in the scripts directory');
    console.log('6. Add "firebase-service-account.json" to your .gitignore file');
    return false;
  }
}

async function makeGoogleUserAdmin() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node scripts/make-google-user-admin.js <email>');
      console.log('Example: node scripts/make-google-user-admin.js riteshf7@gmail.com');
      console.log('');
      console.log('This script will make a Google-authenticated user an admin.');
      console.log('The user must have already signed up through your app using Google Sign-In.');
      process.exit(1);
    }
    
    console.log(`🚀 Making ${email} an admin user...`);
    
    const initialized = await initializeFirebase();
    if (!initialized) {
      process.exit(1);
    }
    
    console.log(`🔍 Looking for user: ${email}`);
    
    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (${userRecord.uid})`);
    console.log(`📧 Email: ${userRecord.email}`);
    console.log(`🔐 Email Verified: ${userRecord.emailVerified}`);
    console.log(`📅 Created: ${new Date(userRecord.metadata.creationTime).toLocaleDateString()}`);
    console.log(`🔑 Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
    
    // Check if user is authenticated via Google
    const isGoogleUser = userRecord.providerData.some(provider => provider.providerId === 'google.com');
    if (!isGoogleUser) {
      console.log('⚠️  Warning: This user is not authenticated via Google');
      console.log(`   Providers: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
    } else {
      console.log('✅ User is authenticated via Google (passwordless auth)');
    }
    
    // Check current custom claims
    const currentClaims = userRecord.customClaims || {};
    console.log(`📋 Current custom claims: ${JSON.stringify(currentClaims)}`);
    
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
    console.log(`   Display Name: ${userRecord.displayName || 'No name'}`);
    console.log(`   Role: admin (custom claim)`);
    console.log(`   Provider: ${isGoogleUser ? 'Google (passwordless auth)' : 'Other'}`);
    console.log('');
    console.log('⚠️  Important: The user must sign out and sign back in for changes to take effect.');
    console.log('   Custom claims are cached in the client-side token.');
    console.log('');
    console.log('🧪 Test the changes:');
    console.log('1. Have the user sign out of your application');
    console.log('2. Sign back in with their authentication method');
    console.log('3. Go to /admin/dashboard');
    console.log('4. Check browser console for admin status logs');
    console.log('');
    console.log('🔍 To verify in Firebase Console:');
    console.log('1. Go to Firebase Console → Authentication → Users');
    console.log('2. Find the user by email');
    console.log('3. Check Custom claims section should show: {"role": "admin"}');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
      console.log('');
      console.log('💡 The user needs to sign up through your app first:');
      console.log('1. Go to your app\'s login page');
      console.log('2. Click "Sign in with Google" (or their preferred method)');
      console.log('3. Complete the registration process');
      console.log('4. Then run this script again');
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

// Check for service account key file
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Firebase service account key not found!');
  console.error('📁 Expected location:', serviceAccountPath);
  console.error('\n🔑 To get the service account key:');
  console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('2. Click "Generate new private key"');
  console.error('3. Download the JSON file');
  console.error('4. Rename it to "firebase-service-account.json"');
  console.error('5. Place it in your project root directory');
  console.error('\n💡 Alternative: Use Firebase Console → Authentication → Users → Custom Claims');
  process.exit(1);
}

makeGoogleUserAdmin();
