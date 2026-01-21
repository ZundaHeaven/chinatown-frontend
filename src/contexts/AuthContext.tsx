'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  getCurrentUser,
  setTokens as saveTokens,
  setUser as saveUser,
  clearTokens,
  getUser as getSavedUser,
  getAccessToken
} from '@/lib/auth';
import { AuthContextType, LoginRequest, RegisterRequest } from '@/types/auth';
import { User } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        saveUser(currentUser);
      } else {
        const savedUser = getSavedUser();
        if (savedUser) {
          setUser(savedUser);
        }
      }
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error);
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(data);
      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      saveUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await apiRegister(data);
      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      saveUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiRefreshToken();
      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      saveUser(response.user);
      setUser(response.user);
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};