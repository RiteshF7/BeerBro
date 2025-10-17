'use client';

import { Badge } from '@/lib/common/ui/badge';
import { OrderStatus } from '@/lib/common/types/admin';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  accepted: {
    label: 'Accepted',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
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
