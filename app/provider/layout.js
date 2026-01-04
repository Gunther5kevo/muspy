'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-luxury rounded-full animate-pulse mx-auto mb-4"></div>
          <p style={{ color: '#2B0E3F' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'provider') {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Sidebar role="provider" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}