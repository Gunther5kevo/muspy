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

      // JOIN provider_profiles with users table
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          users!provider_profiles_user_id_fkey (
            id,
            email,
            full_name,
            phone,
            is_verified,
            is_active,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Providers error:', error);
        throw error;
      }

      console.log('Providers loaded:', data?.length || 0);
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (userId) => {
    try {
      // Update the users table, not provider_profiles
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) throw error;

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
