import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeDisputes: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      console.log('Loading admin stats...');

      // Total users (clients)
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      if (usersError) console.error('Users error:', usersError);

      // Total providers - COUNT FROM PROVIDER_PROFILES TABLE
      const { count: totalProviders, error: providersError } = await supabase
        .from('provider_profiles')
        .select('*', { count: 'exact', head: true });

      if (providersError) console.error('Providers error:', providersError);

      // Active bookings
      const { count: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed']);

      if (bookingsError) console.error('Bookings error:', bookingsError);

      // Pending verifications - FROM USERS TABLE
      const { count: pendingVerifications, error: verifyError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'provider')
        .eq('is_verified', false);

      if (verifyError) console.error('Verify error:', verifyError);

      // Total revenue - USE total_amount NOT amount
      const { data: bookingsData, error: revenueError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'completed');

      if (revenueError) console.error('Revenue error:', revenueError);

      const totalRevenue = bookingsData?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      console.log('Stats loaded:', {
        totalUsers,
        totalProviders,
        activeBookings,
        totalRevenue,
        pendingVerifications
      });

      setStats({
        totalUsers: totalUsers || 0,
        totalProviders: totalProviders || 0,
        activeBookings: activeBookings || 0,
        totalRevenue,
        pendingVerifications: pendingVerifications || 0,
        activeDisputes: 0
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, refresh: loadStats };
}