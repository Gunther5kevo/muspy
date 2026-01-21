'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, profile, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Watch for profile changes and redirect when ready
  useEffect(() => {
    if (user && profile && !authLoading && redirecting) {
      console.log('Profile is ready, redirecting. Role:', profile.role);
      
      // Redirect based on role - ADDED ADMIN CHECK
      if (profile.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        router.push('/admin/');
      } else if (profile.role === 'provider') {
        console.log('Redirecting to provider dashboard');
        router.push('/provider/dashboard');
      } else if (profile.role === 'client') {
        console.log('Redirecting to client dashboard');
        router.push('/dashboard');
      } else {
        console.warn('Unknown role:', profile.role);
        toast.error('Unknown user role');
        router.push('/');
      }
    }
  }, [user, profile, authLoading, redirecting, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting sign in...');
      await signIn(email, password);
      
      console.log('Sign in complete');
      toast.success('Welcome back!');
      
      // Set flag to trigger redirect in useEffect
      setRedirecting(true);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{
        background: "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-luxury rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-xl sm:text-2xl">M</span>
            </div>
          </Link>
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2"
            style={{ color: "#2B0E3F" }}
          >
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#4B5563" }}>
            Sign in to access your account
          </p>
        </div>

        <div 
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                  style={{
                    borderColor: "#D1D5DB",
                    "--tw-ring-color": "#6A0DAD",
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50"
                  style={{ color: "#6B7280" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded flex-shrink-0" 
                  style={{ accentColor: "#6A0DAD" }}
                  disabled={loading}
                />
                <span className="text-sm" style={{ color: "#4B5563" }}>
                  Remember me
                </span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm transition-colors text-center sm:text-left"
                style={{ color: "#6A0DAD" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3 sm:py-3.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {redirecting ? 'Redirecting...' : 'Signing in...'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In Securely
                </>
              )}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-sm sm:text-base" style={{ color: "#4B5563" }}>
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="font-semibold transition-colors"
                style={{ color: "#6A0DAD" }}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-5 sm:mt-6">
          <Link 
            href="/" 
            className="text-sm sm:text-base transition-colors inline-block"
            style={{ color: "#4B5563" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}