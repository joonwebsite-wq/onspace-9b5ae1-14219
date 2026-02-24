import { z } from 'zod';
import { INDIAN_STATES, JOB_POSITIONS } from '@/types';

export const applicationSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  state: z.enum(INDIAN_STATES, { required_error: 'Please select a state' }),
  district: z.string().min(2, 'District is required'),
  position: z.enum(JOB_POSITIONS, { required_error: 'Please select a position' }),
  qualification: z.string().min(2, 'Qualification is required'),
  experience: z.coerce.number().min(0, 'Experience cannot be negative'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  email: z.string().email('Invalid email address'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});