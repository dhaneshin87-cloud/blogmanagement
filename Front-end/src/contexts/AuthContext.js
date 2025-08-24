'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, clearTokens } from '../utils/auth';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        // Verify token and get user data
        const userData = await fetchUserData(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          // Ensure user ID is stored in localStorage
          if (userData.id) {
            localStorage.setItem('userId', userData.id.toString());
          }
        } else {
          // Invalid token, clear it
          clearTokens();
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearTokens();
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  };

  const login = (userData) => {
    // Ensure user data includes the user ID
    if (userData && userData.id) {
      setUser(userData);
      setIsAuthenticated(true);
      // Store user ID in localStorage for persistence
      localStorage.setItem('userId', userData.id.toString());
    } else {
      console.error('Invalid user data received during login');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearTokens();
    // Clear user ID from localStorage
    localStorage.removeItem('userId');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isUser = () => {
    return user?.role === 'user';
  };

  const canManagePost = (postAuthorId) => {
    if (!user) return false;
    if (isAdmin()) return true;
    return user.id === postAuthorId;
  };

  const getCurrentUserId = () => {
    return user?.id || localStorage.getItem('userId');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    isAdmin,
    isUser,
    canManagePost,
    checkAuthStatus,
    getCurrentUserId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
