#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// This script uses Firebase CLI to seed data
// Make sure you're logged in: firebase login
// Make sure you're in the right project: firebase use pleasebringmebooze

function seedFirestoreWithCLI() {
  try {
    console.log('Starting Firestore seeding with Firebase CLI...');
    
    // Check if Firebase CLI is available
    try {
      execSync('firebase --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('Firebase CLI not found. Please install it: npm install -g firebase-tools');
      process.exit(1);
    }
    
    // Check if user is logged in
    try {
      execSync('firebase projects:list', { stdio: 'pipe' });
    } catch (error) {
      console.error('Please login to Firebase: firebase login');
      process.exit(1);
    }
    
    console.log('Firebase CLI is ready. Please manually add data to Firestore using:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project: pleasebringmebooze');
    console.log('3. Go to Firestore Database');
    console.log('4. Create collections: products and categories');
    console.log('5. Add documents using the structure from firestore-seed-data.json');
    
    console.log('\nAlternatively, you can use the Firebase Admin SDK script:');
    console.log('1. Download service account key from Firebase Console');
    console.log('2. Place it in the project root');
    console.log('3. Update the path in scripts/seed-firestore.js');
    console.log('4. Run: node scripts/seed-firestore.js');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedFirestoreWithCLI();
