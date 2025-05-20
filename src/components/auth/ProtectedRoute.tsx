
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: {
    action: Permission['action'];
    subject: Permission['subject'];
  }[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission.action, permission.subject)
    );
    
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <>{children}</>;
};
