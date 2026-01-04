'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url
          ),
          provider_photos (
            photo_url,
            is_primary
          )
        `)
        .eq('verification_status', 'verified')
        .order('rating_average', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinRate = !minRate || (provider.hourly_rate >= parseInt(minRate));
    const matchesMaxRate = !maxRate || (provider.hourly_rate <= parseInt(maxRate));
    
    return matchesSearch && matchesMinRate && matchesMaxRate;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Browse Providers
        </h1>
        <p style={{ color: '#6B7280' }}>
          Find verified professional service providers
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border mb-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Search by name or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              Min Rate ($)
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              Max Rate ($)
            </label>
            <input
              type="number"
              placeholder="Max"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p style={{ color: '#6B7280' }}>
          {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-lg mb-4" style={{ color: '#6B7280' }}>
            No providers found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setMinRate('');
              setMaxRate('');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => {
            const primaryPhoto = provider.provider_photos?.find(p => p.is_primary)?.photo_url;
            
            return (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border overflow-hidden group"
                style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
              >
                {/* Provider Image */}
                <div className="aspect-square bg-gradient-to-br from-primary-light to-primary relative overflow-hidden">
                  {primaryPhoto ? (
                    <img 
                      src={primaryPhoto} 
                      alt={provider.users?.full_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-white font-serif">✦</span>
                    </div>
                  )}
                  {/* Verified Badge */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <CheckCircle className="w-4 h-4" style={{ color: '#6A0DAD' }} />
                    <span className="text-xs font-medium" style={{ color: '#6A0DAD' }}>Verified</span>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
                    {provider.users?.full_name || 'Provider'}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-5 h-5" style={{ fill: '#C1A35E', color: '#C1A35E' }} />
                    <span className="font-semibold" style={{ color: '#2B0E3F' }}>
                      {provider.rating_average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm" style={{ color: '#6B7280' }}>
                      ({provider.total_bookings || 0} bookings)
                    </span>
                  </div>

                  {/* Location */}
                  {provider.location && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                      <span className="text-sm" style={{ color: '#6B7280' }}>{provider.location}</span>
                    </div>
                  )}

                  {/* Bio Preview */}
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                    {provider.bio || 'No bio available'}
                  </p>

                  {/* Rate */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div>
                      <span className="text-2xl font-bold" style={{ color: '#6A0DAD' }}>
                        ${provider.hourly_rate || 0}
                      </span>
                      <span className="text-sm" style={{ color: '#6B7280' }}>/hour</span>
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">
                      View Profile
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}