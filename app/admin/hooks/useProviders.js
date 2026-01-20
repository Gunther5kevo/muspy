import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          provider_profiles (*)
        `)
        .eq('role', 'provider')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (providerId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', providerId);

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

  const suspendProvider = async (providerId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', providerId);

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

  const activateProvider = async (providerId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', providerId);

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