'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializingRef = useRef(false);

  /**
   * Load user profile from DB
   */
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  /**
   * Initialize auth state + listen for changes
   */
  useEffect(() => {
    // Prevent double initialization
    if (initializingRef.current) return;
    initializingRef.current = true;

    let mounted = true;

    const init = async () => {
      try {
        // Get existing session from localStorage
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event); // Useful for debugging

        // Handle all auth state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            await loadProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear state immediately when sign out is detected
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      initializingRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  /**
   * Sign up
   */
  const signUp = async (email, password, fullName, role = 'client') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        is_verified: false,
        is_active: true,
      });

      setUser(data.user);
      await loadProfile(data.user.id);
    }

    return data;
  };

  /**
   * Sign in
   */
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser(data.user);
      await loadProfile(data.user.id);
    }

    return data;
  };

  /**
   * Sign out - IMPROVED
   */
  const signOut = async () => {
    try {
      // Clear state IMMEDIATELY for instant UI feedback
      setUser(null);
      setProfile(null);
      
      // Then clear Supabase session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        // If Supabase sign out fails, still keep local state cleared
        // The auth listener will handle re-sync if needed
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, we've already cleared local state
      throw error;
    }
  };

  /**
   * Refresh session manually (optional - Supabase does this automatically)
   */
  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
    return data.session;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};