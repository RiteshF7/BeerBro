import { z } from 'zod';
import { ORDER_STATUSES } from '@/lib/constants';

export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const orderSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email().optional(),
  userName: z.string().optional(),
  items: z.array(orderItemSchema),
  total: z.number().min(0),
  status: z.enum(ORDER_STATUSES).default('pending'),
  paymentStatus: z.enum(['pending', 'processing', 'completed', 'failed', 'expired']).default('pending'),
  shippingAddress: addressSchema,
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Address = z.infer<typeof addressSchema>;

export interface OrderWithId extends Omit<OrderFormData, 'shippingAddress' | 'items' | 'paymentStatus'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: Address;
  paymentStatus?: string;
  userName?: string;
  userEmail?: string;
  // Allow for flexible item structure from Firestore
  items?: Array<{
    productId?: string;
    productName?: string;
    name?: string;
    title?: string;
    quantity?: number;
    qty?: number;
    price?: number;
    unitPrice?: number;
    [key: string]: unknown; // Allow additional properties
  }>;
}
