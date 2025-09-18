-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location TEXT,
  description TEXT,
  organizer TEXT,
  rsvp_limit INTEGER,
  current_rsvps INTEGER DEFAULT 0,
  category TEXT
);

-- Volunteer Table
CREATE TABLE volunteer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_id UUID REFERENCES events(id),
  role TEXT,
  status TEXT,
  joined_at TIMESTAMP DEFAULT now()
);

-- Discussions Table
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT now()
);

-- Directory Table
CREATE TABLE directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_info TEXT,
  address TEXT,
  type TEXT
);

-- Settings Table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  key TEXT NOT NULL,
  value TEXT
);
