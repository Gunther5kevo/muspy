'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PaymentModal from '@/components/PaymentModal';

// USD to KES exchange rate
const USD_TO_KES = 129.5;

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider:provider_id (
            id,
            users:user_id (
              full_name,
              avatar_url
            ),
            location,
            hourly_rate
          )
        `)
        .eq('client_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful!');
    fetchBookings();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#6A0DAD';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'pending': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          My Bookings
        </h1>
        <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
          Manage and track all your bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-lg border mb-6 sm:mb-8 flex gap-2 overflow-x-auto scrollbar-hide" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap text-sm sm:text-base ${
              filter === status 
                ? 'bg-gradient-luxury text-white' 
                : 'hover:bg-gray-100'
            }`}
            style={filter !== status ? { color: '#2B0E3F' } : {}}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#6B7280' }} />
          <p className="text-lg mb-4" style={{ color: '#6B7280' }}>
            No {filter !== 'all' ? filter : ''} bookings found
          </p>
          <Link href="/providers" className="btn-primary">
            Browse Providers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status);
            const statusColor = getStatusColor(booking.status);
            const needsPayment = booking.status === 'confirmed' && booking.payment_status === 'pending';
            const amountInKES = Math.round(booking.total_amount * USD_TO_KES);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border hover:shadow-xl transition-all"
                style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex gap-3 sm:gap-4 w-full">
                    {/* Provider Avatar */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-luxury flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg sm:text-xl font-semibold">
                        {booking.provider?.users?.full_name?.charAt(0) || 'P'}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-serif font-bold truncate" style={{ color: '#2B0E3F' }}>
                            {booking.provider?.users?.full_name || 'Provider'}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(booking.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {booking.time_start} - {booking.time_end}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full self-start"
                          style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                        >
                          <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium capitalize">{booking.status}</span>
                        </div>
                      </div>

                      {/* Payment Alert */}
                      {needsPayment && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium">Payment required to confirm your booking</span>
                          </div>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-bold" style={{ color: '#6A0DAD' }}>
                              KES {amountInKES.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
                              (${booking.total_amount})
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm ml-0" style={{ color: '#6B7280' }}>
                            {booking.payment_status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                Pending Payment
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Pay Now Button */}
                          {needsPayment && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center gap-2"
                            >
                              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                              Pay Now
                            </button>
                          )}

                          {/* Cancel Button */}
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border-2 hover:bg-red-50 transition-colors" 
                              style={{ borderColor: '#EF4444', color: '#EF4444' }}
                            >
                              Cancel
                            </button>
                          )}

                          {/* Leave Review Button */}
                          {booking.status === 'completed' && booking.payment_status === 'paid' && (
                            <Link
                              href={`/bookings/${booking.id}/review`}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-luxury text-white hover:opacity-90 transition-opacity text-center"
                            >
                              Leave Review
                            </Link>
                          )}

                          {/* View Provider Button */}
                          <Link
                            href={`/providers/${booking.provider.id}`}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border-2 hover:bg-gray-50 transition-colors text-center"
                            style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}
                          >
                            View Provider
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}