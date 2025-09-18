-- Clean Madhya Pradesh Dummy Data (Fixed ON CONFLICT issues)
-- This version removes problematic ON CONFLICT clauses

-- Create users in auth.users table (Supabase Auth table)
-- Note: In a real Supabase environment, users would be created through authentication
-- This is for testing purposes only
INSERT INTO auth.users (id, email, created_at, email_confirmed_at) VALUES
-- Bhopal Users
('550e8400-e29b-41d4-a716-446655441001', 'tiwari.bhopal@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441002', 'shukla.bhopal@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441003', 'dubey.bhopal@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441004', 'mishra.bhopal@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441005', 'jain.bhopal@example.com', NOW(), NOW()),

-- Indore Users
('550e8400-e29b-41d4-a716-446655441006', 'chouhan.indore@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441007', 'agrawal.indore@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441008', 'malviya.indore@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441009', 'soni.indore@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441010', 'bhargava.indore@example.com', NOW(), NOW()),

-- Gwalior Users
('550e8400-e29b-41d4-a716-446655441011', 'rajput.gwalior@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441012', 'sharma.gwalior@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441013', 'goyal.gwalior@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441014', 'singhal.gwalior@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441015', 'khandelwal.gwalior@example.com', NOW(), NOW()),

-- Jabalpur Users
('550e8400-e29b-41d4-a716-446655441016', 'verma.jabalpur@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441017', 'pathak.jabalpur@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441018', 'awasthi.jabalpur@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441019', 'pandey.jabalpur@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441020', 'chaturvedi.jabalpur@example.com', NOW(), NOW()),

-- Ujjain Users
('550e8400-e29b-41d4-a716-446655441021', 'upadhyay.ujjain@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441022', 'kulkarni.ujjain@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441023', 'joshi.ujjain@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441024', 'trivedi.ujjain@example.com', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655441025', 'vyas.ujjain@example.com', NOW(), NOW());

-- Insert profiles for Madhya Pradesh families
INSERT INTO profiles (id, full_name, city, community_name, original_family) VALUES
-- Bhopal Families
('550e8400-e29b-41d4-a716-446655441001', 'Tiwari Family', 'Bhopal', 'Madhya Pradesh Community', 'Tiwari'),
('550e8400-e29b-41d4-a716-446655441002', 'Shukla Family', 'Bhopal', 'Madhya Pradesh Community', 'Shukla'),
('550e8400-e29b-41d4-a716-446655441003', 'Dubey Family', 'Bhopal', 'Madhya Pradesh Community', 'Dubey'),
('550e8400-e29b-41d4-a716-446655441004', 'Mishra Family', 'Bhopal', 'Madhya Pradesh Community', 'Mishra'),
('550e8400-e29b-41d4-a716-446655441005', 'Jain Family', 'Bhopal', 'Madhya Pradesh Community', 'Jain'),

-- Indore Families
('550e8400-e29b-41d4-a716-446655441006', 'Chouhan Family', 'Indore', 'Madhya Pradesh Community', 'Chouhan'),
('550e8400-e29b-41d4-a716-446655441007', 'Agrawal Family', 'Indore', 'Madhya Pradesh Community', 'Agrawal'),
('550e8400-e29b-41d4-a716-446655441008', 'Malviya Family', 'Indore', 'Madhya Pradesh Community', 'Malviya'),
('550e8400-e29b-41d4-a716-446655441009', 'Soni Family', 'Indore', 'Madhya Pradesh Community', 'Soni'),
('550e8400-e29b-41d4-a716-446655441010', 'Bhargava Family', 'Indore', 'Madhya Pradesh Community', 'Bhargava'),

-- Gwalior Families
('550e8400-e29b-41d4-a716-446655441011', 'Rajput Family', 'Gwalior', 'Madhya Pradesh Community', 'Rajput'),
('550e8400-e29b-41d4-a716-446655441012', 'Sharma Family', 'Gwalior', 'Madhya Pradesh Community', 'Sharma'),
('550e8400-e29b-41d4-a716-446655441013', 'Goyal Family', 'Gwalior', 'Madhya Pradesh Community', 'Goyal'),
('550e8400-e29b-41d4-a716-446655441014', 'Singhal Family', 'Gwalior', 'Madhya Pradesh Community', 'Singhal'),
('550e8400-e29b-41d4-a716-446655441015', 'Khandelwal Family', 'Gwalior', 'Madhya Pradesh Community', 'Khandelwal'),

-- Jabalpur Families
('550e8400-e29b-41d4-a716-446655441016', 'Verma Family', 'Jabalpur', 'Madhya Pradesh Community', 'Verma'),
('550e8400-e29b-41d4-a716-446655441017', 'Pathak Family', 'Jabalpur', 'Madhya Pradesh Community', 'Pathak'),
('550e8400-e29b-41d4-a716-446655441018', 'Awasthi Family', 'Jabalpur', 'Madhya Pradesh Community', 'Awasthi'),
('550e8400-e29b-41d4-a716-446655441019', 'Pandey Family', 'Jabalpur', 'Madhya Pradesh Community', 'Pandey'),
('550e8400-e29b-41d4-a716-446655441020', 'Chaturvedi Family', 'Jabalpur', 'Madhya Pradesh Community', 'Chaturvedi'),

-- Ujjain Families
('550e8400-e29b-41d4-a716-446655441021', 'Upadhyay Family', 'Ujjain', 'Madhya Pradesh Community', 'Upadhyay'),
('550e8400-e29b-41d4-a716-446655441022', 'Kulkarni Family', 'Ujjain', 'Madhya Pradesh Community', 'Kulkarni'),
('550e8400-e29b-41d4-a716-446655441023', 'Joshi Family', 'Ujjain', 'Madhya Pradesh Community', 'Joshi'),
('550e8400-e29b-41d4-a716-446655441024', 'Trivedi Family', 'Ujjain', 'Madhya Pradesh Community', 'Trivedi'),
('550e8400-e29b-41d4-a716-446655441025', 'Vyas Family', 'Ujjain', 'Madhya Pradesh Community', 'Vyas');

-- Family members data for Madhya Pradesh families

-- Tiwari Family (Bhopal) - 6 members
INSERT INTO family_members (user_id, name, relationship, age, gender, profession, birth_year, generation_level, family_role, is_family_head, spouse_family, spouse_city, marriage_year, notable_contributions) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'Ramesh Tiwari', 'spouse', 52, 'male', 'IAS Officer', 1971, 3, 'Father', true, NULL, NULL, 1998, 'Administrative reforms advocate'),
('550e8400-e29b-41d4-a716-446655441001', 'Sunita Tiwari', 'spouse', 49, 'female', 'College Principal', 1974, 3, 'Mother', false, 'Shukla', 'Bhopal', 1998, 'Higher education promoter'),
('550e8400-e29b-41d4-a716-446655441001', 'Aaditya Tiwari', 'child', 24, 'male', 'Civil Services Aspirant', 1999, 4, 'Son', false, NULL, NULL, NULL, 'Youth leadership program coordinator'),
('550e8400-e29b-41d4-a716-446655441001', 'Anushka Tiwari', 'child', 21, 'female', 'Law Student', 2002, 4, 'Daughter', false, NULL, NULL, NULL, 'Legal aid volunteer'),
('550e8400-e29b-41d4-a716-446655441001', 'Vishwanath Tiwari', 'parent', 78, 'male', 'Retired District Collector', 1945, 2, 'Grandfather', false, NULL, NULL, 1968, 'Rural development pioneer'),
('550e8400-e29b-41d4-a716-446655441001', 'Kamala Tiwari', 'parent', 75, 'female', 'Retired School Principal', 1948, 2, 'Grandmother', false, 'Dubey', 'Sagar', 1968, 'Women education advocate'),

-- Shukla Family (Bhopal) - 5 members
('550e8400-e29b-41d4-a716-446655441002', 'Manoj Shukla', 'spouse', 50, 'male', 'Railway Officer', 1973, 3, 'Father', true, NULL, NULL, 2000, 'Transport infrastructure advocate'),
('550e8400-e29b-41d4-a716-446655441002', 'Kavita Shukla', 'spouse', 47, 'female', 'Government Doctor', 1976, 3, 'Mother', false, 'Mishra', 'Bhopal', 2000, 'Public health advocate'),
('550e8400-e29b-41d4-a716-446655441002', 'Rohit Shukla', 'child', 22, 'male', 'Engineering Student', 2001, 4, 'Son', false, NULL, NULL, NULL, 'Technical innovation enthusiast'),
('550e8400-e29b-41d4-a716-446655441002', 'Shreya Shukla', 'child', 19, 'female', 'Medical Student', 2004, 4, 'Daughter', false, NULL, NULL, NULL, 'Medical volunteer'),
('550e8400-e29b-41d4-a716-446655441002', 'Gopal Shukla', 'parent', 76, 'male', 'Retired Station Master', 1947, 2, 'Grandfather', false, NULL, NULL, 1970, 'Railway service veteran'),

-- Dubey Family (Bhopal) - 4 members
('550e8400-e29b-41d4-a716-446655441003', 'Prakash Dubey', 'spouse', 48, 'male', 'Sanskrit Professor', 1975, 3, 'Father', true, NULL, NULL, 2001, 'Sanskrit literature preservation'),
('550e8400-e29b-41d4-a716-446655441003', 'Sarita Dubey', 'spouse', 45, 'female', 'Classical Music Teacher', 1978, 3, 'Mother', false, 'Jain', 'Bhopal', 2001, 'Traditional music promotion'),
('550e8400-e29b-41d4-a716-446655441003', 'Vaibhav Dubey', 'child', 21, 'male', 'Sanskrit Studies Student', 2002, 4, 'Son', false, NULL, NULL, NULL, 'Ancient texts research volunteer'),
('550e8400-e29b-41d4-a716-446655441003', 'Riya Dubey', 'child', 18, 'female', 'Music Student', 2005, 4, 'Daughter', false, NULL, NULL, NULL, 'Classical music performer'),

-- Mishra Family (Bhopal) - 6 members
('550e8400-e29b-41d4-a716-446655441004', 'Ajay Mishra', 'spouse', 54, 'male', 'Forest Officer', 1969, 3, 'Father', true, NULL, NULL, 1995, 'Wildlife conservation advocate'),
('550e8400-e29b-41d4-a716-446655441004', 'Meera Mishra', 'spouse', 51, 'female', 'Botanical Researcher', 1972, 3, 'Mother', false, 'Tiwari', 'Bhopal', 1995, 'Medicinal plants research'),
('550e8400-e29b-41d4-a716-446655441004', 'Arjun Mishra', 'child', 27, 'male', 'Environmental Engineer', 1996, 4, 'Son', false, NULL, NULL, 2022, 'Sustainable development advocate'),
('550e8400-e29b-41d4-a716-446655441004', 'Priyanka Mishra', 'child', 24, 'female', 'Forest Ranger', 1999, 4, 'Daughter', false, NULL, NULL, NULL, 'Wildlife protection volunteer'),
('550e8400-e29b-41d4-a716-446655441004', 'Harish Mishra', 'parent', 81, 'male', 'Retired Forest Officer', 1942, 2, 'Grandfather', false, NULL, NULL, 1963, 'Forest conservation pioneer'),
('550e8400-e29b-41d4-a716-446655441004', 'Rukmani Mishra', 'parent', 78, 'female', 'Retired Ayurveda Practitioner', 1945, 2, 'Grandmother', false, 'Pathak', 'Jabalpur', 1963, 'Traditional medicine expert'),

-- Jain Family (Bhopal) - 3 members
('550e8400-e29b-41d4-a716-446655441005', 'Vikash Jain', 'spouse', 46, 'male', 'Textile Business', 1977, 3, 'Father', true, NULL, NULL, 2003, 'Handloom promotion advocate'),
('550e8400-e29b-41d4-a716-446655441005', 'Pooja Jain', 'spouse', 43, 'female', 'Fashion Designer', 1980, 3, 'Mother', false, 'Agrawal', 'Indore', 2003, 'Women entrepreneur'),
('550e8400-e29b-41d4-a716-446655441005', 'Aryan Jain', 'child', 18, 'male', 'Commerce Student', 2005, 4, 'Son', false, NULL, NULL, NULL, 'Young entrepreneur'),

-- Chouhan Family (Indore) - 5 members
('550e8400-e29b-41d4-a716-446655441006', 'Shivraj Chouhan', 'spouse', 49, 'male', 'Political Leader', 1974, 3, 'Father', true, NULL, NULL, 1999, 'Rural development advocate'),
('550e8400-e29b-41d4-a716-446655441006', 'Sadhna Chouhan', 'spouse', 46, 'female', 'Social Worker', 1977, 3, 'Mother', false, 'Malviya', 'Indore', 1999, 'Women empowerment leader'),
('550e8400-e29b-41d4-a716-446655441006', 'Kartik Chouhan', 'child', 23, 'male', 'Public Administration Student', 2000, 4, 'Son', false, NULL, NULL, NULL, 'Youth political activist'),
('550e8400-e29b-41d4-a716-446655441006', 'Khushi Chouhan', 'child', 20, 'female', 'Social Work Student', 2003, 4, 'Daughter', false, NULL, NULL, NULL, 'Community service volunteer'),
('550e8400-e29b-41d4-a716-446655441006', 'Virendra Chouhan', 'parent', 77, 'male', 'Retired Farmer Leader', 1946, 2, 'Grandfather', false, NULL, NULL, 1971, 'Agricultural cooperative pioneer'),

-- Agrawal Family (Indore) - 4 members
('550e8400-e29b-41d4-a716-446655441007', 'Rajesh Agrawal', 'spouse', 51, 'male', 'Pharmaceutical Business', 1972, 3, 'Father', true, NULL, NULL, 1997, 'Healthcare accessibility advocate'),
('550e8400-e29b-41d4-a716-446655441007', 'Sushma Agrawal', 'spouse', 48, 'female', 'Pharmacist', 1975, 3, 'Mother', false, 'Soni', 'Indore', 1997, 'Medicine awareness promoter'),
('550e8400-e29b-41d4-a716-446655441007', 'Nikhil Agrawal', 'child', 25, 'male', 'Pharmaceutical Engineer', 1998, 4, 'Son', false, NULL, NULL, NULL, 'Drug research volunteer'),
('550e8400-e29b-41d4-a716-446655441007', 'Nikita Agrawal', 'child', 22, 'female', 'Pharmacy Student', 2001, 4, 'Daughter', false, NULL, NULL, NULL, 'Health camp organizer'),

-- Rajput Family (Gwalior) - 5 members
('550e8400-e29b-41d4-a716-446655441011', 'Maharaj Singh Rajput', 'spouse', 56, 'male', 'Heritage Tourism', 1967, 3, 'Father', true, NULL, NULL, 1990, 'Cultural heritage preservation'),
('550e8400-e29b-41d4-a716-446655441011', 'Rani Rajput', 'spouse', 53, 'female', 'Classical Dance Teacher', 1970, 3, 'Mother', false, 'Sharma', 'Gwalior', 1990, 'Traditional arts promotion'),
('550e8400-e29b-41d4-a716-446655441011', 'Yuvraj Rajput', 'child', 32, 'male', 'Tourism Manager', 1991, 4, 'Son', false, NULL, NULL, 2018, 'Heritage tourism advocate'),
('550e8400-e29b-41d4-a716-446655441011', 'Kumari Rajput', 'child', 29, 'female', 'Museum Curator', 1994, 4, 'Daughter', false, NULL, NULL, NULL, 'Art preservation expert'),
('550e8400-e29b-41d4-a716-446655441011', 'Maharaja Rajput', 'parent', 84, 'male', 'Former Royal Family', 1939, 2, 'Grandfather', false, NULL, NULL, 1958, 'Cultural tradition keeper'),

-- Verma Family (Jabalpur) - 5 members
('550e8400-e29b-41d4-a716-446655441016', 'Rajeev Verma', 'spouse', 51, 'male', 'Geology Professor', 1972, 3, 'Father', true, NULL, NULL, 1997, 'Geological research advocate'),
('550e8400-e29b-41d4-a716-446655441016', 'Seema Verma', 'spouse', 48, 'female', 'Geography Teacher', 1975, 3, 'Mother', false, 'Pathak', 'Jabalpur', 1997, 'Environmental geography education'),
('550e8400-e29b-41d4-a716-446655441016', 'Aman Verma', 'child', 25, 'male', 'Mining Engineer', 1998, 4, 'Son', false, NULL, NULL, NULL, 'Sustainable mining advocate'),
('550e8400-e29b-41d4-a716-446655441016', 'Pooja Verma', 'child', 22, 'female', 'Environmental Science Student', 2001, 4, 'Daughter', false, NULL, NULL, NULL, 'Climate change activist'),
('550e8400-e29b-41d4-a716-446655441016', 'Jagdish Verma', 'parent', 78, 'male', 'Retired Geologist', 1945, 2, 'Grandfather', false, NULL, NULL, 1969, 'Mineral exploration pioneer'),

-- Upadhyay Family (Ujjain) - 5 members
('550e8400-e29b-41d4-a716-446655441021', 'Pandit Ram Upadhyay', 'spouse', 58, 'male', 'Temple Priest', 1965, 3, 'Father', true, NULL, NULL, 1988, 'Religious tradition preservation'),
('550e8400-e29b-41d4-a716-446655441021', 'Sita Upadhyay', 'spouse', 55, 'female', 'Sanskrit Scholar', 1968, 3, 'Mother', false, 'Kulkarni', 'Ujjain', 1988, 'Vedic studies promotion'),
('550e8400-e29b-41d4-a716-446655441021', 'Shyam Upadhyay', 'child', 34, 'male', 'Astrologer', 1989, 4, 'Son', false, NULL, NULL, 2015, 'Vedic astrology practice'),
('550e8400-e29b-41d4-a716-446655441021', 'Radha Upadhyay', 'child', 31, 'female', 'Sanskrit Teacher', 1992, 4, 'Daughter', false, NULL, NULL, NULL, 'Ancient language education'),
('550e8400-e29b-41d4-a716-446655441021', 'Gopal Upadhyay', 'parent', 85, 'male', 'Former Temple Head Priest', 1938, 2, 'Grandfather', false, NULL, NULL, 1957, 'Spiritual tradition keeper'),

-- Joshi Family (Ujjain) - 6 members
('550e8400-e29b-41d4-a716-446655441023', 'Mohan Joshi', 'spouse', 54, 'male', 'Astronomical Research', 1969, 3, 'Father', true, NULL, NULL, 1993, 'Ancient astronomy revival'),
('550e8400-e29b-41d4-a716-446655441023', 'Saroj Joshi', 'spouse', 51, 'female', 'Mathematics Teacher', 1972, 3, 'Mother', false, 'Trivedi', 'Ujjain', 1993, 'Vedic mathematics education'),
('550e8400-e29b-41d4-a716-446655441023', 'Aditya Joshi', 'child', 29, 'male', 'Astrophysicist', 1994, 4, 'Son', false, NULL, NULL, 2021, 'Space research advocate'),
('550e8400-e29b-41d4-a716-446655441023', 'Deepika Joshi', 'child', 26, 'female', 'Mathematics Professor', 1997, 4, 'Daughter', false, NULL, NULL, NULL, 'Mathematical education innovator'),
('550e8400-e29b-41d4-a716-446655441023', 'Shankar Joshi', 'parent', 82, 'male', 'Former Observatory Keeper', 1941, 2, 'Grandfather', false, NULL, NULL, 1960, 'Traditional astronomy expert'),
('550e8400-e29b-41d4-a716-446655441023', 'Ganga Joshi', 'parent', 79, 'female', 'Retired Mathematics Teacher', 1944, 2, 'Grandmother', false, 'Vyas', 'Indore', 1960, 'Women mathematics education pioneer');