-- Run this in your Supabase SQL Editor to set up the subscribers table

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  confirmed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Row-level security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no public access)
CREATE POLICY "Service role only" ON subscribers
  FOR ALL
  USING (auth.role() = 'service_role');
