'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../lib/types';
import { api, setToken } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<boolean>;
  googleLogin: (name?: string, email?: string, photoURL?: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore authenticated session on page refresh
  useEffect(() => {
    async function restoreSession() {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('kindredpulse_token') : null;
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        // If token expired or network unreachable, check if we have cached profile
        console.warn('Session verification error:', err);
        const cachedUser = localStorage.getItem('kindredpulse_user_cache');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch {
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kindredpulse_user_cache', JSON.stringify(res.user));
        toast.success(res.message || 'Welcome back to KindredPulse!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please verify your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, photoURL: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.register(name, email, photoURL, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kindredpulse_user_cache', JSON.stringify(res.user));
        toast.success(res.message || 'Registration successful! Welcome aboard.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    }
  };

  const googleLogin = async (
    name = 'Community Volunteer',
    email = 'volunteer.google@kindredpulse.org',
    photoURL = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
  ): Promise<boolean> => {
    try {
      const res = await api.auth.googleLogin(name, email, photoURL);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kindredpulse_user_cache', JSON.stringify(res.user));
        toast.success('Logged in successfully via Google!');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed.');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kindredpulse_user_cache');
    toast.success('You have been logged out successfully.');
  };

  const updateCurrentUser = (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('kindredpulse_user_cache', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
