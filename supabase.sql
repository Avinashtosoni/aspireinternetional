-- Supabase Schema for Aspire School CMS
-- Copy and paste this directly into the Supabase SQL Editor and hit "Run".

-- 1. Create Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    bio TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Facilities Table
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide React icon name, e.g., "Library", "FlaskConical"
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Stats Table
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    suffix TEXT DEFAULT '+',
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create School Settings Table
CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Admin',
    image_url TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Parent',
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER DEFAULT 5,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- TEAMS
CREATE POLICY "Allow public read access to team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to team" ON public.team_members FOR ALL USING (auth.role() = 'authenticated');

-- FACILITIES
CREATE POLICY "Allow public read access to facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to facilities" ON public.facilities FOR ALL USING (auth.role() = 'authenticated');

-- STATS
CREATE POLICY "Allow public read access to stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to stats" ON public.stats FOR ALL USING (auth.role() = 'authenticated');

-- SCHOOL SETTINGS
CREATE POLICY "Allow public read access to settings" ON public.school_settings FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to settings" ON public.school_settings FOR ALL USING (auth.role() = 'authenticated');

-- NOTICES
CREATE POLICY "Allow public read access to notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to notices" ON public.notices FOR ALL USING (auth.role() = 'authenticated');

-- EVENTS
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to events" ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- BLOGS
CREATE POLICY "Allow public read access to blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to blogs" ON public.blogs FOR ALL USING (auth.role() = 'authenticated');

-- TESTIMONIALS
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow auth write access to testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- ENQUIRIES (Public can Insert, Auth can View/Edit/Delete)
CREATE POLICY "Allow public insert to enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth select to enquiries" ON public.enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update to enquiries" ON public.enquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete to enquiries" ON public.enquiries FOR DELETE USING (auth.role() = 'authenticated');


-- ==========================================
-- INITIAL DEFAULT DATA
-- ==========================================

INSERT INTO public.stats (label, value, suffix, icon, display_order) VALUES 
('Students', 1200, '+', 'Users', 1),
('Expert Teachers', 50, '+', 'UserCheck', 2),
('Years of Excellence', 10, '+', 'Award', 3),
('Success Rate', 99, '%', 'TrendingUp', 4);

INSERT INTO public.facilities (title, description, icon, display_order) VALUES 
('Modern Library', 'Over 10,000 books and digital resources', 'Library', 1),
('Science Labs', 'State-of-the-art physics, chemistry, and biology labs', 'FlaskConical', 2),
('Sports Complex', 'Indoor and outdoor athletic facilities', 'Trophy', 3),
('Smart Classrooms', 'Interactive digital boards in every room', 'MonitorPlay', 4);

INSERT INTO public.team_members (name, role, image_url, bio, display_order) VALUES 
('Dr. APJ Kalam', 'Principal', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'Over 20 years of experience in educational leadership.', 1),
('Sarah Jenkins', 'Head of Science', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', 'Former researcher turned passionate educator.', 2),
('Michael Chen', 'Sports Director', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'Olympian and dedicated student mentor.', 3);

INSERT INTO public.school_settings (key, value) VALUES 
('school_email', 'info@aspireuniversalinternational.com') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('school_phone', '+91 9431867366') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('school_address', 'Radha Krishana Colony Pakari, Patna, 800002') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('facebook_url', '#') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('instagram_url', '#') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('twitter_url', '#') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('welcome_title', 'Welcome to the Future of Education') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('welcome_message_1', 'We are thrilled to announce the launch of Aspire Universal International School. Our brand new campus is designed to provide a safe, stimulating, and inclusive environment where students can discover their passions and reach their full potential.') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('welcome_message_2', 'Opening our doors on April 1st, 2026, we blend traditional values with modern educational practices to prepare our students for the challenges of tomorrow. Join us in shaping the leaders, innovators, and compassionate citizens of the future.') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('director_name', 'Mr. Deepak Kumar Vidyarthi') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('director_image_url', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('principal_name', 'Dr. APJ Kalam') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.school_settings (key, value) VALUES 
('principal_message', 'Welcome to Aspire Universal International School. Our mission is to provide quality education and foster a nurturing environment for every student.') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.notices (content, display_order) VALUES 
('New Admissions Open for Session 2026-27! Visit our portal to apply online.', 1),
('Annual Sports Day scheduled for April 15th, 2026. Get ready for the excitement!', 2);
