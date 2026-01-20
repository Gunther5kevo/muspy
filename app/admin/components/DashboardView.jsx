import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import { useBookings } from '../hooks/useBookings';
import StatCard from './StatCard';

export default function DashboardView() {
  const { stats, loading: statsLoading } = useAdminStats();
  const { bookings } = useBookings();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Dashboard Overview
        </h2>
        <p style={{ color: '#6B7280' }}>Monitor your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="linear-gradient(to right, #6A0DAD, #9D4EDD)"
        />
        <StatCard
          icon={UserCheck}
          label="Total Providers"
          value={stats.totalProviders}
          color="linear-gradient(to right, #2B0E3F, #6A0DAD)"
        />
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={stats.activeBookings}
          color="linear-gradient(to right, #C1A35E, #E5D9B6)"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          color="linear-gradient(to right, #059669, #10B981)"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#2B0E3F' }}>Pending Verifications</h3>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
              {stats.pendingVerifications}
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Provider applications waiting for review
          </p>
          <button className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
            Review Now
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#2B0E3F' }}>Active Disputes</h3>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium">
              {stats.activeDisputes}
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            Issues requiring attention
          </p>
          <button className="px-4 py-2 rounded-lg font-medium transition-all border-2 hover:bg-purple-50"
                  style={{ borderColor: '#6A0DAD', color: '#6A0DAD' }}>
            View Disputes
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl p-6 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#2B0E3F' }}>Recent Bookings</h3>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                     style={{ background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)' }}>
                  {booking.client?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#2B0E3F' }}>
                    {booking.client?.full_name} → {booking.provider?.full_name}
                  </p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: '#6A0DAD' }}>${booking.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}