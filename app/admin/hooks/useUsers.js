import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User suspended');
      await loadUsers();
      return true;
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
      return false;
    }
  };

  const activateUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User activated');
      await loadUsers();
      return true;
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
      return false;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    refresh: loadUsers,
    suspendUser,
    activateUser
  };
}