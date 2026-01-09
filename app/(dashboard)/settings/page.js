'use client';

import React, { useState } from 'react';
import { Bell, Lock, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ClientSettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  return (
    <div className="p-8" style={{ backgroundColor: '#FDF8FF' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2B0E3F' }}>Settings</h1>
        <p className="mb-8" style={{ color: '#6B7280' }}>Manage your account preferences and security</p>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
              <Bell size={24} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>Notifications</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Choose how you want to be notified</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors" style={{ borderColor: '#E5C7FF' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Booking Reminders</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Get reminded before your scheduled appointments</p>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.booking_reminders}
                  onChange={() => handleToggle('booking_reminders')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.booking_reminders ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.booking_reminders ? 'translateX(24px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors" style={{ borderColor: '#E5C7FF' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Booking Confirmations</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Receive confirmation emails when bookings are made</p>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.booking_confirmations}
                  onChange={() => handleToggle('booking_confirmations')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.booking_confirmations ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.booking_confirmations ? 'translateX(24px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors" style={{ borderColor: '#E5C7FF' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>SMS Notifications</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Get instant text messages for urgent updates</p>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sms_notifications}
                  onChange={() => handleToggle('sms_notifications')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.sms_notifications ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.sms_notifications ? 'translateX(24px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors" style={{ borderColor: '#E5C7FF' }}>
              <div>
                <p className="font-medium" style={{ color: '#2B0E3F' }}>Promotional Emails</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Receive special offers and new provider recommendations</p>
              </div>
              <label className="relative inline-block w-12 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.promotional_emails}
                  onChange={() => handleToggle('promotional_emails')}
                  className="opacity-0 w-0 h-0"
                />
                <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData.promotional_emails ? '#8B5CF6' : '#D1D5DB' }}>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ transform: formData.promotional_emails ? 'translateX(24px)' : 'translateX(0)' }} />
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={() => toast.success('Notification preferences saved!')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Save size={18} />
            Save Notification Settings
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
              <Lock size={24} style={{ color: '#D97706' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#2B0E3F' }}>Security</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Update your password to keep your account secure</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle size={20} style={{ color: '#3B82F6', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#1E40AF' }}>Password Requirements</p>
              <ul className="text-xs space-y-1" style={{ color: '#1E3A8A' }}>
                <li>• At least 6 characters long</li>
                <li>• Use a mix of letters, numbers, and symbols for better security</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Lock size={18} />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}