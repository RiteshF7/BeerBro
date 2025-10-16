# Firebase Setup Instructions

This project has been configured with Firebase integration. Follow these steps to complete the setup:

## 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

## 2. Login to Firebase

```bash
firebase login
```

## 3. Initialize Firebase in your project

```bash
firebase init
```

Select the following services:
- Authentication
- Firestore Database
- Hosting
- Storage

## 4. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name
4. Enable Google Analytics (optional)
5. Create the project

## 5. Configure Firebase Services

### Authentication
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Enable Google authentication:
   - Click on Google provider
   - Toggle "Enable"
   - Add your project support email
   - Save the configuration

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (you can change rules later)
4. Select a location for your database

### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode" (you can change rules later)
4. Select a location for your storage

## 6. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 7. Set Environment Variables

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Fill in your Firebase configuration values in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 8. Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Scroll down to see the Firebase example component
4. Try signing up, signing in, and creating documents

## Firebase Features Included

### Authentication
- Email/Password authentication
- Google Sign-In with profile data
- Password reset
- User profile management
- Account deletion
- Email and password updates

### Firestore Database
- Create, read, update, delete documents
- Query collections
- Real-time listeners

### Storage
- File upload and download
- Image storage
- File management

### Security Rules
- Firestore security rules
- Storage security rules
- User-based access control

## Firebase CLI Commands

```bash
# Start Firebase emulators for local development
firebase emulators:start

# Deploy to Firebase
firebase deploy

# Deploy only specific services
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only hosting

# View logs
firebase functions:log
```

## Project Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   └── firebase-utils.ts    # Firebase utility functions
├── contexts/
│   └── FirebaseContext.tsx  # Firebase React context
└── components/
    ├── FirebaseExample.tsx  # Authentication component
    └── UserProfile.tsx      # User profile management

# Firebase configuration files
├── firebase.json           # Firebase project configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
└── storage.rules          # Storage security rules
```

## Next Steps

1. Customize the security rules in `firestore.rules` and `storage.rules`
2. Update the Firebase context and utilities for your specific use case
3. Add your own components that use Firebase services
4. Configure Firebase Hosting for deployment

## Troubleshooting

- Make sure all environment variables are set correctly
- Check Firebase Console for any configuration issues
- Ensure Firebase CLI is logged in with the correct account
- Verify that your Firebase project has the required services enabled
