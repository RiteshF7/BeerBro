'use client';

import { Card, CardContent } from '@/lib/common/ui/card';
import { Badge } from '@/lib/common/ui/badge';
import { Button } from '@/lib/common/ui/button';
import { X, Menu } from 'lucide-react';
import { useState } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string; // Make image optional since it might not exist in Firestore
  productCount: number;
  isPopular?: boolean;
}

// Hardcoded categories
const HARDCODED_CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    description: 'Browse all available products',
    productCount: 0, // Will be updated dynamically
    isPopular: true,
  },
  {
    id: 'beer',
    name: 'Beer',
    description: 'Craft and premium beers from around the world',
    productCount: 0, // Will be updated dynamically
    isPopular: true,
  },
  {
    id: 'wine',
    name: 'Wine',
    description: 'Red, white, and sparkling wines',
    productCount: 0,
    isPopular: false,
  },
  {
    id: 'spirits',
    name: 'Spirits',
    description: 'Whiskey, vodka, rum, and other premium spirits',
    productCount: 0,
    isPopular: true,
  },
  {
    id: 'cocktails',
    name: 'Cocktails',
    description: 'Ready-to-drink cocktails and mixers',
    productCount: 0,
    isPopular: false,
  },
  {
    id: 'non-alcoholic',
    name: 'Non-Alcoholic',
    description: 'Alcohol-free beverages and mocktails',
    productCount: 0,
    isPopular: false,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Drinking accessories, glassware, and gifts',
    productCount: 0,
    isPopular: false,
  },
];

// Hardcoded image URLs for different categories
const getCategoryImage = (categoryName: string): string => {
  const categoryLower = categoryName.toLowerCase();
  
  if (categoryLower.includes('all products') || categoryLower.includes('all')) {
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('beer')) {
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
    // Default image for any other category
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&q=80';
  }
};

// Category card component with hardcoded images
function CategoryCard({ category, onCategoryClick }: { category: Category; onCategoryClick?: (category: Category) => void }) {
  // Always use hardcoded images for categories
  const imageSrc = getCategoryImage(category.name);
  console.log('CategoryCard rendering:', category.name, 'Image URL:', imageSrc);
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-sm bg-white"
      onClick={() => onCategoryClick?.(category)}
    >
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <img
              src={imageSrc}
              alt={category.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm"
            />
            {category.isPopular && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 text-xs px-2 py-1"
              >
                Hot
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500">
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
  // Use hardcoded categories instead of Firestore categories
  const displayCategories = HARDCODED_CATEGORIES;
  
  console.log('CategoryGrid rendering with hardcoded categories:', displayCategories);
  
  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">Browse our selection by category</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {displayCategories.map((category) => (
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
