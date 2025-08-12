'use client'

import { useState, useEffect } from 'react'
import { supabase, type Influencer, type OutreachLog } from '@/lib/supabase'

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [outreachLogs, setOutreachLogs] = useState<OutreachLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch influencers from Supabase
  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('followers', { ascending: false })

      if (error) throw error
      setInfluencers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch influencers')
    } finally {
      setLoading(false)
    }
  }

  const fetchOutreachLogs = async (influencerId: number) => {
    try {
      const { data, error } = await supabase
        .from('outreach_log')
        .select('*')
        .eq('influencer_id', influencerId)
        .order('contact_date', { ascending: false })

      if (error) throw error
      setOutreachLogs(data || [])
    } catch (err) {
      console.error('Failed to fetch outreach logs:', err)
    }
  }

  const updateInfluencerStatus = async (id: number, status: Influencer['collaboration_status']) => {
    try {
      const { error } = await supabase
        .from('influencers')
        .update({ collaboration_status: status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setInfluencers(prev => 
        prev.map(inf => inf.id === id ? { ...inf, collaboration_status: status } : inf)
      )
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const addOutreachLog = async (influencerId: number, method: OutreachLog['contact_method'], content: string) => {
    try {
      const { error } = await supabase
        .from('outreach_log')
        .insert({
          influencer_id: influencerId,
          contact_date: new Date().toISOString(),
          contact_method: method,
          message_content: content,
          response_status: 'sent'
        })

      if (error) throw error
      
      // Refresh outreach logs
      fetchOutreachLogs(influencerId)
      
      // Update influencer status to 'contacted' if still pending
      const influencer = influencers.find(inf => inf.id === influencerId)
      if (influencer?.collaboration_status === 'pending') {
        updateInfluencerStatus(influencerId, 'contacted')
      }
    } catch (err) {
      console.error('Failed to add outreach log:', err)
    }
  }

  const getStatusColor = (status: Influencer['collaboration_status']) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      interested: 'bg-green-100 text-green-800',
      negotiating: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-emerald-100 text-emerald-800',
      declined: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.pending
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading influencer data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Connection Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchInfluencers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Homa Health Influencer CRM</h1>
              <p className="text-gray-600">Dr. Muddu Surendra Nehru MD - Diabetes Reversal Program</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Connected to Supabase
              </span>
              <span className="text-sm text-gray-500">
                {influencers.length} Influencers Loaded
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Influencers List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Target Influencers</h2>
                <p className="text-sm text-gray-600">Diabetes content creators in Hyderabad</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {influencers.map((influencer) => (
                  <div 
                    key={influencer.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedInfluencer?.id === influencer.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedInfluencer(influencer)
                      fetchOutreachLogs(influencer.id)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{influencer.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(influencer.collaboration_status)}`}>
                            {influencer.collaboration_status}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>📱 {influencer.platform}</div>
                          <div>👥 {formatFollowers(influencer.followers)} followers</div>
                          <div>📊 {influencer.engagement_rate}% engagement</div>
                          <div>🎯 {influencer.niche}</div>
                          <div>📍 {influencer.location}</div>
                          <div>📝 {influencer.content_type}</div>
                        </div>

                        {influencer.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">{influencer.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <select 
                          value={influencer.collaboration_status}
                          onChange={(e) => updateInfluencerStatus(influencer.id, e.target.value as Influencer['collaboration_status'])}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Influencer Details & Outreach */}
          <div className="lg:col-span-1">
            {selectedInfluencer ? (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedInfluencer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedInfluencer.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open(`mailto:${selectedInfluencer.email}`)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        📧 Email
                      </button>
                      <button 
                        onClick={() => window.open(`tel:${selectedInfluencer.phone}`)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                      >
                        📞 Call
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Outreach */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Log Outreach</h3>
                  </div>
                  <div className="p-6">
                    <OutreachForm 
                      onSubmit={(method, content) => addOutreachLog(selectedInfluencer.id, method, content)}
                    />
                  </div>
                </div>

                {/* Outreach History */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Outreach History</h3>
                  </div>
                  <div className="p-6">
                    {outreachLogs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No outreach logged yet</p>
                    ) : (
                      <div className="space-y-3">
                        {outreachLogs.map((log) => (
                          <div key={log.id} className="border-l-4 border-blue-200 pl-4 py-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{log.contact_method}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.contact_date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{log.message_content}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                              log.response_status === 'replied' ? 'bg-green-100 text-green-800' :
                              log.response_status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.response_status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">👆</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Influencer</h3>
                <p className="text-gray-600">Click on any influencer to view details and manage outreach</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick Outreach Form Component
function OutreachForm({ onSubmit }: { onSubmit: (method: OutreachLog['contact_method'], content: string) => void }) {
  const [method, setMethod] = useState<OutreachLog['contact_method']>('email')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(method, content)
      setContent('')
    }
  }

  const templates = {
    email: "Subject: Collaboration Opportunity - Diabetes Reversal Program\n\nDear [Name],\n\nI hope this email finds you well. I'm Dr. Muddu Surendra Nehru MD from Homa Health Care Centre. I've been following your content and am impressed by your commitment to diabetes awareness.\n\nWe're launching an evidence-based diabetes reversal program and would love to explore a collaboration opportunity with you.\n\nBest regards,\nDr. Muddu Surendra Nehru MD",
    phone: "Introduction call about diabetes reversal program collaboration opportunity",
    dm: "Hi! Love your diabetes content. I'm Dr. Muddu Surendra Nehru MD and would like to discuss a collaboration opportunity for our diabetes reversal program.",
    whatsapp: "Hello! This is Dr. Muddu Surendra Nehru MD from Homa Health Care Centre. I'd like to discuss a potential collaboration for our diabetes reversal program."
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
        <select 
          value={method} 
          onChange={(e) => {
            setMethod(e.target.value as OutreachLog['contact_method'])
            setContent(templates[e.target.value as keyof typeof templates])
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="email">📧 Email</option>
          <option value="phone">📞 Phone</option>
          <option value="dm">💬 DM</option>
          <option value="whatsapp">📱 WhatsApp</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message/Notes</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
          placeholder="Enter your message or notes about this outreach..."
        />
      </div>
      
      <button 
        type="submit"
        disabled={!content.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
      >
        Log Outreach
      </button>
    </form>
  )
}
