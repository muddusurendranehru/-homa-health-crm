import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container">
        <div className="main-card">
          <h1 className="title">
            🏥 Homa Health Care Centre
          </h1>
          <h2 className="subtitle">
            Influencer CRM Platform
          </h2>
          <p className="description">
            Dr. Muddu Surendra Nehru MD
          </p>
          <p className="subdescription">
            Diabetes Reversal Program - Strategic Partnership Management
          </p>

          <div className="stats-grid">
            <div className="stat-card blue-card">
              <div className="stat-number">10</div>
              <div className="stat-label">Target Influencers</div>
              <div className="medical-badge">Diabetes Content Creators</div>
            </div>
            
            <div className="stat-card green-card">
              <div className="stat-number">1.2M+</div>
              <div className="stat-label">Combined Reach</div>
              <div className="medical-badge">Total Followers</div>
            </div>
            
            <div className="stat-card purple-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Hyderabad Based</div>
              <div className="medical-badge">Local Market Focus</div>
            </div>
          </div>

          <Link href="/influencers" className="btn-primary">
            🚀 Launch Influencer Dashboard
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <div className="status-indicators">
            <div className="status-item">
              <span className="status-dot green-dot"></span>
              <span>Server Status: Active</span>
            </div>
            <div className="status-item">
              <span className="status-dot blue-dot"></span>
              <span>Database: Ready</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Systematic diabetes content creator outreach for evidence-based reversal program partnerships</p>
          </div>
        </div>
      </div>
    </div>
  )
}