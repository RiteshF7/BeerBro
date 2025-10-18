# Vercel Deployment Guide for BeerBro

This guide will help you deploy your Next.js application to Vercel with Firebase integration.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A Firebase project set up
3. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project

### 2. Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add the following variables:

#### Required Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### How to Get Firebase Configuration Values

1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" and select the web icon
6. Copy the configuration values from the Firebase config object

### 3. Firebase Project Configuration

Based on your `.firebaserc` file, your Firebase project ID is: `pleasebringmebooze`

Make sure your Firebase project has the following services enabled:
- **Authentication** (with Google provider if you're using it)
- **Firestore Database**
- **Storage** (if you're using file uploads)

### 4. Firebase Security Rules

Ensure your Firestore rules are properly configured for production. Your current rules are in `firestore.rules`.

### 5. Deploy

1. After setting up environment variables, click **Deploy**
2. Vercel will build and deploy your application
3. You'll get a production URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to "Authorized domains":
   - `your-app.vercel.app`
   - `your-app-git-main-yourusername.vercel.app` (for preview deployments)

### 2. Configure CORS (if needed)

If you encounter CORS issues, you may need to configure your Firebase Storage rules.

### 3. Test Your Application

1. Visit your deployed URL
2. Test authentication
3. Test database operations
4. Test PWA functionality

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123456789:web:abc123` |

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all environment variables are set correctly
2. **Authentication Issues**: Verify authorized domains in Firebase Console
3. **Database Access**: Check Firestore security rules
4. **PWA Issues**: Ensure service worker files are properly cached

### Build Logs

If deployment fails, check the build logs in Vercel dashboard for specific error messages.

### Local Testing

Test your production build locally:
```bash
npm run build
npm start
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update Firebase authorized domains with your custom domain
4. Configure DNS records as instructed by Vercel

## Monitoring

- Use Vercel Analytics for performance monitoring
- Monitor Firebase usage in Firebase Console
- Set up error tracking (consider Sentry integration)

## Security Notes

- Never commit `.env` files to your repository
- Use Vercel's environment variables for sensitive data
- Regularly review Firebase security rules
- Keep dependencies updated

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
