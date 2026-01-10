'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  User, DollarSign, MapPin, FileText, Tag, AlertCircle, Camera, X, 
  Star, Upload, Image, Eye, Trash2, CheckCircle2, Award, TrendingUp, 
  Settings, RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Skeleton Components
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

const PhotoSkeleton = () => (
  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 animate-pulse">
    <div className="w-full h-40 md:h-48 bg-gray-200"></div>
  </div>
);

// Image Viewer Modal
const ImageViewerModal = ({ photo, onClose, onSetPrimary, onDelete, isPrimary }) => {
  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-2xl z-10"
        aria-label="Close image viewer"
      >
        <X className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
      </button>

      <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.photo_url}
          alt="Provider photo"
          className="w-full h-auto max-h-[70vh] md:max-h-[85vh] object-contain rounded-xl md:rounded-2xl shadow-2xl"
        />

        {isPrimary && (
          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2 shadow-lg">
            <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
            Primary
          </div>
        )}

        <div className="absolute bottom-3 md:bottom-4 left-3 right-3 md:left-auto md:right-4 flex flex-col md:flex-row gap-2 md:gap-3">
          {!isPrimary && (
            <button
              onClick={() => {
                onSetPrimary();
                onClose();
              }}
              className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-2xl transition-colors"
            >
              <Star className="w-4 h-4 md:w-5 md:h-5" />
              Set as Primary
            </button>
          )}
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-2xl transition-colors"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Verification Status Banner
const VerificationBanner = ({ status, onRefresh, refreshing }) => {
  const configs = {
    verified: {
      gradient: 'from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      titleColor: '#059669',
      title: 'Verified Provider ✓',
      message: 'Your profile is verified and visible to clients!'
    },
    rejected: {
      gradient: 'from-red-50 to-rose-50',
      border: 'border-red-200',
      icon: X,
      iconColor: 'text-red-600',
      titleColor: '#DC2626',
      title: 'Verification Rejected',
      message: 'Please update your profile information and resubmit.'
    },
    pending: {
      gradient: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      titleColor: '#D97706',
      title: 'Verification Pending',
      message: 'Your profile is under review. You\'ll be notified once verified.'
    }
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 border-2 shadow-lg bg-gradient-to-r ${config.gradient} ${config.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <Icon className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${config.iconColor}`} />
          <span className="font-bold text-base md:text-lg" style={{ color: config.titleColor }}>
            {config.title}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/50 hover:bg-white/80 transition-colors disabled:opacity-50"
          style={{ color: config.titleColor }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <p className="text-xs md:text-sm text-gray-700 ml-8 md:ml-9">
        {config.message}
      </p>
    </div>
  );
};

export default function ProviderProfilePage() {
  const { user, profile: userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null);
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

  const fetchProviderProfile = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          hourly_rate: data.hourly_rate?.toString() || '',
          location: data.location || '',
          services_offered: Array.isArray(data.services_offered) 
            ? data.services_offered.join(', ') 
            : '',
        });
        await fetchPhotos(data.id);
        
        if (showToast) {
          toast.success('Profile refreshed!', { icon: '🔄' });
        }
      }
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      console.error('Photos fetch error:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (!profile) {
      toast.error('Please save your profile first');
      return;
    }

    setUploadingPhoto(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('provider-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('provider-photos')
        .getPublicUrl(fileName);

      const { data: photoData, error: dbError } = await supabase
        .from('provider_photos')
        .insert([{
          provider_id: profile.id,
          photo_url: publicUrl,
          is_primary: photos.length === 0,
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setPhotos(prev => [...prev, photoData]);
      toast.success('Photo uploaded!', { icon: '📸' });
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error('Photo upload error:', error);
    } finally {
      setUploadingPhoto(false);
      e.target.value = ''; // Reset file input
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

      setPhotos(prev => prev.map(p => ({
        ...p,
        is_primary: p.id === photoId
      })));

      toast.success('Primary photo updated!', { icon: '⭐' });
    } catch (error) {
      toast.error('Failed to update primary photo');
      console.error('Set primary error:', error);
    }
  };

  const handleDeletePhoto = async (photoId, photoUrl) => {
    try {
      // Delete from storage
      const urlParts = photoUrl.split('/provider-photos/');
      if (urlParts.length > 1) {
        await supabase.storage
          .from('provider-photos')
          .remove([urlParts[1]]);
      }

      // Delete from database
      await supabase
        .from('provider_photos')
        .delete()
        .eq('id', photoId);

      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success('Photo deleted', { icon: '🗑️' });
    } catch (error) {
      toast.error('Failed to delete photo');
      console.error('Delete photo error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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

      let result;
      if (profile) {
        result = await supabase
          .from('provider_profiles')
          .update(profileData)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('provider_profiles')
          .insert([profileData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast.success(profile ? 'Profile updated!' : 'Profile created!', { icon: '✅' });
      setProfile(result.data);
      
      // Refresh to get latest data including verification status
      await fetchProviderProfile();
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Profile save error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Access Denied
  if (!loading && userProfile?.role !== 'provider') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom, #fef2f2, #ffffff)' }}>
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-red-200 rounded-xl p-6 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-red-900">Access Denied</h2>
            <p className="text-sm text-red-700 mb-4">
              You need a provider account to access this page.
            </p>
            <Link href="/dashboard" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8" style={{ background: 'linear-gradient(to bottom, #faf5ff, #ffffff)' }}>
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-2" />
          <Skeleton className="h-4 md:h-5 w-64 md:w-96 mb-6" />

          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-purple-100">
                <Skeleton className="h-5 md:h-6 w-28 md:w-32 mb-4" />
                <Skeleton className="h-32 md:h-40 rounded-xl mb-4" />
                <div className="space-y-3">
                  <PhotoSkeleton />
                  <PhotoSkeleton />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg border border-purple-100 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 md:h-4 w-24 md:w-32" />
                    <Skeleton className="h-10 md:h-12 rounded-lg md:rounded-xl" />
                  </div>
                ))}
                <Skeleton className="h-11 md:h-12 rounded-lg md:rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8" style={{ background: 'linear-gradient(to bottom, #faf5ff, #ffffff)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-1 md:mb-2 bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent">
            Provider Profile
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Build your professional profile and attract clients
          </p>
        </div>

        {/* Settings Link - Mobile Only */}
        <Link
          href="/provider/settings"
          className="md:hidden flex items-center gap-2 bg-white border-2 border-purple-100 rounded-xl p-4 mb-6 shadow-md active:scale-95 transition-transform"
        >
          <Settings className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-900">Account Settings</span>
          <div className="ml-auto text-purple-600">→</div>
        </Link>

        {/* Verification Status */}
        {profile && (
          <VerificationBanner 
            status={profile.verification_status} 
            onRefresh={() => fetchProviderProfile(true)}
            refreshing={refreshing}
          />
        )}

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8">
          {/* Photo Gallery */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-purple-100 lg:sticky lg:top-8">
              <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2 flex items-center gap-2 text-purple-900">
                <Camera className="w-5 h-5" />
                Profile Photos
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Showcase your best professional photos
              </p>

              {profile ? (
                <>
                  {/* Upload Area */}
                  <label className={`block w-full border-2 border-dashed rounded-xl md:rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all ${
                    uploadingPhoto 
                      ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-50' 
                      : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50 active:scale-95'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                    {uploadingPhoto ? (
                      <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs md:text-sm font-medium text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 md:w-8 md:h-8 text-purple-700" />
                        </div>
                        <div>
                          <span className="block text-sm md:text-base font-semibold text-gray-900 mb-1">
                            Upload Photo
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG up to 5MB
                          </span>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Photo Grid */}
                  {photos.length > 0 ? (
                    <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-md hover:shadow-xl transition-all cursor-pointer active:scale-95"
                          style={{ borderColor: photo.is_primary ? '#D97706' : '#E5E7EB' }}
                          onClick={() => setViewingPhoto(photo)}
                        >
                          <img
                            src={photo.photo_url}
                            alt="Provider photo"
                            className="w-full h-40 md:h-56 object-cover transition-transform group-hover:scale-105"
                          />
                          
                          {photo.is_primary && (
                            <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5 shadow-lg">
                              <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" />
                              Primary
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 md:pb-4">
                            <div className="flex items-center gap-1.5 text-white text-xs md:text-sm font-medium">
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                              Click to view
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 md:mt-6 text-center py-10 md:py-12 border-2 border-dashed rounded-xl md:rounded-2xl border-gray-200 bg-gray-50">
                      <Image className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" />
                      <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                        No photos yet
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        Upload your first photo to get started
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 md:py-12 border-2 border-dashed rounded-xl md:rounded-2xl border-gray-200 bg-gray-50">
                  <Image className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-300" />
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Save your profile first to upload photos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg border border-purple-100 space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Professional Bio
                </label>
                <textarea
                  rows="5"
                  required
                  maxLength="500"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Share your experience, specialties, and what makes you unique..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base resize-none"
                />
                <p className="text-xs mt-2 text-gray-500">
                  {formData.bio.length} / 500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                  placeholder="150"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="New York, NY"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Services Offered
                </label>
                <input
                  type="text"
                  required
                  value={formData.services_offered}
                  onChange={(e) => setFormData(prev => ({ ...prev, services_offered: e.target.value }))}
                  placeholder="Massage, Companionship, Consulting"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
                />
                <p className="text-xs mt-2 text-gray-500">
                  Separate multiple services with commas
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3.5 md:py-4 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm md:text-base"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg border border-purple-100">
                <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-purple-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                  Profile Performance
                </h2>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg md:rounded-xl">
                    <Award className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-purple-600" />
                    <div className="text-xl md:text-3xl font-bold text-purple-900">
                      {profile.total_bookings || 0}
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-purple-700 mt-1">Total Bookings</div>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg md:rounded-xl">
                    <Star className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-amber-600" />
                    <div className="text-xl md:text-3xl font-bold text-amber-900">
                      {profile.rating_average?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-amber-700 mt-1">Avg Rating</div>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg md:rounded-xl">
                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-emerald-600" />
                    <div className="text-xl md:text-3xl font-bold text-emerald-900">
                      ${profile.hourly_rate || 0}
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-emerald-700 mt-1">Per Hour</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewingPhoto && (
        <ImageViewerModal
          photo={viewingPhoto}
          onClose={() => setViewingPhoto(null)}
          onSetPrimary={() => handleSetPrimaryPhoto(viewingPhoto.id)}
          onDelete={() => handleDeletePhoto(viewingPhoto.id, viewingPhoto.photo_url)}
          isPrimary={viewingPhoto.is_primary}
        />
      )}
    </div>
  );
}