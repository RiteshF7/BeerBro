#!/usr/bin/env node

/**
 * Set admin custom claims using Firebase Admin SDK
 * Based on: https://firebase.google.com/docs/auth/admin/custom-claims
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check for service account key
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Firebase service account key not found!');
  console.error('📁 Expected location:', serviceAccountPath);
  console.error('');
  console.error('🔑 To get the service account key:');
  console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('2. Click "Generate new private key"');
  console.error('3. Download the JSON file');
  console.error('4. Rename it to "firebase-service-account.json"');
  console.error('5. Place it in the scripts directory');
  console.error('');
  console.error('💡 This is the official Firebase method for setting custom claims.');
  console.error('   See: https://firebase.google.com/docs/auth/admin/custom-claims');
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

async function setAdminClaims(email) {
  try {
    console.log(`🚀 Setting admin claims for: ${email}`);
    
    // Get user by email (following Firebase docs pattern)
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${user.displayName || 'No name'} (${user.uid})`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔐 Email Verified: ${user.emailVerified}`);
    console.log(`📅 Created: ${new Date(user.metadata.creationTime).toLocaleDateString()}`);
    
    // Check if user is verified (following Firebase docs best practice)
    if (!user.emailVerified) {
      console.log('⚠️  Warning: User email is not verified');
      console.log('   Proceeding anyway, but consider verifying email first');
    }
    
    // Check current custom claims
    const currentClaims = user.customClaims || {};
    console.log(`📋 Current custom claims: ${JSON.stringify(currentClaims)}`);
    
    if (currentClaims.role === 'admin') {
      console.log('✅ User is already an admin!');
      console.log('');
      console.log('📋 Current Status:');
      console.log(`   Email: ${email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Role: admin (custom claim)`);
      console.log(`   Custom Claims: ${JSON.stringify(currentClaims)}`);
      return;
    }
    
    // Set admin role (following Firebase docs pattern)
    console.log('🔧 Setting admin role...');
    await admin.auth().setCustomUserClaims(user.uid, { 
      role: 'admin' 
    });
    
    console.log('🎉 User is now an admin!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Display Name: ${user.displayName || 'No name'}`);
    console.log(`   Role: admin (custom claim)`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    console.log('');
    console.log('⚠️  Important: The user must sign out and sign back in for changes to take effect.');
    console.log('   Custom claims are cached in the client-side token.');
    console.log('');
    console.log('🧪 Testing the changes:');
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
      console.error('❌ Error setting admin claims:', error.message);
      console.error('Error details:', {
        code: error.code,
        message: error.message
      });
    }
    process.exit(1);
  }
}

// Main execution
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/set-admin-claims.js <email>');
  console.log('Example: node scripts/set-admin-claims.js riteshf7@gmail.com');
  console.log('');
  console.log('This script sets admin custom claims for a user.');
  console.log('Based on: https://firebase.google.com/docs/auth/admin/custom-claims');
  process.exit(1);
}

setAdminClaims(email);
