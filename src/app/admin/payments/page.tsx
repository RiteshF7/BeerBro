'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { Input } from '@/lib/common/ui/input';
import { Label } from '@/lib/common/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/common/ui/select';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Clock,
  Search,
  Package
} from 'lucide-react';
import { paymentService, PaymentStatus } from '@/lib/storefront/services/payment.service';
import { ordersService, Order } from '@/lib/storefront/services/orders.service';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPaymentId, setSearchPaymentId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('completed');
  const [relatedOrder, setRelatedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleUpdatePaymentStatus = async () => {
    if (!searchPaymentId.trim()) {
      alert('Please enter a Payment ID');
      return;
    }

    setLoading(true);
    try {
      await paymentService.updatePaymentStatus(
        searchPaymentId.trim(),
        selectedStatus,
        `Payment status updated to ${selectedStatus} by admin`
      );
      
      // If payment is completed, also update the related order status and payment status
      if (selectedStatus === 'completed' && relatedOrder) {
        await ordersService.updateOrderStatus(relatedOrder.id, 'confirmed');
        await ordersService.updateOrderPaymentStatus(relatedOrder.id, 'completed');
      } else if (relatedOrder) {
        // Update payment status in order regardless of completion
        await ordersService.updateOrderPaymentStatus(relatedOrder.id, selectedStatus);
      }
      
      alert(`Payment ${searchPaymentId} status updated to ${selectedStatus}`);
      setSearchPaymentId('');
      setRelatedOrder(null);
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPayment = async () => {
    if (!searchPaymentId.trim()) {
      setRelatedOrder(null);
      return;
    }

    setLoadingOrder(true);
    try {
      const payment = await paymentService.getPayment(searchPaymentId.trim());
      if (payment && payment.orderId && payment.orderId !== 'temp') {
        const order = await ordersService.getOrderById(payment.orderId);
        setRelatedOrder(order);
      } else {
        setRelatedOrder(null);
      }
    } catch (error) {
      console.error('Error searching payment:', error);
      setRelatedOrder(null);
    } finally {
      setLoadingOrder(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Admin Console</h1>
        
        {/* Payment Status Update */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Update Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paymentId">Payment ID</Label>
                <Input
                  id="paymentId"
                  placeholder="Enter Payment ID"
                  value={searchPaymentId}
                  onChange={(e) => setSearchPaymentId(e.target.value)}
                  onBlur={handleSearchPayment}
                />
              </div>
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleUpdatePaymentStatus}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Order Information */}
        {loadingOrder && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                <span>Loading order information...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {relatedOrder && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Related Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm text-gray-600">#{relatedOrder.id.slice(-8)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Status</Label>
                  <Badge className={`${getStatusColor(relatedOrder.status)} ml-2`}>
                    {relatedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <Badge className={`${getStatusColor(relatedOrder.paymentStatus || 'pending')} ml-2`}>
                    {relatedOrder.paymentStatus || 'pending'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-gray-600">{relatedOrder.userId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-gray-600">${relatedOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-gray-600">{relatedOrder.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-gray-600">{relatedOrder.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              {selectedStatus === 'completed' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> When you update this payment to "Completed", the order status will automatically be updated to "Confirmed".
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Test Payment Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Step 1: Start Payment</h3>
              <p className="text-sm text-gray-600">
                Go to checkout and click "Proceed to Payment Processing" to start a payment.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Step 2: Get Payment ID</h3>
              <p className="text-sm text-gray-600">
                Copy the Payment ID from the payment processing page URL or console logs.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Step 3: Update Status</h3>
              <p className="text-sm text-gray-600">
                Enter the Payment ID above and select "Completed" status, then click "Update Status".
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Step 4: See Real-time Update</h3>
              <p className="text-sm text-gray-600">
                The payment processing page will automatically update and redirect to order success.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sample Payment IDs */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Payment IDs for Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Use these sample Payment IDs for testing:
              </p>
              <div className="space-y-1">
                <code className="block p-2 bg-gray-100 rounded text-sm">PAY_1760767863216_41wk8afuy</code>
                <code className="block p-2 bg-gray-100 rounded text-sm">PAY_1760767863217_42wk8afuz</code>
                <code className="block p-2 bg-gray-100 rounded text-sm">PAY_1760767863218_43wk8afva</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
