#!/usr/bin/env node

/**
 * Guide to get Firebase Service Account Key
 */

console.log('🔑 Getting Firebase Service Account Key');
console.log('=======================================');
console.log('');
console.log('📋 Step-by-Step Instructions:');
console.log('');
console.log('1️⃣  Open Firebase Console');
console.log('   👉 https://console.firebase.google.com');
console.log('');
console.log('2️⃣  Select Your Project');
console.log('   👉 pleasebringmebooze');
console.log('');
console.log('3️⃣  Go to Project Settings');
console.log('   👉 Click the gear icon (⚙️) in the top left');
console.log('   👉 Click "Project settings"');
console.log('');
console.log('4️⃣  Go to Service Accounts Tab');
console.log('   👉 Click "Service accounts" tab');
console.log('');
console.log('5️⃣  Generate New Private Key');
console.log('   👉 Click "Generate new private key"');
console.log('   👉 Click "Generate key" in the confirmation dialog');
console.log('   👉 A JSON file will download automatically');
console.log('');
console.log('6️⃣  Set Up the Key File');
console.log('   👉 Rename the downloaded file to: firebase-service-account.json');
console.log('   👉 Move it to your project root: E:\\beerbro\\');
console.log('   👉 Make sure it\'s in .gitignore (already done)');
console.log('');
console.log('7️⃣  Run the Admin Script');
console.log('   👉 node scripts/make-google-user-admin.js riteshf7@gmail.com');
console.log('');
console.log('⚠️  Security Notes:');
console.log('   - Never commit the service account key to git');
console.log('   - Keep the key file secure and private');
console.log('   - The key gives full admin access to your Firebase project');
console.log('');
console.log('💡 Alternative: Use Firebase Console method instead');
console.log('   - Run: node scripts/set-admin-via-console.js riteshf7@gmail.com');
console.log('   - This is safer and doesn\'t require downloading sensitive files');
console.log('');
