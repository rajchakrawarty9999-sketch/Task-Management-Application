-- =========================================================================
-- TaskEngine PRO — Full PostgreSQL Schema & Setup Script for Supabase
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'Software Engineer',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog', -- 'backlog', 'in_progress', 'in_review', 'completed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  category TEXT DEFAULT 'General',
  due_date TIMESTAMPTZ,
  estimated_hours NUMERIC DEFAULT 0,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  assignee_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  subtasks JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'info', -- 'task_assigned', 'status_changed', 'team_join', 'deadline'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'meeting', -- 'meeting', 'reminder', 'deadline'
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  priority TEXT DEFAULT 'medium',
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Activities Feed Table
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow read/write policies for public anon key in development
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public write users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public write tasks" ON public.tasks FOR ALL USING (true);

CREATE POLICY "Allow public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write notifications" ON public.notifications FOR ALL USING (true);

CREATE POLICY "Allow public read calendar_events" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "Allow public write calendar_events" ON public.calendar_events FOR ALL USING (true);

CREATE POLICY "Allow public read activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public write activities" ON public.activities FOR ALL USING (true);

-- Enable Realtime Replication for Tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
