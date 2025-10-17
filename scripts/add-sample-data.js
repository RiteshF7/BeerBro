#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This script creates a simple way to add sample data to Firestore
// You can copy and paste the output into Firebase Console

function generateSampleData() {
  const seedDataPath = path.join(__dirname, '../firestore-seed-data.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
  
  console.log('=== FIRESTORE SAMPLE DATA ===\n');
  
  console.log('1. Create "products" collection in Firestore Console');
  console.log('2. Add the following documents:\n');
  
  Object.entries(seedData.products).forEach(([docId, product]) => {
    console.log(`Document ID: ${docId}`);
    console.log('Data:');
    console.log(JSON.stringify(product, null, 2));
    console.log('\n---\n');
  });
  
  console.log('3. Create "categories" collection in Firestore Console');
  console.log('4. Add the following documents:\n');
  
  Object.entries(seedData.categories).forEach(([docId, category]) => {
    console.log(`Document ID: ${docId}`);
    console.log('Data:');
    console.log(JSON.stringify(category, null, 2));
    console.log('\n---\n');
  });
  
  console.log('=== INSTRUCTIONS ===');
  console.log('1. Go to: https://console.firebase.google.com/project/pleasebringmebooze/firestore');
  console.log('2. Click "Start collection"');
  console.log('3. Collection ID: "products"');
  console.log('4. Add each document with the ID and data shown above');
  console.log('5. Repeat for "categories" collection');
  console.log('6. Your app will now display the sample products!');
}

generateSampleData();
