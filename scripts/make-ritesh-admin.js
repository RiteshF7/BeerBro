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

async function makeRiteshAdmin() {
  try {
    console.log('🚀 Making riteshf7@gmail.com an admin user...');
    
    const initialized = await initializeFirebase();
    if (!initialized) {
      process.exit(1);
    }
    
    const email = 'riteshf7@gmail.com';
    
    console.log(`🔍 Looking for user: ${email}`);
    
    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (${userRecord.uid})`);
    console.log(`📧 Email: ${userRecord.email}`);
    console.log(`🔐 Email Verified: ${userRecord.emailVerified}`);
    console.log(`📅 Created: ${new Date(userRecord.metadata.creationTime).toLocaleDateString()}`);
    console.log(`🔑 Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
    
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
    console.log(`   Provider: Google (passwordless auth)`);
    console.log('');
    console.log('⚠️  Important: The user must sign out and sign back in for changes to take effect.');
    console.log('   Custom claims are cached in the client-side token.');
    console.log('');
    console.log('🧪 Test the changes:');
    console.log('1. Have riteshf7@gmail.com sign out of your application');
    console.log('2. Sign back in with Google');
    console.log('3. Go to /admin/dashboard');
    console.log('4. Check browser console for admin status logs');
    console.log('');
    console.log('🔍 To verify in Firebase Console:');
    console.log('1. Go to Firebase Console → Authentication → Users');
    console.log('2. Find riteshf7@gmail.com');
    console.log('3. Check Custom claims section should show: {"role": "admin"}');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
      console.log('');
      console.log('💡 The user needs to sign up through your app first:');
      console.log('1. Go to your app\'s login page');
      console.log('2. Click "Sign in with Google"');
      console.log('3. Use riteshf7@gmail.com to sign in');
      console.log('4. Complete the registration process');
      console.log('5. Then run this script again');
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

// Check if required environment variables are set
const requiredEnvVars = [
  'FIREBASE_DATABASE_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these environment variables in your .env.local file and try again.');
  process.exit(1);
}

makeRiteshAdmin();
