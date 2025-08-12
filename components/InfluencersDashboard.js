import React, { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, Mail, Phone, MapPin, Calendar, ExternalLink, Filter, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

// Note: For production deployment, you'll need to import and use your Supabase services
// This demo version uses mock data for demonstration purposes

const InfluencersDashboard = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalInfluencers: 0,
    activeInfluencers: 0,
    pendingInfluencers: 0,
    totalReach: '0'
  });

  // Load influencers from Supabase or mock data
  const loadInfluencers = async () => {
    setLoading(true);
    try {
      // For production, uncomment this line and comment out mockData:
      // const data = await influencerService.getAllInfluencers();
      
      // Mock data for demo - replace with above Supabase call in production
      const mockData = [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-0123",
          specialty: "Endocrinology",
          followers: "150K",
          platform: "Instagram",
          engagement_rate: "4.2%",
          location: "New York, NY",
          status: "active",
          last_contact: "2024-08-10T00:00:00Z",
          content_focus: "Diabetes Management",
          collaboration_type: "Educational Content",
          bio: "Board-certified endocrinologist specializing in diabetes care with 10+ years experience.",
          website_url: "https://drsarahjohnson.com",
          social_handles: { instagram: "@drsarahjohnson", twitter: "@sarahjohnsonmd" }
        },
        {
          id: 2,
          name: "Maria Rodriguez RD",
          email: "maria.rodriguez@email.com",
          phone: "+1-555-0124",
          specialty: "Nutrition",
          followers: "95K",
          platform: "TikTok",
          engagement_rate: "6.8%",
          location: "Los Angeles, CA",
          status: "pending",
          last_contact: "2024-08-08T00:00:00Z",
          content_focus: "Diabetic Recipes",
          collaboration_type: "Product Reviews",
          bio: "Registered Dietitian creating delicious, diabetes-friendly recipes and meal plans.",
          website_url: "https://marianutrition.com",
          social_handles: { tiktok: "@marianutrition", instagram: "@maria_rd" }
        },
        {
          id: 3,
          name: "James Chen MD",
          email: "james.chen@email.com",
          phone: "+1-555-0125",
          specialty: "Internal Medicine",
          followers: "220K",
          platform: "YouTube",
          engagement_rate: "3.9%",
          location: "Chicago, IL",
          status: "active",
          last_contact: "2024-08-12T00:00:00Z",
          content_focus: "Patient Education",
          collaboration_type: "Sponsored Content",
          bio: "Internal Medicine physician educating patients about diabetes management and prevention.",
          website_url: "https://drjameschen.com",
          social_handles: { youtube: "@DrJamesChen", linkedin: "james-chen-md" }
        }
      ];
      
      setInfluencers(mockData);
      
      // Calculate stats
      const totalInfluencers = mockData.length;
      const activeInfluencers = mockData.filter(i => i.status === 'active').length;
      const pendingInfluencers = mockData.filter(i => i.status === 'pending').length;
      const totalReach = mockData.reduce((sum, influencer) => {
        const followers = parseInt(influencer.followers.replace(/[^\d]/g, '')) || 0;
        return sum + followers;
      }, 0);
      
      setStats({
        totalInfluencers,
        activeInfluencers,
        pendingInfluencers,
        totalReach: totalReach > 1000000 ? `${(totalReach / 1000000).toFixed(1)}M` : `${Math.round(totalReach / 1000)}K`
      });
      
    } catch (error) {
      console.error('Error loading influencers:', error);
      // Handle error - show toast notification
    } finally {
      setLoading(false);
    }
  };

  // Search influencers
  const searchInfluencers = async (term, status) => {
    try {
      // For production, uncomment this line:
      // const data = await influencerService.searchInfluencers(term, status);
      
      // For demo, filter the existing mock data
      let filtered = influencers.filter(influencer => {
        const matchesSearch = !term || 
          influencer.name.toLowerCase().includes(term.toLowerCase()) ||
          influencer.specialty.toLowerCase().includes(term.toLowerCase()) ||
          influencer.content_focus.toLowerCase().includes(term.toLowerCase());
        const matchesFilter = status === 'all' || influencer.status === status;
        return matchesSearch && matchesFilter;
      });
      
      return filtered;
    } catch (error) {
      console.error('Error searching influencers:', error);
      return [];
    }
  };

  // Log contact interaction
  const logContact = async (influencerId, contactType, notes = '') => {
    try {
      // For production, uncomment this line:
      // await contactService.logContact(influencerId, contactType, notes);
      
      // For demo, update local state
      setInfluencers(prev => prev.map(inf => 
        inf.id === influencerId 
          ? { ...inf, last_contact: new Date().toISOString() }
          : inf
      ));
      
      console.log(`Contact logged: ${contactType} for influencer ${influencerId}`);
    } catch (error) {
      console.error('Error logging contact:', error);
    }
  };

  useEffect(() => {
    loadInfluencers();
    
    // For production, uncomment to set up real-time subscription:
    // const subscription = setupRealtimeSubscription('influencers', (payload) => {
    //   console.log('Real-time update:', payload);
    //   loadInfluencers(); // Reload data on changes
    // });
    
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  // Filter influencers based on search and status
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  
  useEffect(() => {
    const filterData = async () => {
      const filtered = await searchInfluencers(searchTerm, filterStatus);
      setFilteredInfluencers(filtered);
    };
    
    filterData();
  }, [searchTerm, filterStatus, influencers]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSendMessage = async (influencer) => {
    await logContact(influencer.id, 'email', 'Message sent via dashboard');
    // Implement email sending logic
    alert(`Message sent to ${influencer.name}`);
  };

  const handleScheduleCall = async (influencer) => {
    await logContact(influencer.id, 'call_scheduled', 'Call scheduled via dashboard');
    // Implement calendar integration
    alert(`Call scheduled with ${influencer.name}`);
  };

  const InfluencerModal = ({ influencer, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{influencer.name}</h2>
              <p className="text-gray-600">{influencer.specialty}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(influencer.status)}`}>
                {influencer.status.charAt(0).toUpperCase() + influencer.status.slice(1)}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>{influencer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>{influencer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span>{influencer.location}</span>
                  </div>
                  {influencer.website_url && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-5 h-5 text-purple-600" />
                      <a href={influencer.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Social Media</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>{influencer.followers} followers on {influencer.platform}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span>{influencer.engagement_rate} engagement rate</span>
                  </div>
                  {influencer.social_handles && (
                    <div className="mt-2">
                      {Object.entries(influencer.social_handles).map(([platform, handle]) => (
                        <div key={platform} className="text-sm text-gray-600">
                          <span className="font-medium capitalize">{platform}:</span> {handle}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Professional Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Content Focus</p>
                    <p className="text-gray-600">{influencer.content_focus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Collaboration Type</p>
                    <p className="text-gray-600">{influencer.collaboration_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Biography</p>
                    <p className="text-gray-600">{influencer.bio}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Engagement History</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last Contact: {formatDate(influencer.last_contact)}
                    </span>
                  </div>
                  {/* Add contact history here when implemented */}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => handleSendMessage(influencer)}
              className="flex-1 min-w-32 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Message</span>
            </button>
            <button 
              onClick={() => handleScheduleCall(influencer)}
              className="flex-1 min-w-32 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Call</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Homa Health Influencers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Homa Health Influencer CRM</h1>
                <p className="text-gray-600 mt-1">Dr. Muddu Surendra Nehru MD - Diabetes Content Creator Partnerships</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={loadInfluencers}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Influencer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Influencers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInfluencers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Partnerships</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeInfluencers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Outreach</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingInfluencers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <ExternalLink className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReach}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search influencers by name, specialty, or content focus..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => {setSelectedInfluencer(influencer); setShowModal(true);}}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{influencer.name}</h3>
                    <p className="text-gray-600 text-sm">{influencer.specialty}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(influencer.status)}`}>
                    {influencer.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {influencer.followers} • {influencer.platform}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {influencer.engagement_rate} engagement
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {influencer.location}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Content Focus</p>
                  <p className="text-sm text-gray-600">{influencer.content_focus}</p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleSendMessage(influencer);}}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); setSelectedInfluencer(influencer); setShowModal(true);}}
                    className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedInfluencer && (
        <InfluencerModal 
          influencer={selectedInfluencer} 
          onClose={() => {setShowModal(false); setSelectedInfluencer(null);}} 
        />
      )}
    </div>
  );
};

export default InfluencersDashboard;