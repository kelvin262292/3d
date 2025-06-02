'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Edit, Trash2, Eye, AlertCircle, Archive, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminHeader from '@/components/admin/AdminHeader';
import BulkActions, { commonBulkActions } from '@/components/admin/BulkActions';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  inStock: boolean;
  featured: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
  images: string;
  modelUrl?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.inStock) ||
                         (statusFilter === 'inactive' && !product.inStock) ||
                         (statusFilter === 'featured' && product.featured);
    const matchesCategory = categoryFilter === 'all' || product.category.id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (product: Product) => {
    if (product.featured) {
      return 'bg-purple-500 text-purple-50';
    }
    if (product.inStock) {
      return 'bg-green-500 text-green-50';
    }
    return 'bg-red-500 text-red-50';
  };

  const getStatusText = (product: Product) => {
    if (product.featured) return 'Featured';
    if (product.inStock) return 'In Stock';
    return 'Out of Stock';
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Sản phẩm đã được xóa thành công');
      } else {
        setError('Failed to delete product');
        toast.error('Không thể xóa sản phẩm');
      }
    } catch (error) {
      setError('Error deleting product');
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    try {
      switch (actionId) {
        case 'delete':
          // Xóa nhiều sản phẩm
          const deletePromises = selectedIds.map(id => 
            fetch(`/api/products/${id}`, { method: 'DELETE' })
          );
          await Promise.all(deletePromises);
          setProducts(products.filter(product => !selectedIds.includes(product.id)));
          setSelectedProducts([]);
          toast.success(`Đã xóa ${selectedIds.length} sản phẩm`);
          break;
          
        case 'archive':
          // Lưu trữ sản phẩm (cập nhật status)
          const archivePromises = selectedIds.map(id => 
            fetch(`/api/products/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'archived' })
            })
          );
          await Promise.all(archivePromises);
          setProducts(products.map(product => 
            selectedIds.includes(product.id) 
              ? { ...product, status: 'archived' as any }
              : product
          ));
          setSelectedProducts([]);
          toast.success(`Đã lưu trữ ${selectedIds.length} sản phẩm`);
          break;
          
        case 'export':
          // Xuất dữ liệu sản phẩm
          const selectedProducts = products.filter(p => selectedIds.includes(p.id));
          const csvContent = [
            'ID,Name,Category,Price,Downloads,Rating,Status,Created',
            ...selectedProducts.map(p => 
              `${p.id},"${p.name}","${p.category}",${p.price},${p.downloads},${p.rating},${p.status},${p.createdAt}`
            )
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success('Dữ liệu đã được xuất thành công');
          break;
          
        case 'feature':
          // Đặt sản phẩm nổi bật
          const featurePromises = selectedIds.map(id => 
            fetch(`/api/products/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ featured: true })
            })
          );
          await Promise.all(featurePromises);
          setSelectedProducts([]);
          toast.success(`Đã đặt ${selectedIds.length} sản phẩm nổi bật`);
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

  if (error) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-500 bg-red-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Admin Header */}
      <AdminHeader 
        title="Products Management"
        subtitle="Manage your 3D model products, inventory, and pricing"
      />
      
      {/* Add Product Button */}
      <div className="flex justify-end">
        <Button className="bg-sky-500 hover:bg-sky-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
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
              <SelectItem value="active">In Stock</SelectItem>
              <SelectItem value="inactive">Out of Stock</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-slate-400 text-sm flex items-center">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        items={filteredProducts}
        selectedItems={selectedProducts}
        onSelectionChange={setSelectedProducts}
        actions={[
          {
            id: 'delete',
            label: 'Xóa sản phẩm',
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            requiresConfirmation: true,
            confirmationTitle: 'Xóa sản phẩm đã chọn',
            confirmationDescription: 'Các sản phẩm đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
          },
          {
            id: 'archive',
            label: 'Lưu trữ',
            icon: <Archive className="h-4 w-4" />,
            variant: 'secondary'
          },
          {
            id: 'export',
            label: 'Xuất dữ liệu',
            icon: <Download className="h-4 w-4" />,
            variant: 'secondary'
          },
          {
            id: 'feature',
            label: 'Đặt nổi bật',
            icon: <Eye className="h-4 w-4" />,
            variant: 'default'
          }
        ]}
        onAction={handleBulkAction}
      />

      {/* Products Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-850">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium w-12">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">Product</th>
                <th className="text-left p-4 text-slate-400 font-medium">Category</th>
                <th className="text-left p-4 text-slate-400 font-medium">Price</th>
                <th className="text-left p-4 text-slate-400 font-medium">Downloads</th>
                <th className="text-left p-4 text-slate-400 font-medium">Rating</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Created</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const firstImage = product.images.split(',')[0] || '/images/placeholder.jpg';
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <tr key={product.id} className={`border-t border-slate-700 hover:bg-slate-750 ${
                      isSelected ? 'bg-blue-500/10' : ''
                    }`}>
                      <td className="p-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                            <img 
                              src={firstImage} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <span className="text-slate-400 text-xs hidden">IMG</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-slate-400 text-sm">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{product.category.name}</td>
                      <td className="p-4 text-white font-medium">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-slate-300">{product.downloads.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white">{product.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(product)}>
                          {getStatusText(product)}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-300">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${product.slug}`}>
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400 mb-4">No products found matching your criteria.</p>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;