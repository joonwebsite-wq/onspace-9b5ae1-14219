import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Search, MapPin, Briefcase, Plus, DollarSign, Clock, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

const CATEGORIES = ['All Jobs', 'NGO Jobs', 'Private Jobs', 'Artist Jobs', 'Work From Home', 'Local Jobs'];
const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Volunteer', 'Contract'];
const ITEMS_PER_PAGE = 12;

export function JobPortalPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Jobs');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchKeyword, searchLocation, selectedCategory, selectedJobType, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs]);

  const fetchJobs = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        throw error;
      }
      
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Category filter
    if (selectedCategory !== 'All Jobs') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Job type filter
    if (selectedJobType !== 'All') {
      filtered = filtered.filter(job => job.job_type === selectedJobType);
    }

    // Keyword search
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(keyword) ||
        job.organization_name.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }

    // Location search
    if (searchLocation.trim()) {
      const location = searchLocation.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location)
      );
    }

    // Sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'location') {
      filtered.sort((a, b) => a.location.localeCompare(b.location));
    }

    setFilteredJobs(filtered);
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now.getTime() - posted.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
        <div className="container-custom px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meri Pahal Job Portal
            </h1>
            <p className="text-xl text-gray-200">Find the perfect opportunity or post your job</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Job title, keyword..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Location..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent transition"
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link to="/post-job" className="flex-1">
                <button className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  <Plus size={20} />
                  Post a Job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-2">
                {selectedCategory === 'All Jobs' ? 'All Available Jobs' : selectedCategory}
              </h2>
              <p className="text-gray-600">
                {loading ? 'Loading jobs...' : `${filteredJobs.length} jobs found`}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Job Title A-Z</option>
                <option value="location">Location A-Z</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-600">Error Loading Jobs</h3>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-saffron mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            //Empty State
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <Briefcase size={72} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search filters or browse other categories</p>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSearchLocation('');
                  setSelectedCategory('All Jobs');
                  setSelectedJobType('All');
                }}
                className="text-saffron hover:text-saffron-dark font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Jobs Grid */}
              <div className="grid gap-6 mb-8">
                {paginatedJobs.map((job) => (
                  <Link key={job.id} to={`/job/${job.id}`} className="group">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-saffron hover:border-indiaGreen">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-saffron to-saffron-dark/80 p-3 rounded-lg flex-shrink-0">
                              <Building2 className="text-white" size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-saffron transition">
                                {job.title}
                              </h3>
                              <p className="text-lg text-gray-700 font-semibold mb-3">{job.organization_name}</p>
                              
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin size={16} className="text-saffron flex-shrink-0" />
                                    <span className="line-clamp-1">{job.location}</span>
                                  </span>
                                )}
                                {job.job_type && (
                                  <span className="flex items-center gap-1">
                                    <Briefcase size={16} className="text-saffron flex-shrink-0" />
                                    {job.job_type}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={16} className="text-saffron flex-shrink-0" />
                                    {job.salary}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock size={16} className="text-saffron flex-shrink-0" />
                                  {getTimeSince(job.created_at)}
                                </span>
                              </div>

                              <p className="text-gray-600 line-clamp-2 mb-3">{job.description}</p>

                              <div className="flex flex-wrap gap-2">
                                {job.category && (
                                  <span className="bg-saffron/10 text-saffron px-3 py-1 rounded-full text-xs font-semibold">
                                    {job.category}
                                  </span>
                                )}
                                {new Date(job.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                                  <span className="bg-indiaGreen/10 text-indiaGreen px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right flex-shrink-0">
                          <button className="bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg w-full md:w-auto">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition ${
                          currentPage === page
                            ? 'bg-saffron text-white font-bold'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
