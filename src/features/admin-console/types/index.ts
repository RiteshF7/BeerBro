/**
 * Admin Console Types and Interfaces
 * 
 * This file contains all type definitions specific to the admin console feature.
 * It centralizes type management for better maintainability and reusability.
 */

// Re-export common admin types from the main types directory
export type {
  Product,
  Order,
  OrderItem,
  Address,
  OrderStatus,
  ServiceLocation,
  User,
  UserRole,
  AdminStats
} from '@/types/admin';

/**
 * Navigation item configuration for admin sidebar
 */
export interface NavigationItem {
  /** Display name of the navigation item */
  name: string;
  /** Route path for the navigation item */
  href: string;
  /** Lucide React icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Optional description for accessibility */
  description?: string;
  /** Whether this navigation item is currently active */
  isActive?: boolean;
}

/**
 * Admin layout configuration
 */
export interface AdminLayoutConfig {
  /** Application title displayed in header */
  appTitle: string;
  /** User profile configuration */
  userProfile: {
    /** Whether to show user avatar */
    showAvatar: boolean;
    /** Whether to show user display name */
    showDisplayName: boolean;
    /** Whether to show user email */
    showEmail: boolean;
  };
  /** Sidebar configuration */
  sidebar: {
    /** Whether sidebar is collapsible */
    collapsible: boolean;
    /** Default collapsed state */
    defaultCollapsed: boolean;
  };
}

/**
 * Admin dashboard configuration
 */
export interface AdminDashboardConfig {
  /** Whether to show quick actions section */
  showQuickActions: boolean;
  /** Whether to show recent activity section */
  showRecentActivity: boolean;
  /** Refresh interval for stats in milliseconds */
  statsRefreshInterval: number;
}

/**
 * Admin table column configuration
 */
export interface AdminTableColumn<T> {
  /** Key to access data from the item */
  key: keyof T;
  /** Display label for the column header */
  label: string;
  /** Optional custom render function for the column */
  render?: (value: unknown, item: T) => React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is searchable */
  searchable?: boolean;
  /** Column width (CSS value) */
  width?: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * Admin table configuration
 */
export interface AdminTableConfig<T> {
  /** Table data array */
  data: T[];
  /** Column definitions */
  columns: AdminTableColumn<T>[];
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Message to display when no data is available */
  emptyMessage?: string;
  /** Whether to show pagination */
  showPagination?: boolean;
  /** Items per page for pagination */
  itemsPerPage?: number;
  /** Whether to show search functionality */
  showSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

/**
 * Admin table action handlers
 */
export interface AdminTableActions<T> {
  /** Handler for edit action */
  onEdit?: (item: T) => void;
  /** Handler for delete action */
  onDelete?: (item: T) => void;
  /** Handler for view action */
  onView?: (item: T) => void;
  /** Handler for custom actions */
  onCustomAction?: (action: string, item: T) => void;
}

/**
 * Admin stats card configuration
 */
export interface AdminStatsCardConfig {
  /** Card title */
  title: string;
  /** Card value */
  value: string | number;
  /** Lucide React icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Icon color class */
  iconColor?: string;
  /** Optional description text */
  description?: string;
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Admin console error types
 */
export interface AdminConsoleError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Timestamp when error occurred */
  timestamp: Date;
}

/**
 * Admin console loading states
 */
export interface AdminConsoleLoadingState {
  /** Whether dashboard is loading */
  dashboard: boolean;
  /** Whether products are loading */
  products: boolean;
  /** Whether orders are loading */
  orders: boolean;
  /** Whether users are loading */
  users: boolean;
  /** Whether locations are loading */
  locations: boolean;
}

/**
 * Admin console permissions
 */
export interface AdminConsolePermissions {
  /** Can view dashboard */
  canViewDashboard: boolean;
  /** Can manage products */
  canManageProducts: boolean;
  /** Can manage orders */
  canManageOrders: boolean;
  /** Can manage users */
  canManageUsers: boolean;
  /** Can manage locations */
  canManageLocations: boolean;
  /** Can view analytics */
  canViewAnalytics: boolean;
  /** Can export data */
  canExportData: boolean;
}