-- Migration script to add user_id to existing jobs table
-- Run this BEFORE applying the new schema

-- Step 1: Add user_id column as nullable first
ALTER TABLE jobs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: If you have existing jobs and want to assign them to a specific user,
-- replace 'YOUR_USER_ID_HERE' with the actual user ID from auth.users
-- You can get user IDs by running: SELECT id, email FROM auth.users;

-- Example: Update all existing jobs to belong to the first user
-- UPDATE jobs SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL after assigning values
-- ALTER TABLE jobs ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Create the new indexes
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON jobs(user_id, status);

-- Step 5: Update RLS policies (drop old, create new)
DROP POLICY IF EXISTS "Enable all operations for jobs table" ON jobs;

CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);
