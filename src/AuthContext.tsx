import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from './types';

// Dummy User type to replace Firebase User
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_ADMINS = ['nonyeasuzu3@gmail.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('appUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      loadProfile(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = (currentUser: User) => {
    const profilesJson = localStorage.getItem('userProfiles');
    const profiles = profilesJson ? JSON.parse(profilesJson) : {};
    
    if (profiles[currentUser.uid]) {
      setProfile(profiles[currentUser.uid]);
    } else {
      const role: UserRole = INITIAL_ADMINS.includes(currentUser.email || '') ? 'admin' : 'student';
      const newProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Anonymous User',
        photoURL: currentUser.photoURL || undefined,
        role: role,
      };
      
      profiles[currentUser.uid] = newProfile;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
      setProfile(newProfile);
    }
    setLoading(false);
  };

  const login = async (email: string) => {
    if (!email) return;

    const dummyUser: User = {
      uid: email,
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
    };

    localStorage.setItem('appUser', JSON.stringify(dummyUser));
    setUser(dummyUser);
    loadProfile(dummyUser);
  };

  const logout = async () => {
    localStorage.removeItem('appUser');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
