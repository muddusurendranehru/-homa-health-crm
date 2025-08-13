'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Mail, MapPin, Users, TrendingUp, Instagram, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react'

interface Influencer {
  id: string
  name: string
  platform: string
  handle: string
  contact_info: string
  location: string
  follower_count: number
  engagement_rate: number
  content_niche: string
  notes: string
  created_at: string
}

// Demo data as fallback
const demoInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    platform: 'Instagram',
    handle: '@drsarahmitchell',
    contact_info: 'sarah@healthinfluencer.com',
    location: 'Los Angeles, CA',
    follower_count: 125000,
    engagement_rate: 4.2,
    content_niche: 'Women\'s Health',
    notes: 'Specializes in PCOS and fertility content',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Fitness Coach Mike',
    platform: 'Instagram',
    handle: '@fitnesscoachmike',
    contact_info: 'mike@fitnessmike.com',
    location: 'Miami, FL',
    follower_count: 89000,
    engagement_rate: 5.1,
    content_niche: 'Fitness & Nutrition',
    notes: 'Great engagement with workout videos',
    created_at: '2024-01-20'
  }
]

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  
  const supabase = createClientComponentClient()

  // Test Supabase connection and fetch data
  useEffect(() => {
    async function fetchInfluencers() {
      try {
        console.log('🔄 Attempting to connect to Supabase...')
        setLoading(true)
        setError(null)

        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from('influencers')
         .select('id')
          .limit(1)

        if (testError) {
          console.error('❌ Supabase connection failed:', testError)
          setError(`Supabase connection failed: ${testError.message}`)
          setSupabaseConnected(false)
          setInfluencers(demoInfluencers)
          return
        }

        console.log('✅ Supabase connected successfully')
        setSupabaseConnected(true)

        // Fetch actual data
        const { data, error: fetchError } = await supabase
          .from('influencers')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('❌ Failed to fetch influencers:', fetchError)
          setError(`Failed to fetch data: ${fetchError.message}`)
          setInfluencers(demoInfluencers)
          return
        }

        console.log('✅ Fetched influencers:', data)
        
        if (data && data.length > 0) {
          setInfluencers(data)
        } else {
          console.log('⚠️ No influencers found, using demo data')
          setInfluencers(demoInfluencers)
        }

      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setSupabaseConnected(false)
        setInfluencers(demoInfluencers)
      } finally {
        setLoading(false)
      }
    }

    fetchInfluencers()
  }, [supabase])

  // Fixed: Add new influencer handler with proper error handling
  const handleAddInfluencer = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔄 Add Influencer button clicked - handleAddInfluencer called')
    console.log('🔄 Current showAddForm state:', showAddForm)
    
    try {
      console.log('🔄 Setting showAddForm to true...')
      setShowAddForm(true)
      console.log('✅ showAddForm should now be true')
    } catch (err) {
      console.error('❌ Error opening add form:', err)
      alert('Error opening add form. Please check console for details.')
    }
  }

  // Debug function to test state
  const debugAddForm = () => {
    console.log('🐛 Debug - Current showAddForm:', showAddForm)
    console.log('🐛 Debug - Manually setting showAddForm to true')
    setShowAddForm(true)
  }

  // Fixed: Instagram link handler
  const handleInstagramClick = (handle: string) => {
    try {
      console.log('🔄 Instagram link clicked:', handle)
      
      // Remove @ symbol if present
      const cleanHandle = handle.replace('@', '')
      const instagramUrl = `https://www.instagram.com/${cleanHandle}`
      
      console.log('🔗 Opening Instagram URL:', instagramUrl)
      window.open(instagramUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('❌ Error opening Instagram:', err)
      alert(`Error opening Instagram profile for ${handle}`)
    }
  }

  // Simple add form component
  const AddInfluencerForm = () => {
    console.log('🎨 AddInfluencerForm component rendered')
    
    const [formData, setFormData] = useState({
      name: '',
      platform: 'Instagram',
      handle: '',
      contact_info: '',
      location: '',
      follower_count: '',
      engagement_rate: '',
      content_niche: '',
      notes: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleClose = () => {
      console.log('🔄 Closing add form modal')
      setShowAddForm(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitting(true)

      try {
        console.log('🔄 Submitting new influencer:', formData)

        if (supabaseConnected) {
          const { data, error } = await supabase
            .from('influencers')
            .insert([{
              ...formData,
              follower_count: parseInt(formData.follower_count) || 0,
              engagement_rate: parseFloat(formData.engagement_rate) || 0
            }])
            .select()

          if (error) {
            console.error('❌ Supabase insert failed:', error)
            throw error
          }

          console.log('✅ Influencer added to Supabase:', data)
          
          // Refresh the list
          const { data: updatedData } = await supabase
            .from('influencers')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (updatedData) {
            setInfluencers(updatedData)
          }
        } else {
          // Add to demo data if Supabase not connected
          const newInfluencer: Influencer = {
            id: Date.now().toString(),
            ...formData,
            follower_count: parseInt(formData.follower_count) || 0,
            engagement_rate: parseFloat(formData.engagement_rate) || 0,
            created_at: new Date().toISOString()
          }
          setInfluencers(prev => [newInfluencer, ...prev])
          console.log('✅ Influencer added to demo data')
        }

        handleClose()
        setFormData({
          name: '',
          platform: 'Instagram',
          handle: '',
          contact_info: '',
          location: '',
          follower_count: '',
          engagement_rate: '',
          content_niche: '',
          notes: ''
        })

      } catch (err) {
        console.error('❌ Error adding influencer:', err)
        alert(`Error adding influencer: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Add New Influencer</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
            
            <select
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>
            
            <input
              type="text"
              placeholder="Handle (e.g., @username)"
              value={formData.handle}
              onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.contact_info}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="number"
              placeholder="Follower Count"
              value={formData.follower_count}
              onChange={(e) => setFormData(prev => ({ ...prev, follower_count: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="number"
              step="0.1"
              placeholder="Engagement Rate (%)"
              value={formData.engagement_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, engagement_rate: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <input
              type="text"
              placeholder="Content Niche"
              value={formData.content_niche}
              onChange={(e) => setFormData(prev => ({ ...prev, content_niche: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-2 border rounded"
              rows={3}
            />
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Influencer'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Filter influencers based on search
  const filteredInfluencers = influencers.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.content_niche.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalInfluencers = influencers.length
  const totalFollowers = influencers.reduce((sum, inf) => sum + inf.follower_count, 0)
  const avgEngagement = influencers.length > 0 
    ? (influencers.reduce((sum, inf) => sum + inf.engagement_rate, 0) / influencers.length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Homa Health CRM</h1>
              <p className="text-gray-600 mt-1">Medical Influencer Management</p>
              {!supabaseConnected && (
                <p className="text-amber-600 text-sm mt-1">⚠️ Using demo data - Supabase not connected</p>
              )}
              {supabaseConnected && (
                <p className="text-green-600 text-sm mt-1">✅ Connected to Supabase</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddInfluencer}
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add New Influencer
              </button>
              
              {/* Debug button - remove after testing */}
              <button
                onClick={debugAddForm}
                type="button"
                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
                title="Debug button - click if main button doesn't work"
              >
                DEBUG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ {error}</p>
            <p className="text-red-600 text-sm mt-1">Check console for more details</p>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Influencers</p>
                <p className="text-2xl font-bold text-gray-900">{totalInfluencers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{avgEngagement}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Influencers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Influencers ({filteredInfluencers.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading influencers...</p>
            </div>
          ) : filteredInfluencers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No influencers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Influencer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform & Handle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Followers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Niche
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInfluencers.map((influencer) => (
                    <tr key={influencer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{influencer.name}</div>
                          <div className="text-sm text-gray-500">{influencer.contact_info}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 text-pink-500 mr-2" />
                          <button
                            onClick={() => handleInstagramClick(influencer.handle)}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {influencer.handle}
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">{influencer.platform}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {influencer.follower_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {influencer.engagement_rate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {influencer.content_niche}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {influencer.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Debug info - remove after testing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
          <strong>Debug Info:</strong> showAddForm = {showAddForm.toString()} | 
          Influencers count = {influencers.length} | 
          Supabase connected = {supabaseConnected.toString()}
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <AddInfluencerForm />
        </div>
      )}
    </div>
  )
}