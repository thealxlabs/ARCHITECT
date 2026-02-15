-- Database schema for GitHub App integration

-- Table to store GitHub App installations
CREATE TABLE IF NOT EXISTS public.github_installations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  installation_id BIGINT UNIQUE NOT NULL,
  account_login TEXT NOT NULL,
  account_type TEXT, -- 'User' or 'Organization'
  access_token TEXT,
  repositories JSONB, -- List of repos with access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.github_installations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own installations
CREATE POLICY "Users can view own installations"
  ON public.github_installations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own installations
CREATE POLICY "Users can create installations"
  ON public.github_installations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own installations
CREATE POLICY "Users can update own installations"
  ON public.github_installations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own installations
CREATE POLICY "Users can delete own installations"
  ON public.github_installations FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX github_installations_user_id_idx ON public.github_installations(user_id);
CREATE INDEX github_installations_installation_id_idx ON public.github_installations(installation_id);

-- Table to store webhook events (for debugging)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  installation_id BIGINT,
  repository_name TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX webhook_events_installation_id_idx ON public.webhook_events(installation_id);
CREATE INDEX webhook_events_created_at_idx ON public.webhook_events(created_at DESC);
