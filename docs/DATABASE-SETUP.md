# Database Setup Guide for Supabase

Follow these steps to create the database tables:

## 1. Go to Supabase Dashboard

1. Visit https://supabase.com/dashboard
2. Select your ARCHITECT project
3. Click "SQL Editor" in the left sidebar

## 2. Create the Analyses Table

Copy and paste this SQL code:

```sql
-- Create analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_name text not null,
  language text,
  file_count int,
  overall_score int,
  scores jsonb,
  analysis_data jsonb,
  share_token text unique,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.analyses enable row level security;

-- Policy: Users can view their own analyses
create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
create policy "Users can create analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own analyses
create policy "Users can update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- Policy: Anyone can view public shared analyses
create policy "Public analyses viewable by token"
  on public.analyses for select
  using (is_public = true);

-- Create index for faster queries
create index analyses_user_id_idx on public.analyses(user_id);
create index analyses_share_token_idx on public.analyses(share_token);
create index analyses_created_at_idx on public.analyses(created_at desc);
```

## 3. Click "RUN" button

The tables and security policies will be created!

## 4. Verify Creation

In the left sidebar:
- Click "Table Editor"
- You should see "analyses" table
- Click on it to verify the columns

## ✅ Done!

Your database is ready to store analyses.

## Schema Explanation

**Columns:**
- `id` - Unique ID for each analysis
- `user_id` - Who created it (linked to auth.users)
- `project_name` - Name of the analyzed project
- `language` - Primary programming language
- `file_count` - Number of files analyzed
- `overall_score` - Quality score (1-10)
- `scores` - Detailed scores (JSON)
- `analysis_data` - Full analysis results (JSON)
- `share_token` - Random token for sharing
- `is_public` - Can others view via share link?
- `created_at` - When created
- `updated_at` - When last updated

**Security:**
- Users can only see/edit/delete their own analyses
- Public analyses (with share_token) can be viewed by anyone
- All data is protected by Row Level Security (RLS)
