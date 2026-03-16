-- LifeOS Database Setup
-- Run this in Supabase Dashboard > SQL Editor > New Query > Paste > Click "Run"

-- 1. Create the user_data table
CREATE TABLE IF NOT EXISTS public.user_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  habits jsonb DEFAULT '[]'::jsonb,
  tasks jsonb DEFAULT '[]'::jsonb,
  notes jsonb DEFAULT '[]'::jsonb,
  scores jsonb DEFAULT '{"health":5,"work":5,"relationships":5,"growth":5,"finance":5,"joy":5}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (each user can only access their own data)
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- 3. Policies: users can only read/write their own rows
CREATE POLICY "Users can view own data"
  ON public.user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON public.user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON public.user_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON public.user_data FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);

-- Done! Your database is ready.
