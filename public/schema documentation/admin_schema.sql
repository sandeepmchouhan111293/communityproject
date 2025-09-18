-- Admin Functionality Schema for Community Family Directory
-- This file creates tables and functions needed for comprehensive admin features

-- User Roles and Permissions
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);

-- Create roles enum constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'contributor', 'viewer');
    END IF;
END
$$;

-- Update role column to use enum (handle default value properly)
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'viewer';

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, EXPORT, etc.
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin Sessions Table (for enhanced security)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP DEFAULT NOW()
);

-- Data Import/Export Jobs Table
CREATE TABLE IF NOT EXISTS data_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- 'import' or 'export'
    table_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    file_url TEXT,
    progress INTEGER DEFAULT 0,
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    error_log TEXT,
    metadata JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Events Table (extend existing)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS max_volunteers INTEGER,
ADD COLUMN IF NOT EXISTS volunteer_requirements TEXT,
ADD COLUMN IF NOT EXISTS approval_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Enhanced Volunteer Table
ALTER TABLE volunteer
ADD COLUMN IF NOT EXISTS hours_logged DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS impact_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Enhanced Documents Table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS access_level VARCHAR(20) DEFAULT 'public', -- public, private, restricted
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS member_id BIGINT REFERENCES family_members(id),
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Data Quality Issues Table
CREATE TABLE IF NOT EXISTS data_quality_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    issue_type VARCHAR(100) NOT NULL, -- duplicate, incomplete, invalid, suspicious
    description TEXT,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved, ignored
    detected_by VARCHAR(20) DEFAULT 'system', -- system, user, admin
    detected_at TIMESTAMP DEFAULT NOW(),
    assigned_to UUID REFERENCES profiles(id),
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL, -- welcome, approval_needed, data_issue, etc.
    title TEXT NOT NULL,
    message TEXT,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    read_at TIMESTAMP,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category, key)
);

-- Backup Logs Table
CREATE TABLE IF NOT EXISTS backup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_type VARCHAR(50) NOT NULL, -- full, incremental, table_specific
    status VARCHAR(20) NOT NULL, -- started, completed, failed
    file_path TEXT,
    file_size BIGINT,
    tables_included TEXT[],
    started_by UUID REFERENCES profiles(id),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_data_jobs_user_id ON data_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_data_jobs_status ON data_jobs(status);
CREATE INDEX IF NOT EXISTS idx_data_jobs_job_type ON data_jobs(job_type);

CREATE INDEX IF NOT EXISTS idx_data_quality_issues_table_record ON data_quality_issues(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_data_quality_issues_status ON data_quality_issues(status);
CREATE INDEX IF NOT EXISTS idx_data_quality_issues_severity ON data_quality_issues(severity);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Create admin functions

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action VARCHAR,
    p_table_name VARCHAR DEFAULT NULL,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id,
        old_values, new_values, metadata
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id,
        p_old_values, p_new_values, p_metadata
    ) RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_permission VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
    user_permissions JSONB;
BEGIN
    SELECT role, permissions INTO user_role, user_permissions
    FROM profiles WHERE id = p_user_id;

    -- Admin has all permissions
    IF user_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- Check specific permission in permissions JSON
    IF user_permissions ? p_permission THEN
        RETURN (user_permissions ->> p_permission)::BOOLEAN;
    END IF;

    -- Default role-based permissions
    CASE user_role
        WHEN 'contributor' THEN
            RETURN p_permission IN ('read', 'create', 'update_own');
        WHEN 'viewer' THEN
            RETURN p_permission = 'read';
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    pending_approvals BIGINT,
    admin_users BIGINT,
    contributor_users BIGINT,
    viewer_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::BIGINT as active_users,
        COUNT(CASE WHEN approved_at IS NULL THEN 1 END)::BIGINT as pending_approvals,
        COUNT(CASE WHEN role = 'admin' THEN 1 END)::BIGINT as admin_users,
        COUNT(CASE WHEN role = 'contributor' THEN 1 END)::BIGINT as contributor_users,
        COUNT(CASE WHEN role = 'viewer' THEN 1 END)::BIGINT as viewer_users
    FROM profiles;
END;
$$ LANGUAGE plpgsql;

-- Function to get family statistics
CREATE OR REPLACE FUNCTION get_family_statistics()
RETURNS TABLE (
    total_families BIGINT,
    total_members BIGINT,
    avg_family_size NUMERIC,
    cities_count BIGINT,
    recent_additions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT user_id)::BIGINT as total_families,
        COUNT(*)::BIGINT as total_members,
        ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT user_id), 2) as avg_family_size,
        COUNT(DISTINCT p.city)::BIGINT as cities_count,
        COUNT(CASE WHEN fm.created_at > NOW() - INTERVAL '30 days' THEN 1 END)::BIGINT as recent_additions
    FROM family_members fm
    LEFT JOIN profiles p ON fm.user_id = p.id;
END;
$$ LANGUAGE plpgsql;

-- Function to detect data quality issues
CREATE OR REPLACE FUNCTION detect_data_quality_issues()
RETURNS INTEGER AS $$
DECLARE
    issues_detected INTEGER := 0;
    additional_issues INTEGER := 0;
BEGIN
    -- Detect duplicate family members (same name, age, relationship in same family)
    INSERT INTO data_quality_issues (table_name, record_id, issue_type, description, severity)
    SELECT
        'family_members',
        fm1.id,
        'duplicate',
        'Potential duplicate: Same name, age, and relationship in family',
        'medium'
    FROM family_members fm1
    JOIN family_members fm2 ON fm1.user_id = fm2.user_id
        AND fm1.name = fm2.name
        AND fm1.age = fm2.age
        AND fm1.relationship = fm2.relationship
        AND fm1.id < fm2.id
    WHERE NOT EXISTS (
        SELECT 1 FROM data_quality_issues
        WHERE table_name = 'family_members'
        AND record_id = fm1.id
        AND issue_type = 'duplicate'
        AND status = 'open'
    );

    GET DIAGNOSTICS issues_detected = ROW_COUNT;

    -- Detect incomplete profiles
    INSERT INTO data_quality_issues (table_name, record_id, issue_type, description, severity)
    SELECT
        'profiles',
        id,
        'incomplete',
        'Profile missing essential information',
        'low'
    FROM profiles
    WHERE (full_name IS NULL OR full_name = '')
       OR (city IS NULL OR city = '')
    AND NOT EXISTS (
        SELECT 1 FROM data_quality_issues
        WHERE table_name = 'profiles'
        AND record_id = profiles.id
        AND issue_type = 'incomplete'
        AND status = 'open'
    );

    GET DIAGNOSTICS additional_issues = ROW_COUNT;
    issues_detected := issues_detected + additional_issues;

    RETURN issues_detected;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies for admin access
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admin can see all audit logs
CREATE POLICY admin_audit_logs_all ON audit_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Users can see their own audit logs
CREATE POLICY user_audit_logs_own ON audit_logs
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Similar policies for other admin tables
CREATE POLICY admin_sessions_policy ON admin_sessions
    FOR ALL TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY data_jobs_policy ON data_jobs
    FOR ALL TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY notifications_policy ON notifications
    FOR ALL TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default system settings
INSERT INTO system_settings (category, key, value, description, is_public) VALUES
('app', 'name', 'Community Family Directory', 'Application name', true),
('app', 'version', '1.0.0', 'Application version', true),
('security', 'require_approval', 'true', 'Require admin approval for new users', false),
('security', 'session_timeout', '3600', 'Session timeout in seconds', false),
('backup', 'auto_backup_enabled', 'true', 'Enable automatic backups', false),
('backup', 'backup_retention_days', '30', 'Days to retain backups', false),
('notifications', 'email_enabled', 'false', 'Enable email notifications', false),
('data', 'max_file_size_mb', '10', 'Maximum file upload size in MB', false),
('data', 'allowed_file_types', '["pdf","jpg","jpeg","png","doc","docx"]', 'Allowed file types for upload', false)
ON CONFLICT (category, key) DO NOTHING;