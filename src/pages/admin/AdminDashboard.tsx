import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Loader2, LogOut, LayoutDashboard, Users, FileText, Image, BarChart3, MessageSquare, UserCog } from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { ApplicantsPanel } from './ApplicantsPanel';
import { LegalDocsPanel } from './LegalDocsPanel';
import { GalleryPanel } from './GalleryPanel';
import { TestimonialsPanel } from './TestimonialsPanel';
import { StateManagersPanel } from './StateManagersPanel';

type Tab = 'overview' | 'applicants' | 'legal' | 'gallery' | 'testimonials' | 'managers';

export function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white py-6 px-4 md:px-8">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={32} />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm">PM Surya Ghar Recruitment Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="container-custom px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-2 rounded-lg shadow">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'applicants'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={20} />
            Applicants
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'legal'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={20} />
            Legal Documents
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image size={20} />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={20} />
            Testimonials
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'managers'
                ? 'bg-saffron text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UserCog size={20} />
            State Managers
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'applicants' && <ApplicantsPanel />}
        {activeTab === 'legal' && <LegalDocsPanel />}
        {activeTab === 'gallery' && <GalleryPanel />}
        {activeTab === 'testimonials' && <TestimonialsPanel />}
        {activeTab === 'managers' && <StateManagersPanel />}
      </div>
    </div>
  );
}