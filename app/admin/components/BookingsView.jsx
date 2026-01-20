import { useState } from 'react';
import { Search, Eye, XCircle } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';

export default function BookingsView() {
  const { bookings, loading, cancelBooking } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(b => 
    b.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.provider?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
          Bookings Management
        </h2>
        <p style={{ color: '#6B7280' }}>Monitor all platform bookings</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(to right, #F8F5FF, #E5C7FF)' }}>
              <tr>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Booking ID</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Client</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Provider</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Date & Time</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Amount</th>
                <th className="text-left p-4 font-semibold" style={{ color: '#2B0E3F' }}>Status</th>
                <th className="text-right p-4 font-semibold" style={{ color: '#2B0E3F' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center" style={{ color: '#6B7280' }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t hover:bg-purple-50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-mono" style={{ color: '#6B7280' }}>
                        {booking.id.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium" style={{ color: '#2B0E3F' }}>
                          {booking.client?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {booking.client?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium" style={{ color: '#2B0E3F' }}>
                          {booking.provider?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {booking.provider?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm" style={{ color: '#2B0E3F' }}>
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        {booking.booking_time}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold" style={{ color: '#6A0DAD' }}>
                        ${booking.amount}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-purple-100 transition-colors" style={{ color: '#6A0DAD' }} title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}