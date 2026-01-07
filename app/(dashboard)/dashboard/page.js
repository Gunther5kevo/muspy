'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, MessageSquare, Star, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    completedBookings: 0,
    unreadMessages: 0,
    totalSpent: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.push('/login');
      } else if (profile?.role === 'provider') {
        setIsRedirecting(true);
        router.push('/provider-dashboard');
      }
    }
  }, [loading, user, profile?.role, router, isRedirecting]);

  // Fetch dashboard data with parallel queries
  useEffect(() => {
    if (!user || profile?.role !== 'client') return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        // Run all queries in parallel for faster loading
        const [
          upcomingResponse,
          upcomingCountResponse,
          completedCountResponse,
          unreadCountResponse,
          transactionsResponse,
          recentResponse
        ] = await Promise.all([
          // Fetch upcoming bookings with provider details
          supabase
            .from('bookings')
            .select(`
              *,
              provider:provider_profiles!provider_id (
                id,
                bio,
                hourly_rate,
                location,
                rating_average,
                user:users!user_id (
                  full_name,
                  avatar_url
                )
              )
            `)
            .eq('client_id', user.id)
            .gte('date', today)
            .in('status', ['pending', 'confirmed'])
            .order('date', { ascending: true })
            .order('time_start', { ascending: true })
            .limit(5),

          // Count upcoming bookings
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', user.id)
            .gte('date', today)
            .in('status', ['pending', 'confirmed']),

          // Count completed bookings
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', user.id)
            .eq('status', 'completed'),

          // Count unread messages
          supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false),

          // Calculate total spent from completed transactions
          supabase
            .from('transactions')
            .select(`
              amount,
              bookings!inner(client_id)
            `)
            .eq('bookings.client_id', user.id)
            .eq('status', 'completed'),

          // Fetch recent activity
          supabase
            .from('bookings')
            .select(`
              *,
              provider:provider_profiles!provider_id (
                user:users!user_id (
                  full_name
                )
              )
            `)
            .eq('client_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        // Handle errors gracefully
        if (upcomingResponse.error) {
          console.error('Error fetching upcoming bookings:', upcomingResponse.error);
        } else {
          setUpcomingBookings(upcomingResponse.data || []);
        }

        if (recentResponse.error) {
          console.error('Error fetching recent activity:', recentResponse.error);
        } else {
          setRecentActivity(recentResponse.data || []);
        }

        // Calculate total spent
        const totalSpent = transactionsResponse.error 
          ? 0 
          : (transactionsResponse.data?.reduce((sum, t) => sum + t.amount, 0) || 0);

        // Update stats
        setStats({
          upcomingBookings: upcomingCountResponse.count || 0,
          completedBookings: completedCountResponse.count || 0,
          unreadMessages: unreadCountResponse.count || 0,
          totalSpent: totalSpent
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile?.role]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#6A0DAD';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'client') {
    return null;
  }

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <p style={{ color: '#6B7280' }}>
          Here's what's happening with your bookings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            icon: Calendar, 
            label: 'Upcoming Bookings', 
            value: dataLoading ? '...' : stats.upcomingBookings.toString(), 
            color: '#6A0DAD' 
          },
          { 
            icon: Star, 
            label: 'Completed', 
            value: dataLoading ? '...' : stats.completedBookings.toString(), 
            color: '#C1A35E' 
          },
          { 
            icon: MessageSquare, 
            label: 'Unread Messages', 
            value: dataLoading ? '...' : stats.unreadMessages.toString(), 
            color: '#6A0DAD' 
          },
          { 
            icon: Users, 
            label: 'Total Spent', 
            value: dataLoading ? '...' : formatCurrency(stats.totalSpent), 
            color: '#C1A35E',
            isAmount: true
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#6B7280' }}>{stat.label}</p>
                <p className={`${stat.isAmount ? 'text-2xl' : 'text-3xl'} font-bold`} style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Upcoming Bookings
          </h2>
          {dataLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold" style={{ color: '#2B0E3F' }}>
                        {booking.provider?.user?.full_name || 'Provider'}
                      </h3>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(booking.date)} at {formatTime(booking.time_start)}
                      </p>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${getStatusColor(booking.status)}20`,
                        color: getStatusColor(booking.status)
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatTime(booking.time_start)} - {formatTime(booking.time_end)}
                    </span>
                    <span className="font-semibold" style={{ color: '#6A0DAD' }}>
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#6B7280' }}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming bookings</p>
              <Link href="/providers" className="inline-block mt-4 btn-primary">
                Browse Providers
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Recent Activity
          </h2>
          {dataLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: getStatusColor(activity.status) }}></div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: '#2B0E3F' }}>
                      Booking with <span className="font-semibold">{activity.provider?.user?.full_name || 'Provider'}</span>
                    </p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {formatDate(activity.date)} • {activity.status}
                    </p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#6A0DAD' }}>
                    {formatCurrency(activity.total_amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#6B7280' }}>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/providers" className="btn-primary text-center">
            Browse Providers
          </Link>
          <Link href="/bookings" className="btn-secondary text-center">
            View All Bookings
          </Link>
          <Link href="/messages" className="btn-secondary text-center">
            Messages {stats.unreadMessages > 0 && `(${stats.unreadMessages})`}
          </Link>
        </div>
      </div>
    </div>
  );
}