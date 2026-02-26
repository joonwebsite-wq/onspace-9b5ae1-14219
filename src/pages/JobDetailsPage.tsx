import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'sonner';
import { 
  Loader2, ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building2, 
  Phone, Mail, MessageCircle, Upload, X, FileText, CheckCircle, AlertCircle, Share2
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) {
        throw error;
      }
      setJob(data);
    } catch (err) {
      console.error('Error fetching job:', err);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'full_name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';

      case 'mobile':
        if (!value) return 'Mobile number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Mobile number must be 10 digits';
        return '';

      case 'whatsapp':
        if (!value) return 'WhatsApp number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'WhatsApp number must be 10 digits';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';

      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City name must be at least 2 characters';
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach(key => {
      if (key !== 'message') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'Resume size should not exceed 5MB' }));
        return;
      }
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, resume: 'Please upload PDF file only' }));
        return;
      }
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null;

    try {
      const fileExt = 'pdf';
      const fileName = `${Date.now()}-${formData.full_name.replace(/\s+/g, '-')}.${fileExt}`;

      const { error } = await supabase.storage
        .from('applicant-documents')
        .upload(`resumes/${fileName}`, resumeFile);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('applicant-documents')
        .getPublicUrl(`resumes/${fileName}`);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Resume upload error:', err);
      toast.error('Failed to upload resume');
      return null;
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all errors in the form');
      return;
    }

    setSubmitting(true);

    try {
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

      if (error) {
        throw error;
      }

      setShowSuccess(true);
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
      setErrors({});
      setTouched({});
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-saffron mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
        <Footer />
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

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this job opening: ${job.title} at ${job.organization_name}`;

    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-12 flex-1">
        <div className="container-custom px-4 max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-navy hover:text-saffron mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>

          {/* Success Banner */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
              <div>
                <h3 className="font-semibold text-green-600">Application Submitted!</h3>
                <p className="text-green-700">You'll hear from the employer soon. Check your email for updates.</p>
              </div>
            </div>
          )}

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-6">
                  <div className="bg-gradient-to-br from-saffron to-saffron-dark/80 p-4 rounded-xl flex-shrink-0">
                    <Building2 className="text-white" size={48} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2 break-words">{job.title}</h1>
                    <p className="text-xl text-gray-700 font-semibold mb-4">{job.organization_name}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      {job.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={18} className="text-saffron flex-shrink-0" />
                          <span className="line-clamp-1">{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase size={18} className="text-saffron flex-shrink-0" />
                        <span>{job.job_type}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign size={18} className="text-saffron flex-shrink-0" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={18} className="text-saffron flex-shrink-0" />
                        <span>{getTimeSince(job.created_at)}</span>
                      </div>
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
                </div>
              </div>

              <div className="lg:text-right flex flex-col gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="bg-saffron hover:bg-saffron-dark text-white font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Job Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <FileText size={28} className="text-saffron" />
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold text-navy mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Building2 className="text-saffron mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 text-sm">Contact Person</p>
                    <p className="text-gray-600 break-words">{job.contact_person}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-saffron mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 text-sm">Mobile</p>
                    <a href={`tel:${job.mobile}`} className="text-blue-600 hover:underline break-all">
                      {job.mobile}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="text-saffron mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 text-sm">WhatsApp</p>
                    <a 
                      href={`https://wa.me/91${job.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline break-all"
                    >
                      {job.whatsapp}
                    </a>
                  </div>
                </div>

                {job.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-saffron mt-1 flex-shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-700 text-sm">Email</p>
                      <a href={`mailto:${job.email}`} className="text-blue-600 hover:underline break-all text-sm">
                        {job.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <a
                    href={`https://wa.me/91${job.whatsapp}?text=Hi, I'm interested in the ${job.title} position`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-navy to-navy-light border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Apply for {job.title}</h2>
              <button
                onClick={() => setShowApplyForm(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleFieldChange('full_name', e.target.value)}
                  onBlur={() => handleFieldBlur('full_name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
                    errors.full_name && touched.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.full_name && touched.full_name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onBlur={() => handleFieldBlur('mobile')}
                    maxLength={10}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
                      errors.mobile && touched.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="10-digit number"
                  />
                  {errors.mobile && touched.mobile && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleFieldChange('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onBlur={() => handleFieldBlur('whatsapp')}
                    maxLength={10}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
                      errors.whatsapp && touched.whatsapp ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="10-digit number"
                  />
                  {errors.whatsapp && touched.whatsapp && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
                    errors.email && touched.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  onBlur={() => handleFieldBlur('city')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition ${
                    errors.city && touched.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your city"
                />
                {errors.city && touched.city && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume (PDF, Max 5MB - Optional)
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition cursor-pointer file:cursor-pointer file:bg-saffron file:text-white file:px-4 file:py-2 file:border-0 file:rounded file:mr-4 ${
                      errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {resumeFile && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle size={16} />
                    {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)}MB)
                  </p>
                )}
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent transition resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Application
                    </>
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
