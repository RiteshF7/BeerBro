import { z } from 'zod';

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Name must be less than 100 characters'),
  address: z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
  coordinates: coordinatesSchema,
  radiusKm: z.number().min(0.1, 'Radius must be at least 0.1 km').max(100, 'Radius must be less than 100 km'),
  isActive: z.boolean(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;

export interface LocationWithId extends LocationFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
