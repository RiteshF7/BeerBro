# BeerBro Admin Console

A comprehensive admin console built with Next.js, TypeScript, Firebase, and ShadCN UI components.

## Features

### 🛍️ Product Management
- Full CRUD operations for products
- Image upload to Firebase Storage
- Product categorization and inventory management
- Active/inactive status toggle

### 📦 Order Management
- View and manage customer orders
- Status transitions: pending, accepted, rejected, failed
- Order details with customer information
- Filter orders by status

### 📍 Service Location Management
- Define service locations with coordinates
- Set delivery radius per location
- Location status management
- Geolocation support

### 👥 User Management
- View all registered users
- User role management (admin, user, viewer)
- User status activation/deactivation
- User activity tracking

## Architecture

### Folder Structure
```
/app
  /admin
    /dashboard
    /products
    /orders
    /locations
    /users
/components
  /ui (ShadCN components)
  /admin (shared admin components)
/features
  /products
  /orders
  /locations
  /users
/lib
  firebase.ts
  auth.ts
  constants.ts
  utils.ts
/types
  admin.ts
```

### Key Components

#### AdminTable
Reusable table component with:
- Loading states
- Action dropdowns
- Empty states
- Responsive design

#### StatusBadge
Consistent status indicators for orders and other entities.

#### Forms
- ProductForm: Product creation/editing
- LocationForm: Location management with geolocation
- UserForm: User management
- OrderStatusDialog: Order status updates

## Authentication

The admin console uses Firebase Auth with email-based access control:
- Only specified admin emails can access admin routes
- Authentication is handled client-side in the admin layout
- Automatic redirect to home page for unauthorized users

## Firebase Integration

### Firestore Collections
- `products`: Product inventory
- `orders`: Customer orders
- `locations`: Service locations
- `users`: User accounts

### Firebase Storage
- Product images stored in `products/` folder
- Automatic image cleanup on product deletion

## Getting Started

1. Set up Firebase project and configure environment variables
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access admin console at `/admin`

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Admin Access

To grant admin access, add email addresses to the `ADMIN_EMAILS` array in `src/lib/auth.ts`:

```typescript
const ADMIN_EMAILS = [
  'admin@beerbro.com',
  'your-email@example.com',
];
```

## API Routes

The admin console includes API routes for each feature:
- `/api/admin/products` - Product management
- `/api/admin/orders` - Order management
- `/api/admin/locations` - Location management
- `/api/admin/users` - User management

## Styling

The application uses:
- Tailwind CSS for styling
- ShadCN UI components for consistent design
- Custom color constants for theming
- Responsive design patterns

## Best Practices

- Modular feature-based architecture
- Type-safe with TypeScript and Zod validation
- Consistent error handling and user feedback
- Loading states and optimistic updates
- Clean separation of concerns
