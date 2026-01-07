'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, DollarSign, MapPin, FileText, Tag, AlertCircle, Camera, X, Star, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderProfilePage() {
  const { user, profile: userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState(null);
  const [photos, setPhotos] = useState([]);
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
        .maybeSingle();

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
        
        // Fetch photos
        await fetchPhotos(data.id);
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

  const fetchPhotos = async (profileId) => {
    try {
      const { data, error } = await supabase
        .from('provider_photos')
        .select('*')
        .eq('provider_id', profileId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (!profile) {
      toast.error('Please save your profile first before uploading photos');
      return;
    }

    setUploadingPhoto(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('provider-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('provider-photos')
        .getPublicUrl(fileName);

      // Save to database
      const { data: photoData, error: dbError } = await supabase
        .from('provider_photos')
        .insert([{
          provider_id: profile.id,
          photo_url: publicUrl,
          is_primary: photos.length === 0, // First photo is primary
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setPhotos(prev => [...prev, photoData]);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetPrimaryPhoto = async (photoId) => {
    try {
      // Remove primary from all photos
      await supabase
        .from('provider_photos')
        .update({ is_primary: false })
        .eq('provider_id', profile.id);

      // Set new primary
      await supabase
        .from('provider_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      // Update local state
      setPhotos(prev => prev.map(p => ({
        ...p,
        is_primary: p.id === photoId
      })));

      toast.success('Primary photo updated!');
    } catch (error) {
      console.error('Error setting primary photo:', error);
      toast.error('Failed to set primary photo');
    }
  };

  const handleDeletePhoto = async (photoId, photoUrl) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      // Extract file path from URL
      const urlParts = photoUrl.split('/provider-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        await supabase.storage
          .from('provider-photos')
          .remove([filePath]);
      }

      // Delete from database
      await supabase
        .from('provider_photos')
        .delete()
        .eq('id', photoId);

      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
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
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border sticky top-8" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2" style={{ color: '#2B0E3F' }}>
                <Camera className="w-5 h-5" />
                Profile Photos
              </h2>
              
              {profile && (
                <>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                    Add high-quality photos to attract more clients. First photo will be your primary display.
                  </p>

                  {/* Upload Button */}
                  <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-purple-50 ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ borderColor: '#E5C7FF' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                    {uploadingPhoto ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm" style={{ color: '#6B7280' }}>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8" style={{ color: '#6A0DAD' }} />
                        <span className="text-sm font-medium" style={{ color: '#2B0E3F' }}>
                          Upload Photo
                        </span>
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Photo Grid */}
                  {photos.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group rounded-lg overflow-hidden border-2"
                          style={{ borderColor: photo.is_primary ? '#C1A35E' : '#E5E7EB' }}
                        >
                          <img
                            src={photo.photo_url}
                            alt="Provider photo"
                            className="w-full h-48 object-cover"
                          />
                          
                          {/* Primary Badge */}
                          {photo.is_primary && (
                            <div className="absolute top-2 left-2 bg-gradient-luxury text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Primary
                            </div>
                          )}

                          {/* Actions Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            {!photo.is_primary && (
                              <button
                                onClick={() => handleSetPrimaryPhoto(photo.id)}
                                className="bg-white text-purple-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length === 0 && (
                    <div className="mt-6 text-center py-8 border-2 border-dashed rounded-xl" style={{ borderColor: '#E5E7EB' }}>
                      <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        No photos yet. Upload your first photo to get started!
                      </p>
                    </div>
                  )}
                </>
              )}

              {!profile && (
                <div className="text-center py-8 border-2 border-dashed rounded-xl" style={{ borderColor: '#E5E7EB' }}>
                  <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Save your profile first to upload photos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
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
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-xl p-4 mt-8">
            <p className="text-xs font-mono" style={{ color: '#374151' }}>
              Debug: User ID: {user?.id} | Profile exists: {profile ? 'Yes' : 'No'} | User Role: {userProfile?.role} | Photos: {photos.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}