'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, CheckCircle, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProviderDetails();
      fetchReviews();
    }
  }, [params.id]);

  const fetchProviderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url,
            created_at
          ),
          provider_photos (
            photo_url,
            is_primary
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProvider(data);
    } catch (error) {
      console.error('Error fetching provider:', error);
      toast.error('Failed to load provider profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:reviewer_id (
            full_name,
            avatar_url
          )
        `)
        .eq('provider_id', params.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <p className="text-lg mb-4" style={{ color: '#6B7280' }}>Provider not found</p>
          <Link href="/providers" className="btn-primary">
            Back to Providers
          </Link>
        </div>
      </div>
    );
  }

  const primaryPhoto = provider.provider_photos?.find(p => p.is_primary)?.photo_url;
  const allPhotos = provider.provider_photos?.map(p => p.photo_url) || [];

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link href="/providers" className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity" style={{ color: '#6A0DAD' }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Providers
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Photos & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border sticky top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            {/* Main Photo */}
            <div className="aspect-square bg-gradient-to-br from-primary-light to-primary relative">
              {primaryPhoto ? (
                <img src={primaryPhoto} alt={provider.users?.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl text-white font-serif">✦</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <CheckCircle className="w-4 h-4" style={{ color: '#6A0DAD' }} />
                <span className="text-sm font-medium" style={{ color: '#6A0DAD' }}>Verified</span>
              </div>
            </div>

            {/* Photo Gallery */}
            {allPhotos.length > 1 && (
              <div className="grid grid-cols-3 gap-2 p-4">
                {allPhotos.slice(0, 6).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 space-y-3">
              <button
                onClick={() => router.push(`/bookings/new/${provider.id}`)}
                className="w-full btn-primary"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Book Now
              </button>
              <button className="w-full btn-secondary">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
              {provider.users?.full_name || 'Provider'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{
                      fill: i < Math.floor(provider.rating_average || 0) ? '#C1A35E' : 'transparent',
                      color: '#C1A35E'
                    }}
                  />
                ))}
                <span className="font-bold ml-2" style={{ color: '#2B0E3F' }}>
                  {provider.rating_average?.toFixed(1) || '0.0'}
                </span>
                <span className="text-sm" style={{ color: '#6B7280' }}>
                  ({provider.total_bookings || 0} bookings)
                </span>
              </div>

              {provider.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#6B7280' }}>{provider.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold" style={{ color: '#6A0DAD' }}>
                ${provider.hourly_rate || 0}
              </span>
              <span className="text-lg" style={{ color: '#6B7280' }}>/hour</span>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
              About
            </h2>
            <p className="leading-relaxed" style={{ color: '#4B5563' }}>
              {provider.bio || 'No bio available.'}
            </p>
          </div>

          {/* Services */}
          {provider.services_offered && provider.services_offered.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {provider.services_offered.map((service, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)', color: '#2B0E3F' }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
              Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p style={{ color: '#6B7280' }}>No reviews yet. Be the first to book!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-luxury flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {review.reviewer?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: '#2B0E3F' }}>
                          {review.reviewer?.full_name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4"
                              style={{
                                fill: i < review.rating ? '#C1A35E' : 'transparent',
                                color: '#C1A35E'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ color: '#4B5563' }}>{review.comment}</p>
                    <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}