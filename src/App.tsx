import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterAdminPage } from '@/pages/RegisterAdminPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { JobPortalPage } from '@/pages/JobPortalPage';
import { PostJobPage } from '@/pages/PostJobPage';
import { JobDetailsPage } from '@/pages/JobDetailsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;