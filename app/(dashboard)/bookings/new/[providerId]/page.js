'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Calendar as CalendarIcon, Clock, DollarSign, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// USD to KES exchange rate
const USD_TO_KES = 129.5;

export default function NewBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    timeStart: '',
    duration: '1',
    specialRequests: ''
  });

  useEffect(() => {
    if (params.providerId) {
      fetchProvider();
    }
  }, [params.providerId]);

  const fetchProvider = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('id', params.providerId)
        .single();

      if (error) throw error;
      setProvider(data);
    } catch (error) {
      console.error('Error fetching provider:', error);
      toast.error('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!provider?.hourly_rate) return { subtotal: 0, platformFee: 0, total: 0, subtotalKES: 0, platformFeeKES: 0, totalKES: 0 };
    
    const duration = parseInt(bookingData.duration) || 0;
    const subtotal = provider.hourly_rate * duration;
    const platformFee = Math.round(subtotal * 0.15); // 15% platform fee
    const total = subtotal + platformFee;
    
    // Convert to KES
    const subtotalKES = Math.round(subtotal * USD_TO_KES);
    const platformFeeKES = Math.round(platformFee * USD_TO_KES);
    const totalKES = Math.round(total * USD_TO_KES);
    
    return { 
      subtotal, 
      platformFee, 
      total,
      subtotalKES,
      platformFeeKES,
      totalKES
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create a booking');
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);

    try {
      const { subtotal, platformFee, total } = calculateTotal();
      
      // Calculate end time
      const [hours, minutes] = bookingData.timeStart.split(':');
      const startDate = new Date();
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      const endDate = new Date(startDate.getTime() + parseInt(bookingData.duration) * 60 * 60 * 1000);
      const timeEnd = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            client_id: user.id,
            provider_id: params.providerId,
            date: bookingData.date,
            time_start: bookingData.timeStart,
            time_end: timeEnd,
            total_amount: total,
            platform_fee: platformFee,
            status: 'confirmed', // Changed to confirmed so payment can be made immediately
            payment_status: 'pending',
            special_requests: bookingData.specialRequests || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Booking created! Please proceed to payment.');
      router.push('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
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

  const { subtotal, platformFee, total, subtotalKES, platformFeeKES, totalKES } = calculateTotal();
  const hourlyRateKES = Math.round(provider.hourly_rate * USD_TO_KES);

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
      {/* Back Button */}
      <Link href={`/providers/${params.providerId}`} className="inline-flex items-center gap-2 mb-4 sm:mb-6 hover:opacity-70 transition-opacity" style={{ color: '#6A0DAD' }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Book {provider.users?.full_name}
        </h1>
        <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: '#6B7280' }}>
          Complete the form below to request a booking
        </p>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6" style={{ color: '#2B0E3F' }}>
                Booking Details
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    style={{ borderColor: '#E5E7EB', color: '#2B0E3F' }}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                    <Clock className="w-4 h-4 inline mr-2" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingData.timeStart}
                    onChange={(e) => setBookingData({ ...bookingData, timeStart: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    style={{ borderColor: '#E5E7EB', color: '#2B0E3F' }}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                    Duration
                  </label>
                  <select
                    required
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    style={{ borderColor: '#E5E7EB', color: '#2B0E3F' }}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows="4"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    placeholder="Any special requests or notes for the provider..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    style={{ borderColor: '#E5E7EB', color: '#2B0E3F' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !bookingData.date || !bookingData.timeStart}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3 sm:py-3.5"
                >
                  {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border lg:sticky lg:top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-base sm:text-lg font-serif font-bold mb-3 sm:mb-4" style={{ color: '#2B0E3F' }}>
                Booking Summary
              </h2>

              {/* Provider Info */}
              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-luxury flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {provider.users?.full_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>
                      {provider.users?.full_name}
                    </div>
                    <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                      KES {hourlyRateKES.toLocaleString()}/hour
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      (${provider.hourly_rate}/hour)
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                    KES {hourlyRateKES.toLocaleString()} × {bookingData.duration}h
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-sm sm:text-base" style={{ color: '#2B0E3F' }}>
                      KES {subtotalKES.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      (${subtotal})
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                    Platform Fee (15%)
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-sm sm:text-base" style={{ color: '#2B0E3F' }}>
                      KES {platformFeeKES.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      (${platformFee})
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-start pt-2.5 sm:pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <span className="font-bold text-sm sm:text-base" style={{ color: '#2B0E3F' }}>Total</span>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: '#6A0DAD' }}>
                      KES {totalKES.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
                      ≈ ${total} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="p-3 sm:p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#6A0DAD' }} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: '#2B0E3F' }}>
                        Payment Methods
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        M-Pesa or Card payment will be processed after booking confirmation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex gap-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: '#2B0E3F' }}>
                        Secure Payment
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        Your payment is protected and will only be released after service delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}