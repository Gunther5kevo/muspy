import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('Loading bookings...');

      // FIXED: client_id joins to users, provider_id joins to provider_profiles
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:client_id (
            id,
            full_name,
            email
          ),
          provider:provider_id (
            id,
            user_id,
            users!provider_profiles_user_id_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Bookings error:', error);
        throw error;
      }

      // Transform data to flatten provider info
      const transformedData = data?.map(booking => ({
        ...booking,
        provider: {
          id: booking.provider?.id,
          full_name: booking.provider?.users?.full_name,
          email: booking.provider?.users?.email
        }
      })) || [];

      console.log('Bookings loaded:', transformedData.length);
      setBookings(transformedData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Booking cancelled');
      await loadBookings();
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      return false;
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return {
    bookings,
    loading,
    refresh: loadBookings,
    cancelBooking
  };
}