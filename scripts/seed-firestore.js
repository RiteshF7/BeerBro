const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// You'll need to set up a service account key file
// Download it from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('../path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pleasebringmebooze-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

async function seedFirestore() {
  try {
    console.log('Starting Firestore seeding...');
    
    // Read the seed data
    const seedDataPath = path.join(__dirname, '../firestore-seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    
    // Seed products
    console.log('Seeding products...');
    const productsRef = db.collection('products');
    for (const [productId, productData] of Object.entries(seedData.products)) {
      await productsRef.doc(productId).set({
        ...productData,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(productData.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(productData.updatedAt))
      });
      console.log(`Added product: ${productData.name}`);
    }
    
    // Seed categories
    console.log('Seeding categories...');
    const categoriesRef = db.collection('categories');
    for (const [categoryId, categoryData] of Object.entries(seedData.categories)) {
      await categoriesRef.doc(categoryId).set({
        ...categoryData,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(categoryData.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(categoryData.updatedAt))
      });
      console.log(`Added category: ${categoryData.name}`);
    }
    
    console.log('Firestore seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();
