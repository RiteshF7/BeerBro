#!/usr/bin/env node

/**
 * Script to guide setting admin role via Firebase Console
 * This is the safest and easiest method
 */

const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/set-admin-via-console.js <email>');
  console.log('Example: node scripts/set-admin-via-console.js riteshf7@gmail.com');
  process.exit(1);
}

console.log('🎯 Setting Admin Role via Firebase Console');
console.log('==========================================');
console.log('');
console.log(`📧 Target User: ${email}`);
console.log('');
console.log('📋 Step-by-Step Instructions:');
console.log('');
console.log('1️⃣  Open Firebase Console');
console.log('   👉 https://console.firebase.google.com');
console.log('');
console.log('2️⃣  Select Your Project');
console.log('   👉 pleasebringmebooze');
console.log('');
console.log('3️⃣  Go to Authentication');
console.log('   👉 Click "Authentication" in the left sidebar');
console.log('   👉 Click "Users" tab');
console.log('');
console.log('4️⃣  Find the User');
console.log(`   👉 Look for: ${email}`);
console.log('   👉 Click on the user row to open details');
console.log('');
console.log('5️⃣  Add Custom Claims');
console.log('   👉 Scroll down to "Custom claims" section');
console.log('   👉 Click "Add custom claim"');
console.log('   👉 Key: role');
console.log('   👉 Value: admin');
console.log('   👉 Click "Save"');
console.log('');
console.log('6️⃣  Verify the Change');
console.log('   👉 Custom claims should show: {"role": "admin"}');
console.log('');
console.log('🧪 Testing the Changes:');
console.log('');
console.log('1. Have the user sign out of your application');
console.log('2. Sign back in with Google');
console.log('3. Go to /admin/dashboard');
console.log('4. Check browser console for admin status logs');
console.log('');
console.log('✅ Expected Result:');
console.log('   - User should have access to admin dashboard');
console.log('   - No redirect to landing page');
console.log('   - Console should show: "isAdmin: Is admin? true"');
console.log('');
console.log('🔍 Troubleshooting:');
console.log('   - If still redirecting: User needs to sign out/in again');
console.log('   - If user not found: User must sign up through your app first');
console.log('   - If custom claims not showing: Wait a few minutes and try again');
console.log('');
console.log('💡 Alternative: Use the script method');
console.log('   - Download service account key from Firebase Console');
console.log('   - Run: node scripts/make-google-user-admin.js riteshf7@gmail.com');
console.log('');
