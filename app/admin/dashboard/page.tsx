'use client'

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import ChartCard from '@/components/admin/ChartCard';
import AdminHeader from '@/components/admin/AdminHeader';
import QuickStats from '@/components/admin/QuickStats';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { SecurityAuditPanel } from '@/components/security-audit-panel';
import { PerformanceOptimizer } from '@/components/performance-optimizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Users, ShoppingCart, Eye, Package, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';

// Mock data - in real app, this would come from API
const mockStats = {
  totalRevenue: 125000,
  totalUsers: 8450,
  totalOrders: 2340,
  totalProducts: 1250,
  totalViews: 45600,
  conversionRate: 5.2,
  revenueChange: 12.5,
  usersChange: 8.3,
  ordersChange: 15.2,
  productsChange: 3.7,
  viewsChange: -2.1,
  conversionChange: 3.2,
};

const mockChartData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 320 },
  { name: 'Apr', revenue: 4500, orders: 280 },
  { name: 'May', revenue: 6000, orders: 390 },
  { name: 'Jun', revenue: 5500, orders: 350 },
];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In real app, fetch from actual APIs:
        // const [statsRes, chartRes] = await Promise.all([
        //   fetch('/api/admin/stats'),
        //   fetch('/api/admin/chart-data')
        // ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Admin Header */}
      <AdminHeader 
        title="Admin Dashboard"
        subtitle="Comprehensive management and monitoring for your 3D model store"
      />
      
      {/* Quick Stats */}
      <QuickStats className="mb-8" />

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            <Eye className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={stats.revenueChange}
              icon={DollarSign}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              change={stats.usersChange}
              icon={Users}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              change={stats.ordersChange}
              icon={ShoppingCart}
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              change={stats.productsChange}
              icon={Package}
            />
            <StatCard
              title="Page Views"
              value={stats.totalViews}
              change={stats.viewsChange}
              icon={Eye}
            />
            <StatCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              change={stats.conversionChange}
              icon={TrendingUp}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Revenue Trend"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={stats.revenueChange}
              subtitle="Monthly revenue over time"
            >
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Chart component will be integrated here</p>
                  <p className="text-sm">Using Recharts or Chart.js</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Orders Overview"
              value={stats.totalOrders}
              change={stats.ordersChange}
              subtitle="Order volume by month"
            >
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                  <p>Orders chart will be here</p>
                  <p className="text-sm">Bar or line chart</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New order #1234', time: '2 minutes ago', type: 'order' },
                { action: 'User John Doe registered', time: '5 minutes ago', type: 'user' },
                { action: 'Product "Modern Chair" updated', time: '10 minutes ago', type: 'product' },
                { action: 'Payment received $299', time: '15 minutes ago', type: 'payment' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-blue-400' :
                      activity.type === 'user' ? 'bg-green-400' :
                      activity.type === 'product' ? 'bg-yellow-400' :
                      'bg-purple-400'
                    }`}></div>
                    <span className="text-slate-300">{activity.action}</span>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="bg-slate-900 rounded-lg p-6">
            <AnalyticsDashboard />
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="bg-slate-900 rounded-lg p-6">
            <PerformanceOptimizer />
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="bg-slate-900 rounded-lg p-6">
            <SecurityAuditPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;