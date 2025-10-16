'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locationSchema, LocationFormData, LocationWithId } from './types';
import { Navigation } from 'lucide-react';

interface LocationFormProps {
  location?: LocationWithId;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LocationForm({ 
  location, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
      coordinates: {
        lat: location?.coordinates.lat || 0,
        lng: location?.coordinates.lng || 0,
      },
      radiusKm: location?.radiusKm || 5,
      isActive: location?.isActive || true,
    },
  });

  const isActive = watch('isActive');

  const handleFormSubmit = async (data: LocationFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('coordinates.lat', position.coords.latitude);
          setValue('coordinates.lng', position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {location ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogDescription>
            {location 
              ? 'Update the location information below.' 
              : 'Add a new service location with delivery radius.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Downtown Store"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Coordinates</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  {...register('coordinates.lat', { valueAsNumber: true })}
                />
                {errors.coordinates?.lat && (
                  <p className="text-sm text-red-600">{errors.coordinates.lat.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  {...register('coordinates.lng', { valueAsNumber: true })}
                />
                {errors.coordinates?.lng && (
                  <p className="text-sm text-red-600">{errors.coordinates.lng.message}</p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radiusKm">Service Radius (km)</Label>
            <Input
              id="radiusKm"
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              {...register('radiusKm', { valueAsNumber: true })}
              placeholder="5.0"
            />
            {errors.radiusKm && (
              <p className="text-sm text-red-600">{errors.radiusKm.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Maximum distance for delivery from this location
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <Select
              value={isActive ? 'active' : 'inactive'}
              onValueChange={(value) => setValue('isActive', value === 'active')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : location ? 'Update Location' : 'Add Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
