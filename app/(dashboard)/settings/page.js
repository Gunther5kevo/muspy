'use client';

import React, { useState } from 'react';
import { Bell, Lock, Save, AlertCircle, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ClientSettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [formData, setFormData] = useState({
    booking_reminders: true,
    booking_confirmations: true,
    promotional_emails: false,
    sms_notifications: false
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const updatePassword = async () => {
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      toast.success('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    toast.success('Setting updated');
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      setLoggingOut(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24 sm:pb-8" style={{ backgroundColor: '#FDF8FF' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#2B0E3F' }}>Settings</h1>
        <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: '#6B7280' }}>Manage your account preferences and security</p>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
              <Bell size={20} className="sm:w-6 sm:h-6" style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#2B0E3F' }}>Notifications</h2>
              <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Choose how you want to be notified</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-purple-50 transition-colors active:bg-purple-100" style={{ borderColor: '#E5C7FF' }}>
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>Booking Reminders</p>
                <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Get reminded before your scheduled appointments</p>
              </div>
              <label className="relative inline-block w-10 h-5 sm:w-12 sm:h-6 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.booking_reminders}
                  onChange={() => handleToggle('booking_reminders')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.booking_reminders ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.booking_reminders ? 'translateX(20px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-purple-50 transition-colors active:bg-purple-100" style={{ borderColor: '#E5C7FF' }}>
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>Booking Confirmations</p>
                <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Receive confirmation emails when bookings are made</p>
              </div>
              <label className="relative inline-block w-10 h-5 sm:w-12 sm:h-6 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.booking_confirmations}
                  onChange={() => handleToggle('booking_confirmations')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.booking_confirmations ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.booking_confirmations ? 'translateX(20px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-purple-50 transition-colors active:bg-purple-100" style={{ borderColor: '#E5C7FF' }}>
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>SMS Notifications</p>
                <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Get instant text messages for urgent updates</p>
              </div>
              <label className="relative inline-block w-10 h-5 sm:w-12 sm:h-6 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.sms_notifications}
                  onChange={() => handleToggle('sms_notifications')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.sms_notifications ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.sms_notifications ? 'translateX(20px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-purple-50 transition-colors active:bg-purple-100" style={{ borderColor: '#E5C7FF' }}>
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#2B0E3F' }}>Promotional Emails</p>
                <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Receive special offers and new provider recommendations</p>
              </div>
              <label className="relative inline-block w-10 h-5 sm:w-12 sm:h-6 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.promotional_emails}
                  onChange={() => handleToggle('promotional_emails')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.promotional_emails ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.promotional_emails ? 'translateX(20px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={() => toast.success('Notification preferences saved!')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 active:scale-95 text-sm sm:text-base min-h-[44px]"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            Save Notification Settings
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
              <Lock size={20} className="sm:w-6 sm:h-6" style={{ color: '#D97706' }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#2B0E3F' }}>Security</h2>
              <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Update your password to keep your account secure</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3">
            <AlertCircle size={18} className="sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#3B82F6', marginTop: '2px' }} />
            <div>
              <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: '#1E40AF' }}>Password Requirements</p>
              <ul className="text-xs space-y-1" style={{ color: '#1E3A8A' }}>
                <li>• At least 6 characters long</li>
                <li>• Use a mix of letters, numbers, and symbols for better security</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 active:text-gray-900 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 active:text-gray-900 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showConfirmPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            onClick={updatePassword}
            disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {/* Sign Out Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
              <LogOut size={20} className="sm:w-6 sm:h-6" style={{ color: '#EF4444' }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#2B0E3F' }}>Sign Out</h2>
              <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>Sign out from your account</p>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            You can always sign back in anytime with your email and password.
          </p>

          <button
            onClick={() => setShowSignOutModal(true)}
            disabled={loggingOut}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 text-sm sm:text-base min-h-[44px]"
            style={{ backgroundColor: '#EF4444' }}
          >
            <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle size={24} style={{ color: '#EF4444' }} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#2B0E3F' }}>
                Sign Out?
              </h3>
            </div>
            
            <p className="text-sm sm:text-base mb-6" style={{ color: '#6B7280' }}>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutModal(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 sm:py-3 border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base font-medium min-h-[44px]"
                style={{ borderColor: '#E5C7FF', color: '#6B7280' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-lg text-white transition-all hover:opacity-90 active:scale-95 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2 font-medium min-h-[44px]"
                style={{ backgroundColor: '#EF4444' }}
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}