import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, FileText, Loader2, CheckCircle } from 'lucide-react';
import { applicationSchema, ApplicationFormData } from '@/lib/validations';
import { INDIAN_STATES, JOB_POSITIONS } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should not exceed 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume size should not exceed 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Aadhaar size should not exceed 5MB');
        return;
      }
      setAadhaarFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile || !aadhaarFile || !photoFile) {
      toast.error('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);

    const resumeUrl = await uploadFile(resumeFile, 'applicant-documents', 'resumes');
    const aadhaarUrl = await uploadFile(aadhaarFile, 'applicant-documents', 'aadhaar');
    const photoUrl = await uploadFile(photoFile, 'applicant-documents', 'photos');

    const { error } = await supabase.from('applicants').insert({
      full_name: data.full_name,
      state: data.state,
      district: data.district,
      position: data.position,
      qualification: data.qualification,
      experience: data.experience,
      mobile: data.mobile,
      email: data.email,
      resume_url: resumeUrl,
      aadhaar_url: aadhaarUrl,
      photo_url: photoUrl,
      status: 'Pending',
    });

    if (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setShowSuccess(true);
    toast.success('Application submitted successfully!');
    reset();
    setResumeFile(null);
    setAadhaarFile(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsSubmitting(false);

    setTimeout(() => {
      window.open('https://wa.me/917073741421', '_blank');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="bg-gradient-to-br from-indiaGreen to-green-700 text-white rounded-2xl p-12 text-center">
        <CheckCircle size={64} className="mx-auto mb-6" />
        <h3 className="text-3xl font-bold mb-4">Application Submitted Successfully!</h3>
        <p className="text-lg mb-6">
          Thank you for applying. Our team will review your application and contact you shortly.
        </p>
        <p className="mb-6">You will be redirected to WhatsApp for immediate support...</p>
        <button
          onClick={() => setShowSuccess(false)}
          className="bg-white text-indiaGreen px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('full_name')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register('state')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            {...register('district')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="Enter your district"
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Position Applying For <span className="text-red-500">*</span>
          </label>
          <select
            {...register('position')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
          >
            <option value="">Select Position</option>
            {JOB_POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Qualification <span className="text-red-500">*</span>
          </label>
          <input
            {...register('qualification')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="e.g., B.Tech, MBA, etc."
          />
          {errors.qualification && (
            <p className="text-red-500 text-sm mt-1">{errors.qualification.message}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('experience')}
            type="number"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="Enter years of experience"
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register('mobile')}
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="10-digit mobile number"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Resume/Bio Data <span className="text-red-500">*</span>
          </label>
          <input
            ref={resumeInputRef}
            type="file"
            onChange={handleResumeChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-saffron transition-colors flex items-center justify-center gap-2"
          >
            {resumeFile ? (
              <>
                <FileText size={20} className="text-indiaGreen" />
                <span className="text-sm truncate">{resumeFile.name}</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-sm">Upload Resume</span>
              </>
            )}
          </button>
          {resumeFile && (
            <button
              type="button"
              onClick={() => setResumeFile(null)}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        {/* Aadhaar Upload */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Aadhaar Card <span className="text-red-500">*</span>
          </label>
          <input
            ref={aadhaarInputRef}
            type="file"
            onChange={handleAadhaarChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => aadhaarInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-saffron transition-colors flex items-center justify-center gap-2"
          >
            {aadhaarFile ? (
              <>
                <FileText size={20} className="text-indiaGreen" />
                <span className="text-sm truncate">{aadhaarFile.name}</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span className="text-sm">Upload Aadhaar</span>
              </>
            )}
          </button>
          {aadhaarFile && (
            <button
              type="button"
              onClick={() => setAadhaarFile(null)}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        {/* Passport Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Passport Photo <span className="text-red-500">*</span>
          </label>
          <input
            ref={photoInputRef}
            type="file"
            onChange={handlePhotoChange}
            accept=".jpg,.jpeg,.png"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-saffron transition-colors flex items-center justify-center gap-2"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="h-20 w-16 object-cover rounded"
              />
            ) : (
              <>
                <Upload size={20} />
                <span className="text-sm">Upload Photo</span>
              </>
            )}
          </button>
          {photoFile && (
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-gray-600 mt-1">White background, max 5MB</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cta-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
}