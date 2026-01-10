'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Browse Providers
        </h1>
        <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
          Find verified professional service providers
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border mb-6 sm:mb-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        {/* Search Bar - Always Visible */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Search by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>

        {/* Filter Toggle Button - Mobile Only */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 rounded-xl font-medium text-sm transition-colors"
          style={{ 
            borderColor: showFilters ? '#6A0DAD' : '#E5E7EB',
            color: showFilters ? '#6A0DAD' : '#6B7280',
            backgroundColor: showFilters ? 'rgba(106, 13, 173, 0.05)' : 'transparent'
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Inputs - Collapsible on Mobile */}
        <div className={`grid md:grid-cols-2 gap-4 ${showFilters ? 'mt-4' : 'hidden md:grid md:mt-0'}`}>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              Min Rate ($)
            </label>
            <input
              type="number"
              placeholder="Min"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
          {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 sm:p-12 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <p className="text-base sm:text-lg mb-4" style={{ color: '#6B7280' }}>
            No providers found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setMinRate('');
              setMaxRate('');
            }}
            className="btn-secondary text-sm sm:text-base"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      <span className="text-4xl sm:text-6xl text-white font-serif">✦</span>
                    </div>
                  )}
                  {/* Verified Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#6A0DAD' }} />
                    <span className="text-xs font-medium" style={{ color: '#6A0DAD' }}>Verified</span>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 truncate" style={{ color: '#2B0E3F' }}>
                    {provider.users?.full_name || 'Provider'}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ fill: '#C1A35E', color: '#C1A35E' }} />
                    <span className="font-semibold text-sm sm:text-base" style={{ color: '#2B0E3F' }}>
                      {provider.rating_average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                      ({provider.total_bookings || 0} bookings)
                    </span>
                  </div>

                  {/* Location */}
                  {provider.location && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <span className="text-xs sm:text-sm truncate" style={{ color: '#6B7280' }}>{provider.location}</span>
                    </div>
                  )}

                  {/* Bio Preview */}
                  <p className="text-xs sm:text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                    {provider.bio || 'No bio available'}
                  </p>

                  {/* Rate */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div>
                      <span className="text-xl sm:text-2xl font-bold" style={{ color: '#6A0DAD' }}>
                        ${provider.hourly_rate || 0}
                      </span>
                      <span className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>/hour</span>
                    </div>
                    <button className="btn-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
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