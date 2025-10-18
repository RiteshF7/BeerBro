'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { ShoppingCart, X } from 'lucide-react';
import { cartService, Cart } from '../services/cart.service';

export function CartNotification() {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [isVisible, setIsVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = cartService.subscribe((updatedCart) => {
      setCart(updatedCart);
      
      // Show notification when items are added
      if (updatedCart.totalItems > 0) {
        setIsVisible(true);
        setShowAnimation(true);
        
        // Hide animation after a short delay
        setTimeout(() => setShowAnimation(false), 300);
      }
    });

    return unsubscribe;
  }, []);

  const handleProceedToCart = () => {
    router.push('/cart');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't show if cart is empty or already visible
  if (!isVisible || cart.totalItems === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out ${
      showAnimation ? 'animate-bounce' : ''
    }`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-primary" />
              {cart.totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cart.totalItems}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} added to cart
              </p>
              <p className="text-xs text-gray-500">
                Total: ₹{cart.total.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={handleProceedToCart}
              className="text-xs"
            >
              View Cart
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
