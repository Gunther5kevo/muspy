'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Calendar, Star, TrendingUp, Clock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProviderDashboardPage() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    bookingsThisMonth: 0,
    averageRating: 0,
    totalBookings: 0
  });
  const [providerProfile, setProviderProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        setIsRedirecting(true);
        router.push('/login');
      } else if (profile?.role === 'client') {
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    }
  }, [loading, user, profile?.role, router, isRedirecting]);

  // Fetch provider dashboard data with parallel queries
  useEffect(() => {
    if (!user || profile?.role !== 'provider') return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        // Get provider profile first
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (providerError) throw providerError;
        setProviderProfile(providerData);

        // Calculate profile completion
        const completion = calculateProfileCompletion(providerData);
        setProfileCompletion(completion);

        const providerId = providerData.id;

        // Get current month start date
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const today = now.toISOString().split('T')[0];

        // Run all queries in parallel for faster loading
        const [
          earningsResponse,
          monthlyCountResponse,
          pendingResponse,
          todayResponse
        ] = await Promise.all([
          // Fetch total earnings from completed bookings
          supabase
            .from('bookings')
            .select('total_amount, platform_fee')
            .eq('provider_id', providerId)
            .eq('status', 'completed')
            .eq('payment_status', 'paid'),

          // Count bookings this month
          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .gte('date', monthStart)
            .in('status', ['confirmed', 'completed']),

          // Fetch pending booking requests
          supabase
            .from('bookings')
            .select(`
              *,
              client:users!client_id (
                full_name,
                avatar_url,
                email
              )
            `)
            .eq('provider_id', providerId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5),

          // Fetch today's schedule
          supabase
            .from('bookings')
            .select(`
              *,
              client:users!client_id (
                full_name,
                avatar_url,
                email
              )
            `)
            .eq('provider_id', providerId)
            .eq('date', today)
            .in('status', ['confirmed', 'pending'])
            .order('time_start', { ascending: true })
        ]);

        // Calculate total earnings
        const totalEarnings = earningsResponse.error
          ? 0
          : (earningsResponse.data?.reduce((sum, booking) => {
              return sum + (booking.total_amount - booking.platform_fee);
            }, 0) || 0);

        // Handle errors gracefully
        if (!pendingResponse.error) {
          setPendingRequests(pendingResponse.data || []);
        }

        if (!todayResponse.error) {
          setTodaysSchedule(todayResponse.data || []);
        }

        setStats({
          totalEarnings,
          bookingsThisMonth: monthlyCountResponse.count || 0,
          averageRating: providerData.rating_average || 0,
          totalBookings: providerData.total_bookings || 0
        });

      } catch (error) {
        console.error('Error fetching provider dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile?.role]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (providerData) => {
    if (!providerData) return 0;
    
    let completed = 0;
    const total = 6;

    if (providerData.bio) completed++;
    if (providerData.hourly_rate) completed++;
    if (providerData.location) completed++;
    if (providerData.services_offered?.length > 0) completed++;
    if (providerData.id_document_url) completed++;
    if (providerData.verification_status === 'verified') completed++;

    return Math.round((completed / total) * 100);
  };

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

  // Handle booking action
  const handleBookingAction = async (bookingId, action) => {
    try {
      const newStatus = action === 'accept' ? 'confirmed' : 'cancelled';
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh pending requests
      setPendingRequests(prev => prev.filter(b => b.id !== bookingId));
      
      // Refresh today's schedule if accepted
      if (action === 'accept') {
        const booking = pendingRequests.find(b => b.id === bookingId);
        if (booking && booking.date === new Date().toISOString().split('T')[0]) {
          setTodaysSchedule(prev => [...prev, { ...booking, status: 'confirmed' }].sort((a, b) => 
            a.time_start.localeCompare(b.time_start)
          ));
        }
      }

    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'provider') {
    return null;
  }

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Welcome, {profile?.full_name || 'Provider'}!
        </h1>
        <p style={{ color: '#6B7280' }}>
          Here's your provider performance overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            icon: DollarSign, 
            label: 'Total Earnings', 
            value: dataLoading ? '...' : formatCurrency(stats.totalEarnings), 
            color: '#C1A35E',
            isAmount: true
          },
          { 
            icon: Calendar, 
            label: 'Bookings This Month', 
            value: dataLoading ? '...' : stats.bookingsThisMonth.toString(), 
            color: '#6A0DAD' 
          },
          { 
            icon: Star, 
            label: 'Average Rating', 
            value: dataLoading ? '...' : stats.averageRating.toFixed(1), 
            color: '#C1A35E' 
          },
          { 
            icon: TrendingUp, 
            label: 'Total Bookings', 
            value: dataLoading ? '...' : stats.totalBookings.toString(), 
            color: '#6A0DAD' 
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

      {/* Pending Requests & Today's Schedule */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Pending Requests
          </h2>
          {dataLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A0DAD20' }}>
                        <User className="w-5 h-5" style={{ color: '#6A0DAD' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: '#2B0E3F' }}>
                          {request.client?.full_name || 'Client'}
                        </h3>
                        <p className="text-sm" style={{ color: '#6B7280' }}>
                          {formatDate(request.date)} at {formatTime(request.time_start)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#6A0DAD' }}>
                      {formatCurrency(request.total_amount)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookingAction(request.id, 'accept')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleBookingAction(request.id, 'decline')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#6B7280' }}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending booking requests</p>
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Today's Schedule
          </h2>
          {dataLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : todaysSchedule.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {todaysSchedule.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C1A35E20' }}>
                        <User className="w-5 h-5" style={{ color: '#C1A35E' }} />
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: '#2B0E3F' }}>
                          {booking.client?.full_name || 'Client'}
                        </h3>
                        <p className="text-sm flex items-center gap-1" style={{ color: '#6B7280' }}>
                          <Clock className="w-3 h-3" />
                          {formatTime(booking.time_start)} - {formatTime(booking.time_end)}
                        </p>
                      </div>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: booking.status === 'confirmed' ? '#10B98120' : '#F59E0B20',
                        color: booking.status === 'confirmed' ? '#10B981' : '#F59E0B'
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#6A0DAD' }}>
                    {formatCurrency(booking.total_amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#6B7280' }}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookings today</p>
              <Link href="/provider/availability" className="inline-block mt-4 btn-primary">
                Set Availability
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      {profileCompletion < 100 && (
        <div className="bg-gradient-luxury rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-serif font-bold mb-2">
                Complete Your Profile
              </h2>
              <p className="opacity-90">
                A complete profile gets 3x more bookings!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{profileCompletion}%</div>
              <div className="text-sm opacity-75">Complete</div>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <Link href="/provider/profile" className="inline-block bg-white px-6 py-2 rounded-lg font-semibold" style={{ color: '#6A0DAD' }}>
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  );
}