-- ============================================
-- MERI PAHAL JOB PORTAL DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. USERS TABLE (Admin/Recruiter Accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  organization_name VARCHAR(255),
  mobile VARCHAR(20),
  whatsapp VARCHAR(20),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'recruiter', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 2. JOBS TABLE (Job Postings)
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('NGO Jobs', 'Private Jobs', 'Artist Jobs', 'Work From Home', 'Local Jobs', 'Government Jobs')),
  job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('Full Time', 'Part Time', 'Volunteer', 'Contract', 'Internship')),
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT,
  organization_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed', 'expired')),
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  applications_count INT DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 3. JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  message TEXT,
  resume_url VARCHAR(500),
  resume_file_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'accepted', 'on_hold')),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. JOB SAVES TABLE (Bookmarked Jobs)
-- ============================================
CREATE TABLE IF NOT EXISTS job_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, user_email)
);

-- ============================================
-- 5. ADMIN USERS TABLE (Supabase Auth Users)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions TEXT[] DEFAULT ARRAY['manage_jobs', 'manage_applications'],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. JOB VIEWS TABLE (Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS job_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_ip_address INET,
  user_agent VARCHAR(500),
  referrer VARCHAR(500),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('job_applied', 'job_approved', 'job_rejected', 'new_application', 'message')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 8. AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON job_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_saves_user_email ON job_saves(user_email);
CREATE INDEX IF NOT EXISTS idx_job_saves_job_id ON job_saves(job_id);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

CREATE INDEX IF NOT EXISTS idx_job_views_job_id ON job_views(job_id);
CREATE INDEX IF NOT EXISTS idx_job_views_viewed_at ON job_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Anyone can view approved jobs
CREATE POLICY "Anyone can view approved jobs" ON jobs
  FOR SELECT USING (status = 'approved');

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs" ON jobs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = TRUE)
  );

-- Job posters can view/update their own jobs
CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (user_id = auth.uid());

-- Anyone can view job applications for approved jobs
CREATE POLICY "Anyone can create job applications" ON job_applications
  FOR INSERT WITH CHECK (
    job_id IN (SELECT id FROM jobs WHERE status = 'approved')
  );

-- Job posters can view applications for their jobs
CREATE POLICY "Job posters can view applications" ON job_applications
  FOR SELECT USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
  );

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON job_applications
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = TRUE)
  );

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample category options (if needed as enum table)
-- This helps with data consistency

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update jobs.updated_at
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for jobs updated_at
DROP TRIGGER IF EXISTS trigger_update_jobs_updated_at ON jobs;
CREATE TRIGGER trigger_update_jobs_updated_at
  BEFORE UPDATE
  ON jobs
  FOR EACH ROW
  EXECUTE PROCEDURE update_jobs_updated_at();

-- Function to update job_applications.updated_at
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for job_applications updated_at
DROP TRIGGER IF EXISTS trigger_update_applications_updated_at ON job_applications;
CREATE TRIGGER trigger_update_applications_updated_at
  BEFORE UPDATE
  ON job_applications
  FOR EACH ROW
  EXECUTE PROCEDURE update_applications_updated_at();

-- Function to update users.updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users updated_at
DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;
CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE
  ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_users_updated_at();

-- Function to increment job views count
CREATE OR REPLACE FUNCTION increment_job_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET views_count = views_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for job views
DROP TRIGGER IF EXISTS trigger_increment_job_views ON job_views;
CREATE TRIGGER trigger_increment_job_views
  AFTER INSERT
  ON job_views
  FOR EACH ROW
  EXECUTE PROCEDURE increment_job_views();

-- Function to increment applications count
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for applications count
DROP TRIGGER IF EXISTS trigger_increment_applications_count ON job_applications;
CREATE TRIGGER trigger_increment_applications_count
  AFTER INSERT
  ON job_applications
  FOR EACH ROW
  EXECUTE PROCEDURE increment_applications_count();
