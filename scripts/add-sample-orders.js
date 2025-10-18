#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration - you'll need to set these environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

async function addSampleOrders() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const sampleOrders = [
      {
        userId: 'sample-user-1',
        userEmail: 'customer1@example.com',
        userName: 'John Doe',
        items: [
          {
            productId: 'beer-ipa-001',
            productName: 'Craft IPA Beer',
            quantity: 2,
            price: 12.99
          },
          {
            productId: 'beer-lager-002',
            productName: 'Premium Lager',
            quantity: 1,
            price: 10.99
          }
        ],
        total: 36.97,
        status: 'pending',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        userId: 'sample-user-2',
        userEmail: 'customer2@example.com',
        userName: 'Jane Smith',
        items: [
          {
            productId: 'wine-red-001',
            productName: 'Cabernet Sauvignon',
            quantity: 1,
            price: 24.99
          }
        ],
        total: 24.99,
        status: 'accepted',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        userId: 'sample-user-3',
        userEmail: 'customer3@example.com',
        userName: 'Bob Johnson',
        items: [
          {
            productId: 'spirits-whiskey-001',
            productName: 'Single Malt Whiskey',
            quantity: 1,
            price: 89.99
          },
          {
            productId: 'beer-stout-003',
            productName: 'Stout Porter',
            quantity: 3,
            price: 14.99
          }
        ],
        total: 134.96,
        status: 'rejected',
        shippingAddress: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    console.log('Adding sample orders to Firestore...');
    
    for (const order of sampleOrders) {
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log(`Added order with ID: ${docRef.id}`);
    }

    console.log('Sample orders added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample orders:', error);
    process.exit(1);
  }
}

// Check if required environment variables are set
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\nPlease set these environment variables and try again.');
  process.exit(1);
}

addSampleOrders();
