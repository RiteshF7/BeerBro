# Firebase Vercel Troubleshooting Guide

## Common Firebase Issues on Vercel

### 1. Environment Variables Not Set

**Problem**: Firebase services return errors or don't initialize.

**Solution**: 
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables (copy from `vercel-env-variables.txt`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCva9OrKnu9UhWXmjJClVnNOeD5hgyfP3g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pleasebringmebooze.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pleasebringmebooze
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pleasebringmebooze.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=610788097923
NEXT_PUBLIC_FIREBASE_APP_ID=1:610788097923:web:c5a63159312eac8af400b6
```

**Important**: 
- Set these for **Production**, **Preview**, and **Development** environments
- Make sure there are no extra spaces or quotes
- Redeploy after adding environment variables

### 2. Firebase Authorized Domains

**Problem**: Authentication fails with "unauthorized domain" errors.

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `pleasebringmebooze`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domains:
   - `your-app.vercel.app` (your main domain)
   - `your-app-git-main-yourusername.vercel.app` (preview deployments)
   - `localhost` (for local development)

### 3. Firestore Security Rules

**Problem**: Database operations fail with permission errors.

**Current Rules** (from `firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**If you need to update rules**:
1. Go to Firebase Console → **Firestore Database** → **Rules**
2. Update the rules as needed
3. Click **Publish**

### 4. Firebase Storage Rules

**Problem**: File uploads fail.

**Current Rules** (from `storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. CORS Issues

**Problem**: Cross-origin requests blocked.

**Solution**: 
- Firebase automatically handles CORS for web apps
- Make sure your domain is in authorized domains
- Check browser console for specific CORS errors

### 6. Firebase Project Status

**Verify your Firebase project is active**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Check project: `pleasebringmebooze`
3. Ensure these services are enabled:
   - ✅ **Authentication** (with Google provider)
   - ✅ **Firestore Database**
   - ✅ **Storage** (if using file uploads)

### 7. Debugging Steps

**Check Vercel deployment logs**:
1. Go to Vercel dashboard → **Functions** tab
2. Look for error logs in your API routes
3. Check browser console for client-side errors

**Test Firebase connection**:
```javascript
// Add this to any page to test Firebase
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
```

### 8. Common Error Messages

**"Firebase: Error (auth/unauthorized-domain)"**
- Add your Vercel domain to Firebase authorized domains

**"Firebase: Error (auth/api-key-not-valid)"**
- Check environment variables are set correctly
- Verify API key is correct

**"Firebase: Error (firestore/permission-denied)"**
- Check Firestore security rules
- Ensure user is authenticated

**"Firebase: Error (app/no-app)"**
- Firebase not initialized properly
- Check environment variables

### 9. Quick Fix Checklist

- [ ] Environment variables set in Vercel
- [ ] Vercel domains added to Firebase authorized domains
- [ ] Firebase project is active and services enabled
- [ ] Firestore rules allow authenticated access
- [ ] Redeployed after making changes
- [ ] Checked browser console for errors
- [ ] Checked Vercel function logs

### 10. Testing Your Setup

**Test Authentication**:
1. Visit your deployed app
2. Try to sign in with Google
3. Check if user data is saved to Firestore

**Test Database**:
1. Sign in to your app
2. Try to create/read data
3. Check Firestore console for new documents

**Test API Routes**:
1. Visit `/api/products` or similar endpoints
2. Check Vercel function logs for errors

## Still Having Issues?

1. **Check Vercel deployment logs** for specific error messages
2. **Test locally** with the same environment variables
3. **Verify Firebase project settings** in Firebase Console
4. **Check browser network tab** for failed requests

## Support Resources

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Authentication Setup](https://firebase.google.com/docs/auth/web/google-signin)
