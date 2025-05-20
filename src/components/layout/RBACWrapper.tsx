
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/types';

interface RBACWrapperProps {
  children: ReactNode;
  requiredPermission?: {
    action: Permission['action'];
    subject: Permission['subject'];
  };
  fallback?: ReactNode;
}

export function RBACWrapper({
  children,
  requiredPermission,
  fallback = null,
}: RBACWrapperProps) {
  const { hasPermission } = useAuth();
  
  if (requiredPermission && !hasPermission(requiredPermission.action, requiredPermission.subject)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
