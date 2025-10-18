# Firestore Database Setup Guide

This guide will help you set up the Firestore database structure for the BeerBro e-commerce application.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project created: `pleasebringmebooze`
3. Firestore enabled in your Firebase project

## Current Project Configuration

- **Project ID**: `pleasebringmebooze`
- **Database Location**: `asia-south1`
- **Firestore Rules**: `firestore.rules`
- **Indexes**: `firestore.indexes.json`

## Database Structure

### Collections

#### 1. Products Collection (`products`)
Each product document should have the following structure:

```json
{
  "id": "beer-ipa-001",
  "name": "Craft IPA Beer",
  "description": "A hoppy and aromatic India Pale Ale with citrus notes and a crisp finish.",
  "price": 12.99,
  "originalPrice": 15.99,
  "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop",
  "category": "Beer",
  "rating": 4.5,
  "reviewCount": 128,
  "inStock": true,
  "isOnSale": true,
  "isNew": false,
  "stockQuantity": 50,
  "tags": ["craft", "ipa", "hoppy", "citrus"],
  "alcoholContent": 6.5,
  "volume": 355,
  "brand": "Craft Brew Co",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 2. Categories Collection (`categories`)
Each category document should have the following structure:

```json
{
  "id": "beer",
  "name": "Beer",
  "description": "Craft and premium beers from around the world",
  "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop",
  "productCount": 3,
  "isPopular": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 3. Users Collection (`users`)
User profiles are automatically created when users sign up:

```json
{
  "uid": "user-firebase-uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "photoURL": "https://example.com/photo.jpg",
  "role": "customer",
  "status": "active",
  "isProfileComplete": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 4. Orders Collection (`orders`)
Orders are created when users complete checkout:

```json
{
  "id": "order-123",
  "userId": "user-firebase-uid",
  "items": [
    {
      "id": "cart-item-1",
      "product": { /* product object */ },
      "quantity": 2,
      "addedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States",
    "phone": "+1234567890"
  },
  "paymentMethod": {
    "type": "card",
    "cardNumber": "****1234",
    "expiryDate": "12/25",
    "cardholderName": "John Doe"
  },
  "subtotal": 25.98,
  "tax": 2.08,
  "shipping": 0,
  "total": 28.06,
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## Setup Instructions

### Method 1: Using Firebase Console (Recommended for beginners)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `pleasebringmebooze`

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click "Start collection"

3. **Create Products Collection**
   - Collection ID: `products`
   - Add documents using the structure above
   - Use the sample data from `firestore-seed-data.json`

4. **Create Categories Collection**
   - Collection ID: `categories`
   - Add documents using the structure above

### Method 2: Using Firebase CLI

1. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Run the Seeding Script**
   ```bash
   npm run firebase:seed
   ```

### Method 3: Using Firebase Admin SDK

1. **Download Service Account Key**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file in your project root

2. **Update the Script**
   - Edit `scripts/seed-firestore.js`
   - Update the path to your service account key

3. **Run the Script**
   ```bash
   node scripts/seed-firestore.js
   ```

## Firestore Rules

The current rules allow:
- **Products & Categories**: Public read access, authenticated write
- **Users**: Users can only access their own data
- **Orders**: Users can only access their own orders
- **Admin**: Admin-only access for administrative functions

## Testing the Setup

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Check the Application**
   - Visit: http://localhost:3000
   - You should see products loaded from Firestore
   - If no products appear, check the browser console for errors

3. **Test Cart Functionality**
   - Add products to cart
   - Proceed to checkout
   - Complete an order

## Troubleshooting

### Common Issues

1. **"No Products Available" Message**
   - Check if Firestore collections exist
   - Verify Firestore rules allow public read access
   - Check browser console for Firebase connection errors

2. **Firebase Connection Errors**
   - Verify Firebase configuration in `.env.local`
   - Check if Firebase project is active: `firebase use pleasebringmebooze`

3. **Permission Denied Errors**
   - Check Firestore rules
   - Ensure user is authenticated for write operations

### Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pleasebringmebooze.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pleasebringmebooze
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pleasebringmebooze.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Next Steps

1. Add more products and categories
2. Set up user authentication
3. Configure payment processing
4. Set up order management
5. Add product reviews and ratings
6. Implement search functionality
7. Add inventory management

## Support

If you encounter any issues:
1. Check the Firebase Console for errors
2. Review the browser console for client-side errors
3. Verify your Firebase configuration
4. Check the Firestore rules and indexes
