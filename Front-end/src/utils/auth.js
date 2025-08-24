// Authentication utility functions
import { API_ENDPOINTS } from '../config/api';

// Get access token from localStorage
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Get refresh token from cookies
export const getRefreshToken = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('refreshToken=')
    );
    if (refreshTokenCookie) {
      return refreshTokenCookie.split('=')[1];
    }
  }
  return null;
};

// Set access token in localStorage
export const setAccessToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

// Set refresh token in cookie
export const setRefreshToken = (token) => {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days
    document.cookie = `refreshToken=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
  }
};

// Remove all tokens
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
  if (typeof document !== 'undefined') {
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// API call with authentication
export const authenticatedFetch = async (url, options = {}) => {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  // If token is expired, try to refresh
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request with new token
      const newAccessToken = getAccessToken();
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newAccessToken}`,
          ...options.headers,
        },
      });
      return retryResponse;
    } else {
      // Refresh failed, redirect to login
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Authentication failed');
    }
  }

  return response;
};

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    const response = await fetch(API_ENDPOINTS.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      
      // Optionally update refresh token if a new one is provided
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Login failed' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Registration failed' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Logout function
export const logout = () => {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};
