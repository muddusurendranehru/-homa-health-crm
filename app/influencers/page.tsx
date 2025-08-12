'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Mail, Instagram, MapPin, Users } from 'lucide-react'

interface Influencer {
  id?: number
  name: string
  platform: string
  handle: string
  contact_info: string
  location: string
  follower_count: number
  engagement_rate: string
  content_niche: string
  notes?: string
}

export default function InfluencerDashboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState<Influencer>({
    name: '',
    platform: 'Instagram',
    handle: '',
    contact_info: '',
    location: '',
    follower_count: 0,
    engagement_rate: '',
    content_niche: '',
    notes: ''
  })

  // Demo data - fallback if Supabase fails
  const getDemoData = (): Influencer[] => [
    {
      id: 1,
      name: "Dr. Sagari Ananda",
      platform: "Instagram",
      handle: "@dr.sagariananda",
      follower_count: 45000,
      content_niche: "Family Medicine",
      location: "Hyderabad",
      contact_info: "sagari.ananda@example.com",
      engagement_rate: "3.2",
      notes: "Family physician, NDTV contributor"
    },
    {
      id: 2,
      name: "Dr. Rajender Ramagiri",
      platform: "Instagram",
      handle: "@doctor.rajender",
      follower_count: 38000,
      content_niche: "Diabetes Care",
      location: "Hyderabad",
      contact_info: "rajender.ramagiri@example.com",
      engagement_rate: "4.1",
      notes: "Claims 3000+ reversed cases"
    },
    {
      id: 3,
      name: "Dr. Manasa Mynepally",
      platform: "Instagram",
      handle: "@drmanasamynepally",
      follower_count: 25000,
      content_niche: "Endocrinology",
      location: "Khajaguda, Hyderabad",
      contact_info: "manasa.mynepally@example.com",
      engagement_rate: "3.8",
      notes: "Diabetes/thyroid specialist"
    },
    {
      id: 4,
      name: "Dr. Prudwiraj S",
      platform: "Instagram",
      handle: "@drprudwiraj",
      follower_count: 22000,
      content_niche: "General Medicine",
      location: "Gachibowli, Hyderabad",
      contact_info: "prudwiraj.s@example.com",
      engagement_rate: "2.9",
      notes: "Magna Clinic & Arete Hospitals"
    },
    {
      id: 5,
      name: "Pooja Ganesh",
      platform: "Instagram",
      handle: "@nutritionist_inkannada",
      follower_count: 632000,
      content_niche: "Nutrition",
      location: "Bangalore",
      contact_info: "pooja.ganesh@example.com",
      engagement_rate: "5.2",
      notes: "Award-winning, strong South India presence"
    },
    {
      id: 6,
      name: "Fit Saida",
      platform: "Instagram",
      handle: "@fitsaida_fit",
      follower_count: 527000,
      content_niche: "Fitness",
      location: "Hyderabad",
      contact_info: "fit.saida@example.com",
      engagement_rate: "2.32",
      notes: "Fitness athlete, major Hyderabad audience"
    }
  ]

  // Load data on mount
  useEffect(() => {
    // Simple timeout to simulate loading
    setTimeout(() => {
      setInfluencers(getDemoData())
      setLoading(false)
    }, 1000)
  }, [])

  // Add new influencer (local only for now)
  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newInfluencer = { ...formData, id: Date.now() }
    setInfluencers([...influencers, newInfluencer])
    
    setFormData({ 
      name: '', 
      platform: 'Instagram', 
      handle: '', 
      contact_info: '', 
      location: '', 
      follower_count: 0, 
      engagement_rate: '', 
      content_niche: '', 
      notes: '' 
    })
    setShowAddForm(false)
    alert('Influencer added successfully!')
  }

  // Delete influencer
  const handleDeleteInfluencer = (id: number) => {
    if (!confirm('Are you sure you want to delete this influencer?')) return
    setInfluencers(influencers.filter(inf => inf.id !== id))
    alert('Influencer deleted successfully!')
  }

  // Send email invitation
  const handleSendInvitation = (influencer: Influencer) => {
    const subject = encodeURIComponent(`Collaboration Opportunity - Dr. Muddu Surendra Nehru MD`)
    const body = encodeURIComponent(`Dear ${influencer.name},

I hope this message finds you well. I am Dr. Muddu Surendra Nehru, and I've been following your excellent work in ${influencer.content_niche}.

I would like to explore a potential collaboration opportunity that could benefit both our audiences. Your expertise and reach of ${influencer.follower_count.toLocaleString()} followers would be invaluable.

Would you be available for a brief call to discuss this further?

Best regards,
Dr. Muddu Surendra Nehru MD
Homa Health`)

    window.open(`mailto:${influencer.contact_info}?subject=${subject}&body=${body}`)
  }

  // Open Instagram profile
  const openInstagram = (handle: string) => {
    window.open(`https://instagram.com/${handle.replace('@', '')}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading your influencer network...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your medical influencer network</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Influencer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{influencers.length}</div>
            <div className="text-gray-600">Total Influencers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {(influencers.reduce((sum, inf) => sum + inf.follower_count, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-gray-600">Total Reach</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(influencers.map(inf => inf.content_niche)).size}
            </div>
            <div className="text-gray-600">Specialties</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(influencers.map(inf => inf.location.split(',')[0])).size}
            </div>
            <div className="text-gray-600">Cities</div>
          </div>
        </div>

        {/* Influencer Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{influencer.name}</h3>
                <button
                  onClick={() => influencer.id && handleDeleteInfluencer(influencer.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Instagram Handle */}
              <button
                onClick={() => openInstagram(influencer.handle)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 group"
              >
                <Instagram className="w-4 h-4" />
                <span className="group-hover:underline">{influencer.handle}</span>
              </button>

              {/* Followers */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                <span>{influencer.follower_count.toLocaleString()} followers</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{influencer.location}</span>
              </div>

              {/* Content Niche & Engagement */}
              <div className="mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                  {influencer.content_niche}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {influencer.engagement_rate}% engagement
                </span>
              </div>

              {/* Notes */}
              <p className="text-gray-700 mb-4">{influencer.notes}</p>

              {/* Action Button */}
              <button
                onClick={() => handleSendInvitation(influencer)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Collaboration Invite
              </button>
            </div>
          ))}
        </div>

        {/* Add Influencer Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add New Influencer</h2>
              <form onSubmit={handleAddInfluencer} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                </select>
                <input
                  type="text"
                  placeholder="Handle (@username)"
                  value={formData.handle}
                  onChange={(e) => setFormData({...formData, handle: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Followers Count"
                  value={formData.follower_count || ''}
                  onChange={(e) => setFormData({...formData, follower_count: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Content Niche/Specialty"
                  value={formData.content_niche}
                  onChange={(e) => setFormData({...formData, content_niche: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Engagement Rate (e.g., 3.2)"
                  value={formData.engagement_rate}
                  onChange={(e) => setFormData({...formData, engagement_rate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Notes/Bio"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Add Influencer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}