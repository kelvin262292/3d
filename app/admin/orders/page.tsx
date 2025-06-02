'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Eye, Download, Filter, Trash2, Archive, Truck, CheckCircle, XCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import BulkActions from '@/components/admin/BulkActions';
import { toast } from 'sonner';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
}

// Mock data - in real app, this would come from API
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'processing',
    total: 599.98,
    items: [
      { id: '1', productName: 'Modern Office Chair', quantity: 2, price: 299.99 }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: '123 Main St, New York, NY 10001',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'shipped',
    total: 1299.99,
    items: [
      { id: '2', productName: 'Luxury Sports Car', quantity: 1, price: 1299.99 }
    ],
    createdAt: '2024-01-14T15:45:00Z',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
    paymentMethod: 'PayPal'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    status: 'delivered',
    total: 599.99,
    items: [
      { id: '3', productName: 'Modern House Design', quantity: 1, price: 599.99 }
    ],
    createdAt: '2024-01-13T09:15:00Z',
    shippingAddress: '789 Pine St, Chicago, IL 60601',
    paymentMethod: 'Credit Card'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    status: 'pending',
    total: 899.97,
    items: [
      { id: '1', productName: 'Modern Office Chair', quantity: 3, price: 299.99 }
    ],
    createdAt: '2024-01-12T14:20:00Z',
    shippingAddress: '321 Elm St, Miami, FL 33101',
    paymentMethod: 'Bank Transfer'
  },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    // In real app, fetch from API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    // fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500 text-yellow-50',
      processing: 'bg-blue-500 text-blue-50',
      shipped: 'bg-purple-500 text-purple-50',
      delivered: 'bg-green-500 text-green-50',
      cancelled: 'bg-red-500 text-red-50'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const handleBulkAction = async (actionId: string, selectedItems: string[]) => {
    try {
      switch (actionId) {
        case 'delete':
          setOrders(prev => prev.filter(order => !selectedItems.includes(order.id)));
          toast.success(`Đã xóa ${selectedItems.length} đơn hàng`);
          break;
        case 'archive':
          // In real app, call API to archive orders
          toast.success(`Đã lưu trữ ${selectedItems.length} đơn hàng`);
          break;
        case 'ship':
          setOrders(prev => prev.map(order => 
            selectedItems.includes(order.id) 
              ? { ...order, status: 'shipped' as const }
              : order
          ));
          toast.success(`Đã cập nhật trạng thái giao hàng cho ${selectedItems.length} đơn hàng`);
          break;
        case 'complete':
          setOrders(prev => prev.map(order => 
            selectedItems.includes(order.id) 
              ? { ...order, status: 'delivered' as const }
              : order
          ));
          toast.success(`Đã hoàn thành ${selectedItems.length} đơn hàng`);
          break;
        case 'cancel':
          setOrders(prev => prev.map(order => 
            selectedItems.includes(order.id) 
              ? { ...order, status: 'cancelled' as const }
              : order
          ));
          toast.success(`Đã hủy ${selectedItems.length} đơn hàng`);
          break;
        case 'export':
          // In real app, generate and download export file
          toast.success(`Đã xuất dữ liệu ${selectedItems.length} đơn hàng`);
          break;
      }
      setSelectedOrders([]);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thực hiện hành động');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <AdminHeader 
        title="Orders Management"
        description="Track and manage customer orders, payments, and shipping."
        actions={[
          {
            label: 'Export',
            icon: <Download className="w-4 h-4" />,
            variant: 'outline',
            onClick: () => toast.success('Xuất dữ liệu đơn hàng')
          },
          {
            label: 'Advanced Filter',
            icon: <Filter className="w-4 h-4" />,
            variant: 'outline',
            onClick: () => toast.info('Mở bộ lọc nâng cao')
          }
        ]}
      />

      <BulkActions
        selectedItems={selectedOrders}
        onSelectionChange={setSelectedOrders}
        onBulkAction={handleBulkAction}
        actions={[
          {
            id: 'delete',
            label: 'Xóa đơn hàng',
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            requiresConfirmation: true,
            confirmationTitle: 'Xóa đơn hàng đã chọn',
            confirmationDescription: 'Các đơn hàng đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
          },
          {
            id: 'archive',
            label: 'Lưu trữ',
            icon: <Archive className="h-4 w-4" />,
            variant: 'secondary'
          },
          {
            id: 'ship',
            label: 'Đánh dấu đã giao',
            icon: <Truck className="h-4 w-4" />,
            variant: 'default'
          },
          {
            id: 'complete',
            label: 'Hoàn thành',
            icon: <CheckCircle className="h-4 w-4" />,
            variant: 'default'
          },
          {
            id: 'cancel',
            label: 'Hủy đơn hàng',
            icon: <XCircle className="h-4 w-4" />,
            variant: 'destructive'
          },
          {
            id: 'export',
            label: 'Xuất dữ liệu',
            icon: <Download className="h-4 w-4" />,
            variant: 'outline'
          }
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-white">{filteredOrders.length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">${getTotalRevenue().toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {filteredOrders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Delivered Orders</h3>
          <p className="text-2xl font-bold text-green-400">
            {filteredOrders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-slate-400 text-sm flex items-center">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-850">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium w-12">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedOrders(filteredOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">Order</th>
                <th className="text-left p-4 text-slate-400 font-medium">Customer</th>
                <th className="text-left p-4 text-slate-400 font-medium">Items</th>
                <th className="text-left p-4 text-slate-400 font-medium">Total</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-700 hover:bg-slate-750">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(prev => [...prev, order.id]);
                        } else {
                          setSelectedOrders(prev => prev.filter(id => id !== order.id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{order.orderNumber}</p>
                      <p className="text-slate-400 text-sm">{order.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{order.customerName}</p>
                      <p className="text-slate-400 text-sm">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{order.items.length} item(s)</p>
                      <p className="text-slate-400 text-sm">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">No orders found matching your criteria.</p>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;