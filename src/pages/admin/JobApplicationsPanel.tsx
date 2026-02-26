import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Download, Trash2, User, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  job_id: string;
  full_name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  city: string;
  resume_url: string | null;
  message: string;
  created_at: string;
  jobs: {
    title: string;
    organization_name: string;
  };
}

export function JobApplicationsPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs (
          title,
          organization_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    } else {
      toast.success('Application deleted successfully');
      fetchApplications();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-navy mb-2">Job Applications</h2>
        <p className="text-gray-600">View and manage all job applications</p>
        <p className="text-sm text-gray-500 mt-1">{applications.length} applications received</p>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <User size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No applications received yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {applications.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-navy">{app.full_name}</h4>
                      <p className="text-saffron font-semibold">
                        Applied for: {app.jobs?.title || 'Unknown Job'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Organization: {app.jobs?.organization_name || 'N/A'}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 mb-3">
                      <div>
                        <p><strong>Mobile:</strong> {app.mobile}</p>
                        <p><strong>WhatsApp:</strong> {app.whatsapp}</p>
                      </div>
                      <div>
                        <p><strong>Email:</strong> {app.email}</p>
                        <p><strong>City:</strong> {app.city}</p>
                      </div>
                    </div>

                    {app.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-700"><strong>Message:</strong> {app.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Applied on: {new Date(app.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {app.resume_url ? (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                      >
                        <Download size={16} />
                        Resume
                      </a>
                    ) : (
                      <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-3 py-2 rounded text-sm font-semibold">
                        No Resume
                      </span>
                    )}

                    <a
                      href={`https://wa.me/91${app.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                    >
                      <ExternalLink size={16} />
                      WhatsApp
                    </a>

                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
