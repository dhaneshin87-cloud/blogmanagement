'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  requireUser = false,
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, isLoading, isAdmin, isUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If admin role is required but user is not admin
      if (requireAdmin && !isAdmin()) {
        router.push('/');
        return;
      }

      // If user role is required but user is not a regular user
      if (requireUser && !isUser()) {
        router.push('/');
        return;
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, requireAdmin, requireUser, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If admin role is required but user is not admin, don't render children
  if (requireAdmin && !isAdmin()) {
    return null;
  }

  // If user role is required but user is not a regular user, don't render children
  if (requireUser && !isUser()) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
