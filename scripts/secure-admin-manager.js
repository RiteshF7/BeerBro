#!/usr/bin/env node

const admin = require('firebase-admin');
const readline = require('readline');
require('dotenv').config();

// Create readline interface for secure input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Secure input function
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// List all users
async function listUsers() {
  try {
    console.log('🔍 Fetching all users...');
    const listUsersResult = await admin.auth().listUsers();
    
    if (listUsersResult.users.length === 0) {
      console.log('📭 No users found.');
      return;
    }
    
    console.log(`👥 Found ${listUsersResult.users.length} users:`);
    console.log('');
    
    listUsersResult.users.forEach((userRecord, index) => {
      const customClaims = userRecord.customClaims || {};
      const isAdmin = customClaims.role === 'admin';
      
      console.log(`${index + 1}. ${userRecord.displayName || 'No name'}`);
      console.log(`   📧 Email: ${userRecord.email}`);
      console.log(`   🆔 UID: ${userRecord.uid}`);
      console.log(`   👑 Role: ${isAdmin ? 'Admin' : 'User'}`);
      console.log(`   📅 Created: ${new Date(userRecord.metadata.creationTime).toLocaleDateString()}`);
      console.log(`   🔐 Email Verified: ${userRecord.emailVerified ? 'Yes' : 'No'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

// Make user admin
async function makeUserAdmin(email) {
  try {
    console.log(`🔍 Looking for user: ${email}`);
    
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (${userRecord.uid})`);
    
    // Check current role
    const currentClaims = userRecord.customClaims || {};
    if (currentClaims.role === 'admin') {
      console.log('⚠️  User is already an admin!');
      return;
    }
    
    // Confirm action
    const confirm = await askQuestion(`Are you sure you want to make ${email} an admin? (yes/no): `);
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }
    
    // Set admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
    
    console.log('🎉 User is now an admin!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Role: admin (custom claim)`);
    console.log('');
    console.log('⚠️  Important: The user must sign out and sign back in for changes to take effect.');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
      console.log('💡 Make sure the user has signed up through your app first.');
    } else {
      console.error('❌ Error making user admin:', error.message);
    }
  }
}

// Remove admin privileges
async function removeAdminPrivileges(email) {
  try {
    console.log(`🔍 Looking for user: ${email}`);
    
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || 'No name'} (${userRecord.uid})`);
    
    // Check current role
    const currentClaims = userRecord.customClaims || {};
    if (currentClaims.role !== 'admin') {
      console.log('⚠️  User is not an admin!');
      return;
    }
    
    // Confirm action
    const confirm = await askQuestion(`Are you sure you want to remove admin privileges from ${email}? (yes/no): `);
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }
    
    // Remove admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });
    
    console.log('✅ Admin privileges removed successfully!');
    console.log('');
    console.log('📋 User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Role: user (custom claim)`);
    console.log('');
    console.log('⚠️  Important: The user must sign out and sign back in for changes to take effect.');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ User not found: ${email}`);
    } else {
      console.error('❌ Error removing admin privileges:', error.message);
    }
  }
}

// Main menu
async function showMenu() {
  console.log('');
  console.log('🔐 Secure Admin Manager');
  console.log('======================');
  console.log('1. List all users');
  console.log('2. Make user admin');
  console.log('3. Remove admin privileges');
  console.log('4. Exit');
  console.log('');
  
  const choice = await askQuestion('Select an option (1-4): ');
  
  switch (choice) {
    case '1':
      await listUsers();
      break;
    case '2':
      const emailToMakeAdmin = await askQuestion('Enter user email: ');
      if (emailToMakeAdmin) {
        await makeUserAdmin(emailToMakeAdmin);
      }
      break;
    case '3':
      const emailToRemoveAdmin = await askQuestion('Enter user email: ');
      if (emailToRemoveAdmin) {
        await removeAdminPrivileges(emailToRemoveAdmin);
      }
      break;
    case '4':
      console.log('👋 Goodbye!');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('❌ Invalid option. Please select 1-4.');
  }
  
  // Show menu again
  await showMenu();
}

// Main function
async function main() {
  console.log('🚀 Starting Secure Admin Manager...');
  
  const initialized = await initializeFirebase();
  if (!initialized) {
    process.exit(1);
  }
  
  console.log('');
  console.log('⚠️  WARNING: This tool grants powerful admin privileges.');
  console.log('   Only use this if you are a trusted administrator.');
  console.log('');
  
  const confirm = await askQuestion('Do you understand the implications? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ Access denied. Exiting...');
    rl.close();
    process.exit(0);
  }
  
  await showMenu();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Run the application
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});
