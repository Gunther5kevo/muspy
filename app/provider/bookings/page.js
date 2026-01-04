'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderBookingsPage() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProviderIdAndBookings();
    }
  }, [user]);

  const fetchProviderIdAndBookings = async () => {
    try {
      // First get the provider profile ID
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
      console.log('Fetched bookings:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Booking ${newStatus}`);
      fetchBookings(providerId);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' };
      case 'confirmed':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
      case 'completed':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
      case 'cancelled':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'provider') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#991B1B' }}>
              Access Denied
            </h2>
            <p style={{ color: '#7F1D1D' }}>
              Only providers can access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          My Bookings
        </h1>
        <p style={{ color: '#6B7280' }}>
          Manage your appointments and schedule
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Total Bookings</p>
              <p className="text-3xl font-bold" style={{ color: '#6A0DAD' }}>{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 opacity-20" style={{ color: '#6A0DAD' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Pending</p>
              <p className="text-3xl font-bold" style={{ color: '#F59E0B' }}>{stats.pending}</p>
            </div>
            <AlertCircle className="w-10 h-10 opacity-20" style={{ color: '#F59E0B' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Confirmed</p>
              <p className="text-3xl font-bold" style={{ color: '#3B82F6' }}>{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-10 h-10 opacity-20" style={{ color: '#3B82F6' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Completed</p>
              <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{stats.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 opacity-20" style={{ color: '#10B981' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg border mb-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={filter === status ? { backgroundColor: '#6A0DAD' } : { color: '#4B5563' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#6B7280' }} />
          <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
            No {filter !== 'all' ? filter : ''} bookings found
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            Your bookings will appear here once clients make appointments
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusColor = getStatusColor(booking.status);
            const bookingDate = new Date(booking.date);
            const isPast = bookingDate < new Date();

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow"
                style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Client & Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Client Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-luxury flex items-center justify-center flex-shrink-0">
                        {booking.client?.avatar_url ? (
                          <img
                            src={booking.client.avatar_url}
                            alt={booking.client.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {booking.client?.full_name?.charAt(0) || 'C'}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>
                            {booking.client?.full_name || 'Client'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.border} ${statusColor.text} flex items-center gap-1 border`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                            <Calendar className="w-4 h-4" />
                            <span>{bookingDate.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                            <Clock className="w-4 h-4" />
                            <span>{booking.time_start} - {booking.time_end}</span>
                          </div>
                          {booking.client?.email && (
                            <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                              <Mail className="w-4 h-4" />
                              <span>{booking.client.email}</span>
                            </div>
                          )}
                          {booking.client?.phone && (
                            <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
                              <Phone className="w-4 h-4" />
                              <span>{booking.client.phone}</span>
                            </div>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                            <p className="text-sm font-medium mb-1" style={{ color: '#374151' }}>Notes:</p>
                            <p className="text-sm" style={{ color: '#6B7280' }}>{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Total Amount</p>
                      <p className="text-3xl font-bold" style={{ color: '#6A0DAD' }}>
                        ${booking.total_amount}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        {booking.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="px-4 py-2 btn-primary"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}