'use client';

import { useState, useEffect } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { OrderStatusDialog } from '@/features/orders/OrderStatusDialog';
import { OrderDetailsDialog } from '@/features/orders/OrderDetailsDialog';
import { OrderWithId } from '@/features/orders/types';
import { getOrders, updateOrderStatus, deleteOrder } from '@/features/orders/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const columns = [
    {
      key: 'id' as keyof OrderWithId,
      label: 'Order ID',
      render: (value: unknown) => `#${(value as string).slice(-8)}`,
    },
    {
      key: 'userName' as keyof OrderWithId,
      label: 'Customer',
      render: (value: unknown, item: OrderWithId) => (
        <div>
          <p className="font-medium">{value as string || 'No name'}</p>
          <p className="text-sm text-gray-500">{item.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'total' as keyof OrderWithId,
      label: 'Total',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'status' as keyof OrderWithId,
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={value as 'pending' | 'accepted' | 'rejected' | 'failed'} />,
    },
    {
      key: 'createdAt' as keyof OrderWithId,
      label: 'Date',
      render: (value: unknown) => (value as Date).toLocaleDateString(),
    },
  ];

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEditOrder = (order: OrderWithId) => {
    setSelectedOrder(order);
    setIsStatusDialogOpen(true);
  };

  const handleViewOrder = (order: OrderWithId) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteOrder = async (order: OrderWithId) => {
    if (!confirm(`Are you sure you want to delete order #${order.id.slice(-8)}?`)) {
      return;
    }

    try {
      await deleteOrder(order.id);
      toast.success('Order deleted successfully');
      await loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
      failed: orders.filter(o => o.status === 'failed').length,
    };
  };

  const orderCounts = getOrderCounts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and their status</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({orderCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({orderCounts.rejected})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({orderCounts.failed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AdminTable
            data={filteredOrders}
            columns={columns}
            onEdit={handleEditOrder}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
            isLoading={isLoading}
            emptyMessage="No orders found."
          />
        </TabsContent>
      </Tabs>

      <OrderStatusDialog
        order={selectedOrder}
        isOpen={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isUpdatingStatus}
      />

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
      />
    </div>
  );
}
