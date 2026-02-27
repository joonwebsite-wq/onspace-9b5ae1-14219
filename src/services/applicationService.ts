import { supabase } from '@/lib/supabase';

export interface ApplicationInput {
  job_id: string;
  full_name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  city: string;
  message?: string;
  resume_url?: string;
  resume_file_name?: string;
}

export interface ApplicationFilters {
  job_id?: string;
  status?: string;
  sortBy?: 'recent' | 'rating' | 'status';
  limit?: number;
  offset?: number;
}

// Create job application
export async function createApplication(appData: ApplicationInput) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          ...appData,
          status: 'applied',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating application:', error);
    return { data: null, error };
  }
}

// Get applications for a job
export async function getJobApplications(jobId: string, filters?: ApplicationFilters) {
  try {
    let query = supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (filters?.sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    }

    if (filters?.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return { data: [], count: 0, error };
  }
}

// Get single application
export async function getApplication(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching application:', error);
    return { data: null, error };
  }
}

// Update application status
export async function updateApplicationStatus(applicationId: string, status: string, notes?: string) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { data: null, error };
  }
}

// Rate applicant
export async function rateApplicant(applicationId: string, rating: number, notes?: string) {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update({
        rating,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error rating applicant:', error);
    return { data: null, error };
  }
}

// Get applicant statistics
export async function getApplicantStats(jobId: string) {
  try {
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('status');

    if (error) throw error;

    const stats = {
      total: applications?.length || 0,
      applied: applications?.filter(app => app.status === 'applied').length || 0,
      shortlisted: applications?.filter(app => app.status === 'shortlisted').length || 0,
      rejected: applications?.filter(app => app.status === 'rejected').length || 0,
      accepted: applications?.filter(app => app.status === 'accepted').length || 0,
      onHold: applications?.filter(app => app.status === 'on_hold').length || 0,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching applicant stats:', error);
    return { data: null, error };
  }
}

// Get user applications
export async function getUserApplications(userEmail: string) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(*)')
      .eq('email', userEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return { data: [], error };
  }
}

// Export applications to CSV
export async function exportApplicationsToCSV(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert to CSV format
    if (!data || data.length === 0) {
      return { data: '', error: 'No applications found' };
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(app =>
      Object.values(app)
        .map(val => {
          // Escape quotes and wrap in quotes if contains comma
          if (typeof val === 'string' && val.includes(',')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');
    return { data: csv, error: null };
  } catch (error) {
    console.error('Error exporting applications:', error);
    return { data: '', error };
  }
}

// Delete application
export async function deleteApplication(applicationId: string) {
  try {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', applicationId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { error };
  }
}

// Bulk update applications
export async function bulkUpdateApplications(
  applicationIds: string[],
  updates: { status?: string; notes?: string; rating?: number }
) {
  try {
    const { error } = await supabase
      .from('job_applications')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('id', applicationIds);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error bulk updating applications:', error);
    return { error };
  }
}
