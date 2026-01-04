'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, profile, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Watch for profile changes and redirect when ready
  useEffect(() => {
    if (user && profile && !authLoading && redirecting) {
      console.log('Profile is ready, redirecting. Role:', profile.role);
      
      // Redirect based on role
      if (profile.role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/dashboard');
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
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-2xl">M</span>
            </div>
          </Link>
          <h1 
            className="text-3xl font-serif font-bold mb-2"
            style={{ color: "#2B0E3F" }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "#4B5563" }}>Sign in to access your account</p>
        </div>

        <div 
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2 rounded" 
                  style={{ accentColor: "#6A0DAD" }}
                  disabled={loading}
                />
                <span className="text-sm" style={{ color: "#4B5563" }}>
                  Remember me
                </span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm transition-colors"
                style={{ color: "#6A0DAD" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6 text-center">
            <p style={{ color: "#4B5563" }}>
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

        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="transition-colors"
            style={{ color: "#4B5563" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}