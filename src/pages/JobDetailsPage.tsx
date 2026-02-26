import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import { 
  Loader2, ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building2, 
  Phone, Mail, MessageCircle, Upload, X 
} from 'lucide-react';

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
  created_at: string;
}

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: '',
    message: '',
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume size should not exceed 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Please upload PDF file only');
        return;
      }
      setResumeFile(file);
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null;

    const fileExt = 'pdf';
    const fileName = `${Date.now()}-${formData.full_name.replace(/\s+/g, '-')}.${fileExt}`;

    const { error } = await supabase.storage
      .from('applicant-documents')
      .upload(`resumes/${fileName}`, resumeFile);

    if (error) {
      console.error('Resume upload error:', error);
      toast.error('Failed to upload resume');
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('applicant-documents')
      .getPublicUrl(`resumes/${fileName}`);

    return publicUrlData.publicUrl;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.mobile || !formData.whatsapp || !formData.email || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    let resumeUrl = null;
    if (resumeFile) {
      resumeUrl = await uploadResume();
      if (!resumeUrl) {
        setSubmitting(false);
        return;
      }
    }

    const { error } = await supabase
      .from('job_applications')
      .insert({
        job_id: id,
        full_name: formData.full_name,
        mobile: formData.mobile,
        whatsapp: formData.whatsapp,
        email: formData.email,
        city: formData.city,
        message: formData.message,
        resume_url: resumeUrl,
      });

    setSubmitting(false);

    if (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } else {
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      setFormData({
        full_name: '',
        mobile: '',
        whatsapp: '',
        email: '',
        city: '',
        message: '',
      });
      setResumeFile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron" size={48} />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const getTimeSince = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now.getTime() - posted.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-28 pb-12">
        <div className="container-custom px-4 max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-navy hover:text-saffron mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="bg-saffron/10 p-4 rounded-xl">
                <Building2 className="text-saffron" size={48} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-navy mb-2">{job.title}</h1>
                <p className="text-xl text-gray-700 font-semibold mb-4">{job.organization_name}</p>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-saffron" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase size={18} className="text-saffron" />
                    {job.job_type}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-2">
                      <DollarSign size={18} className="text-saffron" />
                      {job.salary}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Clock size={18} className="text-saffron" />
                    Posted {getTimeSince(job.created_at)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-saffron/10 text-saffron px-4 py-2 rounded-full text-sm font-semibold">
                    {job.category}
                  </span>
                  <span className="bg-indiaGreen/10 text-indiaGreen px-4 py-2 rounded-full text-sm font-semibold">
                    {job.job_type}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="bg-saffron hover:bg-saffron-dark text-white font-bold px-8 py-4 rounded-lg transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Job Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-navy mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="text-saffron mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-700">Contact Person</p>
                    <p className="text-gray-600">{job.contact_person}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-saffron mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-700">Mobile</p>
                    <a href={`tel:${job.mobile}`} className="text-blue-600 hover:underline">
                      {job.mobile}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="text-saffron mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-700">WhatsApp</p>
                    <a 
                      href={`https://wa.me/91${job.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {job.whatsapp}
                    </a>
                  </div>
                </div>

                {job.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-saffron mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Email</p>
                      <a href={`mailto:${job.email}`} className="text-blue-600 hover:underline break-all">
                        {job.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <a
                  href={`https://wa.me/91${job.whatsapp}?text=Hi, I'm interested in the ${job.title} position`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy">Apply for {job.title}</h2>
              <button
                onClick={() => setShowApplyForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume (PDF, Max 5MB - Optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                  {resumeFile && (
                    <p className="text-sm text-green-600 mt-2">✓ {resumeFile.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Tell us why you're interested..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-8 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
