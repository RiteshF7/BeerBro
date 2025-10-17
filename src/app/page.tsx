'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/lib/storefront/components/Header';
import { ProductGrid } from '@/lib/storefront/components/ProductGrid';
import { CategoryGrid } from '@/lib/storefront/components/CategoryGrid';
import { AuthWrapper } from '@/lib/storefront/components/AuthWrapper';
import { productsService, Product, Category } from '@/lib/storefront/services/products.service';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { Button } from "@/lib/common/ui/button";
import { Loader2 } from 'lucide-react';

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading products from Firestore...');
        const productsData = await productsService.getProducts({ inStock: true });
        
        console.log('Products loaded:', productsData.length);
        console.log('Sample product:', productsData[0]);
        console.log('Using hardcoded categories instead of Firestore');
        
        setProducts(productsData);
        setCategories([]); // Empty array since we use hardcoded categories
        setFilteredProducts(productsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Reset category selection when searching
    
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      try {
        const searchResults = await productsService.searchProducts(query);
        setFilteredProducts(searchResults);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again.');
      }
    }
  };

  const handleCategoryClick = async (category: { name: string; id: string }) => {
    try {
      setFiltering(true);
      setError(null);
      setSearchQuery(''); // Clear search when selecting category
      setSelectedCategory(category.id === 'all' ? null : category.name);
      
      if (category.id === 'all') {
        // Show all products
        setFilteredProducts(products);
      } else {
        // Filter by category - use lowercase to match Firestore data
        const firestoreCategoryName = category.name.toLowerCase();
        const categoryProducts = await productsService.getProducts({ 
          category: firestoreCategoryName,
          inStock: true 
        });
        setFilteredProducts(categoryProducts);
      }
    } catch (err) {
      console.error('Error filtering by category:', err);
      setError('Failed to filter products. Please try again.');
    } finally {
      setFiltering(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Hardcoded featured products
  const featuredProducts: Product[] = [
    {
      id: 'featured-1',
      name: 'Premium Craft IPA',
      description: 'Award-winning IPA with tropical fruit notes and a crisp finish',
      price: 15.99,
      originalPrice: 18.99,
      image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80',
      category: 'Beer',
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      isOnSale: true,
      isNew: false,
      stockQuantity: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['craft', 'ipa', 'award-winning'],
      alcoholContent: 6.5,
      volume: 355,
      brand: 'Craft Masters',
    },
    {
      id: 'featured-2',
      name: 'Vintage Cabernet Sauvignon',
      description: 'Rich and full-bodied red wine with notes of blackcurrant and oak',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop&q=80',
      category: 'Wine',
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
      isOnSale: false,
      isNew: false,
      stockQuantity: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['vintage', 'cabernet', 'premium'],
      alcoholContent: 13.5,
      volume: 750,
      brand: 'Vineyard Estates',
    },
    {
      id: 'featured-3',
      name: 'Single Malt Whiskey 18yr',
      description: 'Aged 18 years in oak barrels for exceptional smoothness and complexity',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1551538827-9c037bd4df7b?w=400&h=400&fit=crop&q=80',
      category: 'Spirits',
      rating: 4.9,
      reviewCount: 67,
      inStock: true,
      isOnSale: false,
      isNew: false,
      stockQuantity: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['single-malt', 'aged', 'premium'],
      alcoholContent: 40.0,
      volume: 700,
      brand: 'Highland Distillery',
    },
  ];

  // Prepare user data for header
  const user = userProfile ? {
    name: userProfile.displayName,
    email: userProfile.email,
    avatar: userProfile.photoURL
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onSearch={() => {}}
          cartItems={0}
          user={user}
          onSignOut={handleSignOut}
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products Available</h1>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re currently setting up our product catalog. Please check back soon!
            </p>
            <p className="text-sm text-gray-500">
              Make sure Firebase is properly configured and products are added to Firestore.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        cartItems={0}
        user={user}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to BeerBro
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover the finest selection of craft beers, wines, and spirits. 
            From local favorites to international classics, we have something for every taste.
          </p>
        </div>

        {/* Categories Section - Sidebar */}
        <CategoryGrid 
          categories={categories}
          onCategoryClick={handleCategoryClick}
          layout="sidebar"
          products={products}
          selectedCategory={selectedCategory}
        />

        {/* Featured Products - Horizontal */}
        <section className="mb-12 sm:mb-16">
          <ProductGrid 
            products={featuredProducts}
            layout="horizontal"
            title="Featured Products"
          />
        </section>

        {/* New Arrivals - Hidden for now */}
        {/* <section className="mb-16">
          <ProductGrid 
            products={newArrivals}
            layout="horizontal"
            title="New Arrivals"
          />
        </section> */}

        {/* All Products - Grid */}
        <section className="mb-12 sm:mb-16">
          <ProductGrid 
            products={filtering ? [] : filteredProducts}
            layout="grid"
            title={
              searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedCategory 
                  ? `${selectedCategory} Products` 
                  : "All Products"
            }
          />
          {filtering && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-gray-600">Loading products...</span>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Explore More?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join our community of beer enthusiasts and discover exclusive offers, 
            new releases, and expert recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button size="lg" asChild>
              <a href="/admin">Admin Console</a>
            </Button>
            {!userProfile && (
              <Button variant="outline" size="lg" asChild>
                <a href="/login">Sign In</a>
              </Button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthWrapper>
      <HomeContent />
    </AuthWrapper>
  );
}
