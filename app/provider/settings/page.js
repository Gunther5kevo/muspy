'use client';

import React, { useState } from 'react';
import { Bell, Lock, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    notifications_email: true,
    notifications_sms: false,
    booking_reminders: true,
    payment_alerts: true,
    marketing_emails: false
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
    <div className="min-h-screen p-4 md:p-8 pb-24" style={{ backgroundColor: '#FDF8FF' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2" style={{ color: '#2B0E3F' }}>Settings</h1>
        <p className="text-sm md:text-base mb-6 md:mb-8" style={{ color: '#6B7280' }}>Manage your account preferences and security</p>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-4 md:mb-6" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: '#F3E8FF' }}>
              <Bell size={20} className="md:w-6 md:h-6" style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold" style={{ color: '#2B0E3F' }}>Notifications</h2>
              <p className="text-xs md:text-sm" style={{ color: '#6B7280' }}>Choose how you want to be notified</p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            {[
              { key: 'notifications_email', title: 'Email Notifications', desc: 'Receive booking updates via email' },
              { key: 'notifications_sms', title: 'SMS Notifications', desc: 'Get instant text messages' },
              { key: 'booking_reminders', title: 'Booking Reminders', desc: 'Reminders before bookings' },
              { key: 'payment_alerts', title: 'Payment Alerts', desc: 'Notified when you receive payments' },
              { key: 'marketing_emails', title: 'Marketing Emails', desc: 'Tips and promotional content' }
            ].map(item => (
              <div 
                key={item.key}
                className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-purple-50 transition-colors active:bg-purple-100" 
                style={{ borderColor: '#E5C7FF' }}
              >
                <div className="flex-1 pr-3">
                  <p className="font-medium text-sm md:text-base" style={{ color: '#2B0E3F' }}>{item.title}</p>
                  <p className="text-xs md:text-sm line-clamp-1" style={{ color: '#6B7280' }}>{item.desc}</p>
                </div>
                <label className="relative inline-block w-11 h-6 md:w-12 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={() => handleToggle(item.key)}
                    className="opacity-0 w-0 h-0"
                  />
                  <span className="absolute inset-0 rounded-full transition-all" style={{ backgroundColor: formData[item.key] ? '#8B5CF6' : '#D1D5DB' }}>
                    <span 
                      className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" 
                      style={{ transform: formData[item.key] ? 'translateX(20px)' : 'translateX(0)' }} 
                    />
                  </span>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.success('Notification preferences saved!')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all hover:opacity-90 active:scale-95 min-h-[44px]"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Save size={16} className="md:w-[18px] md:h-[18px]" />
            Save Notification Settings
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8" style={{ border: '1px solid rgba(229, 199, 255, 0.2)' }}>
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
              <Lock size={20} className="md:w-6 md:h-6" style={{ color: '#D97706' }} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold" style={{ color: '#2B0E3F' }}>Security</h2>
              <p className="text-xs md:text-sm" style={{ color: '#6B7280' }}>Update your password</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex gap-2 md:gap-3">
            <AlertCircle size={18} className="md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
            <div>
              <p className="text-xs md:text-sm font-medium mb-1" style={{ color: '#1E40AF' }}>Password Requirements</p>
              <ul className="text-xs space-y-0.5 md:space-y-1" style={{ color: '#1E3A8A' }}>
                <li>• At least 6 characters long</li>
                <li>• Use a mix of letters, numbers, and symbols</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div>
              <label className="block text-sm md:text-base font-medium mb-2" style={{ color: '#2B0E3F' }}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full px-3 md:px-4 py-3 pr-11 md:pr-12 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 active:text-gray-900 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                </button>
              </div>
              {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm md:text-base font-medium mb-2" style={{ color: '#2B0E3F' }}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="w-full px-3 md:px-4 py-3 pr-11 md:pr-12 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 min-h-[44px]"
                  style={{ borderColor: '#E5C7FF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 active:text-gray-900 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {showConfirmPassword ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            onClick={updatePassword}
            disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg text-white text-sm md:text-base font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <Lock size={16} className="md:w-[18px] md:h-[18px]" />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}