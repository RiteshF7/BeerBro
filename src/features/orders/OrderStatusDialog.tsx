'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderWithId } from './types';
import { ORDER_STATUSES } from '@/lib/constants';

interface OrderStatusDialogProps {
  order: OrderWithId | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
  isLoading?: boolean;
}

export function OrderStatusDialog({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  isLoading = false,
}: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSubmit = async () => {
    if (!order || !selectedStatus) return;

    try {
      await onUpdateStatus(order.id, selectedStatus);
      onClose();
      setSelectedStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order #{order.id.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Status</label>
            <div className="p-2 bg-gray-100 rounded-md">
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedStatus || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
