'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/lib/common/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Input } from '@/lib/common/ui/input';
import { Label } from '@/lib/common/ui/label';
import { Separator } from '@/lib/common/ui/separator';
import { Badge } from '@/lib/common/ui/badge';
import { cartService, Cart, ShippingAddress, PaymentMethod } from '@/lib/storefront/services/cart.service';
import { ordersService } from '@/lib/storefront/services/orders.service';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { Header } from '@/lib/storefront/components/Header';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'success'>('shipping');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    const unsubscribe = cartService.subscribe((cartData) => {
      setCart(cartData);
    });

    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        // Pre-fill shipping address with user profile data
        setShippingAddress(prev => ({
          ...prev,
          firstName: state.profile?.displayName?.split(' ')[0] || '',
          lastName: state.profile?.displayName?.split(' ').slice(1).join(' ') || '',
        }));
      }
      
      // Set initial loading to false after auth state is determined
      if (!state.loading) {
        setInitialLoading(false);
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  // Redirect if cart is empty (only after initial loading is complete)
  useEffect(() => {
    if (!initialLoading && cart.items.length === 0 && step !== 'success') {
      router.push('/cart');
    }
  }, [cart.items.length, router, step, initialLoading]);

  // Redirect if not authenticated (only after initial loading is complete)
  useEffect(() => {
    if (!initialLoading && !userProfile && step !== 'success') {
      router.push('/login');
    }
  }, [userProfile, router, step, initialLoading]);

  const validateShippingAddress = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!shippingAddress.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentMethod = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod.cardNumber?.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentMethod.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!paymentMethod.expiryDate?.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!paymentMethod.cvv?.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentMethod.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!paymentMethod.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'shipping' && validateShippingAddress()) {
      setStep('payment');
    } else if (step === 'payment' && validatePaymentMethod()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const orderId = await ordersService.createOrder({
        userId: userProfile.uid,
        items: cart.items,
        shippingAddress,
        paymentMethod,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
      });

      if (orderId) {
        cartService.clearCart();
        setStep('success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ general: 'Failed to place order. Please try again.' });
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

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
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

  // Show loading screen while determining initial state
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
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
            <div className="py-16">
              <CheckCircle className="h-24 w-24 mx-auto mb-6 text-green-500" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your order. You will receive a confirmation email shortly.
              </p>
              <div className="space-x-4">
                <Button size="lg" onClick={() => router.push('/')}>
                  Continue Shopping
                </Button>
                <Button variant="outline" size="lg" onClick={() => router.push('/profile')}>
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={() => {}}
        cartItems={cart.totalItems}
        user={user}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-2">Checkout</h1>
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                  <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-primary' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'shipping' ? 'bg-primary text-white' : step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {step === 'payment' || step === 'review' ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : '1'}
                    </div>
                    <span className="text-sm sm:text-base">Shipping</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'payment' ? 'bg-primary text-white' : step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {step === 'review' ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : '2'}
                    </div>
                    <span className="text-sm sm:text-base">Payment</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-primary' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'review' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                      3
                    </div>
                    <span className="text-sm sm:text-base">Review</span>
                  </div>
                </div>
              </div>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{errors.general}</span>
                </div>
              )}

              {/* Shipping Address */}
              {step === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          className={errors.state ? 'border-red-500' : ''}
                        />
                        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          className={errors.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                    <CardDescription>
                      <Lock className="h-4 w-4 inline mr-1" />
                      Your payment information is secure and encrypted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) => setPaymentMethod(prev => ({ 
                          ...prev, 
                          cardNumber: formatCardNumber(e.target.value) 
                        }))}
                        className={errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name *</Label>
                      <Input
                        id="cardholderName"
                        value={paymentMethod.cardholderName}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                        className={errors.cardholderName ? 'border-red-500' : ''}
                      />
                      {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentMethod.expiryDate}
                          onChange={(e) => setPaymentMethod(prev => ({ 
                            ...prev, 
                            expiryDate: formatExpiryDate(e.target.value) 
                          }))}
                          className={errors.expiryDate ? 'border-red-500' : ''}
                        />
                        {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentMethod.cvv}
                          onChange={(e) => setPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                          className={errors.cvv ? 'border-red-500' : ''}
                        />
                        {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Order */}
              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-gray-600">
                        {shippingAddress.firstName} {shippingAddress.lastName}<br />
                        {shippingAddress.address}<br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <p className="text-gray-600">
                        **** **** **** {paymentMethod.cardNumber?.slice(-4)}<br />
                        {paymentMethod.cardholderName}<br />
                        Expires {paymentMethod.expiryDate}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step !== 'shipping' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(step === 'payment' ? 'shipping' : 'payment')}
                  >
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {step === 'review' ? (
                    <Button 
                      size="lg" 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleNext}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {cart.shipping === 0 ? (
                          <Badge variant="default" className="text-xs">FREE</Badge>
                        ) : (
                          formatPrice(cart.shipping)
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
