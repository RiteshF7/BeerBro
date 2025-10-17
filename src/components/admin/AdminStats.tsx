'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { LucideIcon, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  description 
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminStatsProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    pendingOrders: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Products"
        value={stats.totalProducts}
        icon={Package}
        iconColor="text-blue-600"
      />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={ShoppingCart}
        iconColor="text-green-600"
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
        iconColor="text-purple-600"
      />
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        iconColor="text-orange-600"
      />
    </div>
  );
}
