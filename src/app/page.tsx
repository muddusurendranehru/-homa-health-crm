'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Users, 
  Megaphone, 
  TrendingUp, 
  DollarSign,
  Eye,
  Heart,
  Share2
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInfluencers: 0,
    totalCampaigns: 0,
    totalFollowers: 0,
    totalEngagement: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch influencers count and total followers
      const { data: influencers } = await supabase
        .from('influencers')
        .select('follower_count, engagement_rate')
      
      // Fetch campaigns count
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')

      const totalFollowers = influencers?.reduce((sum, inf) => sum + (inf.follower_count || 0), 0) || 0
      const avgEngagement = influencers?.length > 0 
        ? influencers.reduce((sum, inf) => sum + (inf.engagement_rate || 0), 0) / influencers.length 
        : 0

      setStats({
        totalInfluencers: influencers?.length || 0,
        totalCampaigns: campaigns?.length || 0,
        totalFollowers,
        totalEngagement: avgEngagement
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Influencers',
      value: stats.totalInfluencers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Campaigns',
      value: stats.totalCampaigns,
      icon: Megaphone,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Total Followers',
      value: stats.totalFollowers.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Avg Engagement',
      value: `${stats.totalEngagement.toFixed(1)}%`,
      icon: Heart,
      color: 'bg-orange-500',
      change: '+2.1%'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'campaign',
      title: 'Summer Fashion Collection launched',
      description: 'New campaign started with 5 influencers',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'influencer',
      title: 'Sarah Johnson joined',
      description: 'Fashion influencer with 125K followers',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'performance',
      title: 'Campaign performance update',
      description: 'Tech Product Launch reached 50K impressions',
      time: '6 hours ago'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your influencer campaigns.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="btn-primary w-full flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Add New Influencer
            </button>
            <button className="btn-secondary w-full flex items-center justify-center">
              <Megaphone className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
            <button className="btn-secondary w-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
