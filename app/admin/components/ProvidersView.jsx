import { useState } from 'react';
import { Search, Filter, CheckCircle, Ban, Eye } from 'lucide-react';
import { useProviders } from '../hooks/useProviders';

export default function ProvidersView() {
  const { providers, loading, verifyProvider, suspendProvider, activateProvider } = useProviders();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Providers Management
        </h2>
        <p style={{ color: '#6B7280' }}>Manage and verify service providers</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}
          />
        </div>
        <button className="px-4 py-3 rounded-lg border-2 font-medium hover:bg-purple-50 transition-colors flex items-center gap-2"
                style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(to right, #F8F5FF, #E5C7FF)' }}>
              <tr>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Provider</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Status</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Verified</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Joined</th>
                <th className="text-right p-4 font-semibold" style={{ color: '#2B0E3F' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    Loading providers...
                  </td>
                </tr>
              ) : filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    No providers found
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider.id} className="border-t hover:bg-purple-50 transition-colors" style={{ borderColor: 'rgba(229, 199, 255, 0.1)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                             style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
                          {provider.full_name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#2B0E3F' }}>{provider.full_name}</p>
                          <p className="text-sm" style={{ color: '#6B7280' }}>{provider.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        provider.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {provider.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        provider.is_verified ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {provider.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {new Date(provider.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {!provider.is_verified && (
                          <button
                            onClick={() => verifyProvider(provider.id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {provider.is_active ? (
                          <button
                            onClick={() => suspendProvider(provider.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Suspend"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => activateProvider(provider.id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-purple-100 transition-colors" style={{ color: '#6A0DAD' }} title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}