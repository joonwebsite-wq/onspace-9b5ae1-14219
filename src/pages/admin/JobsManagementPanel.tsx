import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Trash2, Briefcase, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string;
  description: string;
  organization_name: string;
  contact_person: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  status: string;
  created_at: string;
}

export function JobsManagementPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const updateJobStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    } else {
      toast.success(`Job ${status} successfully`);
      fetchJobs();
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    } else {
      toast.success('Job deleted successfully');
      fetchJobs();
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus === 'all') return true;
    return job.status === filterStatus;
  });

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

  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    approved: jobs.filter(j => j.status === 'approved').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-navy mb-2">Jobs Management</h2>
        <p className="text-gray-600">Approve, reject, or delete job postings</p>
      </div>

      {/* Stats & Filters */}
      <div className="grid md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filterStatus === 'all'
              ? 'border-saffron bg-saffron/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-navy">{statusCounts.all}</p>
          <p className="text-sm text-gray-600">Total Jobs</p>
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filterStatus === 'pending'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-orange-600">{statusCounts.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filterStatus === 'approved'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`p-4 rounded-lg border-2 transition-all ${
            filterStatus === 'rejected'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </button>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-navy">
            {filterStatus === 'all' ? 'All Jobs' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Jobs`} ({filteredJobs.length})
          </h3>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-saffron/10 p-2 rounded-lg">
                        <Briefcase className="text-saffron" size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-navy">{job.title}</h4>
                        <p className="text-gray-700 font-semibold">{job.organization_name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{job.category}</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{job.job_type}</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">📍 {job.location}</span>
                          {job.salary && (
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">💰 {job.salary}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>

                    <div className="text-sm text-gray-500">
                      <p><strong>Contact:</strong> {job.contact_person} | 📱 {job.mobile} | 💬 {job.whatsapp}</p>
                      {job.email && <p><strong>Email:</strong> {job.email}</p>}
                      <p><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-center ${
                        job.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>

                    {job.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateJobStatus(job.id, 'approved')}
                          className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, 'rejected')}
                          className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}

                    {job.status === 'rejected' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'approved')}
                        className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => deleteJob(job.id)}
                      className="flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-semibold transition-colors"
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
