'use client';

import { useState } from 'react';
import { Button } from '@/lib/common/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/common/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/common/ui/select';
import { OrderWithId } from './types';
import { PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from '@/lib/constants';

interface PaymentStatusDialogProps {
  order: OrderWithId | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePaymentStatus: (orderId: string, paymentStatus: string) => Promise<void>;
  isLoading?: boolean;
}

export function PaymentStatusDialog({
  order,
  isOpen,
  onClose,
  onUpdatePaymentStatus,
  isLoading = false,
}: PaymentStatusDialogProps) {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');

  const handlePaymentStatusChange = (paymentStatus: string) => {
    setSelectedPaymentStatus(paymentStatus);
  };

  const handleSubmit = async () => {
    if (!order || !selectedPaymentStatus) return;

    try {
      await onUpdatePaymentStatus(order.id, selectedPaymentStatus);
      onClose();
      setSelectedPaymentStatus('');
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleClose = () => {
    setSelectedPaymentStatus('');
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
          <DialogDescription>
            Change the payment status for order #{order.id.slice(-8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Payment Status</label>
            <div className="p-2 bg-gray-100 rounded-md">
              <span>{PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || order.paymentStatus || 'No status'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Payment Status</label>
            <Select value={selectedPaymentStatus} onValueChange={handlePaymentStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select new payment status" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PAYMENT_STATUS_LABELS[status]}
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
            disabled={!selectedPaymentStatus || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Payment Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

