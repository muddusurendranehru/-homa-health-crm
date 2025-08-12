'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    const { data } = await supabase
      .from('influencers')
      .select('*')
      .order('follower_count', { ascending: false })
    setInfluencers(data || [])
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Influencer Dashboard</h1>
      <div className="grid gap-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold text-lg">{influencer.name}</h3>
            <p className="text-gray-600">{influencer.handle} • {influencer.platform}</p>
            <p className="text-sm text-gray-500">{influencer.follower_count?.toLocaleString()} followers</p>
            <p className="text-sm mt-2">{influencer.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
