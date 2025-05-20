
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

// Pages
import IndexPage from './pages/Index';
import CandidatesPage from './pages/Candidates';
import JobsPage from './pages/Jobs';
import UserManagementPage from './pages/UserManagement';
import RoleManagementPage from './pages/RoleManagement';
import WorkflowPage from './pages/Workflow';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import UnauthorizedPage from './pages/Unauthorized';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        } />
        
        <Route path="/candidates" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'candidates' }]}>
            <CandidatesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/jobs" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'jobs' }]}>
            <JobsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/workflow" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'jobs' }]}>
            <WorkflowPage />
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'jobs' }]}>
            <ReportsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'users' }]}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/roles" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'users' }]}>
            <RoleManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute requiredPermissions={[{ action: 'read', subject: 'settings' }]}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
