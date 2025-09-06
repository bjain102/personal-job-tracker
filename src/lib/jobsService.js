import { supabase } from './supabaseClient'

// Map UI status values to DB-allowed values
const normalizeStatusForDb = (status) => {
  if (!status) return 'Wishlist'
  const map = {
    wishlist: 'Wishlist',
    'to apply': 'To Apply',
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    decision: 'Decision',
  }
  const key = String(status).toLowerCase()
  return map[key] || 'Wishlist'
}

const toNullable = (v) => (v === '' || v === undefined ? null : v)

// Get current user ID
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  return user.id
}

export const jobsService = {
  // Fetch all jobs for the current user
  async getAllJobs() {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },

  // Add a new job for the current user
  async addJob(jobData) {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          user_id: userId,
          job_title: jobData.jobTitle,
          company: jobData.company,
          location: toNullable(jobData.location),
          job_link: toNullable(jobData.jobLink),
          application_date: toNullable(jobData.applicationDate),
          status: normalizeStatusForDb(jobData.status),
          notes: toNullable(jobData.notes),
          follow_up_date: toNullable(jobData.followUpDate)
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding job:', error)
      throw error
    }
  },

  // Update an existing job (only if owned by current user)
  async updateJob(jobId, jobData) {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('jobs')
        .update({
          job_title: jobData.jobTitle,
          company: jobData.company,
          location: toNullable(jobData.location),
          job_link: toNullable(jobData.jobLink),
          application_date: toNullable(jobData.applicationDate),
          status: normalizeStatusForDb(jobData.status),
          notes: toNullable(jobData.notes),
          follow_up_date: toNullable(jobData.followUpDate)
        })
        .eq('id', jobId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  },

  // Update job status only (only if owned by current user)
  async updateJobStatus(jobId, status) {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: normalizeStatusForDb(status) })
        .eq('id', jobId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating job status:', error)
      throw error
    }
  },

  // Delete a job (only if owned by current user)
  async deleteJob(jobId) {
    try {
      const userId = await getCurrentUserId()
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  },

  // Get a single job by ID (only if owned by current user)
  async getJobById(jobId) {
    try {
      const userId = await getCurrentUserId()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching job:', error)
      throw error
    }
  }
}
