/*
  # User Authentication Schema

  1. New Tables
    - Ensures the users table exists with proper fields linked to auth.users
  
  2. Security
    - Enables RLS on users table
    - Adds policies for authenticated users to manage their data
    - Adds policy for public viewing of public profiles
  
  3. Triggers
    - Creates a trigger to automatically create user profiles on signup
*/

-- Ensure the users table has the necessary fields and is linked to auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  bio TEXT,
  education TEXT,
  location TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  profile_visibility TEXT DEFAULT 'public',
  join_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone" 
      ON public.users 
      FOR SELECT 
      TO public 
      USING (profile_visibility = 'public');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can insert own data'
  ) THEN
    CREATE POLICY "Users can insert own data" 
      ON public.users 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data" 
      ON public.users 
      FOR SELECT 
      TO authenticated 
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" 
      ON public.users 
      FOR UPDATE 
      TO authenticated 
      USING (auth.uid() = id);
  END IF;
END
$$;

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();