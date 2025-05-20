import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Permission, RolePermissions } from '@/types';

// Define role permissions
const rolePermissions: RolePermissions = {
  admin: [
    { action: 'create', subject: 'candidates' },
    { action: 'read', subject: 'candidates' },
    { action: 'update', subject: 'candidates' },
    { action: 'delete', subject: 'candidates' },
    { action: 'create', subject: 'jobs' },
    { action: 'read', subject: 'jobs' },
    { action: 'update', subject: 'jobs' },
    { action: 'delete', subject: 'jobs' },
    { action: 'create', subject: 'interviews' },
    { action: 'read', subject: 'interviews' },
    { action: 'update', subject: 'interviews' },
    { action: 'delete', subject: 'interviews' },
    { action: 'create', subject: 'users' },
    { action: 'read', subject: 'users' },
    { action: 'update', subject: 'users' },
    { action: 'delete', subject: 'users' },
    { action: 'read', subject: 'settings' },
    { action: 'update', subject: 'settings' },
  ],
  recruiter: [
    { action: 'create', subject: 'candidates' },
    { action: 'read', subject: 'candidates' },
    { action: 'update', subject: 'candidates' },
    { action: 'create', subject: 'jobs' },
    { action: 'read', subject: 'jobs' },
    { action: 'update', subject: 'jobs' },
    { action: 'create', subject: 'interviews' },
    { action: 'read', subject: 'interviews' },
    { action: 'update', subject: 'interviews' },
    { action: 'read', subject: 'users' },
  ],
  hiring_manager: [
    { action: 'read', subject: 'candidates' },
    { action: 'update', subject: 'candidates' },
    { action: 'read', subject: 'jobs' },
    { action: 'create', subject: 'interviews' },
    { action: 'read', subject: 'interviews' },
    { action: 'update', subject: 'interviews' },
    { action: 'read', subject: 'users' },
  ],
  viewer: [
    { action: 'read', subject: 'candidates' },
    { action: 'read', subject: 'jobs' },
    { action: 'read', subject: 'interviews' },
  ],
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'AU',
  },
  {
    id: '2',
    name: 'Recruiter User',
    email: 'recruiter@example.com',
    role: 'recruiter',
    avatar: 'RU',
    department: 'HR',
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'hiring_manager',
    avatar: 'MU',
    department: 'Engineering',
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: 'viewer',
    avatar: 'VU',
  },
];

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  hasPermission: (action: Permission['action'], subject: Permission['subject']) => boolean;
  users: User[];
  isAuthenticated: boolean;
  rolePermissions: RolePermissions;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      console.error('User not found');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (action: Permission['action'], subject: Permission['subject']): boolean => {
    if (!currentUser) return false;
    
    const permissions = rolePermissions[currentUser.role];
    return permissions.some(permission => 
      permission.action === action && permission.subject === subject
    );
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        hasPermission, 
        users: mockUsers,
        isAuthenticated,
        rolePermissions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
