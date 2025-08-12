'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import type { Influencer } from '@/lib/supabase'

export default function InfluencerDashboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const supabase = createClientComponentClient()

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
    } catch (error) {
      console.error('Error fetching influencers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate dashboard metrics
  const totalInfluencers = influencers.length
  const totalFollowers = influencers.reduce((sum, inf) => sum + (inf.followers || 0), 0)
  const avgEngagement = influencers.length > 0 
    ? influencers.reduce((sum, inf) => sum + (inf.engagement_rate || 0), 0) / influencers.length 
    : 0
  const activeCollaborations = influencers.filter(inf => 
    ['interested', 'negotiating', 'confirmed'].includes(inf.collaboration_status)
  ).length

  // Platform distribution
  const platformStats = influencers.reduce((acc, inf) => {
    acc[inf.platform] = (acc[inf.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Top performing influencers
  const topPerformers = influencers
    .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
    .slice(0, 5)

  // Recent activities (mock data for now)
  const recentActivities = [
    {
      id: 1,
      type: 'new_influencer',
      title: 'Sarah Johnson joined the platform',
      description: 'Fashion influencer with 125K followers',
      time: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'campaign_launch',
      title: 'Summer Collection campaign started',
      description: '5 influencers assigned to the campaign',
      time: '4 hours ago',
      icon: TrendingUp
    },
    {
      id: 3,
      type: 'performance_update',
      title: 'Tech Product Launch reached 50K impressions',
      description: 'Engagement rate increased by 15%',
      time: '6 hours ago',
      icon: Activity
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your influencer marketing performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Influencers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalInfluencers}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalFollowers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgEngagement.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Collaborations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeCollaborations}</p>
              <p className="text-sm text-green-600 mt-1">+5% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Platform Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(platformStats).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{platform}</span>
                </div>
                <span className="text-gray-600">{count} influencers</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topPerformers.map((influencer, index) => (
              <div key={influencer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {influencer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{influencer.name}</p>
                    <p className="text-xs text-gray-500">{influencer.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{influencer.engagement_rate}%</p>
                  <p className="text-xs text-gray-500">{influencer.followers.toLocaleString()} followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
