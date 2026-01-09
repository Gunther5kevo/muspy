'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle, MapPin, Phone, Mail, TrendingUp, Award } from 'lucide-react';
import toast from 'react-hot-toast';

// Skeleton Loading Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border animate-pulse" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2 md:mb-3"></div>
        <div className="h-6 md:h-8 bg-gray-300 rounded w-12 md:w-16"></div>
      </div>
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const BookingCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border animate-pulse" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
    <div className="flex items-start gap-3 md:gap-4 mb-4">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-200 flex-shrink-0"></div>
      <div className="flex-1 space-y-2 md:space-y-3">
        <div className="h-5 md:h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-9 md:h-10 bg-gray-200 rounded flex-1"></div>
      <div className="h-9 md:h-10 bg-gray-200 rounded flex-1"></div>
    </div>
  </div>
);

export default function ProviderBookingsPage() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [providerId, setProviderId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProviderIdAndBookings();
    }
  }, [user]);

  const fetchProviderIdAndBookings = async () => {
    try {
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!providerProfile) {
        toast.error('Provider profile not found');
        setLoading(false);
        return;
      }

      setProviderId(providerProfile.id);
      await fetchBookings(providerProfile.id);
    } catch (error) {
      console.error('Error fetching provider ID:', error);
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  const fetchBookings = async (provId) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:client_id (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('provider_id', provId)
        .order('date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Booking ${newStatus}!`, {
        icon: newStatus === 'confirmed' ? '✅' : newStatus === 'completed' ? '🎉' : '❌',
      });
      
      await fetchBookings(providerId);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'confirmed':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'completed':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' };
      case 'cancelled':
        return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />;
      case 'completed':
        return <Award className="w-3 h-3 md:w-4 md:h-4" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 md:w-4 md:h-4" />;
      default:
        return <Clock className="w-3 h-3 md:w-4 md:h-4" />;
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8" style={{ background: 'linear-gradient(to bottom, #faf5ff, #ffffff)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-48 md:w-64 mb-2 animate-pulse"></div>
            <div className="h-4 md:h-5 bg-gray-200 rounded w-64 md:w-96 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Filter Skeleton */}
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg border mb-6 animate-pulse" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 md:h-10 bg-gray-200 rounded-lg w-20 md:w-24 flex-shrink-0"></div>
              ))}
            </div>
          </div>

          {/* Bookings Skeleton */}
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Access Denied State
  if (profile?.role !== 'provider') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom, #fef2f2, #ffffff)' }}>
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-red-200 rounded-xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-red-900">
              Access Denied
            </h2>
            <p className="text-sm text-red-700 mb-4">
              This page is only accessible to service providers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8" style={{ background: 'linear-gradient(to bottom, #faf5ff, #ffffff)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-1 md:mb-2 bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Manage your appointments
          </p>
        </div>

        {/* Stats Cards - Mobile 2 Column */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <Calendar className="w-7 h-7 md:w-10 md:h-10 opacity-80" />
            </div>
            <p className="text-purple-100 text-[10px] md:text-sm mb-1">Total</p>
            <p className="text-2xl md:text-4xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-amber-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <AlertCircle className="w-7 h-7 md:w-10 md:h-10 text-amber-500" />
              <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-[10px] md:text-sm mb-1">Pending</p>
            <p className="text-2xl md:text-4xl font-bold text-amber-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <CheckCircle className="w-7 h-7 md:w-10 md:h-10 text-blue-500" />
              <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-[10px] md:text-sm mb-1">Confirmed</p>
            <p className="text-2xl md:text-4xl font-bold text-blue-600">{stats.confirmed}</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <Award className="w-7 h-7 md:w-10 md:h-10 text-emerald-500" />
            </div>
            <p className="text-gray-600 text-[10px] md:text-sm mb-1">Done</p>
            <p className="text-2xl md:text-4xl font-bold text-emerald-600">{stats.completed}</p>
            <p className="text-[9px] md:text-xs text-emerald-600 mt-1 font-medium">
              ${totalRevenue.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Filters - Horizontal Scroll on Mobile */}
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border mb-6" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { value: 'all', label: 'All', icon: Calendar },
              { value: 'pending', label: 'Pending', icon: AlertCircle },
              { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
              { value: 'completed', label: 'Done', icon: Award },
              { value: 'cancelled', label: 'Cancelled', icon: XCircle }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl font-medium transition-all flex items-center gap-1.5 md:gap-2 flex-shrink-0 text-xs md:text-sm ${
                  filter === value
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl p-12 md:p-16 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Calendar className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
              No {filter !== 'all' ? filter : ''} bookings
            </h3>
            <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto">
              Your {filter !== 'all' ? filter : ''} bookings will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredBookings.map((booking) => {
              const statusColor = getStatusColor(booking.status);
              const bookingDate = new Date(booking.date);
              const isActionLoading = actionLoading === booking.id;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 hover:shadow-xl transition-all"
                  style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}
                >
                  {/* Client Info */}
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                        {booking.client?.avatar_url ? (
                          <img
                            src={booking.client.avatar_url}
                            alt={booking.client.full_name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg md:text-xl">
                            {booking.client?.full_name?.charAt(0) || 'C'}
                          </span>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 ${statusColor.dot} rounded-full border-2 border-white`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base md:text-xl font-bold text-gray-900 truncate">
                          {booking.client?.full_name || 'Client'}
                        </h3>
                        <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold ${statusColor.bg} ${statusColor.border} ${statusColor.text} flex items-center gap-1 border-2 flex-shrink-0`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs md:text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
                          <span className="font-medium truncate">
                            {bookingDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                          <span className="font-medium">{booking.time_start} - {booking.time_end}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price - Top Right on Mobile */}
                    <div className="text-right bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl p-2 md:p-4 flex-shrink-0">
                      <p className="text-[9px] md:text-xs text-purple-600 font-medium mb-0.5">Total</p>
                      <p className="text-lg md:text-3xl font-bold text-purple-900">
                        ${parseFloat(booking.total_amount).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mb-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                      <p className="text-[10px] md:text-sm font-semibold mb-1 text-purple-900">Notes:</p>
                      <p className="text-xs md:text-sm text-gray-700 line-clamp-2">{booking.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        disabled={isActionLoading}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 shadow-lg disabled:opacity-50 active:scale-95"
                      >
                        {isActionLoading ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={isActionLoading}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 shadow-lg disabled:opacity-50 active:scale-95"
                      >
                        {isActionLoading ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                            Decline
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        disabled={isActionLoading}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all shadow-lg disabled:opacity-50 active:scale-95"
                      >
                        {isActionLoading ? (
                          <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : (
                          'Complete'
                        )}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={isActionLoading}
                        className="px-3 md:px-4 py-2.5 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all disabled:opacity-50 active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}