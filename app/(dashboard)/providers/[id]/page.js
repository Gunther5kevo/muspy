'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, CheckCircle, Calendar, MessageSquare, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProviderDetails();
      fetchReviews();
    }
  }, [params.id]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

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

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
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
    <>
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
        <Link href="/providers" className="inline-flex items-center gap-2 mb-4 sm:mb-6 hover:opacity-70 transition-opacity" style={{ color: '#6A0DAD' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border lg:sticky lg:top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              {/* Main Photo */}
              <div 
                className="aspect-square bg-gradient-to-br from-primary-light to-primary relative cursor-pointer"
                onClick={() => openLightbox(0)}
              >
                {primaryPhoto ? (
                  <img src={primaryPhoto} alt={provider.users?.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl sm:text-8xl text-white font-serif">✦</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#6A0DAD' }} />
                  <span className="text-xs sm:text-sm font-medium" style={{ color: '#6A0DAD' }}>Verified</span>
                </div>
              </div>

              {/* Photo Grid */}
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-3 gap-2 p-3 sm:p-4">
                  {allPhotos.slice(0, 6).map((photo, index) => (
                    <div 
                      key={index} 
                      className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
                      onClick={() => openLightbox(index)}
                    >
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      {index === 5 && allPhotos.length > 6 && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-sm sm:text-lg font-semibold">
                          +{allPhotos.length - 6}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <button
                  onClick={() => router.push(`/bookings/new/${provider.id}`)}
                  className="w-full btn-primary text-sm sm:text-base"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Book Now
                </button>
                <button className="w-full btn-secondary text-sm sm:text-base">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
                {provider.users?.full_name || 'Provider'}
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{
                        fill: i < Math.floor(provider.rating_average || 0) ? '#C1A35E' : 'transparent',
                        color: '#C1A35E'
                      }}
                    />
                  ))}
                  <span className="font-bold ml-2 text-sm sm:text-base" style={{ color: '#2B0E3F' }}>
                    {provider.rating_average?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                    ({provider.total_bookings || 0} bookings)
                  </span>
                </div>

                {provider.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#6B7280' }} />
                    <span className="text-sm sm:text-base" style={{ color: '#6B7280' }}>{provider.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold" style={{ color: '#6A0DAD' }}>
                  ${provider.hourly_rate || 0}
                </span>
                <span className="text-base sm:text-lg" style={{ color: '#6B7280' }}>/hour</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4" style={{ color: '#2B0E3F' }}>
                About
              </h2>
              <p className="leading-relaxed text-sm sm:text-base" style={{ color: '#4B5563' }}>
                {provider.bio || 'No bio available.'}
              </p>
            </div>

            {provider.services_offered && provider.services_offered.length > 0 && (
              <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4" style={{ color: '#2B0E3F' }}>
                  Services Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {provider.services_offered.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                      style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)', color: '#2B0E3F' }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6" style={{ color: '#2B0E3F' }}>
                Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>No reviews yet. Be the first to book!</p>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 sm:pb-6 last:border-0" style={{ borderColor: '#E5E7EB' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-luxury flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {review.reviewer?.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>
                            {review.reviewer?.full_name || 'Anonymous'}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                style={{
                                  fill: i < review.rating ? '#C1A35E' : 'transparent',
                                  color: '#C1A35E'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base" style={{ color: '#4B5563' }}>{review.comment}</p>
                      <p className="text-xs sm:text-sm mt-2" style={{ color: '#9CA3AF' }}>
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all z-50"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Counter */}
          <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {allPhotos.length}
          </div>

          {/* Previous button */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 text-white p-2 sm:p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Image */}
          <img
            src={allPhotos[currentImageIndex]}
            alt={`Photo ${currentImageIndex + 1}`}
            className="max-h-[85vh] sm:max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 text-white p-2 sm:p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}
        </div>
      )}
    </>
  );
}