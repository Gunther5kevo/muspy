'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/app/admin/components/Sidebar';
import DashboardView from '@/app/admin/components/DashboardView';
import ProvidersView from '@/app/admin/components/ProvidersView';
import UsersView from '@/app/admin/components/UsersView';
import BookingsView from '@/app/admin/components/BookingsView';
import VerificationsView from '@/app/admin/components/VerificationsView';
import DisputesView from '@/app/admin/components/DisputesView';
import ReportsView from '@/app/admin/components/ReportsView';
import SettingsView from '@/app/admin/components/SettingsView';
import LoadingScreen from '@/app/admin/components/LoadingScreen';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication and authorization
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // Auth has finished loading, now check user status
    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    // User exists, now check if profile is loaded
    if (!profile) {
      console.log('User exists but profile not loaded yet');
      // Profile is still loading, wait a bit more
      return;
    }

    // Profile is loaded, check role
    if (profile.role !== 'admin') {
      console.log('User is not admin, redirecting');
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }

    // All checks passed
    console.log('Admin user authenticated successfully');
    setIsChecking(false);
  }, [user, profile, loading, router]);

  // Show loading screen while checking auth
  if (loading || isChecking) {
    return <LoadingScreen />;
  }

  // Don't render anything if redirecting
  if (!user || !profile || profile.role !== 'admin') {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profile={profile}
      />

      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
        {activeTab === 'providers' && <ProvidersView />}
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'verifications' && <VerificationsView />}
        {activeTab === 'disputes' && <DisputesView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}