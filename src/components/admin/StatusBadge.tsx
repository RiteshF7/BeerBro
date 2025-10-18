'use client';

import { Badge } from '@/lib/common/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  paid: {
    label: 'Paid',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  preparing: {
    label: 'Preparing',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    variant: 'default' as const,
    className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  },
  delivered: {
    label: 'Delivered',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'outline' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  // Payment statuses
  processing: {
    label: 'Processing',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  completed: {
    label: 'Completed',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  expired: {
    label: 'Expired',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
