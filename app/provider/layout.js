'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function ProviderLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile?.role !== 'provider') {
        router.push('/dashboard');
      }
    }
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-purple-900">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'provider') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Sidebar handles mobile bottom nav, hamburger menu, and desktop sidebar */}
      <Sidebar 
        role="provider"
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}