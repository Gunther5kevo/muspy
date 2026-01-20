import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useProviders } from '../hooks/useProviders';

export default function VerificationsView() {
  const { providers, loading, verifyProvider, suspendProvider } = useProviders();

  // Filter only unverified providers
  const pendingProviders = providers.filter(p => !p.is_verified);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Provider Verifications
        </h2>
        <p style={{ color: '#6B7280' }}>Review and approve provider applications</p>
      </div>

      {/* Pending Count */}
      <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Pending Verifications</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#2B0E3F' }}>
              {pendingProviders.length}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" 
               style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Pending Providers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <p style={{ color: '#6B7280' }}>Loading applications...</p>
          </div>
        ) : pendingProviders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2B0E3F' }}>All Caught Up!</h3>
            <p style={{ color: '#6B7280' }}>No pending verifications at the moment</p>
          </div>
        ) : (
          pendingProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all" 
                 style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                       style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
                    {provider.full_name?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#2B0E3F' }}>
                      {provider.full_name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                      {provider.email}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: '#6B7280' }}>
                        Applied: {new Date(provider.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-medium">
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => verifyProvider(provider.id)}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => suspendProvider(provider.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
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