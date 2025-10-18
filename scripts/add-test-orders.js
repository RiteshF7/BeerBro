#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function addTestOrders() {
  try {
    console.log('🚀 Starting to add test orders...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');

    const testOrders = [
      {
        userId: 'test-user-1',
        userEmail: 'john.doe@example.com',
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
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        userId: 'test-user-2',
        userEmail: 'jane.smith@example.com',
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
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        userId: 'test-user-3',
        userEmail: 'bob.johnson@example.com',
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
            quantity: 2,
            price: 14.99
          }
        ],
        total: 119.97,
        status: 'rejected',
        shippingAddress: {
          street: '789 Pine Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        userId: 'test-user-4',
        userEmail: 'alice.wilson@example.com',
        userName: 'Alice Wilson',
        items: [
          {
            productId: 'beer-ipa-001',
            productName: 'Craft IPA Beer',
            quantity: 4,
            price: 12.99
          }
        ],
        total: 51.96,
        status: 'failed',
        shippingAddress: {
          street: '321 Elm Street',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    console.log(`📦 Adding ${testOrders.length} test orders to Firestore...`);
    
    for (let i = 0; i < testOrders.length; i++) {
      const order = testOrders[i];
      console.log(`📝 Adding order ${i + 1}: ${order.userName} - $${order.total}`);
      
      const docRef = await addDoc(collection(db, 'orders'), order);
      console.log(`✅ Order added with ID: ${docRef.id}`);
    }

    console.log('🎉 All test orders added successfully!');
    console.log('📊 Summary:');
    console.log(`   - Total orders: ${testOrders.length}`);
    console.log(`   - Pending: ${testOrders.filter(o => o.status === 'pending').length}`);
    console.log(`   - Accepted: ${testOrders.filter(o => o.status === 'accepted').length}`);
    console.log(`   - Rejected: ${testOrders.filter(o => o.status === 'rejected').length}`);
    console.log(`   - Failed: ${testOrders.filter(o => o.status === 'failed').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test orders:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Check if required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these environment variables in your .env.local file and try again.');
  process.exit(1);
}

addTestOrders();
