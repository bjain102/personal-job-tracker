# Supabase Setup Instructions for Job Tracker

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Create the Jobs Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase_schema.sql` file
3. Click "Run" to execute the SQL

The schema creates:
- `jobs` table with all required fields
- Row Level Security (RLS) enabled
- Basic policy allowing all operations
- Indexes for better performance

## 5. Test Your Setup

1. Start your development server: `npm start`
2. Navigate to the job dashboard
3. Try adding a new job to test the integration
4. Verify the data appears in your Supabase table

## Database Schema

The `jobs` table includes:
- `id` (UUID, primary key)
- `job_title` (text, required)
- `company` (text, required)
- `location` (text, optional)
- `job_link` (text, optional)
- `application_date` (date, optional)
- `status` (text, default "Wishlist")
- `notes` (text, optional)
- `follow_up_date` (date, optional)
- `created_at` (timestamp, auto-generated)

## Features Implemented

✅ Fetch all jobs from Supabase on component load
✅ Add new jobs via the Add Job Modal
✅ Edit existing jobs with real-time updates
✅ Delete jobs with confirmation
✅ Update job status inline
✅ Auto-save functionality for edits
✅ Error handling and user feedback

## Security Notes

- Row Level Security (RLS) is enabled
- Current policy allows all operations (modify as needed)
- Environment variables keep credentials secure
- All database operations use the Supabase client
