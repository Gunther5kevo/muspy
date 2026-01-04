'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, Calendar, Star, TrendingUp } from 'lucide-react';

export default function ProviderDashboardPage() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile?.role === 'client') {
        router.push('/dashboard');
      }
    }
  }, [loading, user, profile, router]);

  if (loading) {
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
          { icon: DollarSign, label: 'Total Earnings', value: '$0', color: '#C1A35E' },
          { icon: Calendar, label: 'Bookings This Month', value: '0', color: '#6A0DAD' },
          { icon: Star, label: 'Average Rating', value: '0.0', color: '#C1A35E' },
          { icon: TrendingUp, label: 'Profile Views', value: '0', color: '#6A0DAD' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#6B7280' }}>{stat.label}</p>
                <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Pending Requests
          </h2>
          <div className="text-center py-8" style={{ color: '#6B7280' }}>
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pending booking requests</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Today's Schedule
          </h2>
          <div className="text-center py-8" style={{ color: '#6B7280' }}>
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bookings today</p>
            <Link href="/provider/availability" className="inline-block mt-4 btn-primary">
              Set Availability
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-luxury rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-xl font-serif font-bold mb-4">
          Complete Your Profile
        </h2>
        <p className="mb-4">
          A complete profile gets 3x more bookings!
        </p>
        <div className="flex gap-4">
          <Link href="/provider/profile" className="bg-white px-6 py-2 rounded-lg font-semibold" style={{ color: '#6A0DAD' }}>
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
}