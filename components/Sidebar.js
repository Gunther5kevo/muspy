'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings,
  Briefcase,
  DollarSign,
  Clock
} from 'lucide-react';

export default function Sidebar({ role = 'client' }) {
  const pathname = usePathname();

  const clientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/providers', label: 'Providers', icon: Users },
    { href: '/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const providerLinks = [
    { href: '/provider/dashboard', label: 'Dashboard', icon: Home },
    { href: '/provider/profile', label: 'My Profile', icon: User },
    { href: '/provider/availability', label: 'Availability', icon: Clock },
    { href: '/provider/bookings', label: 'Bookings', icon: Calendar },
    { href: '/provider/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/provider/settings', label: 'Settings', icon: Settings },
  ];

  const links = role === 'provider' ? providerLinks : clientLinks;

  return (
    <aside className="w-64 bg-white border-r min-h-screen" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
            <span className="text-white font-serif text-xl">M</span>
          </div>
          <h1 className="text-xl font-serif font-bold bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
            Muspy Ho's
          </h1>
        </Link>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-luxury text-white' 
                    : 'hover:bg-gray-100'
                }`}
                style={!isActive ? { color: '#2B0E3F' } : {}}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}