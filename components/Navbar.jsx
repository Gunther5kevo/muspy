'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double clicks
    
    setIsSigningOut(true);
    setMobileMenuOpen(false); // Close menu immediately
    
    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-xl">M</span>
            </div>
            <h1 className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
              Muspy Ho's
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Public Links - Always Visible */}
            {!user && (
              <>
                <Link 
                  href="/providers"
                  className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                  style={{ color: '#2B0E3F' }}
                >
                  Browse Providers
                </Link>
                <Link 
                  href="/how-it-works"
                  className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                  style={{ color: '#2B0E3F' }}
                >
                  How It Works
                </Link>
              </>
            )}

            {/* Authenticated User Links */}
            {user ? (
              <>
                {/* Show Browse Providers for Clients */}
                {profile?.role === 'client' && (
                  <Link 
                    href="/providers"
                    className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                    style={{ color: '#2B0E3F' }}
                  >
                    Browse Providers
                  </Link>
                )}

                {/* Dashboard Link */}
                <Link 
                  href={profile?.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                  className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                  style={{ color: '#2B0E3F' }}
                >
                  Dashboard
                </Link>

                {/* Provider-specific Links */}
                {profile?.role === 'provider' && (
                  <>
                    <Link 
                      href="/provider/bookings"
                      className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                      style={{ color: '#2B0E3F' }}
                    >
                      Bookings
                    </Link>
                    <Link 
                      href="/provider/profile"
                      className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                      style={{ color: '#2B0E3F' }}
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {/* Client-specific Links */}
                {profile?.role === 'client' && (
                  <Link 
                    href="/bookings"
                    className="px-3 py-2 font-medium transition-colors hover:text-purple-600"
                    style={{ color: '#2B0E3F' }}
                  >
                    My Bookings
                  </Link>
                )}

                {/* Profile Dropdown Button */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
                  <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#2B0E3F' }}>
                    {profile?.full_name || 'User'}
                  </span>
                </div>

                {/* Sign Out Button - IMPROVED */}
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-2 px-4 py-2 font-medium transition-colors hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#2B0E3F' }}
                >
                  <LogOut className={`w-4 h-4 ${isSigningOut ? 'animate-spin' : ''}`} />
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                {/* Guest User Buttons */}
                <Link 
                  href="/login" 
                  className="px-4 py-2 font-medium transition-colors hover:text-purple-600"
                  style={{ color: '#2B0E3F' }}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            disabled={isSigningOut}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: '#2B0E3F' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: '#2B0E3F' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="flex flex-col space-y-2">
              {!user && (
                <>
                  <Link 
                    href="/providers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                    style={{ color: '#2B0E3F' }}
                  >
                    Browse Providers
                  </Link>
                  <Link 
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                    style={{ color: '#2B0E3F' }}
                  >
                    How It Works
                  </Link>
                </>
              )}

              {user ? (
                <>
                  {profile?.role === 'client' && (
                    <Link 
                      href="/providers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                      style={{ color: '#2B0E3F' }}
                    >
                      Browse Providers
                    </Link>
                  )}

                  <Link 
                    href={profile?.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                    style={{ color: '#2B0E3F' }}
                  >
                    Dashboard
                  </Link>

                  {profile?.role === 'provider' && (
                    <>
                      <Link 
                        href="/provider/bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                        style={{ color: '#2B0E3F' }}
                      >
                        Bookings
                      </Link>
                      <Link 
                        href="/provider/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                        style={{ color: '#2B0E3F' }}
                      >
                        My Profile
                      </Link>
                    </>
                  )}

                  {profile?.role === 'client' && (
                    <Link 
                      href="/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                      style={{ color: '#2B0E3F' }}
                    >
                      My Bookings
                    </Link>
                  )}

                  <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {profile?.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2B0E3F' }}>
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs capitalize" style={{ color: '#6B7280' }}>
                          {profile?.role || 'User'}
                        </p>
                      </div>
                    </div>
                    {/* Mobile Sign Out Button - IMPROVED */}
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors hover:bg-red-50 rounded-lg text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className={`w-4 h-4 ${isSigningOut ? 'animate-spin' : ''}`} />
                      {isSigningOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 font-medium transition-colors hover:bg-purple-50 rounded-lg"
                    style={{ color: '#2B0E3F' }}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}