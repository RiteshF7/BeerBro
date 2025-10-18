const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and place it as 'firebase-service-account.json' in the root directory
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

async function setAdminRole() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node scripts/set-admin-role.js <email>');
      console.log('Example: node scripts/set-admin-role.js admin@beerbro.com');
      process.exit(1);
    }
    
    console.log(`Setting admin role for user: ${email}`);
    
    // Get the user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log('Found user:', userRecord.uid);
    
    // Set custom claim for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    
    console.log('✅ Admin role set successfully!');
    console.log('User UID:', userRecord.uid);
    console.log('Email:', email);
    console.log('Role: admin');
    console.log('\nNote: The user may need to sign out and sign back in for the changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('❌ User not found with that email address');
    } else {
      console.error('❌ Error setting admin role:', error);
    }
    process.exit(1);
  }
}

setAdminRole();
