import { CheckCircle, XCircle, Eye, Star, Briefcase } from 'lucide-react';
import { useProviders } from '../hooks/useProviders';

export default function ProvidersView() {
  const { providers, loading, verifyProvider, suspendProvider, activateProvider } = useProviders();

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p style={{ color: '#6B7280' }}>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Provider Management
        </h2>
        <p style={{ color: '#6B7280' }}>Manage all service providers on the platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Total Providers</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#2B0E3F' }}>{providers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Verified</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {providers.filter(p => p.is_verified).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {providers.filter(p => !p.is_verified).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Active</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#6A0DAD' }}>
            {providers.filter(p => p.is_active).length}
          </p>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: '#6B7280' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2B0E3F' }}>No Providers Yet</h3>
            <p style={{ color: '#6B7280' }}>No service providers have registered on the platform</p>
          </div>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
                 style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                       style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
                    {provider.full_name?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>
                        {provider.full_name}
                      </h3>
                      {provider.is_verified && (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {!provider.is_active && (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                          Suspended
                        </span>
                      )}
                    </div>
                    
                    {provider.business_name && (
                      <p className="text-sm font-medium mb-1" style={{ color: '#6A0DAD' }}>
                        {provider.business_name}
                      </p>
                    )}
                    <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                      {provider.email} • {provider.phone || 'No phone'}
                    </p>

                    {provider.bio && (
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#6B7280' }}>
                        {provider.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      {provider.hourly_rate > 0 && (
                        <span style={{ color: '#6B7280' }}>
                          <strong style={{ color: '#2B0E3F' }}>${provider.hourly_rate}</strong>/hour
                        </span>
                      )}
                      {provider.location && (
                        <span style={{ color: '#6B7280' }}>
                          📍 <strong style={{ color: '#2B0E3F' }}>{provider.location}</strong>
                        </span>
                      )}
                      {provider.rating > 0 && (
                        <span className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <strong style={{ color: '#2B0E3F' }}>{provider.rating.toFixed(2)}</strong>
                        </span>
                      )}
                      {provider.total_bookings > 0 && (
                        <span style={{ color: '#6B7280' }}>
                          <strong style={{ color: '#2B0E3F' }}>{provider.total_bookings}</strong> bookings
                        </span>
                      )}
                    </div>

                    {provider.services && provider.services.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {provider.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full bg-purple-100 text-purple-600 text-xs">
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                            +{provider.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                      Joined: {new Date(provider.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!provider.is_verified && (
                    <button
                      onClick={() => verifyProvider(provider.id)}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify
                    </button>
                  )}
                  
                  {provider.is_active ? (
                    <button
                      onClick={() => suspendProvider(provider.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => activateProvider(provider.id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Activate
                    </button>
                  )}
                  
                  <button className="p-2 rounded-lg hover:bg-purple-100 transition-colors" style={{ color: '#6A0DAD' }}>
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}