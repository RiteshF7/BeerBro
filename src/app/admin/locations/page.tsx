'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AdminTable } from '@/components/admin/AdminTable';
import { LocationForm } from '@/features/locations/LocationForm';
import { LocationWithId, LocationFormData } from '@/features/locations/types';
import { getLocations, createLocation, updateLocation, deleteLocation } from '@/features/locations/api';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationWithId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    {
      key: 'name' as keyof LocationWithId,
      label: 'Name',
    },
    {
      key: 'address' as keyof LocationWithId,
      label: 'Address',
    },
    {
      key: 'coordinates' as keyof LocationWithId,
      label: 'Coordinates',
      render: (value: unknown) => {
        const coords = value as { lat: number; lng: number };
        return (
          <span className="text-sm text-gray-600">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
        );
      },
    },
    {
      key: 'radiusKm' as keyof LocationWithId,
      label: 'Radius',
      render: (value: unknown) => `${value as number} km`,
    },
    {
      key: 'isActive' as keyof LocationWithId,
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

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleCreateLocation = async (data: LocationFormData) => {
    try {
      setIsSubmitting(true);
      await createLocation(data);
      toast.success('Location created successfully');
      await loadLocations();
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error('Failed to create location');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLocation = async (data: LocationFormData) => {
    if (!editingLocation) return;

    try {
      setIsSubmitting(true);
      await updateLocation(editingLocation.id, data);
      toast.success('Location updated successfully');
      await loadLocations();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLocation = (location: LocationWithId) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleDeleteLocation = async (location: LocationWithId) => {
    if (!confirm(`Are you sure you want to delete "${location.name}"?`)) {
      return;
    }

    try {
      await deleteLocation(location.id);
      toast.success('Location deleted successfully');
      await loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Locations</h1>
          <p className="text-gray-600">Manage delivery locations and service radius</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.filter(l => l.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Average Radius</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.length > 0 
                  ? (locations.reduce((sum, l) => sum + l.radiusKm, 0) / locations.length).toFixed(1)
                  : '0'
                } km
              </p>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={locations}
        columns={columns}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
        isLoading={isLoading}
        emptyMessage="No locations found. Add your first service location to get started."
      />

      <LocationForm
        location={editingLocation || undefined}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingLocation ? handleUpdateLocation : handleCreateLocation}
        isLoading={isSubmitting}
      />
    </div>
  );
}
