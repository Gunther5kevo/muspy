'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, MessageSquare, Star, Clock, TrendingUp, Search, ArrowRight, DollarSign, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Mobile-First Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-12"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const BookingCardSkeleton = () => (
  <div className="border-2 rounded-xl p-3 border-gray-200 animate-pulse">
    <div className="flex items-start gap-3 mb-2">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="flex items-start gap-3 pb-3 border-b border-gray-100 animate-pulse">
    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
    <div className="flex-1">
      <div className="h-3 bg-gray-200 rounded w-40 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-24"></div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();
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
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile?.role === 'provider') {
        router.push('/provider-dashboard');
      }
    }
  }, [loading, user, profile?.role, router]);

  useEffect(() => {
    if (!user || profile?.role !== 'client') return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        const [
          upcomingResponse,
          upcomingCountResponse,
          completedCountResponse,
          unreadCountResponse,
          transactionsResponse,
          recentResponse
        ] = await Promise.all([
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

          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', user.id)
            .gte('date', today)
            .in('status', ['pending', 'confirmed']),

          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', user.id)
            .eq('status', 'completed'),

          supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false),

          supabase
            .from('transactions')
            .select(`
              amount,
              bookings!inner(client_id)
            `)
            .eq('bookings.client_id', user.id)
            .eq('status', 'completed'),

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

        if (!upcomingResponse.error) {
          setUpcomingBookings(upcomingResponse.data || []);
        }

        if (!recentResponse.error) {
          setRecentActivity(recentResponse.data || []);
        }

        const totalSpent = transactionsResponse.error 
          ? 0 
          : (transactionsResponse.data?.reduce((sum, t) => sum + t.amount, 0) || 0);

        setStats({
          upcomingBookings: upcomingCountResponse.count || 0,
          completedBookings: completedCountResponse.count || 0,
          unreadMessages: unreadCountResponse.count || 0,
          totalSpent: totalSpent
        });

      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile?.role]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#10B98120', text: '#10B981', dot: '#10B981' };
      case 'pending': return { bg: '#F59E0B20', text: '#F59E0B', dot: '#F59E0B' };
      case 'completed': return { bg: '#6A0DAD20', text: '#6A0DAD', dot: '#6A0DAD' };
      case 'cancelled': return { bg: '#EF444420', text: '#EF4444', dot: '#EF4444' };
      default: return { bg: '#6B728020', text: '#6B7280', dot: '#6B7280' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white px-4">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <div className="w-16 h-16 border-4 border-purple-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-7 h-7 text-purple-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'client') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="px-4 py-6 pb-20">
        {/* Welcome Header - Mobile Optimized */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent mb-1">
            Hi, {profile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Your bookings at a glance
          </p>
        </div>

        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {dataLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg text-white">
                <Calendar className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-purple-100 text-xs mb-1">Upcoming</p>
                <p className="text-2xl font-bold">{stats.upcomingBookings}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-100">
                <Star className="w-8 h-8 text-amber-500 fill-current mb-2" />
                <p className="text-gray-600 text-xs mb-1">Completed</p>
                <p className="text-2xl font-bold text-amber-600">{stats.completedBookings}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-100 relative">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-2" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                )}
                <p className="text-gray-600 text-xs mb-1">Messages</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unreadMessages}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-lg text-white">
                <DollarSign className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-emerald-100 text-xs mb-1">Spent</p>
                <p className="text-lg font-bold leading-tight">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </>
          )}
        </div>

        {/* CTA Banner - Mobile */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 shadow-xl text-white mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-6 h-6" />
            <h2 className="text-lg font-bold">Find Your Service</h2>
          </div>
          <p className="text-purple-100 text-sm mb-4">
            Browse verified providers for your needs
          </p>
          <Link 
            href="/providers" 
            className="flex items-center justify-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg text-sm"
          >
            Browse Providers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Upcoming Bookings - Mobile */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-purple-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Upcoming
            </h2>
            {upcomingBookings.length > 0 && (
              <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">
                {upcomingBookings.length}
              </span>
            )}
          </div>
          
          {dataLoading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingBookings.map((booking) => {
                const statusColors = getStatusColor(booking.status);
                return (
                  <div key={booking.id} className="border-2 rounded-xl p-3 border-purple-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                        {booking.provider?.user?.avatar_url ? (
                          <img 
                            src={booking.provider.user.avatar_url} 
                            alt="" 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          <Users className="w-5 h-5 text-purple-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {booking.provider?.user?.full_name || 'Provider'}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {formatDate(booking.date)} • {formatTime(booking.time_start)}
                        </p>
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-bold flex-shrink-0"
                        style={{ 
                          backgroundColor: statusColors.bg,
                          color: statusColors.text
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(booking.time_start)} - {formatTime(booking.time_end)}
                      </span>
                      <span className="text-sm font-bold text-purple-700">
                        {formatCurrency(booking.total_amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">No upcoming bookings</h3>
              <p className="text-xs text-gray-600 mb-4">Start exploring providers</p>
              <Link 
                href="/providers" 
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg"
              >
                Browse Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity - Mobile */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-purple-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h2>
          </div>
          
          {dataLoading ? (
            <div className="space-y-3">
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => {
                const statusColors = getStatusColor(activity.status);
                return (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-purple-50 last:border-0">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: statusColors.dot }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900">
                        <span className="font-bold text-purple-900">{activity.provider?.user?.full_name || 'Provider'}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.date)}
                        </p>
                        <span className="text-xs">•</span>
                        <span 
                          className="text-xs font-semibold"
                          style={{ color: statusColors.text }}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700 flex-shrink-0">
                      {formatCurrency(activity.total_amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-gray-600">No recent activity</p>
            </div>
          )}
        </div>

        {/* Quick Actions - Mobile Grid */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-purple-100">
          <h2 className="text-lg font-bold text-purple-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/providers" 
              className="flex items-center justify-between bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-purple-700" />
                </div>
                <span className="font-bold text-purple-900 text-sm">Browse Providers</span>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600" />
            </Link>
            
            <Link 
              href="/bookings" 
              className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                <span className="font-bold text-blue-900 text-sm">All Bookings</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </Link>
            
            <Link 
              href="/messages" 
              className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-4 transition-all active:scale-95 relative"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center relative">
                  <MessageSquare className="w-5 h-5 text-amber-700" />
                  {stats.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {stats.unreadMessages}
                    </span>
                  )}
                </div>
                <span className="font-bold text-amber-900 text-sm">
                  Messages {stats.unreadMessages > 0 && `(${stats.unreadMessages})`}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}