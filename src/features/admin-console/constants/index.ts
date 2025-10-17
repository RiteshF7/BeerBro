/**
 * Admin Console Constants
 * 
 * This file contains all constants and configuration values
 * specific to the admin console feature.
 */

import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MapPin, 
  Users,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';
import type { NavigationItem, AdminLayoutConfig, AdminDashboardConfig } from '../types';

/**
 * Default navigation items for admin sidebar
 */
export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'View admin dashboard and statistics'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage product catalog'
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'View and manage orders'
  },
  {
    name: 'Locations',
    href: '/admin/locations',
    icon: MapPin,
    description: 'Manage service locations'
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage user accounts'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'View analytics and reports'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure admin settings'
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    description: 'Generate and view reports'
  }
];

/**
 * Default admin layout configuration
 */
export const DEFAULT_ADMIN_LAYOUT_CONFIG: AdminLayoutConfig = {
  appTitle: 'BeerBro Admin',
  userProfile: {
    showAvatar: true,
    showDisplayName: true,
    showEmail: true
  },
  sidebar: {
    collapsible: true,
    defaultCollapsed: false
  }
};

/**
 * Default admin dashboard configuration
 */
export const DEFAULT_ADMIN_DASHBOARD_CONFIG: AdminDashboardConfig = {
  showQuickActions: true,
  showRecentActivity: true,
  statsRefreshInterval: 30000 // 30 seconds
};

/**
 * Admin console API endpoints
 */
export const ADMIN_API_ENDPOINTS = {
  DASHBOARD_STATS: '/api/admin/dashboard/stats',
  PRODUCTS: '/api/admin/products',
  ORDERS: '/api/admin/orders',
  USERS: '/api/admin/users',
  LOCATIONS: '/api/admin/locations',
  ANALYTICS: '/api/admin/analytics',
  REPORTS: '/api/admin/reports'
} as const;

/**
 * Admin console table configuration
 */
export const ADMIN_TABLE_CONFIG = {
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
  SEARCH_DEBOUNCE_MS: 300,
  SORT_DIRECTIONS: ['asc', 'desc'] as const
} as const;

/**
 * Admin console error codes
 */
export const ADMIN_ERROR_CODES = {
  UNAUTHORIZED: 'ADMIN_UNAUTHORIZED',
  FORBIDDEN: 'ADMIN_FORBIDDEN',
  NOT_FOUND: 'ADMIN_NOT_FOUND',
  VALIDATION_ERROR: 'ADMIN_VALIDATION_ERROR',
  NETWORK_ERROR: 'ADMIN_NETWORK_ERROR',
  SERVER_ERROR: 'ADMIN_SERVER_ERROR',
  UNKNOWN_ERROR: 'ADMIN_UNKNOWN_ERROR'
} as const;

/**
 * Admin console loading states
 */
export const ADMIN_LOADING_STATES = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  USERS: 'users',
  LOCATIONS: 'locations',
  ANALYTICS: 'analytics',
  REPORTS: 'reports'
} as const;

/**
 * Admin console permissions
 */
export const ADMIN_PERMISSIONS = {
  VIEW_DASHBOARD: 'admin:dashboard:view',
  MANAGE_PRODUCTS: 'admin:products:manage',
  MANAGE_ORDERS: 'admin:orders:manage',
  MANAGE_USERS: 'admin:users:manage',
  MANAGE_LOCATIONS: 'admin:locations:manage',
  VIEW_ANALYTICS: 'admin:analytics:view',
  EXPORT_DATA: 'admin:data:export'
} as const;

/**
 * Admin console theme configuration
 */
export const ADMIN_THEME_CONFIG = {
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'blue'
  },
  SIZES: {
    SIDEBAR_WIDTH: '16rem',
    HEADER_HEIGHT: '4rem',
    CARD_PADDING: '1.5rem'
  }
} as const;

/**
 * Admin console validation rules
 */
export const ADMIN_VALIDATION_RULES = {
  PRODUCT_NAME_MIN_LENGTH: 2,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 500,
  USER_EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/
} as const;

/**
 * Admin console date formats
 */
export const ADMIN_DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss'
} as const;