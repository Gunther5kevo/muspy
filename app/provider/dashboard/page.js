'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Calendar, Star, TrendingUp, Clock, User, CheckCircle, XCircle, AlertCircle, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Mobile-First Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const BookingCardSkeleton = () => (
  <div className="border-2 rounded-xl p-3 border-gray-200 animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 bg-gray-100 rounded-lg flex-1"></div>
      <div className="h-8 bg-gray-100 rounded-lg flex-1"></div>
    </div>
  </div>
);

export default function ProviderDashboardPage() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();
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
  const [actionLoading, setActionLoading] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile?.role === 'client') {
        router.push('/dashboard');
      }
    }
  }, [loading, user, profile?.role, router]);

  useEffect(() => {
    if (!user || profile?.role !== 'provider') return;

    const fetchDashboardData = async () => {
      setDataLoading(true);
      try {
        const { data: providerData, error: providerError } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (providerError) throw providerError;
        setProviderProfile(providerData);

        // Get photo count
        const { data: photosData, error: photosError } = await supabase
          .from('provider_photos')
          .select('id', { count: 'exact' })
          .eq('provider_id', providerData.id);

        const photoCount = photosError ? 0 : (photosData?.length || 0);

        const { completion, missing } = calculateProfileCompletion(providerData, photoCount);
        setProfileCompletion(completion);
        setMissingFields(missing);

        const providerId = providerData.id;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const today = now.toISOString().split('T')[0];

        const [
          earningsResponse,
          monthlyCountResponse,
          pendingResponse,
          todayResponse
        ] = await Promise.all([
          supabase
            .from('bookings')
            .select('total_amount, platform_fee')
            .eq('provider_id', providerId)
            .eq('status', 'completed')
            .eq('payment_status', 'paid'),

          supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .gte('date', monthStart)
            .in('status', ['confirmed', 'completed']),

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

        const totalEarnings = earningsResponse.error
          ? 0
          : (earningsResponse.data?.reduce((sum, booking) => {
              return sum + (booking.total_amount - booking.platform_fee);
            }, 0) || 0);

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
        toast.error('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile?.role]);

  const calculateProfileCompletion = (providerData, photoCount) => {
    if (!providerData) return { completion: 0, missing: [] };
    
    const checks = [
      { field: 'bio', label: 'Professional Bio', completed: !!providerData.bio },
      { field: 'hourly_rate', label: 'Hourly Rate', completed: !!providerData.hourly_rate },
      { field: 'location', label: 'Location', completed: !!providerData.location },
      { field: 'services_offered', label: 'Services Offered', completed: !!(providerData.services_offered?.length > 0) },
      { field: 'photos', label: 'Profile Photos', completed: photoCount > 0 },
      { field: 'verification', label: 'Account Verification', completed: providerData.verification_status === 'verified' }
    ];

    const completed = checks.filter(c => c.completed).length;
    const total = checks.length;
    const missing = checks.filter(c => !c.completed).map(c => c.label);

    return {
      completion: Math.round((completed / total) * 100),
      missing
    };
  };

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

  const handleBookingAction = async (bookingId, action) => {
    setActionLoading(bookingId);
    try {
      const newStatus = action === 'accept' ? 'confirmed' : 'cancelled';
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setPendingRequests(prev => prev.filter(b => b.id !== bookingId));
      
      if (action === 'accept') {
        const booking = pendingRequests.find(b => b.id === bookingId);
        if (booking && booking.date === new Date().toISOString().split('T')[0]) {
          setTodaysSchedule(prev => [...prev, { ...booking, status: 'confirmed' }].sort((a, b) => 
            a.time_start.localeCompare(b.time_start)
          ));
        }
      }

      toast.success(action === 'accept' ? 'Booking accepted!' : 'Booking declined', {
        icon: action === 'accept' ? '✅' : '❌'
      });

    } catch (error) {
      toast.error('Failed to update booking');
      console.error('Booking action error:', error);
    } finally {
      setActionLoading(null);
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
              <TrendingUp className="w-7 h-7 text-purple-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'provider') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="px-4 py-6 pb-20">
        {/* Welcome Header - Mobile Optimized */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent mb-1">
            Welcome, {profile?.full_name?.split(' ')[0] || 'Provider'}! 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Your daily overview
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
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-lg text-white">
                <DollarSign className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-emerald-100 text-xs mb-1">Earnings</p>
                <p className="text-xl font-bold leading-tight">{formatCurrency(stats.totalEarnings)}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-100">
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-gray-600 text-xs mb-1">This Month</p>
                <p className="text-2xl font-bold text-purple-900">{stats.bookingsThisMonth}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-100">
                <Star className="w-8 h-8 text-amber-500 fill-current mb-2" />
                <p className="text-gray-600 text-xs mb-1">Rating</p>
                <p className="text-2xl font-bold text-amber-600">{stats.averageRating.toFixed(1)}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-100">
                <CheckCircle className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-gray-600 text-xs mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
              </div>
            </>
          )}
        </div>

        {/* Profile Completion Banner - Mobile */}
        {profileCompletion < 100 && !dataLoading && (
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 shadow-xl text-white mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <h2 className="text-lg font-bold">Complete Profile</h2>
                </div>
                <p className="text-purple-100 text-sm mb-3">
                  Get <span className="font-bold">3x more bookings</span> at 100%
                </p>
                
                {/* Missing Fields */}
                {missingFields.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold mb-2 text-purple-100">Still needed:</p>
                    <div className="space-y-1">
                      {missingFields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <span>{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-bold mb-1">{profileCompletion}%</div>
                <div className="text-xs text-purple-200">
                  {6 - missingFields.length}/6
                </div>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            
            <Link 
              href="/provider/profile" 
              className="flex items-center justify-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg text-sm active:scale-95"
            >
              Complete Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 100% Complete Celebration */}
        {profileCompletion === 100 && !dataLoading && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 shadow-xl text-white mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Profile Complete! 🎉</h3>
                <p className="text-green-100 text-sm">
                  Your profile is optimized for maximum bookings
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests - Mobile First */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-purple-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Pending Requests
            </h2>
            {pendingRequests.length > 0 && (
              <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                {pendingRequests.length}
              </span>
            )}
          </div>
          
          {dataLoading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border-2 rounded-xl p-3 border-purple-100 hover:border-purple-200 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                      {request.client?.avatar_url ? (
                        <img src={request.client.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-purple-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {request.client?.full_name || 'Client'}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(request.date)} • {formatTime(request.time_start)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-purple-700 flex-shrink-0">
                      {formatCurrency(request.total_amount)}
                    </span>
                  </div>
                  
                  {request.notes && (
                    <p className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg line-clamp-2">
                      "{request.notes}"
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookingAction(request.id, 'accept')}
                      disabled={actionLoading === request.id}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
                    >
                      {actionLoading === request.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBookingAction(request.id, 'decline')}
                      disabled={actionLoading === request.id}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
                    >
                      {actionLoading === request.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Decline
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">All caught up!</h3>
              <p className="text-xs text-gray-600">No pending requests</p>
            </div>
          )}
        </div>

        {/* Today's Schedule - Mobile First */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Schedule
            </h2>
            {todaysSchedule.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                {todaysSchedule.length}
              </span>
            )}
          </div>
          
          {dataLoading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : todaysSchedule.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todaysSchedule.map((booking) => (
                <div key={booking.id} className="border-2 rounded-xl p-3 border-blue-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      {booking.client?.avatar_url ? (
                        <img src={booking.client.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-blue-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {booking.client?.full_name || 'Client'}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(booking.time_start)} - {formatTime(booking.time_end)}
                      </p>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full font-bold flex-shrink-0"
                      style={{ 
                        backgroundColor: booking.status === 'confirmed' ? '#10B98120' : '#F59E0B20',
                        color: booking.status === 'confirmed' ? '#10B981' : '#F59E0B'
                      }}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-600">Service Fee</span>
                    <span className="text-sm font-bold text-purple-700">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">No bookings today</h3>
              <p className="text-xs text-gray-600 mb-4">Set availability to get bookings</p>
              <Link 
                href="/provider/availability" 
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg active:scale-95 transition-transform"
              >
                Set Availability
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}