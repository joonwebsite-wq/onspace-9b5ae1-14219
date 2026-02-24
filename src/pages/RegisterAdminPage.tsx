import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const registerSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(4, 'OTP must be 4 digits'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type OtpForm = z.infer<typeof otpSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterAdminPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleSendOTP = async (data: OtpForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      setEmail(data.email);
      registerForm.setValue('email', data.email);
      setStep('verify');
      toast.success('OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // Verify OTP
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.otp,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      // Update user with password and username
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: data.password,
        data: { username: data.username },
      });

      if (updateError) throw updateError;

      toast.success('Admin account created successfully!');
      
      if (updateData.user) {
        login({
          id: updateData.user.id,
          email: updateData.user.email!,
          username: data.username,
          avatar: updateData.user.user_metadata?.avatar_url,
        });
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-saffron/10 text-saffron rounded-full mb-4">
              <User size={32} />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Admin Registration</h1>
            <p className="text-gray-600">Create your admin account</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={otpForm.handleSubmit(handleSendOTP)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    {...otpForm.register('email')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                    placeholder="admin@example.com"
                  />
                </div>
                {otpForm.formState.errors.email && (
                  <p className="text-red-600 text-sm mt-1">{otpForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cta-button justify-center"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight className="ml-2" size={20} />
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-saffron hover:underline font-semibold"
                >
                  Login here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  {...registerForm.register('otp')}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="0000"
                />
                {registerForm.formState.errors.otp && (
                  <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.otp.message}</p>
                )}
                <p className="text-sm text-gray-600 mt-2">Check your email: {email}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    {...registerForm.register('username')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                    placeholder="Your username"
                  />
                </div>
                {registerForm.formState.errors.username && (
                  <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    {...registerForm.register('password')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                    placeholder="Min. 6 characters"
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    {...registerForm.register('confirmPassword')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                    placeholder="Repeat password"
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cta-button justify-center"
              >
                {loading ? 'Creating Account...' : 'Create Admin Account'}
                <ArrowRight className="ml-2" size={20} />
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-600 hover:text-saffron"
              >
                Back to email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
