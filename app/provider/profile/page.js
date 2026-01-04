'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, DollarSign, MapPin, FileText, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderProfilePage() {
  const { user, profile: userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    hourly_rate: '',
    location: '',
    services_offered: '',
  });

  useEffect(() => {
    if (user) {
      fetchProviderProfile();
    }
  }, [user]);

  const fetchProviderProfile = async () => {
    try {
      console.log('Fetching provider profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid error when not found

      console.log('Provider profile query result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        setError('fetch_error');
        throw error;
      }

      if (data) {
        console.log('Profile found:', data);
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          hourly_rate: data.hourly_rate?.toString() || '',
          location: data.location || '',
          services_offered: Array.isArray(data.services_offered) 
            ? data.services_offered.join(', ') 
            : '',
        });
      } else {
        console.log('No profile found, will create new one on submit');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in fetchProviderProfile:', error);
      setError('fetch_error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Submitting profile data...');
      
      const servicesArray = formData.services_offered
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const profileData = {
        user_id: user.id,
        bio: formData.bio,
        hourly_rate: parseInt(formData.hourly_rate),
        location: formData.location,
        services_offered: servicesArray,
      };

      console.log('Profile data to save:', profileData);

      let result;
      if (profile) {
        // Update existing profile
        console.log('Updating existing profile...');
        result = await supabase
          .from('provider_profiles')
          .update(profileData)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Create new profile
        console.log('Creating new profile...');
        result = await supabase
          .from('provider_profiles')
          .insert([profileData])
          .select()
          .single();
      }

      console.log('Save result:', result);

      if (result.error) throw result.error;

      toast.success('Profile updated successfully!');
      setProfile(result.data);
      setError(null);
      
      // Refresh the profile data
      await fetchProviderProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if user is actually a provider
  if (!loading && userProfile?.role !== 'provider') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#991B1B' }}>
              Access Denied
            </h2>
            <p style={{ color: '#7F1D1D' }}>
              You need to have a provider account to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#6B7280' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#D97706' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#92400E' }}>
              Error Loading Profile
            </h2>
            <p className="mb-4" style={{ color: '#78350F' }}>
              There was an error loading your provider profile.
            </p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProviderProfile();
              }}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2B0E3F' }}>
            Provider Profile
          </h1>
          <p style={{ color: '#6B7280' }}>
            Complete your profile to start receiving bookings
          </p>
        </div>

        {/* Status Banner */}
        {profile && (
          <div className={`p-4 rounded-xl mb-8 ${
            profile.verification_status === 'verified' 
              ? 'bg-green-50 border-green-200' 
              : profile.verification_status === 'rejected'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`} style={{ border: '1px solid' }}>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ 
                color: profile.verification_status === 'verified' 
                  ? '#10B981' 
                  : profile.verification_status === 'rejected'
                  ? '#EF4444'
                  : '#F59E0B'
              }}>
                Verification Status:
              </span>
              <span className="capitalize font-bold">
                {profile.verification_status}
              </span>
            </div>
            {profile.verification_status === 'pending' && (
              <p className="text-sm mt-2" style={{ color: '#78350F' }}>
                Your profile is under review. You'll be notified once verified.
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border space-y-6" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              <FileText className="w-4 h-4 inline mr-2" />
              Bio / About You
            </label>
            <textarea
              rows="6"
              required
              maxLength="500"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell potential clients about yourself, your experience, and what makes you unique..."
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              {formData.bio.length} / 500 characters
            </p>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              <DollarSign className="w-4 h-4 inline mr-2" />
              Hourly Rate ($)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.hourly_rate}
              onChange={(e) => handleChange('hourly_rate', e.target.value)}
              placeholder="150"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="New York, NY"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
              <Tag className="w-4 h-4 inline mr-2" />
              Services Offered
            </label>
            <input
              type="text"
              required
              value={formData.services_offered}
              onChange={(e) => handleChange('services_offered', e.target.value)}
              placeholder="Massage, Companionship, Consulting (separate with commas)"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ borderColor: '#E5E7EB' }}
            />
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              Separate multiple services with commas
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : profile ? (
              'Update Profile'
            ) : (
              'Create Profile'
            )}
          </button>
        </form>

        {/* Stats */}
        {profile && (
          <div className="bg-white rounded-xl p-8 shadow-lg border mt-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
              Profile Stats
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#6A0DAD' }}>
                  {profile.total_bookings || 0}
                </div>
                <div className="text-sm" style={{ color: '#6B7280' }}>Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#C1A35E' }}>
                  {profile.rating_average?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm" style={{ color: '#6B7280' }}>Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#6A0DAD' }}>
                  ${profile.hourly_rate || 0}
                </div>
                <div className="text-sm" style={{ color: '#6B7280' }}>Hourly Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-xl p-4 mt-8">
            <p className="text-xs font-mono" style={{ color: '#374151' }}>
              Debug: User ID: {user?.id} | Profile exists: {profile ? 'Yes' : 'No'} | User Role: {userProfile?.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}