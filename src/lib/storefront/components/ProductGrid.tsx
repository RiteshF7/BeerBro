'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Button } from '@/lib/common/ui/button';
import { Badge } from '@/lib/common/ui/badge';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { cartService } from '../services/cart.service';
import { Product } from '../services/products.service';
import { useState, useEffect } from 'react';

// Placeholder images for different product categories
const getProductPlaceholderImage = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('beer')) {
    return 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80';
  } else if (categoryLower.includes('wine')) {
    return 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop&q=80';
  } else if (categoryLower.includes('spirit') || categoryLower.includes('whiskey') || categoryLower.includes('vodka')) {
    return 'https://images.unsplash.com/photo-1551538827-9c037bd4df7b?w=400&h=400&fit=crop&q=80';
  } else if (categoryLower.includes('cocktail')) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80';
  } else if (categoryLower.includes('non-alcoholic') || categoryLower.includes('mocktail')) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&q=80';
  } else if (categoryLower.includes('accessor')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80';
  } else {
    // Default placeholder
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&q=80';
  }
};

interface ProductGridProps {
  products: Product[];
  layout?: 'grid' | 'horizontal';
  title?: string;
  showTitle?: boolean;
}

// ProductCard component for individual product display
function ProductCard({ product }: { product: Product }) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      setCartQuantity(cartService.getProductQuantity(product.id));
    });
    return unsubscribe;
  }, [product.id]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const imageSrc = imageError || !product.image ? getProductPlaceholderImage(product.category) : product.image;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    cartService.addItem(product, 1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      cartService.removeItem(cartService.getCart().items.find(item => item.product.id === product.id)?.id || '');
    } else {
      const cartItem = cartService.getCart().items.find(item => item.product.id === product.id);
      if (cartItem) {
        cartService.updateItemQuantity(cartItem.id, newQuantity);
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          {imageLoading && (
            <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-t-lg animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt={product.name}
            className={`w-full h-40 sm:h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200 ${
              imageLoading ? 'hidden' : 'block'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <Badge variant="default" className="text-xs">New</Badge>
            )}
            {product.isOnSale && (
              <Badge variant="destructive" className="text-xs">Sale</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-sm sm:text-lg line-clamp-2">
            {product.name}
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || 4.0)}
            <span className="text-xs sm:text-sm text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => handleUpdateQuantity(cartQuantity - 1)}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                {cartQuantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                disabled={!product.inStock}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => handleUpdateQuantity(0)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full text-xs sm:text-sm" 
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Horizontal ProductCard component
function HorizontalProductCard({ product }: { product: Product }) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      setCartQuantity(cartService.getProductQuantity(product.id));
    });
    return unsubscribe;
  }, [product.id]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const imageSrc = imageError || !product.image ? getProductPlaceholderImage(product.category) : product.image;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    cartService.addItem(product, 1);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      cartService.removeItem(cartService.getCart().items.find(item => item.product.id === product.id)?.id || '');
    } else {
      const cartItem = cartService.getCart().items.find(item => item.product.id === product.id);
      if (cartItem) {
        cartService.updateItemQuantity(cartItem.id, newQuantity);
      }
    }
  };

  return (
    <Card className="min-w-[280px] flex-shrink-0">
      <CardHeader className="p-0">
        <div className="relative">
          {imageLoading && (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt={product.name}
            className={`w-full h-48 object-cover rounded-t-lg ${
              imageLoading ? 'hidden' : 'block'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <Badge variant="default" className="text-xs">New</Badge>
            )}
            {product.isOnSale && (
              <Badge variant="destructive" className="text-xs">Sale</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-lg line-clamp-2">
            {product.name}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || 4.0)}
            <span className="text-sm text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(cartQuantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">
                {cartQuantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                disabled={!product.inStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleUpdateQuantity(0)}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ProductGrid({ 
  products, 
  layout = 'grid', 
  title = 'Products',
  showTitle = true 
}: ProductGridProps) {

  if (layout === 'horizontal') {
    return (
      <div className="space-y-6">
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        )}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {products.map((product) => (
            <HorizontalProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {showTitle && (
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
