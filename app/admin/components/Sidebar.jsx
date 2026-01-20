import React from 'react';
import { Users, UserCheck, Calendar, Shield, MessageSquare, FileText, Settings, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, profile }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'providers', label: 'Providers', icon: UserCheck },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'verifications', label: 'Verifications', icon: Shield },
    { id: 'disputes', label: 'Disputes', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside 
      className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white shadow-xl border-r`} 
      style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <h1 className="text-xl font-serif font-bold" style={{ color: '#6A0DAD' }}>
              Muspy Ho's
            </h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg hover:bg-purple-50"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'text-white' 
                    : 'hover:bg-purple-50'
                }`}
                style={activeTab === item.id ? {
                  background: 'linear-gradient(to right, #6A0DAD, #9D4EDD)'
                } : {}}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          {sidebarOpen && (
            <div className="mb-4 p-3 rounded-lg bg-purple-50">
              <p className="text-sm font-medium" style={{ color: '#2B0E3F' }}>
                {profile?.full_name}
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>Administrator</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}