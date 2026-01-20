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

      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      // Total providers
      const { count: totalProviders } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'provider');

      // Active bookings
      const { count: activeBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed']);

      // Pending verifications
      const { count: pendingVerifications } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'provider')
        .eq('is_verified', false);

      // Total revenue
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = bookingsData?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

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