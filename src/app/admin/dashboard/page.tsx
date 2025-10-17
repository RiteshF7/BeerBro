'use client';

import { useState, useEffect } from 'react';
import { AdminStats } from '@/components/admin/AdminStats';
import { getProducts } from '@/lib/adminconsole/products/api';
import { getOrders } from '@/lib/adminconsole/orders/api';
import { getUsers } from '@/lib/adminconsole/users/api';
import { Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const [products, orders, users] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsers(),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your admin console</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your admin console</p>
      </div>

      <AdminStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium">Manage Products</p>
                <p className="text-sm text-gray-600">Add, edit, or remove products</p>
              </div>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-3 text-green-600" />
              <div>
                <p className="font-medium">View Orders</p>
                <p className="text-sm text-gray-600">Process and manage orders</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-3 text-purple-600" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Pending Orders</p>
                <p className="text-sm text-gray-600">Orders waiting for approval</p>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {stats.pendingOrders}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Total Revenue</p>
                <p className="text-sm text-gray-600">All-time sales</p>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${stats.totalRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
