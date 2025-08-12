import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Influencer {
  id: number
  name: string
  platform: string
  followers: number
  engagement_rate: number
  niche: string
  email: string
  phone: string
  location: string
  content_type: string
  collaboration_status: 'pending' | 'contacted' | 'interested' | 'negotiating' | 'confirmed' | 'declined'
  notes: string
  created_at: string
  updated_at: string
}

export interface OutreachLog {
  id: number
  influencer_id: number
  contact_date: string
  contact_method: 'email' | 'phone' | 'dm' | 'whatsapp'
  message_content: string
  response_status: 'sent' | 'delivered' | 'read' | 'replied' | 'no_response'
  follow_up_date: string
  notes: string
  created_at: string
}
