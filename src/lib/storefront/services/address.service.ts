import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  label?: string; // e.g., "Home", "Work", "Office"
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  label?: string;
}

class AddressService {
  private readonly ADDRESSES_COLLECTION = 'addresses';

  // Create a new address
  async createAddress(userId: string, addressData: CreateAddressData): Promise<string | null> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // If this is set as default, unset all other default addresses
      if (addressData.isDefault) {
        await this.unsetDefaultAddresses(userId);
      }

      const addressDoc = {
        ...addressData,
        userId,
        isDefault: addressData.isDefault || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.ADDRESSES_COLLECTION), addressDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  // Get all addresses for a user
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return [];
      }

      const q = query(
        collection(db, this.ADDRESSES_COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Address[];
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
  }

  // Get default address for a user
  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      if (!db) {
        console.error('Firestore not initialized');
        return null;
      }

      const q = query(
        collection(db, this.ADDRESSES_COLLECTION),
        where('userId', '==', userId),
        where('isDefault', '==', true)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Address;
    } catch (error) {
      console.error('Error fetching default address:', error);
      return null;
    }
  }

  // Update an address
  async updateAddress(addressId: string, updates: Partial<CreateAddressData>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // If setting as default, unset all other default addresses
      if (updates.isDefault) {
        const addressRef = doc(db, this.ADDRESSES_COLLECTION, addressId);
        const addressDoc = await getDocs(query(collection(db, this.ADDRESSES_COLLECTION), where('__name__', '==', addressId)));
        
        if (!addressDoc.empty) {
          const userId = addressDoc.docs[0].data().userId;
          await this.unsetDefaultAddresses(userId);
        }
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      const addressRef = doc(db, this.ADDRESSES_COLLECTION, addressId);
      await updateDoc(addressRef, updateData);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete an address
  async deleteAddress(addressId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const addressRef = doc(db, this.ADDRESSES_COLLECTION, addressId);
      await deleteDoc(addressRef);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Set an address as default
  async setDefaultAddress(addressId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      // Get the address to find the userId
      const addressRef = doc(db, this.ADDRESSES_COLLECTION, addressId);
      const addressDoc = await getDocs(query(collection(db, this.ADDRESSES_COLLECTION), where('__name__', '==', addressId)));
      
      if (!addressDoc.empty) {
        const userId = addressDoc.docs[0].data().userId;
        
        // Unset all other default addresses
        await this.unsetDefaultAddresses(userId);
        
        // Set this address as default
        await updateDoc(addressRef, {
          isDefault: true,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Helper method to unset all default addresses for a user
  private async unsetDefaultAddresses(userId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const q = query(
        collection(db, this.ADDRESSES_COLLECTION),
        where('userId', '==', userId),
        where('isDefault', '==', true)
      );

      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          isDefault: false,
          updatedAt: serverTimestamp(),
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error unsetting default addresses:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const addressService = new AddressService();
