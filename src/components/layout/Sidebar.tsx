
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  FileText, 
  FolderPlus, 
  User, 
  Users, 
  Settings, 
  Shield, 
  BarChart3, 
  Workflow 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { hasPermission, currentUser } = useAuth();
  
  // Define navigation items
  const navigation = [
    { name: 'Dashboard', href: '/', icon: <FileText className="h-5 w-5" /> },
    { name: 'Candidates', href: '/candidates', icon: <Users className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'candidates' as const } },
    { name: 'Jobs', href: '/jobs', icon: <FolderPlus className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'jobs' as const } },
    { name: 'Workflow', href: '/workflow', icon: <Workflow className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'jobs' as const } },
    { name: 'Reports', href: '/reports', icon: <BarChart3 className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'jobs' as const } },
  ];
  
  // Define user management navigation items
  const userManagementNav = [
    { name: 'User Management', href: '/users', icon: <User className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'users' as const } },
    { name: 'Role Management', href: '/roles', icon: <Shield className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'users' as const } },
  ];
  
  // Define settings navigation item - only for admins
  const settingsNav = [
    { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, permission: { action: 'read' as const, subject: 'settings' as const } },
  ];
  
  // Show settings only for admin users or users with settings permission
  const showSettings = currentUser?.role === 'admin' || hasPermission('read', 'settings');
  
  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <User className="h-6 w-6 text-ats-600" />
          <span className="text-lg font-semibold text-ats-800">TalentTrack</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const showItem = !item.permission || hasPermission(item.permission.action, item.permission.subject);
            
            if (!showItem) return null;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-ats-50 text-ats-700"
                      : "text-gray-700 hover:bg-ats-50 hover:text-ats-700"
                  )}
                >
                  <div className={cn("mr-3", isActive ? "text-ats-600" : "text-gray-400 group-hover:text-ats-600")}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Management Section */}
        {userManagementNav.some(item => 
          !item.permission || hasPermission(item.permission.action, item.permission.subject)
        ) && (
          <>
            <div className="my-3 px-3">
              <div className="border-t" />
              <h3 className="mt-3 text-xs font-semibold text-gray-500">USER MANAGEMENT</h3>
            </div>
            <ul className="space-y-1">
              {userManagementNav.map((item) => {
                const isActive = location.pathname === item.href;
                const showItem = !item.permission || hasPermission(item.permission.action, item.permission.subject);
                
                if (!showItem) return null;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-ats-50 text-ats-700"
                          : "text-gray-700 hover:bg-ats-50 hover:text-ats-700"
                      )}
                    >
                      <div className={cn("mr-3", isActive ? "text-ats-600" : "text-gray-400 group-hover:text-ats-600")}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        
        {/* Settings Section - only for admins */}
        {showSettings && (
          <>
            <div className="my-3 px-3">
              <div className="border-t" />
              <h3 className="mt-3 text-xs font-semibold text-gray-500">ADMINISTRATION</h3>
            </div>
            <ul className="space-y-1">
              {settingsNav.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-ats-50 text-ats-700"
                          : "text-gray-700 hover:bg-ats-50 hover:text-ats-700"
                      )}
                    >
                      <div className={cn("mr-3", isActive ? "text-ats-600" : "text-gray-400 group-hover:text-ats-600")}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ats-100 text-ats-700">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@talenttrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
