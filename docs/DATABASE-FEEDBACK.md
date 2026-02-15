# Feedback Table Setup

Run this SQL in your Supabase SQL Editor to enable the Report Problem feature.

```sql
-- Create feedback table for bug reports and feature requests
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('bug', 'feature', 'other')),
  message text not null,
  email text,
  page_url text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Anyone can submit feedback (even unauthenticated users)
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

-- Only authenticated users with service_role can read feedback
-- (you'll read it from the Supabase dashboard, not the app)
-- No select policy = nobody can read via the client API

-- Index for dashboard queries
create index feedback_created_at_idx on public.feedback(created_at desc);
create index feedback_type_idx on public.feedback(type);
```

## Viewing Feedback

Go to Supabase Dashboard → Table Editor → `feedback` to see submissions.
There is no select policy on purpose — feedback is write-only from the client.
You read it from the Supabase admin dashboard.
