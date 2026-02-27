import { supabase } from '@/lib/supabase';

// Approve job
export async function approveJob(jobId: string, adminId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'approved',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit(adminId, 'APPROVE_JOB', 'jobs', jobId, { status: 'approved' });

    return { data, error: null };
  } catch (error) {
    console.error('Error approving job:', error);
    return { data: null, error };
  }
}

// Reject job
export async function rejectJob(jobId: string, adminId: string, reason?: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit(adminId, 'REJECT_JOB', 'jobs', jobId, { status: 'rejected', reason });

    return { data, error: null };
  } catch (error) {
    console.error('Error rejecting job:', error);
    return { data: null, error };
  }
}

// Get pending jobs for admin approval
export async function getPendingJobs(limit = 50, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    return { data: [], count: 0, error };
  }
}

// Feature/unfeature job
export async function toggleJobFeature(jobId: string, featured: boolean, adminId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        is_featured: featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit(adminId, featured ? 'FEATURE_JOB' : 'UNFEATURE_JOB', 'jobs', jobId, {
      is_featured: featured,
    });

    return { data, error: null };
  } catch (error) {
    console.error('Error toggling job feature:', error);
    return { data: null, error };
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  try {
    // Total jobs
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    // Pending jobs
    const { count: pendingJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Total applications
    const { count: totalApplications } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true });

    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Jobs by category
    const { data: jobsByCategory } = await supabase
      .from('jobs')
      .select('category')
      .eq('status', 'approved');

    const categoryStats: Record<string, number> = {};
    jobsByCategory?.forEach(job => {
      categoryStats[job.category] = (categoryStats[job.category] || 0) + 1;
    });

    // Applications by status
    const { data: applicationsByStatus } = await supabase
      .from('job_applications')
      .select('status');

    const statusStats: Record<string, number> = {};
    applicationsByStatus?.forEach(app => {
      statusStats[app.status] = (statusStats[app.status] || 0) + 1;
    });

    return {
      data: {
        totalJobs: totalJobs || 0,
        pendingJobs: pendingJobs || 0,
        totalApplications: totalApplications || 0,
        totalUsers: totalUsers || 0,
        jobsByCategory: categoryStats,
        applicationsByStatus: statusStats,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      data: {
        totalJobs: 0,
        pendingJobs: 0,
        totalApplications: 0,
        totalUsers: 0,
        jobsByCategory: {},
        applicationsByStatus: {},
      },
      error,
    };
  }
}

// Get all jobs for admin (with all statuses)
export async function getAllJobsAdmin(filters?: {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('jobs')
      .select('*, users(organization_name, email)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`
      );
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    return { data: [], count: 0, error };
  }
}

// Log audit trail
export async function logAudit(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes: any
) {
  try {
    await supabase.from('audit_logs').insert([
      {
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Error logging audit trail:', error);
  }
}

// Get audit logs
export async function getAuditLogs(limit = 100, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('audit_logs')
      .select('*, admin_users(full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { data: [], count: 0, error };
  }
}

// Send notification
export async function sendNotification(
  userId: string | null,
  adminId: string | null,
  type: string,
  title: string,
  message: string,
  relatedId?: string
) {
  try {
    const { error } = await supabase.from('notifications').insert([
      {
        user_id: userId,
        admin_id: adminId,
        type,
        title,
        message,
        related_id: relatedId,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { error };
  }
}

// Get unread notifications
export async function getUnreadNotifications(userId?: string, adminId?: string) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count, error: null };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: [], count: 0, error };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { error };
  }
}

// Bulk approve jobs
export async function bulkApproveJobs(jobIds: string[], adminId: string) {
  try {
    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from('jobs')
      .update({
        status: 'approved',
        published_at: timestamp,
        updated_at: timestamp,
      })
      .in('id', jobIds);

    if (error) throw error;

    // Log audit for each job
    for (const jobId of jobIds) {
      await logAudit(adminId, 'BULK_APPROVE_JOB', 'jobs', jobId, { status: 'approved' });
    }

    return { error: null };
  } catch (error) {
    console.error('Error bulk approving jobs:', error);
    return { error };
  }
}

// Bulk reject jobs
export async function bulkRejectJobs(jobIds: string[], adminId: string, reason?: string) {
  try {
    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from('jobs')
      .update({
        status: 'rejected',
        updated_at: timestamp,
      })
      .in('id', jobIds);

    if (error) throw error;

    // Log audit for each job
    for (const jobId of jobIds) {
      await logAudit(adminId, 'BULK_REJECT_JOB', 'jobs', jobId, {
        status: 'rejected',
        reason,
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error bulk rejecting jobs:', error);
    return { error };
  }
}
