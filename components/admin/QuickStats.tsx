'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface QuickStatsProps {
  className?: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ className }) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data - will be replaced with real API calls
  const mockStats: StatItem[] = [
    {
      id: 'revenue',
      title: 'Doanh thu hôm nay',
      value: '₫2,450,000',
      change: 12.5,
      changeType: 'increase',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-green-500'
    },
    {
      id: 'orders',
      title: 'Đơn hàng mới',
      value: 24,
      change: -5.2,
      changeType: 'decrease',
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'text-blue-500'
    },
    {
      id: 'users',
      title: 'Người dùng online',
      value: 156,
      change: 8.1,
      changeType: 'increase',
      icon: <Users className="h-5 w-5" />,
      color: 'text-purple-500'
    },
    {
      id: 'products',
      title: 'Sản phẩm bán chạy',
      value: 89,
      change: 0,
      changeType: 'neutral',
      icon: <Package className="h-5 w-5" />,
      color: 'text-orange-500'
    }
  ];

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would be:
      // const response = await fetch('/api/admin/dashboard/quick-stats');
      // const data = await response.json();
      // setStats(data.stats);
      
      // For now, use mock data with some randomization
      const updatedStats = mockStats.map(stat => ({
        ...stat,
        value: typeof stat.value === 'number' 
          ? stat.value + Math.floor(Math.random() * 10) - 5
          : stat.value,
        change: stat.change + (Math.random() * 4 - 2)
      }));
      
      setStats(updatedStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number, changeType: string) => {
    const absChange = Math.abs(change);
    const sign = change > 0 ? '+' : change < 0 ? '-' : '';
    
    return {
      text: `${sign}${absChange.toFixed(1)}%`,
      color: changeType === 'increase' 
        ? 'text-green-500' 
        : changeType === 'decrease' 
        ? 'text-red-500' 
        : 'text-slate-400'
    };
  };

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Thống kê nhanh</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">
            Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const changeFormat = formatChange(stat.change, stat.changeType);
          
          return (
            <Card key={stat.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {stat.title}
                </CardTitle>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant="secondary" 
                    className={`${changeFormat.color} bg-transparent border-0 px-0`}
                  >
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(stat.changeType)}
                      <span className="text-xs">{changeFormat.text}</span>
                    </div>
                  </Badge>
                  <span className="text-xs text-slate-400">so với hôm qua</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;