'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/common/ui/button';
import { cartService } from '@/lib/storefront/services/cart.service';
import { productsService } from '@/lib/storefront/services/products.service';
import { useRouter } from 'next/navigation';

export default function TestCartPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState(cartService.getCart());
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productsService.getProducts({ limit: 3 });
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();

    const unsubscribe = cartService.subscribe((cartData) => {
      console.log('Cart updated in test page:', cartData);
      setCart(cartData);
    });

    return unsubscribe;
  }, []);

  const handleAddToCart = (product: any) => {
    console.log('Adding product to cart:', product);
    cartService.addItem(product, 1);
  };

  const handleGoToCart = () => {
    console.log('Navigating to cart page');
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Cart Status</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p>Total Items: {cart.totalItems}</p>
            <p>Subtotal: ${cart.subtotal.toFixed(2)}</p>
            <p>Total: ${cart.total.toFixed(2)}</p>
            <Button onClick={handleGoToCart} className="mt-4">
              Go to Cart Page
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="mt-2"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            {cart.items.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
