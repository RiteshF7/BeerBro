'use client';

import { Button } from '@/lib/common/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/lib/common/ui/dialog';
import { OrderWithId } from './types';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Calendar, User, MapPin, Package } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: OrderWithId | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  // Debug logging to help identify data structure issues
  console.log('🔍 OrderDetailsDialog: Order data received:', {
    id: order.id,
    status: order.status,
    total: order.total,
    items: order.items,
    itemsLength: order.items?.length,
    firstItem: order.items?.[0],
    orderKeys: Object.keys(order)
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.id.slice(-8)} - {order.userName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <StatusBadge status={order.status} />
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <p>{order.userName}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p>{order.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h3>
            <div className="space-y-2">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  // Handle different possible property names and ensure we have valid data
                  const price = item.price || item.unitPrice || 0;
                  const quantity = item.quantity || item.qty || 0;
                  const productName = item.productName || item.name || item.title || 'Unknown Product';
                  const itemTotal = price * quantity;
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{productName}</p>
                        <p className="text-sm text-gray-600">Qty: {quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          Total: ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 bg-gray-50 rounded-md text-center text-gray-500">
                  No items found in this order
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h3>
            <div className="p-3 bg-gray-50 rounded-md">
              {order.shippingAddress ? (
                <>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">No shipping address provided</p>
              )}
            </div>
          </div>

          {/* Order Dates */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Order Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <p>{order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}</p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p>{order.updatedAt.toLocaleDateString()} at {order.updatedAt.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
