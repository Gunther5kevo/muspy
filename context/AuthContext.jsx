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
      console.log('Loading profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile load error:', error);
        throw error;
      }

      console.log('Profile loaded successfully:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
      return null;
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
        console.log('Initializing auth...');
        
        // Get existing session from localStorage
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (!mounted) return;

        if (session?.user) {
          console.log('Session found for user:', session.user.id);
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          console.log('No active session found');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
        }
      }
    };

    init();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change event:', event);

        // Handle all auth state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            console.log('User signed in/refreshed:', session.user.id);
            setUser(session.user);
            await loadProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Clear state immediately when sign out is detected
          setUser(null);
          setProfile(null);
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
          if (session?.user) {
            setUser(session.user);
            await loadProfile(session.user.id);
          }
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
    try {
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
        // Create user profile
        const { error: profileError } = await supabase.from('users').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          is_verified: false,
          is_active: true,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        setUser(data.user);
        await loadProfile(data.user.id);
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  /**
   * Sign in
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('User signed in:', data.user.id);
        setUser(data.user);
        await loadProfile(data.user.id);
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      console.log('Signing out...');
      
      // Clear state IMMEDIATELY for instant UI feedback
      setUser(null);
      setProfile(null);
      
      // Then clear Supabase session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        // If Supabase sign out fails, still keep local state cleared
        // The auth listener will handle re-sync if needed
      } else {
        console.log('Sign out successful');
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
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      console.log('Session refreshed successfully');
      return data.session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
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