'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  User,
  Clock,
  DollarSign,
  Settings,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Bell,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function BottomNav({ role = 'client', user, profile, onSignOut }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile Bottom Nav: 4 core actions (thumb-friendly)
  const clientMobileLinks = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/providers', label: 'Browse', icon: Users },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const providerMobileLinks = [
    { href: '/provider/dashboard', label: 'Home', icon: Home },
    { href: '/provider/bookings', label: 'Bookings', icon: Calendar },
    { href: '/provider/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/provider/profile', label: 'Profile', icon: User },
  ];

  // Hamburger Menu Items (secondary actions)
  const clientMenuLinks = [
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
    { href: '/terms', label: 'Terms & Privacy', icon: FileText },
  ];

  const providerMenuLinks = [
    { href: '/provider/availability', label: 'Availability', icon: Clock },
    { href: '/provider/messages', label: 'Messages', icon: MessageSquare },
    { href: '/provider/settings', label: 'Settings', icon: Settings },
    { href: '/provider/help', label: 'Help & Support', icon: HelpCircle },
  ];

  // Desktop Sidebar: All navigation items
  const clientDesktopLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/providers', label: 'Providers', icon: Users },
    { href: '/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const providerDesktopLinks = [
    { href: '/provider/dashboard', label: 'Dashboard', icon: Home },
    { href: '/provider/bookings', label: 'Bookings', icon: Calendar },
    { href: '/provider/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/provider/availability', label: 'Availability', icon: Clock },
    { href: '/provider/profile', label: 'My Profile', icon: User },
    { href: '/provider/settings', label: 'Settings', icon: Settings },
  ];

  const mobileLinks = role === 'provider' ? providerMobileLinks : clientMobileLinks;
  const menuLinks = role === 'provider' ? providerMenuLinks : clientMenuLinks;
  const desktopLinks = role === 'provider' ? providerDesktopLinks : clientDesktopLinks;

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[70px] active:scale-95 ${
                  isActive ? 'text-purple-700' : 'text-gray-500'
                }`}
              >
                <div className={`relative ${isActive ? 'transform -translate-y-0.5' : ''}`}>
                  <Icon 
                    className={`w-6 h-6 transition-all ${isActive ? 'fill-current' : ''}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-700 rounded-full"></div>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${
                  isActive ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Hamburger Button (Fixed Top Right) */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 right-4 z-40 bg-white p-2.5 rounded-full shadow-lg border border-purple-100 active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5 text-purple-700" />
      </button>

      {/* Mobile Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-slide-in">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="p-5 border-b border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-purple-900">Menu</h2>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-purple-900 text-sm truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-purple-600 capitalize">
                      {role} Account
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-3">
                  {menuLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                            : 'hover:bg-purple-50 text-gray-700 active:bg-purple-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-4 border-t border-purple-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 active:bg-red-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r min-h-screen" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
        <div className="p-6 w-full">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-xl">M</span>
            </div>
            <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent">
              Muspy Ho's
            </h1>
          </Link>

          <nav className="space-y-2">
            {desktopLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Section */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-purple-900 text-sm truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-purple-600 capitalize">
                  {role}
                </p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}