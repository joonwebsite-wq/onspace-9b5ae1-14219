import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Applicant } from '@/types';
import { toast } from 'sonner';
import { Eye, Download, Search, Filter, Calendar, FileDown, CheckSquare, XSquare } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ApplicantsPanel() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [qualificationFilter, setQualificationFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, stateFilter, positionFilter, statusFilter, qualificationFilter, startDate, endDate, applicants]);

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
    }
    setLoading(false);
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.full_name.toLowerCase().includes(term) ||
          a.email.toLowerCase().includes(term) ||
          a.mobile.includes(term)
      );
    }

    if (stateFilter !== 'All') {
      filtered = filtered.filter((a) => a.state === stateFilter);
    }

    if (positionFilter !== 'All') {
      filtered = filtered.filter((a) => a.position === positionFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (qualificationFilter !== 'All') {
      filtered = filtered.filter((a) => a.qualification === qualificationFilter);
    }

    if (startDate) {
      filtered = filtered.filter((a) => new Date(a.created_at) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((a) => new Date(a.created_at) <= new Date(endDate));
    }

    setFilteredApplicants(filtered);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('applicants')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } else {
      toast.success(`Status updated to ${status}`);
      fetchApplicants();
    }
  };

  const exportToExcel = () => {
    const exportData = filteredApplicants.map((a) => ({
      Name: a.full_name,
      Email: a.email,
      Mobile: a.mobile,
      State: a.state,
      District: a.district,
      Position: a.position,
      Qualification: a.qualification,
      Experience: `${a.experience} years`,
      Status: a.status,
      'Applied On': new Date(a.created_at).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    XLSX.writeFile(wb, `applicants_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file downloaded successfully');
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplicants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplicants.map((a) => a.id)));
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedIds.size === 0) {
      toast.error('No applications selected');
      return;
    }

    const { error } = await supabase
      .from('applicants')
      .update({ status })
      .in('id', Array.from(selectedIds));

    if (error) {
      console.error('Error bulk updating:', error);
      toast.error('Failed to update statuses');
    } else {
      toast.success(`${selectedIds.size} applications updated to ${status}`);
      setSelectedIds(new Set());
      fetchApplicants();
    }
  };

  const states = ['All', ...new Set(applicants.map((a) => a.state))];
  const positions = ['All', ...new Set(applicants.map((a) => a.position))];
  const qualifications = ['All', ...new Set(applicants.map((a) => a.qualification))];

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Applicants Management</h1>
          <p className="text-gray-600">{filteredApplicants.length} applications found</p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-indiaGreen hover:bg-indiaGreen-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <FileDown size={20} />
          Export to Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-1">Total Applications</p>
          <p className="text-3xl font-bold text-navy">{applicants.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">
            {applicants.filter((a) => a.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {applicants.filter((a) => a.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-sm mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {applicants.filter((a) => a.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-saffron" />
          <h2 className="text-lg font-bold text-navy">Advanced Filters</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, email, mobile..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
            <select
              value={qualificationFilter}
              onChange={(e) => setQualificationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
            >
              {qualifications.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-saffron/10 border border-saffron rounded-xl p-4 flex items-center justify-between">
          <p className="font-semibold text-navy">
            {selectedIds.size} application(s) selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => bulkUpdateStatus('Approved')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <CheckSquare size={18} />
              Bulk Approve
            </button>
            <button
              onClick={() => bulkUpdateStatus('Rejected')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <XSquare size={18} />
              Bulk Reject
            </button>
          </div>
        </div>
      )}

      {/* Applicants Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredApplicants.length && filteredApplicants.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">State</th>
                <th className="px-6 py-4 text-left">Position</th>
                <th className="px-6 py-4 text-left">Experience</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Applied On</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(applicant.id)}
                      onChange={() => toggleSelect(applicant.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-navy">{applicant.full_name}</p>
                      <p className="text-sm text-gray-600">{applicant.qualification}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm">{applicant.email}</p>
                      <p className="text-sm text-gray-600">{applicant.mobile}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{applicant.state}</p>
                      <p className="text-xs text-gray-600">{applicant.district}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{applicant.position}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{applicant.experience} years</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={applicant.status}
                      onChange={(e) => updateStatus(applicant.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        applicant.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : applicant.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      {applicant.resume_url && (
                        <a
                          href={applicant.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-saffron hover:text-saffron-dark"
                          title="View Resume"
                        >
                          <Eye size={18} />
                        </a>
                      )}
                      {applicant.aadhaar_url && (
                        <a
                          href={applicant.aadhaar_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indiaGreen hover:text-indiaGreen-dark"
                          title="View Aadhaar"
                        >
                          <Download size={18} />
                        </a>
                      )}
                      {applicant.photo_url && (
                        <a
                          href={applicant.photo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="View Photo"
                        >
                          <Eye size={18} />
                        </a>
                      )}
                    </div>
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
  );
}
