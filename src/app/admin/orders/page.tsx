'use client';

import { useState, useEffect } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { OrderStatusDialog } from '@/lib/adminconsole/orders/OrderStatusDialog';
import { PaymentStatusDialog } from '@/lib/adminconsole/orders/PaymentStatusDialog';
import { OrderDetailsDialog } from '@/lib/adminconsole/orders/OrderDetailsDialog';
import { OrderWithId } from '@/lib/adminconsole/orders/types';
import { getOrders, updateOrderStatus, updatePaymentStatus, deleteOrder } from '@/lib/adminconsole/orders/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/common/ui/tabs';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithId | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPaymentStatusDialogOpen, setIsPaymentStatusDialogOpen] = useState(false);
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
      label: 'Order Status',
      render: (value: unknown) => {
        const status = value as string;
        if (!status) return <span className="text-gray-500">No status</span>;
        return <StatusBadge status={status} />;
      },
    },
    {
      key: 'paymentStatus' as keyof OrderWithId,
      label: 'Payment Status',
      render: (value: unknown) => {
        const paymentStatus = value as string;
        if (!paymentStatus) return <span className="text-gray-500">No payment status</span>;
        return <StatusBadge status={paymentStatus} />;
      },
    },
    {
      key: 'createdAt' as keyof OrderWithId,
      label: 'Date',
      render: (value: unknown) => (value as Date).toLocaleDateString(),
    },
  ];

  const loadOrders = async () => {
    try {
      console.log('🔄 OrdersPage: Starting to load orders...');
      setIsLoading(true);
      
      const data = await getOrders();
      console.log('📊 OrdersPage: Raw orders data received:', data);
      console.log('📊 OrdersPage: Number of orders:', data.length);
      
      if (data.length > 0) {
        console.log('📊 OrdersPage: First order sample:', data[0]);
        console.log('📊 OrdersPage: Order keys:', Object.keys(data[0]));
      }
      
      setOrders(data);
      console.log('✅ OrdersPage: Orders state updated successfully');
    } catch (error) {
      console.error('❌ OrdersPage: Error loading orders:', error);
      console.error('❌ OrdersPage: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
      console.log('🏁 OrdersPage: Loading completed');
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

  const handleQuickStatusChange = async (order: OrderWithId, status: string) => {
    await handleUpdateStatus(order.id, status);
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      await updatePaymentStatus(orderId, paymentStatus);
      toast.success('Payment status updated successfully');
      await loadOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleQuickPaymentStatusChange = async (order: OrderWithId, paymentStatus: string) => {
    await handleUpdatePaymentStatus(order.id, paymentStatus);
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

  const handleClosePaymentStatusDialog = () => {
    setIsPaymentStatusDialogOpen(false);
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

  console.log('🔍 OrdersPage: Filtering orders for tab:', activeTab);
  console.log('🔍 OrdersPage: Total orders:', orders.length);
  console.log('🔍 OrdersPage: Filtered orders:', filteredOrders.length);
  console.log('🔍 OrdersPage: Filtered orders data:', filteredOrders);

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      failed: orders.filter(o => o.status === 'failed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
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
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">
            All ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({orderCounts.paid})
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing ({orderCounts.preparing})
          </TabsTrigger>
          <TabsTrigger value="out_for_delivery">
            Out for Delivery ({orderCounts.out_for_delivery})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({orderCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({orderCounts.failed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({orderCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AdminTable
            data={filteredOrders}
            columns={columns}
            onEdit={handleEditOrder}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
            onQuickStatusChange={handleQuickStatusChange}
            onQuickPaymentStatusChange={handleQuickPaymentStatusChange}
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

      <PaymentStatusDialog
        order={selectedOrder}
        isOpen={isPaymentStatusDialogOpen}
        onClose={handleClosePaymentStatusDialog}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
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
