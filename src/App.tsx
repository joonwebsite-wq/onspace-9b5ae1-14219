import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterAdminPage } from '@/pages/RegisterAdminPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { JobPortalPage } from '@/pages/JobPortalPage';
import { PostJobPage } from '@/pages/PostJobPage';
import { JobDetailsPage } from '@/pages/JobDetailsPage';

// Main application component with routing
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-admin" element={<RegisterAdminPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/jobs" element={<JobPortalPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;