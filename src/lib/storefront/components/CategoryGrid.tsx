'use client';

import { Card, CardContent } from '@/lib/common/ui/card';
import { Badge } from '@/lib/common/ui/badge';
import { useState } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isPopular?: boolean;
}

// Placeholder images for different categories
const getPlaceholderImage = (categoryName: string): string => {
  const categoryLower = categoryName.toLowerCase();
  
  if (categoryLower.includes('beer')) {
    return 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('wine')) {
    return 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('spirit') || categoryLower.includes('whiskey') || categoryLower.includes('vodka')) {
    return 'https://images.unsplash.com/photo-1551538827-9c037bd4df7b?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('cocktail')) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('non-alcoholic') || categoryLower.includes('mocktail')) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('accessor')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&q=80';
  } else {
    // Default placeholder
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&q=80';
  }
};

// Category card component with image fallback
function CategoryCard({ category, onCategoryClick }: { category: Category; onCategoryClick?: (category: Category) => void }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const imageSrc = imageError || !category.image ? getPlaceholderImage(category.name) : category.image;
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => onCategoryClick?.(category)}
    >
      <CardContent className="p-4 text-center">
        <div className="space-y-3">
          <div className="relative">
            {imageLoading && (
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            )}
            <img
              src={imageSrc}
              alt={category.name}
              className={`w-16 h-16 mx-auto object-cover rounded-full group-hover:scale-110 transition-transform duration-200 ${
                imageLoading ? 'hidden' : 'block'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {category.isPopular && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 text-xs"
              >
                Hot
              </Badge>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {category.productCount} products
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CategoryGridProps {
  categories: Category[];
  title?: string;
  showTitle?: boolean;
  onCategoryClick?: (category: Category) => void;
}

export function CategoryGrid({ 
  categories, 
  title = 'Categories',
  showTitle = true,
  onCategoryClick 
}: CategoryGridProps) {
  return (
    <div className="space-y-6">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    </div>
  );
}
