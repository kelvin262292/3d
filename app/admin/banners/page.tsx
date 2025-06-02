'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
  });

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const result = await response.json();
      if (result.success) {
        setBanners(result.data);
      } else {
        toast.error('Không thể tải danh sách banners');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Lỗi khi tải banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.url }));
        toast.success('Upload ảnh thành công');
      } else {
        toast.error('Upload ảnh thất bại');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Lỗi khi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      toast.error('Vui lòng nhập tiêu đề và chọn ảnh');
      return;
    }

    try {
      const url = editingBanner ? '/api/banners' : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      const payload = editingBanner 
        ? { id: editingBanner.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingBanner ? 'Cập nhật banner thành công' : 'Tạo banner thành công');
        fetchBanners();
        resetForm();
      } else {
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Lỗi khi lưu banner');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;

    try {
      const response = await fetch(`/api/banners?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Xóa banner thành công');
        fetchBanners();
      } else {
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Lỗi khi xóa banner');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      isActive: true,
      order: 0,
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  // Start editing
  const startEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      isActive: banner.isActive,
      order: banner.order,
    });
    setEditingBanner(banner);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banners</h1>
          <p className="text-gray-600">Quản lý hero slides và banners trên trang chủ</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm Banner
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề banner"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Phụ đề</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Nhập phụ đề (tùy chọn)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="link">Liên kết</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com (tùy chọn)"
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="image">Ảnh Banner *</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={uploading}
                  />
                  {formData.image && (
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Kích hoạt</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Đang upload...' : (editingBanner ? 'Cập nhật' : 'Tạo Banner')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{banner.title}</h3>
                  <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                    {banner.isActive ? (
                      <><Eye className="h-3 w-3 mr-1" />Hiển thị</>
                    ) : (
                      <><EyeOff className="h-3 w-3 mr-1" />Ẩn</>
                    )}
                  </Badge>
                </div>
                
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 truncate">{banner.subtitle}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Thứ tự: {banner.order}</span>
                  <span>{new Date(banner.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(banner)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Chưa có banner nào. Hãy tạo banner đầu tiên!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}