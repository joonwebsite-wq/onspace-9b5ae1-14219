import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Applicant } from '@/types';
import { toast } from 'sonner';
import { Loader2, LogOut, Users, Filter, Download, ExternalLink } from 'lucide-react';

export function ApplicantsPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchApplicants();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...applicants];

    if (stateFilter !== 'All') {
      filtered = filtered.filter((a) => a.state === stateFilter);
    }
    if (positionFilter !== 'All') {
      filtered = filtered.filter((a) => a.position === positionFilter);
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredApplicants(filtered);
  }, [stateFilter, positionFilter, statusFilter, applicants]);

  const fetchApplicants = async () => {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    } else {
      setApplicants(data || []);
      setFilteredApplicants(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'Pending' | 'Approved' | 'Rejected') => {
    const { error } = await supabase
      .from('applicants')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated successfully');
      fetchApplicants();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const states = ['All', ...new Set(applicants.map((a) => a.state))];
  const positions = ['All', ...new Set(applicants.map((a) => a.position))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white py-6 px-4 md:px-8">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={32} />
            <div>
              <h1 className="text-2xl font-bold">Applicants Management</h1>
              <p className="text-gray-300 text-sm">Manage recruitment applications</p>
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
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-navy">{applicants.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {applicants.filter((a) => a.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-indiaGreen">
              {applicants.filter((a) => a.status === 'Approved').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">
              {applicants.filter((a) => a.status === 'Rejected').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-saffron" />
            <h2 className="text-lg font-bold text-navy">Filters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Documents</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {applicant.photo_url && (
                          <img
                            src={applicant.photo_url}
                            alt={applicant.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-navy">{applicant.full_name}</p>
                          <p className="text-xs text-gray-500">{applicant.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{applicant.state}</td>
                    <td className="px-4 py-3 text-sm">{applicant.position}</td>
                    <td className="px-4 py-3 text-sm">{applicant.experience} years</td>
                    <td className="px-4 py-3 text-sm">
                      <p>{applicant.mobile}</p>
                      <p className="text-xs text-gray-500">{applicant.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {applicant.resume_url && (
                          <a
                            href={applicant.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saffron hover:text-saffron-dark"
                            title="Resume"
                          >
                            <Download size={16} />
                          </a>
                        )}
                        {applicant.aadhaar_url && (
                          <a
                            href={applicant.aadhaar_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indiaGreen hover:text-indiaGreen-dark"
                            title="Aadhaar"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          applicant.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : applicant.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={applicant.status}
                        onChange={(e) =>
                          updateStatus(applicant.id, e.target.value as 'Pending' | 'Approved' | 'Rejected')
                        }
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p>No applicants found matching the filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}