'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
    if (!provider?.hourly_rate) return 0;
    const duration = parseInt(bookingData.duration) || 0;
    const subtotal = provider.hourly_rate * duration;
    const platformFee = Math.round(subtotal * 0.15); // 15% platform fee
    return { subtotal, platformFee, total: subtotal + platformFee };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            status: 'pending',
            payment_status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Booking request submitted!');
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
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
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

  const { subtotal, platformFee, total } = calculateTotal();

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link href={`/providers/${params.providerId}`} className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity" style={{ color: '#6A0DAD' }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8" style={{ color: '#2B0E3F' }}>
          Book {provider.users?.full_name}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
                Booking Details
              </h2>

              <div className="space-y-6">
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
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ borderColor: '#E5E7EB' }}
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
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ borderColor: '#E5E7EB' }}
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
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                    <option value="6">6 hours</option>
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
                    placeholder="Any special requests or notes..."
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ borderColor: '#E5E7EB' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary"
                >
                  {submitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border sticky top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-lg font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
                Booking Summary
              </h2>

              {/* Provider Info */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-luxury flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {provider.users?.full_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#2B0E3F' }}>
                      {provider.users?.full_name}
                    </div>
                    <div className="text-sm" style={{ color: '#6B7280' }}>
                      ${provider.hourly_rate}/hour
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>
                    ${provider.hourly_rate} × {bookingData.duration}h
                  </span>
                  <span className="font-semibold" style={{ color: '#2B0E3F' }}>
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Platform Fee (15%)</span>
                  <span className="font-semibold" style={{ color: '#2B0E3F' }}>
                    ${platformFee}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <span className="font-bold" style={{ color: '#2B0E3F' }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: '#6A0DAD' }}>
                    ${total}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.2)' }}>
                <p className="text-sm" style={{ color: '#2B0E3F' }}>
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Payment will be processed after the provider accepts your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}