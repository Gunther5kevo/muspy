import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    try {
      setLoading(true);
      console.log('Loading providers...');

      // Get all users with role 'provider' and join with provider_profiles
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          provider_profiles (
            id,
            bio,
            hourly_rate,
            location,
            services_offered,
            rating_average,
            total_bookings,
            verification_status,
            id_document_url
          )
        `)
        .eq('role', 'provider')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Providers error:', error);
        throw error;
      }

      console.log('Providers loaded:', data?.length || 0);
      
      // Flatten the data structure for easier use
      const flattenedData = data?.map(user => {
        const profile = user.provider_profiles?.[0] || {};
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          is_verified: user.is_verified,
          is_active: user.is_active,
          created_at: user.created_at,
          avatar_url: user.avatar_url,
          // Provider profile fields
          bio: profile.bio || '',
          hourly_rate: profile.hourly_rate || 0,
          location: profile.location || '',
          services: profile.services_offered || [],
          rating: profile.rating_average || 0,
          total_bookings: profile.total_bookings || 0,
          verification_status: profile.verification_status || 'pending',
          id_document_url: profile.id_document_url || ''
        };
      }) || [];

      setProviders(flattenedData);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (userId) => {
    try {
      // Update both users table and provider_profiles table
      const { error: userError } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('provider_profiles')
        .update({ verification_status: 'verified' })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast.success('Provider verified successfully');
      await loadProviders();
      return true;
    } catch (error) {
      console.error('Error verifying provider:', error);
      toast.error('Failed to verify provider');
      return false;
    }
  };

  const suspendProvider = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Provider suspended');
      await loadProviders();
      return true;
    } catch (error) {
      console.error('Error suspending provider:', error);
      toast.error('Failed to suspend provider');
      return false;
    }
  };

  const activateProvider = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Provider activated');
      await loadProviders();
      return true;
    } catch (error) {
      console.error('Error activating provider:', error);
      toast.error('Failed to activate provider');
      return false;
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return {
    providers,
    loading,
    refresh: loadProviders,
    verifyProvider,
    suspendProvider,
    activateProvider
  };
}