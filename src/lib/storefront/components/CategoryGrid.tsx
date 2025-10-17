'use client';

import { Card, CardContent } from '@/lib/common/ui/card';
import { Badge } from '@/lib/common/ui/badge';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isPopular?: boolean;
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
          <Card 
            key={category.id} 
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => onCategoryClick?.(category)}
          >
            <CardContent className="p-4 text-center">
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-16 h-16 mx-auto object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
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
        ))}
      </div>
    </div>
  );
}
