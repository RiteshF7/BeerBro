'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/lib/storefront/components/Header';
import { ProductGrid } from '@/lib/storefront/components/ProductGrid';
import { CategoryGrid } from '@/lib/storefront/components/CategoryGrid';
import { AuthWrapper } from '@/lib/storefront/components/AuthWrapper';
import { sampleProducts, sampleCategories } from '@/lib/storefront/data/sampleData';
import { authService, UserProfile } from '@/lib/storefront/auth/authService';
import { Button } from "@/lib/common/ui/button";

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
      }
    });

    return unsubscribe;
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(sampleProducts);
    } else {
      const filtered = sampleProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryClick = (category: { name: string }) => {
    const filtered = sampleProducts.filter(product =>
      product.category.toLowerCase() === category.name.toLowerCase()
    );
    setFilteredProducts(filtered);
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get featured products (first 4)
  const featuredProducts = sampleProducts.slice(0, 4);
  
  // Get new arrivals (last 4)
  const newArrivals = sampleProducts.slice(-4);

  // Prepare user data for header
  const user = userProfile ? {
    name: userProfile.displayName,
    email: userProfile.email,
    avatar: userProfile.photoURL
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        cartItems={3}
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
            categories={sampleCategories}
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
            <Button variant="outline" size="lg" asChild>
              <a href="/login">Sign In</a>
            </Button>
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
