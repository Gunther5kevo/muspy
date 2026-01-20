'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProvidersView from './components/ProvidersView';
import UsersView from './components/UsersView';
import BookingsView from './components/BookingsView';
import VerificationsView from './components/VerificationsView';
import DisputesView from './components/DisputesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoadingScreen from './components/LoadingScreen';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    if (profile && profile.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }

    if (profile) {
      setLoading(false);
    }
  }, [profile, user, router]);

  if (loading) {
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
        {activeTab === 'dashboard' && <DashboardView />}
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