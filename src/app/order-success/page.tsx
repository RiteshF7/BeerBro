'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { Separator } from '@/lib/common/ui/separator';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock,
  MapPin,
  CreditCard,
  Calendar,
  ArrowRight,
  Home,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/lib/storefront/components/Header';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { ordersService, Order } from '@/lib/storefront/services/orders.service';

interface OrderDetails {
  id: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: {
    type: string;
    paymentId?: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

function OrderSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [realTimeOrder, setRealTimeOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        if (orderId) {
          loadOrderDetails(orderId);
          startOrderStatusMonitoring(orderId);
        }
      } else if (!state.loading) {
        router.push('/login?returnUrl=/order-success');
      }
    });

    return authUnsubscribe;
  }, [router, orderId]);

  const startOrderStatusMonitoring = (orderId: string) => {
    const checkOrderStatus = async () => {
      try {
        const order = await ordersService.getOrderById(orderId);
        if (order) {
          setRealTimeOrder(order);
        }
      } catch (error) {
        console.error('Error checking order status:', error);
      }
    };

    // Check immediately and then every 10 seconds
    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 10000);

    return () => clearInterval(interval);
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate loading order details
      // In a real app, this would fetch from your API
      const mockOrderDetails: OrderDetails = {
        id: orderId,
        items: [
          {
            product: {
              name: 'Craft IPA Beer',
              price: 12.99
            },
            quantity: 2
          },
          {
            product: {
              name: 'Premium Red Wine',
              price: 24.99
            },
            quantity: 1
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1-555-0123'
        },
        paymentMethod: {
          type: 'qr_code',
          paymentId: paymentId || 'PAY_123456789'
        },
        subtotal: 50.97,
        tax: 4.08,
        shipping: 0,
        total: 55.05,
        status: 'confirmed',
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      };

      setOrderDetails(mockOrderDetails);
    } catch (error) {
      console.error('Error loading order details:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = () => {
    router.push(`/orders/${orderId}`);
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  // Prepare user data for header
  const user = userProfile ? {
    name: userProfile.displayName,
    email: userProfile.email,
    avatar: userProfile.photoURL
  } : null;

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onSearch={() => {}}
          cartItems={0}
          user={user}
          onSignOut={handleSignOut}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/orders')}>
              View All Orders
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={() => {}}
        cartItems={0}
        user={user}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We&apos;ve received your payment and will process your order shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                    </p>
                    <p>{orderDetails.shippingAddress.address}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
                    </p>
                    <p>{orderDetails.shippingAddress.country}</p>
                    {orderDetails.shippingAddress.phone && (
                      <p className="text-sm text-gray-600">
                        {orderDetails.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">QR Code Payment</p>
                    <p className="text-sm text-gray-600">
                      Payment ID: {orderDetails.paymentMethod.paymentId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {realTimeOrder?.paymentStatus || 'completed'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Status & Actions */}
            <div className="space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Order Status
                    {realTimeOrder && (
                      <div className="flex items-center text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                        Live Updates
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <Badge className={`${getStatusColor(realTimeOrder?.status || orderDetails.status)} flex items-center space-x-1`}>
                      <CheckCircle className="h-3 w-3" />
                      <span className="capitalize">{realTimeOrder?.status || orderDetails.status}</span>
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Order Placed</p>
                        <p className="text-xs text-gray-500">{formatDate(orderDetails.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Processing</p>
                        <p className="text-xs text-gray-500">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Shipped</p>
                        <p className="text-xs text-gray-500">Within 2-3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Delivered</p>
                        <p className="text-xs text-gray-500">{formatDate(orderDetails.estimatedDelivery)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Delivery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Estimated Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-lg font-semibold">{formatDate(orderDetails.estimatedDelivery)}</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Total */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatPrice(orderDetails.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{orderDetails.shipping === 0 ? 'FREE' : formatPrice(orderDetails.shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatPrice(orderDetails.total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleViewOrder}
                  className="w-full"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View Order Details
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessPageContent />
    </Suspense>
  );
}
