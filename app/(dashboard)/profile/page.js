'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setEditing(false);
      window.location.reload(); // Reload to update context
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
            My Profile
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
            Manage your account information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border text-center lg:sticky lg:top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-luxury flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl sm:text-4xl font-serif">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif font-bold mb-1" style={{ color: '#2B0E3F' }}>
                {profile?.full_name || 'User'}
              </h2>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)', color: '#6A0DAD' }}>
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium capitalize">{profile?.role || 'client'}</span>
              </div>

              <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold" style={{ color: '#2B0E3F' }}>
                  Account Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-secondary text-sm px-4 py-2 w-full sm:w-auto"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 700 000000"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 text-sm sm:text-base"
                      style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                    />
                    <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: profile?.full_name || '',
                          phone: profile?.phone || '',
                        });
                      }}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Display Mode */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                    <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Full Name</div>
                      <div className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>
                        {profile?.full_name || 'Not set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Email Address</div>
                      <div className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>
                        {user?.email || 'Not set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Phone Number</div>
                      <div className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>
                        {profile?.phone || 'Not set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Member Since</div>
                      <div className="font-semibold text-sm sm:text-base" style={{ color: '#2B0E3F' }}>
                        {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6" style={{ color: '#2B0E3F' }}>
                Account Status
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                  <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#6A0DAD' }}>
                    {profile?.is_verified ? '✓' : '○'}
                  </div>
                  <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                    {profile?.is_verified ? 'Verified' : 'Not Verified'}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-lg" style={{ backgroundColor: 'rgba(229, 199, 255, 0.1)' }}>
                  <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#10B981' }}>
                    {profile?.is_active ? '✓' : '○'}
                  </div>
                  <div className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                    {profile?.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}