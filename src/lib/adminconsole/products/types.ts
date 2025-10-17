import { z } from 'zod';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.enum(PRODUCT_CATEGORIES),
  stock: z.number().min(0, 'Stock must be non-negative'),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductWithId extends ProductFormData {
  id: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
