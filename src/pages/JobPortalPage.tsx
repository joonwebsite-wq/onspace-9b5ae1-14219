import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Search, MapPin, Briefcase, Plus, DollarSign, Clock, Building2 } from 'lucide-react';
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

export function JobPortalPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Jobs');
  const [selectedJobType, setSelectedJobType] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchKeyword, searchLocation, selectedCategory, selectedJobType]);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } else {
      setJobs(data || []);
    }
    setLoading(false);
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
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.organization_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Location search
    if (searchLocation.trim()) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-navy via-navy-light to-navy text-white">
        <div className="container-custom px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meri Pahal Fast Help Job Portal
            </h1>
            <p className="text-xl text-gray-200">Find Jobs. Post Jobs. Grow Together.</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Job title, keyword..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Location..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-saffron focus:border-transparent"
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link to="/post-job" className="flex-1">
                <button className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Post a Job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-12">
        <div className="container-custom px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-2">
              {selectedCategory === 'All Jobs' ? 'All Available Jobs' : selectedCategory}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${filteredJobs.length} jobs found`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron mx-auto"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Link key={job.id} to={`/job/${job.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-saffron cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="bg-saffron/10 p-3 rounded-lg">
                            <Building2 className="text-saffron" size={32} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-navy mb-2">{job.title}</h3>
                            <p className="text-lg text-gray-700 font-semibold mb-2">{job.organization_name}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin size={16} className="text-saffron" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase size={16} className="text-saffron" />
                                {job.job_type}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1">
                                  <DollarSign size={16} className="text-saffron" />
                                  {job.salary}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock size={16} className="text-saffron" />
                                {getTimeSince(job.created_at)}
                              </span>
                            </div>

                            <p className="text-gray-600 line-clamp-2">{job.description}</p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="bg-saffron/10 text-saffron px-3 py-1 rounded-full text-sm font-semibold">
                                {job.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <button className="bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-6 py-3 rounded-lg transition-all">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
