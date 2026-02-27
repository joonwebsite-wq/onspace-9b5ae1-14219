import { supabase } from '@/lib/supabase';

export interface JobInput {
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary?: string;
  description: string;
  requirements?: string;
  organization_name: string;
  contact_person: string;
  mobile: string;
  whatsapp: string;
  email?: string;
}

export interface JobFilters {
  category?: string;
  job_type?: string;
  location?: string;
  search?: string;
  status?: string;
  sortBy?: 'recent' | 'popular' | 'title';
  limit?: number;
  offset?: number;
}

// Get all approved jobs with filters
export async function getJobs(filters?: JobFilters) {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'All Jobs') {
      query = query.eq('category', filters.category);
    }

    if (filters?.job_type && filters.job_type !== 'All') {
      query = query.eq('job_type', filters.job_type);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`
      );
    }

    if (filters?.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Record view for analytics
    if (data && data.length > 0) {
      data.forEach(job => {
        recordJobView(job.id).catch(console.error);
      });
    }

    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { data: [], count: 0, error };
  }
}

// Get single job by ID
export async function getJobById(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('status', 'approved')
      .single();

    if (error) throw error;

    // Record view
    if (data) {
      await recordJobView(jobId);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching job:', error);
    return { data: null, error };
  }
}

// Create new job
export async function createJob(jobData: JobInput, userId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: userId,
          ...jobData,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating job:', error);
    return { data: null, error };
  }
}

// Update job
export async function updateJob(jobId: string, jobData: Partial<JobInput>, userId: string) {
  try {
    // Verify ownership
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single();

    if (fetchError || job?.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('jobs')
      .update({
        ...jobData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating job:', error);
    return { data: null, error };
  }
}

// Delete job
export async function deleteJob(jobId: string, userId: string) {
  try {
    // Verify ownership
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single();

    if (fetchError || job?.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting job:', error);
    return { error };
  }
}

// Close/Expire job
export async function closeJob(jobId: string, userId: string) {
  return updateJob(jobId, { status: 'closed' }, userId);
}

// Record job view for analytics
export async function recordJobView(jobId: string) {
  try {
    await supabase.from('job_views').insert([
      {
        job_id: jobId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        viewed_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Error recording job view:', error);
  }
}

// Save/Bookmark job
export async function saveJob(jobId: string, userEmail: string) {
  try {
    const { data, error } = await supabase
      .from('job_saves')
      .insert([
        {
          job_id: jobId,
          user_email: userEmail,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving job:', error);
    return { data: null, error };
  }
}

// Unsave job
export async function unsaveJob(jobId: string, userEmail: string) {
  try {
    const { error } = await supabase
      .from('job_saves')
      .delete()
      .eq('job_id', jobId)
      .eq('user_email', userEmail);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error unsaving job:', error);
    return { error };
  }
}

// Check if job is saved
export async function isJobSaved(jobId: string, userEmail: string) {
  try {
    const { data, error } = await supabase
      .from('job_saves')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_email', userEmail)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { isSaved: !!data, error: null };
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return { isSaved: false, error };
  }
}

// Get saved jobs for user
export async function getSavedJobs(userEmail: string) {
  try {
    const { data, error } = await supabase
      .from('job_saves')
      .select('jobs(*)')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobs = data?.map((save: any) => save.jobs).filter(Boolean) || [];
    return { data: jobs, error: null };
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return { data: [], error };
  }
}

// Get featured jobs
export async function getFeaturedJobs(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    return { data: [], error };
  }
}

// Get trending jobs (most viewed)
export async function getTrendingJobs(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching trending jobs:', error);
    return { data: [], error };
  }
}

// Get jobs by user/organization
export async function getUserJobs(userId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return { data: [], error };
  }
}
