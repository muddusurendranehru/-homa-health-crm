// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mphmmjgiwyaffquuavsx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations for influencers
export const influencerService = {
  // Get all influencers
  async getAllInfluencers() {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching influencers:', error)
      throw error
    }
  },

  // Get influencer by ID
  async getInfluencerById(id) {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching influencer:', error)
      throw error
    }
  },

  // Create new influencer
  async createInfluencer(influencerData) {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .insert([influencerData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating influencer:', error)
      throw error
    }
  },

  // Update influencer
  async updateInfluencer(id, updates) {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating influencer:', error)
      throw error
    }
  },

  // Delete influencer
  async deleteInfluencer(id) {
    try {
      const { error } = await supabase
        .from('influencers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting influencer:', error)
      throw error
    }
  },

  // Search influencers
  async searchInfluencers(searchTerm, statusFilter = 'all') {
    try {
      let query = supabase
        .from('influencers')
        .select('*')

      // Add search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%,content_focus.ilike.%${searchTerm}%`)
      }

      // Add status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching influencers:', error)
      throw error
    }
  }
}

// Contact/interaction tracking
export const contactService = {
  // Log contact interaction
  async logContact(influencerId, contactType, notes = '') {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          influencer_id: influencerId,
          contact_type: contactType,
          notes: notes,
          contact_date: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      
      // Update last_contact in influencers table
      await supabase
        .from('influencers')
        .update({ last_contact: new Date().toISOString() })
        .eq('id', influencerId)
      
      return data
    } catch (error) {
      console.error('Error logging contact:', error)
      throw error
    }
  },

  // Get contact history for influencer
  async getContactHistory(influencerId) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('influencer_id', influencerId)
        .order('contact_date', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching contact history:', error)
      throw error
    }
  }
}

// Analytics and reporting
export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats() {
    try {
      const [
        totalInfluencers,
        activeInfluencers,
        pendingInfluencers,
        recentContacts
      ] = await Promise.all([
        supabase.from('influencers').select('id', { count: 'exact', head: true }),
        supabase.from('influencers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('influencers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contacts').select('id', { count: 'exact', head: true }).gte('contact_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      return {
        totalInfluencers: totalInfluencers.count || 0,
        activeInfluencers: activeInfluencers.count || 0,
        pendingInfluencers: pendingInfluencers.count || 0,
        recentContacts: recentContacts.count || 0
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  // Get engagement metrics
  async getEngagementMetrics() {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('followers, engagement_rate, platform')
        .not('followers', 'is', null)
        .not('engagement_rate', 'is', null)
      
      if (error) throw error
      
      // Calculate total reach and average engagement
      const totalReach = data.reduce((sum, influencer) => {
        const followers = parseInt(influencer.followers.replace(/[^\d]/g, '')) || 0
        return sum + followers
      }, 0)
      
      const avgEngagement = data.reduce((sum, influencer) => {
        const engagement = parseFloat(influencer.engagement_rate.replace('%', '')) || 0
        return sum + engagement
      }, 0) / data.length
      
      return {
        totalReach: totalReach > 1000000 ? `${(totalReach / 1000000).toFixed(1)}M` : `${Math.round(totalReach / 1000)}K`,
        avgEngagement: `${avgEngagement.toFixed(1)}%`,
        platformDistribution: data.reduce((acc, influencer) => {
          acc[influencer.platform] = (acc[influencer.platform] || 0) + 1
          return acc
        }, {})
      }
    } catch (error) {
      console.error('Error fetching engagement metrics:', error)
      throw error
    }
  }
}

// Real-time subscriptions
export const setupRealtimeSubscription = (table, callback) => {
  const subscription = supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: table }, 
      callback
    )
    .subscribe()

  return subscription
}

// Database table schemas for reference
export const schemas = {
  influencers: `
    CREATE TABLE IF NOT EXISTS influencers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      specialty VARCHAR(100),
      followers VARCHAR(50),
      platform VARCHAR(50),
      engagement_rate VARCHAR(10),
      location VARCHAR(100),
      status VARCHAR(20) DEFAULT 'pending',
      last_contact TIMESTAMP,
      content_focus TEXT,
      collaboration_type VARCHAR(100),
      bio TEXT,
      website_url VARCHAR(255),
      social_handles JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  contacts: `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
      contact_type VARCHAR(50) NOT NULL,
      contact_date TIMESTAMP DEFAULT NOW(),
      notes TEXT,
      outcome VARCHAR(100),
      follow_up_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  campaigns: `
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      budget DECIMAL(10,2),
      status VARCHAR(20) DEFAULT 'planning',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  campaign_influencers: `
    CREATE TABLE IF NOT EXISTS campaign_influencers (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
      influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
      compensation DECIMAL(10,2),
      deliverables TEXT,
      status VARCHAR(20) DEFAULT 'invited',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
}

export default supabase