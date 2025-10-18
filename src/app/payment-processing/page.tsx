'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Header } from '@/lib/storefront/components/Header';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { paymentService, PaymentStatus } from '@/lib/storefront/services/payment.service';
import { ordersService, Order } from '@/lib/storefront/services/orders.service';
import { cartService } from '@/lib/storefront/services/cart.service';

interface PaymentStatusLocal {
  status: 'processing' | 'completed' | 'failed' | 'pending';
  message: string;
  paymentId?: string;
  timestamp?: string;
}

function PaymentProcessingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusLocal>({
    status: 'pending',
    message: 'Payment submitted. Waiting for admin confirmation...'
  });
  const [orderStatus, setOrderStatus] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        if (paymentId) {
          startPaymentMonitoring(paymentId);
        }
      } else if (!state.loading) {
        router.push('/login?returnUrl=/payment-processing');
      }
    });

    return authUnsubscribe;
  }, [router, paymentId]);

  const startPaymentMonitoring = (paymentId: string) => {
    setLoading(false);
    
    // Create payment record in Firebase
    const createPaymentRecord = async () => {
      try {
        await paymentService.createPayment({
          orderId: orderId || 'temp',
          paymentId,
          status: 'pending', // Start as pending, not processing
          amount: parseFloat(amount || '0'),
          currency: 'INR',
          userId: userProfile?.uid || 'anonymous'
        });

        // Don't auto-simulate payment processing - wait for admin confirmation
        setPaymentStatus({
          status: 'pending',
          message: 'Payment submitted. Waiting for admin confirmation...',
          paymentId
        });
      } catch (error) {
        console.error('Error creating payment record:', error);
        setError('Failed to initialize payment processing');
      }
    };

    createPaymentRecord();

    // Listen to real-time payment status updates
    const unsubscribePayment = paymentService.listenToPaymentStatus(paymentId, (payment: PaymentStatus | null) => {
      if (payment) {
        setPaymentStatus({
          status: payment.status as 'pending' | 'completed' | 'failed',
          message: payment.message || 'Payment status updated',
          paymentId: payment.paymentId,
          timestamp: payment.updatedAt.toISOString()
        });

        // Only redirect to order success when payment is completed by admin
        if (payment.status === 'completed' && !hasRedirected) {
          // Set redirect flag to prevent multiple redirects
          setHasRedirected(true);
          
          // Clear the cart since order is completed
          cartService.clearCart();
          setTimeout(() => {
            router.push(`/order-success?orderId=${orderId}&paymentId=${paymentId}`);
          }, 2000);
        }
      }
    });

    // Monitor order status and payment status if orderId is available
    let orderStatusInterval: NodeJS.Timeout | null = null;
    if (orderId && orderId !== 'temp' && !hasRedirected) {
      const checkOrderStatus = async () => {
        try {
          // Stop monitoring if we've already redirected
          if (hasRedirected) {
            if (orderStatusInterval) {
              clearInterval(orderStatusInterval);
            }
            return;
          }
          
          const order = await ordersService.getOrderById(orderId);
          if (order) {
            setOrderStatus(order);
            
            // Check if payment status has changed in the order
            if (order.paymentStatus) {
              console.log('🔄 PaymentProcessing: Order payment status changed:', order.paymentStatus);
              
              // Update payment status based on order's payment status
              if (order.paymentStatus === 'completed' && !hasRedirected) {
                setPaymentStatus({
                  status: 'completed',
                  message: 'Payment completed successfully!',
                  paymentId: paymentId,
                  timestamp: new Date().toISOString()
                });
                
                // Set redirect flag to prevent multiple redirects
                setHasRedirected(true);
                
                // Clear cart and redirect to success page
                cartService.clearCart();
                setTimeout(() => {
                  router.push(`/order-success?orderId=${orderId}&paymentId=${paymentId}`);
                }, 2000);
              } else if (order.paymentStatus === 'failed') {
                setPaymentStatus({
                  status: 'failed',
                  message: 'Payment failed. Please try again.',
                  paymentId: paymentId,
                  timestamp: new Date().toISOString()
                });
              } else if (order.paymentStatus === 'processing') {
                setPaymentStatus({
                  status: 'processing',
                  message: 'Payment is being processed...',
                  paymentId: paymentId,
                  timestamp: new Date().toISOString()
                });
              }
            }
            
            // If order status changes to confirmed/processing, we can show additional info
            if (order.status === 'confirmed' || order.status === 'processing') {
              setPaymentStatus(prev => ({
                ...prev,
                message: `Payment confirmed! Order status: ${order.status}`
              }));
            }
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      };

      // Check immediately and then every 10 seconds to reduce API calls
      checkOrderStatus();
      orderStatusInterval = setInterval(checkOrderStatus, 10000);
    }

    return () => {
      unsubscribePayment();
      if (orderStatusInterval) {
        clearInterval(orderStatusInterval);
      }
    };
  };

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'processing':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleBack = () => {
    router.push('/checkout');
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
          <p className="text-gray-600">Loading payment processing...</p>
        </div>
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
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Button>

          {/* Payment Processing Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Status */}
              <div className={`p-6 rounded-lg border flex flex-col items-center space-y-4 ${getStatusColor()}`}>
                {getStatusIcon()}
                <div className="text-center">
                  <p className="text-lg font-medium">{paymentStatus.message}</p>
                  {paymentStatus.paymentId && (
                    <p className="text-sm opacity-75 mt-1">
                      Payment ID: {paymentStatus.paymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">₹{amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">QR Code Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderId || 'N/A'}</span>
                  </div>
                  {orderStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Status:</span>
                      <Badge 
                        variant={orderStatus.status === 'confirmed' ? 'default' : 
                                orderStatus.status === 'processing' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {orderStatus.status}
                      </Badge>
                    </div>
                  )}
                  {orderStatus?.paymentStatus && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge 
                        variant={orderStatus.paymentStatus === 'completed' ? 'default' : 
                                orderStatus.paymentStatus === 'processing' ? 'secondary' : 
                                orderStatus.paymentStatus === 'failed' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {orderStatus.paymentStatus}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Monitoring Indicator */}
              {orderId && orderId !== 'temp' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700">
                      Monitoring payment status... Updates every 10 seconds
                    </span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant={paymentStatus.status === 'completed' ? 'default' : 
                          paymentStatus.status === 'failed' ? 'destructive' : 'secondary'}
                  className="px-4 py-2"
                >
                  {paymentStatus.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {paymentStatus.status === 'failed' && <AlertCircle className="h-4 w-4 mr-1" />}
                  {paymentStatus.status === 'processing' && <RefreshCw className="h-4 w-4 mr-1 animate-spin" />}
                  {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}
                </Badge>
              </div>

              {/* Action Buttons */}
              {paymentStatus.status === 'failed' && (
                <div className="flex justify-center">
                  <Button onClick={handleRetry} className="w-full">
                    Retry Payment
                  </Button>
                </div>
              )}

              {paymentStatus.status === 'completed' && (
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-4">
                    Redirecting to order confirmation...
                  </p>
                </div>
              )}

              {/* Processing Animation */}
              {paymentStatus.status === 'processing' && (
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please do not close this window while we process your payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentProcessingPageContent />
    </Suspense>
  );
}
