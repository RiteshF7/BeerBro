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
  userEmail: z.string().email(),
  userName: z.string(),
  items: z.array(orderItemSchema),
  total: z.number().min(0),
  status: z.enum(ORDER_STATUSES),
  shippingAddress: addressSchema,
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Address = z.infer<typeof addressSchema>;

export interface OrderWithId extends OrderFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
