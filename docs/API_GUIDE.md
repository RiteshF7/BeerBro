# API Guide

This guide covers the API endpoints available in the BeerBro Admin Console.

## Authentication

All admin API routes require authentication. The authentication is handled client-side through Firebase Auth.

## Products API

### GET /api/admin/products
Retrieve all products.

**Response:**
```json
[
  {
    "id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "category": "Beer",
    "stock": 100,
    "isActive": true,
    "imageUrl": "https://storage.googleapis.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "category": "Beer",
  "stock": 100,
  "isActive": true
}
```

**Response:**
```json
{
  "id": "new_product_id"
}
```

## Orders API

### GET /api/admin/orders
Retrieve all orders.

**Response:**
```json
[
  {
    "id": "order_id",
    "userId": "user_id",
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "items": [
      {
        "productId": "product_id",
        "productName": "Product Name",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "total": 59.98,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/orders
Create a new order.

**Request Body:**
```json
{
  "userId": "user_id",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "items": [
    {
      "productId": "product_id",
      "productName": "Product Name",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "status": "pending",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  }
}
```

## Locations API

### GET /api/admin/locations
Retrieve all service locations.

**Response:**
```json
[
  {
    "id": "location_id",
    "name": "Downtown Store",
    "address": "123 Main St, City, State 12345",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "radiusKm": 5.0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/locations
Create a new service location.

**Request Body:**
```json
{
  "name": "Downtown Store",
  "address": "123 Main St, City, State 12345",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "radiusKm": 5.0,
  "isActive": true
}
```

## Users API

### GET /api/admin/users
Retrieve all users.

**Response:**
```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/admin/users
Create a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "user",
  "isActive": true
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Validation

All API endpoints use Zod schemas for request validation:

- **Products**: `productSchema`
- **Orders**: `orderSchema`
- **Locations**: `locationSchema`
- **Users**: `userSchema`

Invalid requests will return a `400` status with validation error details.

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

CORS is configured to allow requests from the same origin. For cross-origin requests, update the CORS configuration in your Next.js API routes.
