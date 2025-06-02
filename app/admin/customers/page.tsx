'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Eye, Mail, Phone, MapPin, Calendar, Filter, Download, Trash2, Archive, UserX, UserCheck } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import BulkActions from '@/components/admin/BulkActions';
import { toast } from 'sonner';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  joinedDate: string;
  location?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Mock data - in real app, this would come from API
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    totalOrders: 12,
    totalSpent: 2599.88,
    lastOrderDate: '2024-01-15T10:30:00Z',
    joinedDate: '2023-06-15T09:00:00Z',
    location: 'New York, NY',
    tier: 'gold'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    status: 'active',
    totalOrders: 8,
    totalSpent: 1899.92,
    lastOrderDate: '2024-01-14T15:45:00Z',
    joinedDate: '2023-08-22T14:30:00Z',
    location: 'Los Angeles, CA',
    tier: 'silver'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    totalOrders: 25,
    totalSpent: 4299.75,
    lastOrderDate: '2024-01-13T09:15:00Z',
    joinedDate: '2023-03-10T11:20:00Z',
    location: 'Chicago, IL',
    tier: 'platinum'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    status: 'inactive',
    totalOrders: 3,
    totalSpent: 599.97,
    lastOrderDate: '2023-12-05T16:20:00Z',
    joinedDate: '2023-11-01T10:15:00Z',
    location: 'Miami, FL',
    tier: 'bronze'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1 (555) 321-9876',
    status: 'banned',
    totalOrders: 1,
    totalSpent: 99.99,
    lastOrderDate: '2023-10-15T12:00:00Z',
    joinedDate: '2023-10-10T08:45:00Z',
    location: 'Seattle, WA',
    tier: 'bronze'
  },
];

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    // In real app, fetch from API
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // const response = await fetch('/api/users');
        // const data = await response.json();
        // setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };

    // fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.location && customer.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500 text-green-50',
      inactive: 'bg-yellow-500 text-yellow-50',
      banned: 'bg-red-500 text-red-50'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      bronze: 'bg-amber-600 text-amber-50',
      silver: 'bg-slate-500 text-slate-50',
      gold: 'bg-yellow-500 text-yellow-50',
      platinum: 'bg-purple-500 text-purple-50'
    };
    return variants[tier as keyof typeof variants] || variants.bronze;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCustomerStats = () => {
    const totalCustomers = filteredCustomers.length;
    const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;
    const totalRevenue = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const avgOrderValue = totalRevenue / filteredCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0) || 0;
    
    return { totalCustomers, activeCustomers, totalRevenue, avgOrderValue };
  };

  const stats = getCustomerStats();

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    try {
      switch (actionId) {
        case 'delete':
          // Xóa nhiều khách hàng
          const deletePromises = selectedIds.map(id => 
            fetch(`/api/users/${id}`, { method: 'DELETE' })
          );
          await Promise.all(deletePromises);
          setCustomers(customers.filter(customer => !selectedIds.includes(customer.id)));
          setSelectedCustomers([]);
          toast.success(`Đã xóa ${selectedIds.length} khách hàng`);
          break;
          
        case 'activate':
          // Kích hoạt khách hàng
          const activatePromises = selectedIds.map(id => 
            fetch(`/api/users/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'active' })
            })
          );
          await Promise.all(activatePromises);
          setCustomers(customers.map(customer => 
            selectedIds.includes(customer.id) 
              ? { ...customer, status: 'active' as any }
              : customer
          ));
          setSelectedCustomers([]);
          toast.success(`Đã kích hoạt ${selectedIds.length} khách hàng`);
          break;
          
        case 'deactivate':
          // Vô hiệu hóa khách hàng
          const deactivatePromises = selectedIds.map(id => 
            fetch(`/api/users/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'inactive' })
            })
          );
          await Promise.all(deactivatePromises);
          setCustomers(customers.map(customer => 
            selectedIds.includes(customer.id) 
              ? { ...customer, status: 'inactive' as any }
              : customer
          ));
          setSelectedCustomers([]);
          toast.success(`Đã vô hiệu hóa ${selectedIds.length} khách hàng`);
          break;
          
        case 'export':
          // Xuất dữ liệu khách hàng
          const selectedCustomersData = customers.filter(c => selectedIds.includes(c.id));
          const csvContent = [
            'ID,Name,Email,Phone,Status,Total Orders,Total Spent,Tier,Joined Date,Location',
            ...selectedCustomersData.map(c => 
              `${c.id},"${c.name}","${c.email}","${c.phone || ''}",${c.status},${c.totalOrders},${c.totalSpent},${c.tier},${c.joinedDate},"${c.location || ''}"`
            )
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success('Dữ liệu khách hàng đã được xuất thành công');
          break;
          
        default:
          toast.error('Hành động không được hỗ trợ');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Có lỗi xảy ra khi thực hiện thao tác');
    }
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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Admin Header */}
      <AdminHeader 
        title="Customers Management"
        subtitle="Manage customer accounts, track spending, and analyze behavior"
      />
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Active Customers</h3>
          <p className="text-2xl font-bold text-green-400">{stats.activeCustomers}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Avg Order Value</h3>
          <p className="text-2xl font-bold text-white">${stats.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-slate-400 text-sm flex items-center">
            {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        items={filteredCustomers}
        selectedItems={selectedCustomers}
        onSelectionChange={setSelectedCustomers}
        actions={[
          {
            id: 'delete',
            label: 'Xóa khách hàng',
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            requiresConfirmation: true,
            confirmationTitle: 'Xóa khách hàng đã chọn',
            confirmationDescription: 'Các khách hàng đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
          },
          {
            id: 'activate',
            label: 'Kích hoạt',
            icon: <UserCheck className="h-4 w-4" />,
            variant: 'default'
          },
          {
            id: 'deactivate',
            label: 'Vô hiệu hóa',
            icon: <UserX className="h-4 w-4" />,
            variant: 'secondary'
          },
          {
            id: 'export',
            label: 'Xuất dữ liệu',
            icon: <Download className="h-4 w-4" />,
            variant: 'secondary'
          }
        ]}
        onAction={handleBulkAction}
      />

      {/* Customers Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-850">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium w-12">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCustomers(filteredCustomers.map(c => c.id));
                      } else {
                        setSelectedCustomers([]);
                      }
                    }}
                    className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">Customer</th>
                <th className="text-left p-4 text-slate-400 font-medium">Contact</th>
                <th className="text-left p-4 text-slate-400 font-medium">Orders</th>
                <th className="text-left p-4 text-slate-400 font-medium">Total Spent</th>
                <th className="text-left p-4 text-slate-400 font-medium">Tier</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Joined</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const isSelected = selectedCustomers.includes(customer.id);
                return (
                  <tr key={customer.id} className={`border-t border-slate-700 hover:bg-slate-750 ${
                    isSelected ? 'bg-blue-500/10' : ''
                  }`}>
                    <td className="p-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCustomers([...selectedCustomers, customer.id]);
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                          }
                        }}
                        className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </td>
                    <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-slate-300 font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.name}</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {customer.location || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-slate-300 text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                      {customer.phone && (
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{customer.totalOrders}</p>
                      {customer.lastOrderDate && (
                        <p className="text-slate-400 text-sm">
                          Last: {formatDate(customer.lastOrderDate)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge className={getTierBadge(customer.tier)}>
                      {customer.tier.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusBadge(customer.status)}>
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(customer.joinedDate)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">No customers found matching your criteria.</p>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;