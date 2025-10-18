'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/common/ui/table';
import { Button } from '@/lib/common/ui/button';
import { MoreHorizontal, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/common/ui/dropdown-menu';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from '@/lib/constants';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onQuickStatusChange?: (item: T, status: string) => void;
  onQuickPaymentStatusChange?: (item: T, paymentStatus: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onQuickStatusChange,
  onQuickPaymentStatusChange,
  isLoading = false,
  emptyMessage = 'No data available',
}: AdminTableProps<T>) {
  console.log('📋 AdminTable: Component rendered with props:', {
    dataLength: data.length,
    isLoading,
    emptyMessage,
    hasOnEdit: !!onEdit,
    hasOnDelete: !!onDelete,
    hasOnView: !!onView,
    columnsCount: columns.length
  });
  
  if (data.length > 0) {
    console.log('📋 AdminTable: Sample data item:', data[0]);
  }
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.label}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.label}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || '')}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(item)}>
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    
                    {/* Quick Order Status Changes */}
                    {onQuickStatusChange && 'status' in item && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Order Status</DropdownMenuLabel>
                        {ORDER_STATUSES.filter(status => status !== (item as { status?: string }).status).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onQuickStatusChange(item, status)}
                            className="text-sm"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Order: {ORDER_STATUS_LABELS[status]}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                    
                    {/* Quick Payment Status Changes */}
                    {onQuickPaymentStatusChange && 'paymentStatus' in item && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                        {PAYMENT_STATUSES.filter(status => status !== (item as { paymentStatus?: string }).paymentStatus).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onQuickPaymentStatusChange(item, status)}
                            className="text-sm"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Payment: {PAYMENT_STATUS_LABELS[status]}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                    
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
