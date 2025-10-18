'use client';

import { Card, CardContent } from '@/lib/common/ui/card';
import { Badge } from '@/lib/common/ui/badge';
import { Button } from '@/lib/common/ui/button';
import { X, Menu } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../services/products.service';

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
    id: 'whisky',
    name: 'Whisky',
    description: 'Premium whiskies including bourbon, scotch, and rye',
    productCount: 0,
    isPopular: true,
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'Artisanal gins with unique botanical profiles',
    productCount: 0,
    isPopular: true,
  },
  {
    id: 'vodka',
    name: 'Vodka',
    description: 'Premium vodkas from around the world',
    productCount: 0,
    isPopular: false,
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'Aged and spiced rums for every taste',
    productCount: 0,
    isPopular: false,
  },
  {
    id: 'tequila',
    name: 'Tequila',
    description: 'Authentic tequilas and mezcals from Mexico',
    productCount: 0,
    isPopular: false,
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
  } else if (categoryLower.includes('whiskey')) {
    return 'https://images.unsplash.com/photo-1551538827-9c037bd4df7b?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('gin')) {
    return 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('vodka')) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('rum')) {
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&q=80';
  } else if (categoryLower.includes('tequila')) {
    return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop&q=80';
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

// Category sidebar item component
function CategorySidebarItem({ category, onCategoryClick, isSelected = false }: { 
  category: Category; 
  onCategoryClick?: (category: Category) => void;
  isSelected?: boolean;
}) {
  const imageSrc = getCategoryImage(category.name);
  
  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
        isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-gray-100'
      }`}
      onClick={() => onCategoryClick?.(category)}
    >
      <div className="relative w-10 h-10 flex-shrink-0">
        <img
          src={imageSrc}
          alt={category.name}
          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
        />
        {category.isPopular && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 text-xs px-1 py-0.5"
          >
            Hot
          </Badge>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm transition-colors ${
          isSelected 
            ? 'text-primary-foreground' 
            : 'text-gray-900 group-hover:text-primary'
        }`}>
          {category.name}
        </h3>
        <p className={`text-xs truncate ${
          isSelected 
            ? 'text-primary-foreground/80' 
            : 'text-gray-500'
        }`}>
          {category.productCount} products
        </p>
      </div>
    </div>
  );
}

// Category card component with hardcoded images (for grid layout)
function CategoryCard({ category, onCategoryClick }: { category: Category; onCategoryClick?: (category: Category) => void }) {
  // Always use hardcoded images for categories
  const imageSrc = getCategoryImage(category.name);
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-sm bg-white"
      onClick={() => onCategoryClick?.(category)}
    >
      <CardContent className="p-3 sm:p-4 md:p-6 text-center">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
            <img
              src={imageSrc}
              alt={category.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm"
            />
            {category.isPopular && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-xs px-1 py-0.5 sm:px-2 sm:py-1"
              >
                Hot
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
  layout?: 'grid' | 'sidebar';
  products?: Product[]; // Add products prop to calculate counts
  selectedCategory?: string | null; // Add selected category prop
}

export function CategoryGrid({ 
  categories, 
  title = 'Categories',
  showTitle = true,
  onCategoryClick,
  layout = 'grid',
  products = [],
  selectedCategory = null
}: CategoryGridProps) {
  // Use hardcoded categories but update product counts based on actual products
  const displayCategories = HARDCODED_CATEGORIES.map(category => {
    if (category.id === 'all') {
      return {
        ...category,
        productCount: products.length
      };
    } else {
      const categoryProducts = products.filter(product => 
        product.category?.toLowerCase() === category.name.toLowerCase()
      );
      return {
        ...category,
        productCount: categoryProducts.length
      };
    }
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  
  if (layout === 'sidebar') {
    return (
      <>
        {/* Hamburger Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 left-4 z-50 bg-white shadow-lg md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Categories</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              {displayCategories.map((category) => (
                <CategorySidebarItem
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.name || (selectedCategory === null && category.id === 'all')}
                  onCategoryClick={(cat) => {
                    onCategoryClick?.(cat);
                    setSidebarOpen(false); // Close sidebar after selection
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Default grid layout
  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Browse our selection by category</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
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
