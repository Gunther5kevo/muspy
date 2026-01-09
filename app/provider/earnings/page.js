'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Download, Filter, CreditCard } from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase';

export default function EarningsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    initializeProvider();
  }, []);

  useEffect(() => {
    if (providerId) loadTransactions();
  }, [filter, dateRange, providerId]);

  const initializeProvider = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProviderId(data.id);
    } catch (err) {
      setError('Failed to load provider information');
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('provider_id', providerId);

      if (bookingsError) throw bookingsError;

      const bookingIds = bookings?.map(b => b.id) || [];
      if (bookingIds.length === 0) {
        setTransactions([]);
        return;
      }

      let query = supabase
        .from('transactions')
        .select('*')
        .in('booking_id', bookingIds)
        .order('created_at', { ascending: false });

      if (filter !== 'all') query = query.eq('status', filter);

      const now = new Date();
      const ranges = {
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      };

      if (ranges[dateRange]) {
        const startDate = new Date(now.getTime() - ranges[dateRange]);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      
      setTransactions(data || []);
    } catch (err) {
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    const totalEarnings = completed.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalEarnings,
      pendingAmount,
      completedCount: completed.length,
      avgTransaction: completed.length > 0 ? totalEarnings / completed.length : 0
    };
  }, [transactions]);

  const formatCurrency = (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      completed: { bg: '#F0FDF4', text: '#16A34A', icon: CheckCircle },
      pending: { bg: '#FFFBEB', text: '#D97706', icon: Clock },
      failed: { bg: '#FEF2F2', text: '#DC2626', icon: XCircle }
    };
    return styles[status] || { bg: '#F9FAFB', text: '#6B7280', icon: null };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Booking ID', 'Amount', 'Currency', 'Status', 'Payment Method', 'Stripe ID'];
    const rows = transactions.map(t => [
      formatDate(t.created_at),
      t.booking_id,
      t.amount / 100,
      t.currency,
      t.status,
      t.payment_method,
      t.stripe_payment_id
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24" style={{ backgroundColor: '#FDF8FF' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#2B0E3F' }}>Earnings</h1>
          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 min-h-[44px]"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {[
            { label: 'Total Earnings', value: stats.totalEarnings, icon: DollarSign, bg: '#F3E8FF', color: '#8B5CF6', subtitle: `${stats.completedCount} completed` },
            { label: 'Pending', value: stats.pendingAmount, icon: Clock, bg: '#FEF3C7', color: '#D97706', subtitle: 'Processing' },
            { label: 'Completed', value: stats.completedCount, icon: CheckCircle, bg: '#D1FAE5', color: '#10B981', subtitle: 'This period', isCount: true },
            { label: 'Average', value: stats.avgTransaction, icon: TrendingUp, bg: '#DBEAFE', color: '#3B82F6', subtitle: 'Per booking' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-medium truncate pr-2" style={{ color: '#6B7280' }}>{stat.label}</span>
                <div className="p-1.5 md:p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: stat.bg }}>
                  <stat.icon size={16} className="md:w-5 md:h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-lg md:text-2xl font-bold truncate" style={{ color: '#2B0E3F' }}>
                {stat.isCount ? stat.value : formatCurrency(stat.value)}
              </p>
              <p className="text-xs mt-1 truncate" style={{ color: '#6B7280' }}>{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Filters - Horizontal scroll on mobile */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Filter size={16} style={{ color: '#6B7280' }} />
            <span className="text-xs md:text-sm font-medium" style={{ color: '#6B7280' }}>Filters</span>
          </div>
          
          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
            {['all', 'completed', 'pending', 'failed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-shrink-0 active:scale-95 min-h-[44px] ${filter === status ? 'text-white' : 'hover:bg-purple-50'}`}
                style={filter === status ? { backgroundColor: '#8B5CF6' } : { color: '#6B7280' }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Date Range Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {['week', 'month', 'year', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-shrink-0 active:scale-95 min-h-[44px] ${dateRange === range ? 'text-white' : 'hover:bg-purple-50'}`}
                style={dateRange === range ? { backgroundColor: '#8B5CF6' } : { color: '#6B7280', border: '1px solid #E5E7EB' }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List - Desktop Table / Mobile Cards */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr>
                  {['Date', 'Booking ID', 'Amount', 'Payment Method', 'Status', 'Stripe ID'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center" style={{ color: '#6B7280' }}>Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center"><XCircle size={48} style={{ color: '#EF4444' }} className="mx-auto mb-2" /><p style={{ color: '#EF4444' }}>{error}</p></td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center"><DollarSign size={48} style={{ color: '#8B5CF6' }} className="mx-auto mb-2 opacity-20" /><p className="text-lg font-semibold mb-1" style={{ color: '#2B0E3F' }}>No transactions yet</p><p className="text-sm" style={{ color: '#6B7280' }}>Your earnings will appear once you receive bookings</p></td></tr>
                ) : (
                  transactions.map(t => {
                    const statusStyle = getStatusStyle(t.status);
                    const StatusIcon = statusStyle.icon;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#374151' }}>{formatDate(t.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#8B5CF6' }}>{t.booking_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: '#2B0E3F' }}>{formatCurrency(t.amount, t.currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex items-center gap-2"><CreditCard size={16} style={{ color: '#6B7280' }} /><span style={{ color: '#374151' }}>{t.payment_method.charAt(0).toUpperCase() + t.payment_method.slice(1)}</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>{StatusIcon && <StatusIcon size={16} />}{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: '#6B7280' }}>{t.stripe_payment_id}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center" style={{ color: '#6B7280' }}>Loading...</div>
            ) : error ? (
              <div className="p-8 text-center">
                <XCircle size={48} style={{ color: '#EF4444' }} className="mx-auto mb-2" />
                <p style={{ color: '#EF4444' }}>{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign size={48} style={{ color: '#8B5CF6' }} className="mx-auto mb-2 opacity-20" />
                <p className="text-lg font-semibold mb-1" style={{ color: '#2B0E3F' }}>No transactions yet</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Your earnings will appear once you receive bookings</p>
              </div>
            ) : (
              transactions.map(t => {
                const statusStyle = getStatusStyle(t.status);
                const StatusIcon = statusStyle.icon;
                return (
                  <div key={t.id} className="p-4 active:bg-gray-50 transition-colors">
                    {/* Header Row - Status and Amount */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                        {StatusIcon && <StatusIcon size={14} />}
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: '#2B0E3F' }}>{formatCurrency(t.amount, t.currency)}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#6B7280' }}>Date</span>
                        <span style={{ color: '#374151' }} className="font-medium">{formatDate(t.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#6B7280' }}>Booking ID</span>
                        <span style={{ color: '#8B5CF6' }} className="font-medium truncate ml-2">{t.booking_id}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#6B7280' }}>Payment Method</span>
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={14} style={{ color: '#6B7280' }} />
                          <span style={{ color: '#374151' }} className="font-medium">{t.payment_method.charAt(0).toUpperCase() + t.payment_method.slice(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#6B7280' }}>Stripe ID</span>
                        <span style={{ color: '#6B7280' }} className="font-mono text-xs truncate ml-2 max-w-[180px]">{t.stripe_payment_id}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}