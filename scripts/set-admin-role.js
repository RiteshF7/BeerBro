const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and place it as 'firebase-service-account.json' in the root directory

async function setAdminRole() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node scripts/set-admin-role.js <email>');
      console.log('Example: node scripts/set-admin-role.js admin@beerbro.com');
      console.log('');
      console.log('This script will set custom claims for admin role.');
      console.log('Make sure you have firebase-service-account.json in the root directory.');
      process.exit(1);
    }
    
    // Check if service account file exists
    try {
      const serviceAccount = require('../firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } catch (error) {
      console.error('❌ Firebase service account file not found!');
      console.log('');
      console.log('📝 To set up Firebase Admin SDK:');
      console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('2. Click "Generate new private key"');
      console.log('3. Download the JSON file');
      console.log('4. Rename it to "firebase-service-account.json"');
      console.log('5. Place it in the root directory of your project');
      console.log('');
      console.log('⚠️  Make sure to add "firebase-service-account.json" to your .gitignore file!');
      process.exit(1);
    }
    
    console.log(`🚀 Setting admin role for user: ${email}`);
    
    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log('✅ Found user:', userRecord.uid);
    
    // Set custom claim for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    
    console.log('🎉 Admin role set successfully!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Role: admin (custom claim)`);
    console.log('');
    console.log('⚠️  Important: The user may need to sign out and sign back in for the changes to take effect.');
    console.log('   Custom claims are cached in the client-side token.');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('❌ User not found with that email address');
      console.log('');
      console.log('💡 Make sure the user has signed up through your app first.');
    } else {
      console.error('❌ Error setting admin role:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message
      });
    }
    process.exit(1);
  }
}

setAdminRole();
