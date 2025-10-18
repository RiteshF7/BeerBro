'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Input } from '@/lib/common/ui/input';
import { Label } from '@/lib/common/ui/label';
import { Badge } from '@/lib/common/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/lib/common/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/lib/common/ui/dropdown-menu';
import { addressService, Address, CreateAddressData } from '../services/address.service';
import { authService, UserProfile } from '../auth/authService';
import { 
  Plus, 
  MapPin, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Star,
  Phone,
  Home,
  Building,
  Navigation
} from 'lucide-react';

interface AddressManagerProps {
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
  showSelection?: boolean;
  className?: string;
}

export function AddressManager({ 
  onAddressSelect, 
  selectedAddressId, 
  showSelection = false,
  className = '' 
}: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '+91 ',
    isDefault: false,
    label: ''
  });

  useEffect(() => {
    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        loadAddresses(state.profile.uid);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          firstName: state.profile?.displayName?.split(' ')[0] || '',
          lastName: state.profile?.displayName?.split(' ').slice(1).join(' ') || '',
          phone: state.profile?.phone || '+91 '
        }));
      }
    });

    return authUnsubscribe;
  }, []);

  const loadAddresses = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userAddresses = await addressService.getUserAddresses(userId);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      setError(null);
      
      if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(editingAddress.id, formData);
      } else {
        // Create new address
        await addressService.createAddress(userProfile.uid, formData);
      }

      // Reload addresses
      await loadAddresses(userProfile.uid);
      
      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
      label: address.label || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setError(null);
      await addressService.deleteAddress(addressId);
      await loadAddresses(userProfile!.uid);
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setError(null);
      await addressService.setDefaultAddress(addressId);
      await loadAddresses(userProfile!.uid);
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('Failed to set default address. Please try again.');
    }
  };

  const handleAddressSelect = (address: Address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      firstName: userProfile?.displayName?.split(' ')[0] || '',
      lastName: userProfile?.displayName?.split(' ').slice(1).join(' ') || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      phone: userProfile?.phone || '+91 ',
      isDefault: false,
      label: ''
    });
  };

  const getAddressIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
      case 'office':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Addresses</h3>
          <p className="text-sm text-gray-600">Manage your delivery addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your address information' : 'Add a new delivery address'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, building, apartment"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label (Optional)</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Home, Work, Office"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-6">
              Add your first address to get started with deliveries.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`relative ${showSelection ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${
                selectedAddressId === address.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={showSelection ? () => handleAddressSelect(address) : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getAddressIcon(address.label)}
                    <CardTitle className="text-base">
                      {address.label || 'Address'}
                    </CardTitle>
                    {address.isDefault && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  {!showSelection && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(address)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!address.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatAddress(address)}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {address.phone}
                  </div>
                </div>
                
                {showSelection && (
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddressSelect(address);
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Select Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
