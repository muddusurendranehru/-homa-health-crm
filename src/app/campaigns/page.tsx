'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  budget: number
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'completed' | 'paused'
  influencer_campaigns?: {
    id: string
    status: string
    rate: number
    influencers: {
      id: string
      name: string
      handle: string
      platform: string
      follower_count: number
    }
  }[]
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          influencer_campaigns (
            id,
            status,
            rate,
            influencers (
              id,
              name,
              handle,
              platform,
              follower_count
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />
      case 'draft': return <Calendar className="w-4 h-4" />
      case 'completed': return <Users className="w-4 h-4" />
      case 'paused': return <Calendar className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your marketing campaigns and influencer partnerships</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                  <span className={`status-badge ${getStatusColor(campaign.status)} flex items-center gap-1`}>
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{campaign.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Budget</span>
                      <p className="font-semibold">${campaign.budget?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Duration</span>
                      <p className="font-semibold">
                        {campaign.start_date && campaign.end_date 
                          ? `${new Date(campaign.start_date).toLocaleDateString()} - ${new Date(campaign.end_date).toLocaleDateString()}`
                          : 'Not set'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Influencers</span>
                      <p className="font-semibold">{campaign.influencer_campaigns?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {campaign.influencer_campaigns && campaign.influencer_campaigns.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Assigned Influencers</h4>
                    <div className="space-y-2">
                      {campaign.influencer_campaigns.map((ic) => (
                        <div key={ic.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {ic.influencers?.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{ic.influencers?.name}</p>
                              <p className="text-xs text-gray-500">{ic.influencers?.handle} • {ic.influencers?.platform}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">${ic.rate}</p>
                            <p className="text-xs text-gray-500">{ic.influencers?.follower_count.toLocaleString()} followers</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="btn-primary text-sm">Edit Campaign</button>
                  <button className="btn-secondary text-sm">View Analytics</button>
                  <button className="btn-secondary text-sm">Add Influencers</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600">Create your first campaign to get started with influencer marketing.</p>
        </div>
      )}
    </div>
  )
}
