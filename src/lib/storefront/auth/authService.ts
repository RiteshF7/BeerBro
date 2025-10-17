import { 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  dateOfBirth?: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
}

export interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = [];
  private currentState: AuthState = {
    user: null,
    profile: null,
    loading: true,
    error: null
  };

  constructor() {
    if (auth) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await this.getUserProfile(user.uid);
          this.updateState({ user, profile, loading: false, error: null });
        } else {
          this.updateState({ user: null, profile: null, loading: false, error: null });
        }
      });
    }
  }

  private updateState(newState: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...newState };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  public subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getCurrentState(): AuthState {
    return this.currentState;
  }

  public async signInWithGoogle(): Promise<{ user: FirebaseUser; isNewUser: boolean }> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this is a new user
      const profile = await this.getUserProfile(user.uid);
      const isNewUser = !profile;

      if (isNewUser) {
        // Create initial profile for new user
        await this.createUserProfile(user);
      }

      return { user, isNewUser };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      this.updateState({ error: errorMessage });
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      await signOut(auth);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      this.updateState({ error: errorMessage });
      throw error;
    }
  }

  public async createUserProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const profile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      phone: '',
      dateOfBirth: '',
      photoURL: firebaseUser.photoURL || undefined,
      role: 'customer',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      isProfileComplete: false
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return profile;
  }

  public async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  public async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        isProfileComplete: this.checkProfileComplete({ ...updates } as UserProfile)
      });

      // Update Firebase Auth profile if displayName or photoURL changed
      if (auth?.currentUser && (updates.displayName || updates.photoURL)) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      this.updateState({ error: errorMessage });
      throw error;
    }
  }

  private checkProfileComplete(profile: Partial<UserProfile>): boolean {
    return !!(
      profile.displayName &&
      profile.phone &&
      profile.email
    );
  }

  public isProfileComplete(profile: UserProfile | null): boolean {
    if (!profile) return false;
    return !!(profile.displayName && profile.phone && profile.email);
  }

  public async requireAuth(): Promise<{ user: FirebaseUser; profile: UserProfile }> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.subscribe((state) => {
        if (!state.loading) {
          unsubscribe();
          if (state.user && state.profile) {
            resolve({ user: state.user, profile: state.profile });
          } else {
            reject(new Error('User not authenticated'));
          }
        }
      });
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
