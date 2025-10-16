'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AdminTable } from '@/components/admin/AdminTable';
import { ProductForm } from '@/features/products/ProductForm';
import { ProductWithId, ProductFormData } from '@/features/products/types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/features/products/api';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    {
      key: 'imageUrl' as keyof ProductWithId,
      label: 'Image',
      render: (value: unknown, product: ProductWithId) => (
        <div className="flex items-center">
          {value ? (
            <img
              src={value as string}
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name' as keyof ProductWithId,
      label: 'Name',
    },
    {
      key: 'category' as keyof ProductWithId,
      label: 'Category',
    },
    {
      key: 'price' as keyof ProductWithId,
      label: 'Price',
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: 'stock' as keyof ProductWithId,
      label: 'Stock',
    },
    {
      key: 'isActive' as keyof ProductWithId,
      label: 'Status',
      render: (value: unknown) => {
        const isActive = value as boolean;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
  ];

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (data: ProductFormData, imageFile?: File) => {
    try {
      setIsSubmitting(true);
      await createProduct(data, imageFile);
      toast.success('Product created successfully');
      await loadProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData, imageFile?: File) => {
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      await updateProduct(editingProduct.id, data, imageFile);
      toast.success('Product updated successfully');
      await loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: ProductWithId) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (product: ProductWithId) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <AdminTable
        data={products}
        columns={columns}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        isLoading={isLoading}
        emptyMessage="No products found. Create your first product to get started."
      />

      <ProductForm
        product={editingProduct || undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        isLoading={isSubmitting}
      />
    </div>
  );
}
