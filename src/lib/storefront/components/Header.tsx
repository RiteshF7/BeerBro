'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/common/ui/button';
import { Input } from '@/lib/common/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/common/ui/avatar';
import { Badge } from '@/lib/common/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/lib/common/ui/dropdown-menu';
import { Search, ShoppingCart, User, Menu, LogOut, Settings, UserCircle, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cartService } from '../services/cart.service';
import InstallAppButton from '@/components/InstallAppButton';

interface HeaderProps {
  onSearch?: (query: string) => void;
  cartItems?: number;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onSignOut?: () => void;
}

export function Header({ onSearch, cartItems = 0, user, onSignOut }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actualCartItems, setActualCartItems] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = cartService.subscribe((cart) => {
      console.log('Cart updated in Header:', cart);
      setActualCartItems(cart.totalItems);
    });
    return unsubscribe;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">BeerBro</span>
            </button>
          </div>

          {/* Search Bar - Hidden on mobile, shown on tablet and up */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Install App Button - Desktop only */}
            <div className="hidden lg:block">
              <InstallAppButton 
                variant="outline" 
                size="sm" 
                showText={false}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              />
            </div>

            {/* Search Button - Mobile only */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => {
                // You could implement a mobile search modal here
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                }
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => {
                console.log('Cart button clicked, navigating to /cart');
                router.push('/cart');
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {actualCartItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {actualCartItems}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 sm:space-x-3 h-auto p-1 sm:p-2">
                    {/* Hide user info on mobile, show only avatar */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push('/login')} className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Sign In Button */}
            {!user && (
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => router.push('/login')}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Shown below header on mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
