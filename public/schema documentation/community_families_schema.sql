-- Extended Family Data Schema for Community Family Directory
-- This extends the existing family_members table to support comprehensive family tracking

-- Add columns to existing family_members table
ALTER TABLE family_members
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS generation_level INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS spouse_family VARCHAR(255),
ADD COLUMN IF NOT EXISTS spouse_city VARCHAR(255),
ADD COLUMN IF NOT EXISTS marriage_year INTEGER,
ADD COLUMN IF NOT EXISTS notable_contributions TEXT,
ADD COLUMN IF NOT EXISTS family_role VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_family_head BOOLEAN DEFAULT FALSE;

-- Add columns to profiles table for community tracking
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS community_name VARCHAR(255) DEFAULT 'Community',
ADD COLUMN IF NOT EXISTS city VARCHAR(255),
ADD COLUMN IF NOT EXISTS original_family VARCHAR(255),
ADD COLUMN IF NOT EXISTS family_lineage JSONB;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_family_members_city ON family_members(spouse_city);
CREATE INDEX IF NOT EXISTS idx_family_members_generation ON family_members(generation_level);
CREATE INDEX IF NOT EXISTS idx_family_members_birth_year ON family_members(birth_year);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_community ON profiles(community_name);

-- Create view for community family directory
CREATE OR REPLACE VIEW community_family_directory AS
SELECT
    fm.*,
    p.full_name as family_head_name,
    p.city,
    p.community_name,
    p.original_family,
    CASE
        WHEN fm.birth_year IS NOT NULL THEN fm.birth_year
        WHEN fm.age IS NOT NULL THEN EXTRACT(YEAR FROM CURRENT_DATE) - fm.age
        ELSE NULL
    END as calculated_birth_year,
    CASE
        WHEN fm.relationship = 'grandparent' THEN 1
        WHEN fm.relationship = 'parent' THEN 2
        WHEN fm.relationship IN ('spouse', 'sibling') THEN 3
        WHEN fm.relationship = 'child' THEN 4
        WHEN fm.relationship = 'grandchild' THEN 5
        ELSE 3
    END as calculated_generation_level
FROM family_members fm
LEFT JOIN profiles p ON fm.user_id = p.id
ORDER BY p.city, p.full_name, fm.generation_level, fm.age DESC;

-- Function to get family hierarchy
CREATE OR REPLACE FUNCTION get_family_hierarchy(family_user_id UUID)
RETURNS TABLE (
    member_id UUID,
    member_name VARCHAR,
    relationship VARCHAR,
    generation_level INTEGER,
    birth_year INTEGER,
    city VARCHAR,
    married_into JSONB,
    family_role VARCHAR,
    notable_contributions TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fm.id as member_id,
        fm.name as member_name,
        fm.relationship,
        COALESCE(fm.generation_level,
            CASE
                WHEN fm.relationship = 'grandparent' THEN 1
                WHEN fm.relationship = 'parent' THEN 2
                WHEN fm.relationship IN ('spouse', 'sibling') THEN 3
                WHEN fm.relationship = 'child' THEN 4
                WHEN fm.relationship = 'grandchild' THEN 5
                ELSE 3
            END
        ) as generation_level,
        COALESCE(fm.birth_year,
            CASE
                WHEN fm.age IS NOT NULL THEN EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - fm.age
                ELSE NULL
            END
        ) as birth_year,
        COALESCE(fm.spouse_city, p.city) as city,
        CASE
            WHEN fm.spouse_family IS NOT NULL THEN
                json_build_object(
                    'family', fm.spouse_family,
                    'city', fm.spouse_city,
                    'marriage_year', fm.marriage_year
                )
            ELSE NULL
        END as married_into,
        COALESCE(fm.family_role, fm.relationship) as family_role,
        fm.notable_contributions
    FROM family_members fm
    LEFT JOIN profiles p ON fm.user_id = p.id
    WHERE fm.user_id = family_user_id
    ORDER BY generation_level, fm.age DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get community families by city
CREATE OR REPLACE FUNCTION get_community_families_by_city(target_city VARCHAR DEFAULT NULL)
RETURNS TABLE (
    family_id UUID,
    family_head_name VARCHAR,
    city VARCHAR,
    community_name VARCHAR,
    member_count BIGINT,
    generations_present INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id as family_id,
        p.full_name as family_head_name,
        p.city,
        p.community_name,
        COUNT(fm.id) as member_count,
        ARRAY_AGG(DISTINCT
            COALESCE(fm.generation_level,
                CASE
                    WHEN fm.relationship = 'grandparent' THEN 1
                    WHEN fm.relationship = 'parent' THEN 2
                    WHEN fm.relationship IN ('spouse', 'sibling') THEN 3
                    WHEN fm.relationship = 'child' THEN 4
                    WHEN fm.relationship = 'grandchild' THEN 5
                    ELSE 3
                END
            ) ORDER BY COALESCE(fm.generation_level,
                CASE
                    WHEN fm.relationship = 'grandparent' THEN 1
                    WHEN fm.relationship = 'parent' THEN 2
                    WHEN fm.relationship IN ('spouse', 'sibling') THEN 3
                    WHEN fm.relationship = 'child' THEN 4
                    WHEN fm.relationship = 'grandchild' THEN 5
                    ELSE 3
                END
            )
        ) as generations_present
    FROM profiles p
    LEFT JOIN family_members fm ON p.id = fm.user_id
    WHERE (target_city IS NULL OR p.city = target_city)
    AND fm.id IS NOT NULL
    GROUP BY p.id, p.full_name, p.city, p.community_name
    ORDER BY p.city, p.full_name;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
/*
INSERT INTO profiles (id, full_name, city, community_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sharma Family', 'Mumbai', 'Maharashtra Community'),
('550e8400-e29b-41d4-a716-446655440002', 'Patel Family', 'Ahmedabad', 'Gujarat Community'),
('550e8400-e29b-41d4-a716-446655440003', 'Singh Family', 'Delhi', 'Delhi Community');

INSERT INTO family_members (user_id, name, relationship, age, gender, profession, birth_year, generation_level, family_role) VALUES
-- Sharma Family
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh Sharma', 'spouse', 45, 'male', 'Engineer', 1978, 3, 'Father'),
('550e8400-e29b-41d4-a716-446655440001', 'Priya Sharma', 'spouse', 42, 'female', 'Teacher', 1981, 3, 'Mother'),
('550e8400-e29b-41d4-a716-446655440001', 'Arjun Sharma', 'child', 20, 'male', 'Student', 2003, 4, 'Son'),
('550e8400-e29b-41d4-a716-446655440001', 'Meera Sharma', 'child', 18, 'female', 'Student', 2005, 4, 'Daughter'),
('550e8400-e29b-41d4-a716-446655440001', 'Ram Sharma', 'parent', 70, 'male', 'Retired', 1953, 2, 'Grandfather');
*/