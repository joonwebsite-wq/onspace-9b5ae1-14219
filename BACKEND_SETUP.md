# Meri Pahal Job Portal - Complete Backend Setup Guide

## Overview
This guide provides complete instructions for setting up the backend infrastructure for the Meri Pahal Job Portal using Supabase.

## Architecture

```
Frontend (React)
    ↓
API Services (TypeScript)
    ↓
Supabase (PostgreSQL + Auth + Storage)
    ├── Authentication
    ├── Database (Tables & RLS Policies)
    ├── File Storage (Resumes)
    └── Real-time Features
```

## Prerequisites
- Supabase account (https://supabase.com)
- Node.js 18+ for local development
- Environment variables configured

## Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy your URL and API keys:
   - `VITE_SUPABASE_URL` - Project URL
   - `VITE_SUPABASE_ANON_KEY` - Anon Key

### 2. Configure Environment Variables
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the entire content from `DATABASE_SCHEMA.sql`
4. Run the SQL to create all tables, indexes, and RLS policies

### 4. Set Up Authentication
1. Go to Authentication → Providers
2. Enable Email/Password authentication
3. Configure email templates in Authentication → Email Templates

### 5. Create Storage Bucket
1. Go to Storage → Buckets
2. Create bucket named: `applicant-documents`
3. Set permissions:
   - Public read access (for resume downloads)
   - Authenticated write access

### 6. Configure Policies & Permissions
The DATABASE_SCHEMA.sql includes Row Level Security (RLS) policies:
- ✅ Authenticated users can view their profile
- ✅ Anyone can view approved jobs
- ✅ Job posters can manage their jobs
- ✅ Admins have full access
- ✅ Applications are only for approved jobs

## Database Schema

### Tables

#### users
```typescript
id: UUID
email: string (unique)
password_hash: string
full_name: string
organization_name: string
mobile: string
whatsapp: string
role: 'admin' | 'recruiter' | 'super_admin'
is_active: boolean
email_verified: boolean
created_at: timestamp
updated_at: timestamp
last_login: timestamp
```

#### jobs
```typescript
id: UUID
user_id: UUID (references users)
title: string
category: string
job_type: string
location: string
salary?: string
description: text
requirements?: text
organization_name: string
contact_person: string
mobile: string
whatsapp: string
email?: string
status: 'pending' | 'approved' | 'rejected' | 'closed' | 'expired'
is_featured: boolean
views_count: number
applications_count: number
expiry_date?: timestamp
created_at: timestamp
updated_at: timestamp
published_at?: timestamp
```

#### job_applications
```typescript
id: UUID
job_id: UUID (references jobs)
full_name: string
email: string
mobile: string
whatsapp: string
city: string
message?: string
resume_url?: string
resume_file_name?: string
status: 'applied' | 'shortlisted' | 'rejected' | 'accepted' | 'on_hold'
rating?: number (1-5)
notes?: string
created_at: timestamp
updated_at: timestamp
```

#### job_saves
```typescript
id: UUID
job_id: UUID (references jobs)
user_email: string
user_ip_address?: string
created_at: timestamp
UNIQUE(job_id, user_email)
```

#### admin_users
```typescript
id: UUID (references auth.users)
email: string (unique)
full_name: string
role: 'admin' | 'super_admin'
permissions: string[] (array)
is_active: boolean
created_at: timestamp
updated_at: timestamp
```

#### job_views (Analytics)
```typescript
id: UUID
job_id: UUID (references jobs)
user_ip_address?: string
user_agent?: string
referrer?: string
viewed_at: timestamp
```

#### notifications
```typescript
id: UUID
user_id?: UUID (references users)
admin_id?: UUID (references admin_users)
type: 'job_applied' | 'job_approved' | 'job_rejected' | 'new_application' | 'message'
title: string
message: string
related_id?: UUID
is_read: boolean
created_at: timestamp
read_at?: timestamp
```

#### audit_logs
```typescript
id: UUID
admin_id?: UUID (references admin_users)
action: string
entity_type: string
entity_id: UUID
changes: JSONB
created_at: timestamp
```

## API Services

### Job Service (`src/services/jobService.ts`)

**Functions:**
- `getJobs(filters)` - Get all approved jobs with filtering
- `getJobById(jobId)` - Get single job details
- `createJob(jobData, userId)` - Create new job (requires auth)
- `updateJob(jobId, jobData, userId)` - Update job (owner only)
- `deleteJob(jobId, userId)` - Delete job (owner only)
- `closeJob(jobId, userId)` - Close/expire job
- `recordJobView(jobId)` - Track job views
- `saveJob(jobId, userEmail)` - Bookmark job
- `unsaveJob(jobId, userEmail)` - Remove bookmark
- `isJobSaved(jobId, userEmail)` - Check if saved
- `getSavedJobs(userEmail)` - Get user's saved jobs
- `getFeaturedJobs(limit)` - Get featured jobs
- `getTrendingJobs(limit)` - Get trending jobs by views
- `getUserJobs(userId)` - Get user's posted jobs

### Application Service (`src/services/applicationService.ts`)

**Functions:**
- `createApplication(appData)` - Submit job application
- `getJobApplications(jobId, filters)` - Get applications for a job
- `getApplication(applicationId)` - Get single application
- `updateApplicationStatus(appId, status, notes)` - Update status
- `rateApplicant(appId, rating, notes)` - Rate applicant (1-5)
- `getApplicantStats(jobId)` - Get application statistics
- `getUserApplications(userEmail)` - Get user's applications
- `exportApplicationsToCSV(jobId)` - Export to CSV
- `deleteApplication(applicationId)` - Delete application
- `bulkUpdateApplications(ids, updates)` - Bulk update multiple

### Admin Service (`src/services/adminService.ts`)

**Functions:**
- `approveJob(jobId, adminId)` - Approve pending job
- `rejectJob(jobId, adminId, reason)` - Reject job
- `getPendingJobs(limit, offset)` - Get jobs pending approval
- `toggleJobFeature(jobId, featured, adminId)` - Feature/unfeature job
- `getDashboardStats()` - Get admin dashboard statistics
- `getAllJobsAdmin(filters)` - Get all jobs (all statuses)
- `logAudit(adminId, action, entityType, entityId, changes)` - Log audit trail
- `getAuditLogs(limit, offset)` - Get audit logs
- `sendNotification(userId, adminId, type, title, message)` - Send notification
- `getUnreadNotifications(userId, adminId)` - Get unread notifications
- `markNotificationAsRead(notificationId)` - Mark as read
- `bulkApproveJobs(jobIds, adminId)` - Bulk approve
- `bulkRejectJobs(jobIds, adminId, reason)` - Bulk reject

## Usage Examples

### Get All Jobs
```typescript
import { getJobs } from '@/services/jobService';

const { data, count, error } = await getJobs({
  category: 'NGO Jobs',
  job_type: 'Full Time',
  location: 'New Delhi',
  search: 'Manager',
  limit: 12,
  offset: 0
});
```

### Create Job Application
```typescript
import { createApplication } from '@/services/applicationService';

const { data, error } = await createApplication({
  job_id: '123-456',
  full_name: 'John Doe',
  email: 'john@example.com',
  mobile: '9876543210',
  whatsapp: '9876543210',
  city: 'Delhi',
  message: 'I am interested in this position',
  resume_url: 'https://storage.url/resume.pdf'
});
```

### Admin: Approve Job
```typescript
import { approveJob } from '@/services/adminService';

const { data, error } = await approveJob(jobId, adminId);
```

### Admin: Get Dashboard Stats
```typescript
import { getDashboardStats } from '@/services/adminService';

const { data, error } = await getDashboardStats();
// Returns: {
//   totalJobs: 150,
//   pendingJobs: 5,
//   totalApplications: 320,
//   totalUsers: 45,
//   jobsByCategory: { 'NGO Jobs': 50, ... },
//   applicationsByStatus: { applied: 200, ... }
// }
```

## Authentication

### User Registration (Admin)
```typescript
const { user, session } = await supabase.auth.signUp({
  email: 'admin@example.com',
  password: 'secure_password'
});

// Then insert into admin_users table
await supabase.from('admin_users').insert({
  id: user.id,
  email: user.email,
  full_name: 'Admin Name',
  role: 'admin'
});
```

### User Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Check Auth Status
```typescript
const { data: { session } } = await supabase.auth.getSession();

// Or listen for changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
});
```

## File Storage (Resume Upload)

### Upload Resume
```typescript
const fileName = `resumes/${Date.now()}-${fullName}.pdf`;

const { data, error } = await supabase.storage
  .from('applicant-documents')
  .upload(fileName, resumeFile);

if (!error) {
  const { data: publicUrl } = supabase.storage
    .from('applicant-documents')
    .getPublicUrl(fileName);
  
  const resumeUrl = publicUrl.publicUrl;
}
```

### Download Resume
```typescript
const { data, error } = await supabase.storage
  .from('applicant-documents')
  .download(filePath);

if (!error) {
  // Create download link
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}
```

## Real-time Features

### Listen to Job Insertions (Admins)
```typescript
supabase
  .channel('new-jobs')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'jobs',
      filter: `status=eq.pending`
    },
    (payload) => {
      console.log('New job pending approval:', payload.new);
    }
  )
  .subscribe();
```

### Listen to New Applications
```typescript
supabase
  .channel(`job-${jobId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'job_applications',
      filter: `job_id=eq.${jobId}`
    },
    (payload) => {
      console.log('New application:', payload.new);
    }
  )
  .subscribe();
```

## Performance Optimization

### Indexes
The schema includes indexes on:
- `jobs.user_id` - User's jobs
- `jobs.status` - Job listing
- `jobs.category` - Category filtering
- `jobs.location` - Location search
- `jobs.created_at` - Recent jobs
- `jobs.is_featured` - Featured jobs
- `job_applications.job_id` - Job's applications
- `job_applications.status` - Application filtering
- `job_views.job_id` - Job analytics

### Row Level Security (RLS)
- Improves security and privacy
- Automatically filters queries based on user
- Reduces data exposure

## Monitoring & Analytics

### Track Job Views
Automatically recorded when jobs are fetched:
```typescript
// Recorded in job_views table
{
  job_id: '...',
  user_ip_address: '...',
  user_agent: '...',
  referrer: '...',
  viewed_at: timestamp
}
```

### Job Statistics
```typescript
// Views count
job.views_count

// Applications count
job.applications_count

// Trending jobs
getTrendingJobs() // sorted by views_count
```

## Backup & Disaster Recovery

### Regular Backups
1. Supabase provides automatic daily backups
2. Access backups in Database → Backups
3. Configure backup retention period

### Export Data
```bash
# Backup database
pg_dump postgresql://user:password@host/db > backup.sql

# Export specific table
psql -c "COPY jobs TO STDOUT" > jobs.csv
```

## Deployment Checklist

- [ ] Verify all environment variables set
- [ ] Test database schema with sample data
- [ ] Configure authentication providers
- [ ] Set up storage bucket with correct policies
- [ ] Test file upload/download
- [ ] Verify RLS policies are working
- [ ] Set up notification system
- [ ] Configure email templates
- [ ] Test all API services
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Load test the database
- [ ] Deploy to production

## Troubleshooting

### Connection Issues
```typescript
// Check Supabase credentials
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test connection
const { data, error } = await supabase.from('jobs').select('count()');
```

### Authentication Issues
- Clear browser cache
- Check Supabase Auth settings
- Verify JWT token expiry
- Check allowed redirect URLs

### File Upload Issues
- Verify bucket exists and is public
- Check file size limits (5MB)
- Check MIME type (application/pdf)
- Verify storage policies

### Performance Issues
- Check table indexes exist
- Monitor query performance
- Enable query statistics
- Use pagination (limit/offset)

## Security Best Practices

1. **Row Level Security** - Enable on all tables
2. **API Keys** - Keep anon key public, store service key securely
3. **Passwords** - Hash before storage
4. **File Validation** - Validate file type and size
5. **SQL Injection** - Use parameterized queries
6. **CORS** - Configure allowed origins
7. **Rate Limiting** - Implement on API endpoints
8. **Audit Logging** - Log all admin actions
9. **Email Verification** - Verify email before operations
10. **Two-Factor Auth** - Enable for admin accounts

## Support & Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **RealtimeDB**: https://supabase.com/docs/realtime
- **Storage**: https://supabase.com/docs/guides/storage

## API Rate Limits

- Free tier: 50k requests/month
- Pro tier: Pay-as-you-go (additional requests)
- Plan upgrades in Supabase dashboard

---

**Last Updated**: February 27, 2026
**Backend Version**: 1.0.0
**Status**: Production Ready
