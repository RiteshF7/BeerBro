import { Product } from './products.service';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'qr_code';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  qrCodeData?: string;
  paymentId?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

class CartService {
  private cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  };

  private listeners: ((cart: Cart) => void)[] = [];
  private readonly TAX_RATE = 0.08; // 8% tax rate
  private readonly FREE_SHIPPING_THRESHOLD = 50;
  private readonly SHIPPING_COST = 5.99;

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
  }

  // Subscribe to cart changes
  subscribe(listener: (cart: Cart) => void) {
    this.listeners.push(listener);
    // Immediately call with current cart state
    listener(this.cart);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current cart state
  getCart(): Cart {
    return { ...this.cart };
  }

  // Add item to cart
  addItem(product: Product, quantity: number = 1): void {
    console.log('Adding item to cart:', product.name, 'quantity:', quantity);
    
    const existingItemIndex = this.cart.items.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      this.cart.items[existingItemIndex].quantity += quantity;
      console.log('Updated existing item quantity to:', this.cart.items[existingItemIndex].quantity);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        addedAt: new Date(),
      };
      this.cart.items.push(newItem);
      console.log('Added new item to cart:', newItem);
    }

    this.updateCartTotals();
    this.saveCartToStorage();
    this.notifyListeners();
    
    console.log('Cart after adding item:', this.cart);
  }

  // Remove item from cart
  removeItem(itemId: string): void {
    this.cart.items = this.cart.items.filter(item => item.id !== itemId);
    this.updateCartTotals();
    this.saveCartToStorage();
    this.notifyListeners();
  }

  // Update item quantity
  updateItemQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.cart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.updateCartTotals();
      this.saveCartToStorage();
      this.notifyListeners();
    }
  }

  // Clear entire cart
  clearCart(): void {
    this.cart = {
      items: [],
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    };
    this.saveCartToStorage();
    this.notifyListeners();
  }

  // Get cart item count
  getItemCount(): number {
    return this.cart.totalItems;
  }

  // Check if product is in cart
  isInCart(productId: string): boolean {
    return this.cart.items.some(item => item.product.id === productId);
  }

  // Get quantity of specific product in cart
  getProductQuantity(productId: string): number {
    const item = this.cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Calculate cart totals
  private updateCartTotals(): void {
    this.cart.totalItems = this.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    this.cart.subtotal = this.cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );

    this.cart.tax = this.cart.subtotal * this.TAX_RATE;
    
    // Free shipping if subtotal is above threshold
    this.cart.shipping = this.cart.subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
    
    this.cart.total = this.cart.subtotal + this.cart.tax + this.cart.shipping;
  }

  // Notify all listeners of cart changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.cart }));
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    if (typeof window === 'undefined') return; // Skip on server-side
    
    try {
      localStorage.setItem('beerbro_cart', JSON.stringify({
        ...this.cart,
        items: this.cart.items.map(item => ({
          ...item,
          addedAt: item.addedAt.toISOString(),
        })),
      }));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    if (typeof window === 'undefined') return; // Skip on server-side
    
    try {
      const savedCart = localStorage.getItem('beerbro_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        this.cart = {
          ...parsedCart,
          items: parsedCart.items.map((item: CartItem & { addedAt: string }) => ({
            ...item,
            addedAt: new Date(item.addedAt),
          })),
        };
        this.updateCartTotals();
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  // Calculate shipping cost
  calculateShipping(subtotal: number): number {
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

  // Get free shipping threshold
  getFreeShippingThreshold(): number {
    return this.FREE_SHIPPING_THRESHOLD;
  }

  // Check if order qualifies for free shipping
  qualifiesForFreeShipping(): boolean {
    return this.cart.subtotal >= this.FREE_SHIPPING_THRESHOLD;
  }

  // Reorder items from a previous order
  async reorderItems(orderItems: CartItem[]): Promise<void> {
    try {
      // Clear current cart
      this.clearCart();
      
      // Add each item from the order
      for (const orderItem of orderItems) {
        await this.addItem(orderItem.product, orderItem.quantity);
      }
      
      console.log('Reorder completed:', this.cart);
    } catch (error) {
      console.error('Error reordering items:', error);
      throw error;
    }
  }

  // Get remaining amount for free shipping
  getRemainingForFreeShipping(): number {
    const remaining = this.FREE_SHIPPING_THRESHOLD - this.cart.subtotal;
    return Math.max(0, remaining);
  }
}

// Export singleton instance
export const cartService = new CartService();
