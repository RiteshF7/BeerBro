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
        const [productsData, categoriesData] = await Promise.all([
          productsService.getProducts({ inStock: true }),
          productsService.getCategories()
        ]);
        
        console.log('Products loaded:', productsData.length);
        console.log('Categories loaded:', categoriesData.length);
        console.log('Sample product:', productsData[0]);
        
        setProducts(productsData);
        setCategories(categoriesData);
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

  const handleCategoryClick = async (category: { name: string }) => {
    try {
      const categoryProducts = await productsService.getProducts({ 
        category: category.name,
        inStock: true 
      });
      setFilteredProducts(categoryProducts);
    } catch (err) {
      console.error('Error filtering by category:', err);
      setError('Failed to filter products. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get featured and new products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const [featured, newProducts] = await Promise.all([
          productsService.getFeaturedProducts(),
          productsService.getNewProducts()
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(newProducts);
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    };

    if (products.length > 0) {
      loadFeaturedProducts();
    }
  }, [products]);

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BeerBro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the finest selection of craft beers, wines, and spirits. 
            From local favorites to international classics, we have something for every taste.
          </p>
        </div>

        {/* Categories Section */}
        <section className="mb-16">
          <CategoryGrid 
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        </section>

        {/* Featured Products - Horizontal */}
        <section className="mb-16">
          <ProductGrid 
            products={featuredProducts}
            layout="horizontal"
            title="Featured Products"
          />
        </section>

        {/* New Arrivals - Horizontal */}
        <section className="mb-16">
          <ProductGrid 
            products={newArrivals}
            layout="horizontal"
            title="New Arrivals"
          />
        </section>

        {/* All Products - Grid */}
        <section className="mb-16">
          <ProductGrid 
            products={filteredProducts}
            layout="grid"
            title={searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          />
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore More?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of beer enthusiasts and discover exclusive offers, 
            new releases, and expert recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
