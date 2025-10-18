// Color constants for consistent theming
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  'Beer',
  'Wine',
  'Spirits',
  'Non-Alcoholic',
  'Accessories',
  'Food',
] as const;

// Order statuses
export const ORDER_STATUSES = [
  'pending',
  'paid',
  'preparing',
  'out_for_delivery',
  'delivered',
  'failed',
  'cancelled',
] as const;

// Order status labels for display
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed: 'Failed',
  cancelled: 'Cancelled',
} as const;

// Order status colors for badges
export const ORDER_STATUS_COLORS = {
  pending: 'warning',
  paid: 'success',
  preparing: 'primary',
  out_for_delivery: 'primary',
  delivered: 'success',
  failed: 'error',
  cancelled: 'gray',
} as const;

// Payment statuses
export const PAYMENT_STATUSES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'expired',
] as const;

// Payment status labels for display
export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  expired: 'Expired',
} as const;

// User roles
export const USER_ROLES = [
  'admin',
  'user',
  'viewer',
] as const;
