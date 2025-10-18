# Admin Management Guide

This guide explains how to manage admin users in your BeerBro application using Firebase custom claims.

## Admin System Overview

Your application uses Firebase custom claims for admin authentication. Users with the `role: 'admin'` custom claim can:
- Access the admin console at `/admin`
- View and manage orders, products, users, and locations
- Perform all administrative tasks

## How to Make Someone an Admin

### Using Firebase Console (Recommended)

1. **Go to Firebase Console**:
   - Navigate to [Firebase Console](https://console.firebase.google.com)
   - Select your project (`pleasebringmebooze`)

2. **Access Authentication**:
   - Click on "Authentication" in the left sidebar
   - Go to the "Users" tab

3. **Find the User**:
   - Search for the user by email
   - Click on their user record

4. **Add Custom Claims**:
   - Scroll down to "Custom claims" section
   - Click "Add custom claim"
   - Set the key as: `role`
   - Set the value as: `admin`
   - Click "Save"

5. **Verify the Claim**:
   - The user should now see `role: "admin"` in their custom claims
   - They can immediately access the admin console

### Using Firebase Admin SDK (For Developers)

If you have access to the Firebase Admin SDK, you can programmatically set custom claims:

```javascript
const admin = require('firebase-admin');

// Set custom claims for a user
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

## Security Features

- **Single Source of Truth**: Only Firebase custom claims determine admin access
- **No Code Changes**: Admin status is managed entirely through Firebase
- **Immediate Effect**: Changes take effect immediately without code deployment
- **Secure**: Custom claims are verified server-side by Firestore rules

## Firestore Rules

The Firestore rules automatically check for the `role: 'admin'` custom claim:

```javascript
// Example rule
allow read, write: if request.auth != null && request.auth.token.role == 'admin';
```

## Troubleshooting

### User Can't Access Admin Console
1. **Check Custom Claims**: Verify the user has `role: 'admin'` in their custom claims
2. **Verify Authentication**: Ensure the user is logged in
3. **Check Browser Console**: Look for authentication errors
4. **Token Refresh**: The user may need to sign out and sign back in to get updated claims

### Custom Claims Not Working
1. **Wait for Propagation**: Custom claims can take a few minutes to propagate
2. **Force Token Refresh**: Have the user sign out and sign back in
3. **Check Firebase Console**: Verify the custom claim was saved correctly
4. **Check Firestore Rules**: Ensure rules are deployed and up to date

### Firestore Permission Errors
1. **Deploy Rules**: Run `firebase deploy --only firestore:rules`
2. **Check Rule Syntax**: Ensure rules are properly formatted
3. **Verify Claims**: Double-check the custom claim is set correctly

## Removing Admin Access

To remove admin access from a user:

1. **Go to Firebase Console** → Authentication → Users
2. **Find the user** and click on their record
3. **Edit Custom Claims**:
   - Either delete the `role` claim entirely
   - Or change the value to something other than `admin`
4. **Save changes**

The user will lose admin access immediately (after token refresh).

## Best Practices

1. **Regular Audits**: Periodically review who has admin access
2. **Principle of Least Privilege**: Only grant admin access when necessary
3. **Documentation**: Keep track of who has admin access and why
4. **Backup Admins**: Always have at least one backup admin user
5. **Secure Development**: Never commit admin credentials to code

## Example: Complete Admin Setup

1. **User signs up** with email `newadmin@company.com`
2. **Go to Firebase Console** → Authentication → Users
3. **Find the user** and click on their record
4. **Add custom claim**: `role: admin`
5. **User signs out and back in** to refresh their token
6. **User can now access** `/admin` and all admin features

That's it! The admin system is now fully managed through Firebase custom claims.
