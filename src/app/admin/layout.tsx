'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/lib/common/contexts/FirebaseContext';
import { isAdmin } from '@/lib/auth';
import { Button } from '@/lib/common/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/common/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/lib/common/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  MapPin, 
  Users, 
  LogOut,
  User as UserIcon,
  LayoutDashboard
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useFirebase();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!user) {
        router.push('/');
        return;
      }

      const userIsAdmin = await isAdmin(user);
      if (!userIsAdmin) {
        router.push('/');
        return;
      }

      setIsAuthorized(true);
    };

    checkAdminStatus();
  }, [user, loading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">BeerBro Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName || 'Admin'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 pr-8">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
