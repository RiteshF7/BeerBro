# Secure Admin Management Guide

This guide provides secure methods to manage admin users in your BeerBro application. **Admin privileges should only be granted by trusted administrators through secure methods.**

## 🔒 Security Principles

- **No frontend admin management** - Admin privileges cannot be granted through the web interface
- **Server-side only** - Admin management requires Firebase Admin SDK access
- **Audit trail** - All admin changes should be logged and monitored
- **Principle of least privilege** - Only grant admin access when absolutely necessary

## 🛠️ Methods to Make Users Admin

### Method 1: Firebase Console (Recommended for Quick Changes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `pleasebringmebooze`

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Find the User**
   - Search for the user by email
   - Click on the user to open their details

4. **Set Custom Claims**
   - Scroll down to "Custom claims" section
   - Click "Add custom claim"
   - **Key**: `role`
   - **Value**: `admin`
   - Click "Save"

5. **Verify the Change**
   - The custom claim should now show: `{"role": "admin"}`
   - The user will need to sign out and sign back in for changes to take effect

### Method 2: Firebase Admin SDK Scripts (Recommended for Automation)

#### Prerequisites
1. **Download Service Account Key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Rename it to `firebase-service-account.json`
   - Place it in your project root directory

2. **Add to .gitignore**:
   ```bash
   echo "firebase-service-account.json" >> .gitignore
   ```

#### Make User Admin by Email
```bash
node scripts/set-admin-role.js user@example.com
```

#### Create New Admin User
```bash
node scripts/create-admin-user.js
```

#### List All Users (to find UIDs)
```bash
node scripts/list-users.js
```

### Method 3: Firebase CLI (Advanced)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Use Firebase Admin SDK functions
firebase functions:shell
```

## 🔍 How to Verify Admin Status

### Check Custom Claims in Firebase Console
1. Go to Authentication → Users
2. Find the user
3. Look for custom claims: `{"role": "admin"}`

### Check in Application
1. User signs in to the application
2. Go to `/admin/dashboard`
3. If they have admin privileges, they'll see the admin interface
4. Check browser console for logs showing custom claims

## 🚨 Removing Admin Privileges

### Using Firebase Console
1. Go to Authentication → Users
2. Find the admin user
3. In custom claims section, either:
   - Delete the `role` claim entirely, or
   - Change the value from `admin` to `user`

### Using Scripts
```bash
# You can modify the set-admin-role.js script to remove admin privileges
# Change the role value to 'user' or remove the claim entirely
```

## 📋 Admin Management Checklist

- [ ] User has signed up through the application
- [ ] User's email is verified (recommended)
- [ ] Custom claim `role: admin` is set
- [ ] User signs out and signs back in
- [ ] User can access `/admin/dashboard`
- [ ] Admin privileges are working correctly

## 🔐 Security Best Practices

1. **Limit Admin Access**: Only grant admin privileges to trusted individuals
2. **Regular Audits**: Periodically review who has admin access
3. **Monitor Activity**: Keep track of admin actions and changes
4. **Secure Service Account**: Never commit service account keys to version control
5. **Environment Variables**: Use environment variables for sensitive configuration
6. **Backup Admin Access**: Always have at least one admin user as backup

## 🆘 Troubleshooting

### User Can't Access Admin Dashboard
1. Check if custom claims are set correctly
2. Verify user has signed out and back in
3. Check browser console for error messages
4. Verify Firestore rules are deployed correctly

### Script Errors
1. Ensure `firebase-service-account.json` exists and is valid
2. Check that the user email exists in Firebase Authentication
3. Verify Firebase project configuration
4. Check network connectivity

### Permission Denied Errors
1. Verify Firestore rules are using custom claims correctly
2. Check if the user's token has been refreshed
3. Ensure the user has the correct custom claims

## 📞 Support

If you encounter issues with admin management:
1. Check the browser console for error messages
2. Verify Firebase Console shows correct custom claims
3. Test with a fresh user account
4. Review Firestore rules and ensure they're deployed

Remember: **Admin privileges are powerful and should be granted carefully and securely.**
