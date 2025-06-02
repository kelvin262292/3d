'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Trash2, 
  Edit, 
  Archive, 
  Eye, 
  MoreHorizontal, 
  CheckSquare, 
  Square,
  Download,
  Send
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
}

interface BulkActionsProps {
  items: any[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  actions: BulkAction[];
  onAction: (actionId: string, selectedIds: string[]) => Promise<void>;
  itemIdField?: string;
  className?: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  actions,
  onAction,
  itemIdField = 'id',
  className
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const itemIds = items.map(item => item[itemIdField]);
  const selectedCount = selectedItems.length;
  const totalCount = items.length;

  useEffect(() => {
    const allSelected = selectedCount === totalCount && totalCount > 0;
    const someSelected = selectedCount > 0 && selectedCount < totalCount;
    
    setIsAllSelected(allSelected);
    setIsIndeterminate(someSelected);
  }, [selectedCount, totalCount]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(itemIds);
    }
  };

  const handleActionClick = (action: BulkAction) => {
    if (selectedCount === 0) {
      toast.error('Vui lòng chọn ít nhất một mục');
      return;
    }

    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    setIsProcessing(true);
    try {
      await onAction(action.id, selectedItems);
      toast.success(`Đã thực hiện "${action.label}" cho ${selectedCount} mục`);
      onSelectionChange([]); // Clear selection after action
    } catch (error) {
      toast.error(`Lỗi khi thực hiện "${action.label}": ${error}`);
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg ${className}`}>
        <div className="flex items-center space-x-4">
          {/* Select All Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onCheckedChange={handleSelectAll}
              className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="text-sm text-slate-300">
              {isAllSelected ? (
                <span className="flex items-center space-x-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>Tất cả đã chọn</span>
                </span>
              ) : isIndeterminate ? (
                <span className="flex items-center space-x-1">
                  <Square className="h-4 w-4" />
                  <span>Một số đã chọn</span>
                </span>
              ) : (
                'Chọn tất cả'
              )}
            </span>
          </div>

          {/* Selection Count */}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {selectedCount} đã chọn
            </Badge>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            {actions.slice(0, 3).map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'secondary'}
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={isProcessing}
                className="flex items-center space-x-1"
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}

            {/* More Actions Dropdown */}
            {actions.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" disabled={isProcessing}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                  <DropdownMenuLabel className="text-slate-300">
                    Thao tác khác
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  {actions.slice(3).map((action) => (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        {action.icon}
                        <span>{action.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {pendingAction?.confirmationTitle || `Xác nhận ${pendingAction?.label}`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              {pendingAction?.confirmationDescription || 
                `Bạn có chắc chắn muốn thực hiện "${pendingAction?.label}" cho ${selectedCount} mục đã chọn? Hành động này không thể hoàn tác.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              disabled={isProcessing}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`${
                pendingAction?.variant === 'destructive' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Predefined common bulk actions
export const commonBulkActions: BulkAction[] = [
  {
    id: 'delete',
    label: 'Xóa',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationTitle: 'Xóa các mục đã chọn',
    confirmationDescription: 'Các mục đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
  },
  {
    id: 'archive',
    label: 'Lưu trữ',
    icon: <Archive className="h-4 w-4" />,
    variant: 'secondary',
    requiresConfirmation: true
  },
  {
    id: 'export',
    label: 'Xuất',
    icon: <Download className="h-4 w-4" />,
    variant: 'secondary'
  },
  {
    id: 'edit',
    label: 'Chỉnh sửa',
    icon: <Edit className="h-4 w-4" />,
    variant: 'secondary'
  },
  {
    id: 'view',
    label: 'Xem',
    icon: <Eye className="h-4 w-4" />,
    variant: 'secondary'
  },
  {
    id: 'send',
    label: 'Gửi',
    icon: <Send className="h-4 w-4" />,
    variant: 'default'
  }
];

export default BulkActions;