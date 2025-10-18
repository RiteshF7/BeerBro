'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/lib/common/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/common/ui/card';
import { Badge } from '@/lib/common/ui/badge';
import { AddressManager } from './AddressManager';
import { addressService, Address } from '../services/address.service';
import { authService, UserProfile } from '../auth/authService';
import { 
  MapPin, 
  Plus, 
  Check, 
  Home,
  Building
} from 'lucide-react';

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
  className?: string;
}

export function AddressSelector({ 
  onAddressSelect, 
  selectedAddressId,
  className = '' 
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddressManager, setShowAddressManager] = useState(false);

  useEffect(() => {
    const authUnsubscribe = authService.subscribe((state) => {
      if (state.profile) {
        setUserProfile(state.profile);
        loadAddresses(state.profile.uid);
      }
    });

    return authUnsubscribe;
  }, []);

  const loadAddresses = async (userId: string) => {
    try {
      setLoading(true);
      const userAddresses = await addressService.getUserAddresses(userId);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
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
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}`;
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
      {showAddressManager ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Manage Addresses</h3>
            <Button 
              variant="outline" 
              onClick={() => setShowAddressManager(false)}
            >
              Back to Selection
            </Button>
          </div>
          <AddressManager 
            onAddressSelect={(address) => {
              handleAddressSelect(address);
              setShowAddressManager(false);
            }}
            selectedAddressId={selectedAddressId}
            showSelection={true}
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Select Delivery Address</h3>
              <p className="text-sm text-gray-600">Choose where you want your order delivered</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAddressManager(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Addresses
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-6">
                  Add an address to continue with your order.
                </p>
                <Button onClick={() => setShowAddressManager(true)}>
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
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedAddressId === address.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleAddressSelect(address)}
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
                            Default
                          </Badge>
                        )}
                      </div>
                      {selectedAddressId === address.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
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
                      <p className="text-sm text-gray-600">
                        {address.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {address.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
