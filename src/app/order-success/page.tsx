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
  MapPin,
  CreditCard,
  Calendar,
  Home,
  AlertCircle,
  Clock,
  MessageCircle
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
    let orderStatusInterval: NodeJS.Timeout | null = null;
    
    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        if (orderId) {
          loadOrderDetails(orderId);
          
          // Start order status monitoring
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
          orderStatusInterval = setInterval(checkOrderStatus, 10000);
        }
      } else if (!state.loading) {
        router.push('/login?returnUrl=/order-success');
      }
    });

    return () => {
      authUnsubscribe();
      if (orderStatusInterval) {
        clearInterval(orderStatusInterval);
      }
    };
  }, [router, orderId]);


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
              price: 1299
            },
            quantity: 2
          },
          {
            product: {
              name: 'Premium Red Wine',
              price: 2499
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
        subtotal: 5097,
        tax: 408,
        shipping: 0,
        total: 5505,
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status-specific content and styling
  const getStatusInfo = (status: string) => {
    const currentStatus = realTimeOrder?.status || orderDetails?.status || status;
    
    switch (currentStatus) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-600" />,
          title: 'Order Pending',
          subtitle: 'Your order is being reviewed',
          description: 'We\'re currently reviewing your order and will confirm it shortly.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          nextSteps: [
            'Order under review',
            'Payment verification in progress',
            'Confirmation within 2 hours'
          ]
        };
      case 'paid':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: 'Payment Confirmed!',
          subtitle: 'Your order is being prepared',
          description: 'Payment has been successfully processed. We\'re now preparing your order.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          nextSteps: [
            'Payment confirmed',
            'Order preparation started',
            'Ready for dispatch within 24 hours'
          ]
        };
      case 'preparing':
        return {
          icon: <Package className="h-8 w-8 text-blue-600" />,
          title: 'Order Being Prepared',
          subtitle: 'Your items are being packed',
          description: 'Our team is carefully preparing your order for shipment.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-100',
          nextSteps: [
            'Items being packed',
            'Quality check in progress',
            'Ready for shipping soon'
          ]
        };
      case 'out_for_delivery':
        return {
          icon: <Truck className="h-8 w-8 text-purple-600" />,
          title: 'Out for Delivery',
          subtitle: 'Your order is on its way',
          description: 'Your order has been dispatched and is on its way to you.',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          iconBg: 'bg-purple-100',
          nextSteps: [
            'Order dispatched',
            'In transit to your location',
            'Expected delivery today'
          ]
        };
      case 'delivered':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: 'Order Delivered!',
          subtitle: 'Your order has arrived',
          description: 'Your order has been successfully delivered. Thank you for your purchase!',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          nextSteps: [
            'Order delivered successfully',
            'Please check your items',
            'Enjoy your purchase!'
          ]
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-600" />,
          title: 'Order Failed',
          subtitle: 'There was an issue with your order',
          description: 'We encountered an issue processing your order. Please contact support.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          nextSteps: [
            'Order processing failed',
            'Payment will be refunded',
            'Contact support for assistance'
          ]
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-600" />,
          title: 'Order Cancelled',
          subtitle: 'Your order has been cancelled',
          description: 'Your order has been cancelled. Any payment will be refunded.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          nextSteps: [
            'Order cancelled',
            'Refund processing',
            'Contact support if needed'
          ]
        };
      default:
        return {
          icon: <CheckCircle className="h-8 w-8 text-gray-600" />,
          title: 'Order Confirmed',
          subtitle: 'Your order is being processed',
          description: 'Thank you for your order. We\'re processing it now.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBg: 'bg-gray-100',
          nextSteps: [
            'Order confirmed',
            'Processing in progress',
            'Updates coming soon'
          ]
        };
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
          {/* Dynamic Status Header */}
          {(() => {
            const statusInfo = getStatusInfo(realTimeOrder?.status || orderDetails?.status || 'confirmed');
            return (
              <div className={`text-center mb-8 p-8 rounded-lg border-2 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 ${statusInfo.iconBg} rounded-full flex items-center justify-center`}>
                    {statusInfo.icon}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusInfo.title}</h1>
                <p className="text-lg text-gray-700 mb-2">{statusInfo.subtitle}</p>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {statusInfo.description}
                </p>
              </div>
            );
          })()}

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
                  
                  {/* Dynamic Progress Steps */}
                  {(() => {
                    const statusInfo = getStatusInfo(realTimeOrder?.status || orderDetails?.status || 'confirmed');
                    const currentStatus = realTimeOrder?.status || orderDetails?.status || 'confirmed';
                    
                    // Define all possible steps
                    const allSteps = [
                      { key: 'pending', label: 'Order Placed', date: formatDate(orderDetails.createdAt) },
                      { key: 'paid', label: 'Payment Confirmed', date: 'Just now' },
                      { key: 'preparing', label: 'Order Being Prepared', date: 'Within 24 hours' },
                      { key: 'out_for_delivery', label: 'Out for Delivery', date: 'Within 2-3 days' },
                      { key: 'delivered', label: 'Delivered', date: formatDate(orderDetails.estimatedDelivery) }
                    ];
                    
                    // Determine which steps are completed based on current status
                    const getStepStatus = (stepKey: string) => {
                      const statusOrder = ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered'];
                      const currentIndex = statusOrder.indexOf(currentStatus);
                      const stepIndex = statusOrder.indexOf(stepKey);
                      
                      if (stepIndex <= currentIndex) {
                        return 'completed';
                      } else if (stepIndex === currentIndex + 1) {
                        return 'current';
                      } else {
                        return 'pending';
                      }
                    };
                    
                    return (
                      <div className="space-y-3">
                        {allSteps.map((step) => {
                          const stepStatus = getStepStatus(step.key);
                          return (
                            <div key={step.key} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                stepStatus === 'completed' ? 'bg-green-500' :
                                stepStatus === 'current' ? 'bg-blue-500 animate-pulse' :
                                'bg-gray-300'
                              }`}></div>
                              <div>
                                <p className={`text-sm font-medium ${
                                  stepStatus === 'completed' ? 'text-green-700' :
                                  stepStatus === 'current' ? 'text-blue-700' :
                                  'text-gray-500'
                                }`}>
                                  {step.label}
                                </p>
                                <p className="text-xs text-gray-500">{step.date}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  
                  {/* Next Steps Information */}
                  {(() => {
                    const statusInfo = getStatusInfo(realTimeOrder?.status || orderDetails?.status || 'confirmed');
                    return (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">What's Next:</h4>
                        <ul className="space-y-1">
                          {statusInfo.nextSteps.map((step, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
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

              {/* Dynamic Action Buttons */}
              {(() => {
                const currentStatus = realTimeOrder?.status || orderDetails?.status || 'confirmed';
                const statusInfo = getStatusInfo(currentStatus);
                
                return (
                  <div className="space-y-3">
                    <Button 
                      onClick={handleViewOrder}
                      className="w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View Order Details
                    </Button>
                    
                    {/* Status-specific action buttons */}
                    {currentStatus === 'delivered' && (
                      <Button 
                        variant="outline"
                        onClick={() => router.push('/contact')}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                    
                    {(currentStatus === 'failed' || currentStatus === 'cancelled') && (
                      <Button 
                        variant="outline"
                        onClick={() => router.push('/contact')}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    )}
                    
                    {currentStatus === 'out_for_delivery' && (
                      <Button 
                        variant="outline"
                        onClick={() => router.push('/tracking')}
                        className="w-full"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={handleContinueShopping}
                      className="w-full"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </div>
                );
              })()}
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
