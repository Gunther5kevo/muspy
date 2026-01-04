'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
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
        </div>

        <div
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border text-center"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h1
            className="text-3xl font-serif font-bold mb-4"
            style={{ color: "#2B0E3F" }}
          >
            Check Your Email
          </h1>

          {/* Message */}
          <p className="mb-6 text-lg" style={{ color: "#4B5563" }}>
            We've sent a verification email to:
          </p>
          
          <div 
            className="mb-6 px-4 py-3 rounded-xl font-medium"
            style={{ backgroundColor: "rgba(229, 199, 255, 0.2)", color: "#6A0DAD" }}
          >
            {email}
          </div>

          <p className="mb-8" style={{ color: "#6B7280" }}>
            Click the link in the email to verify your account and complete your registration.
          </p>

          {/* Steps */}
          <div className="text-left space-y-4 mb-8 bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1" style={{ color: "#2B0E3F" }}>Check your inbox</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>Look for an email from Muspy Ho's</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1" style={{ color: "#2B0E3F" }}>Click the verification link</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>This will activate your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1" style={{ color: "#2B0E3F" }}>Sign in to your account</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>Start browsing or setup your profile</p>
              </div>
            </div>
          </div>

          {/* Didn't receive email */}
          <div className="pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
              Didn't receive the email?
            </p>
            <div className="space-y-2 text-sm">
              <p style={{ color: "#6B7280" }}>
                • Check your spam or junk folder
              </p>
              <p style={{ color: "#6B7280" }}>
                • Make sure {email} is correct
              </p>
              <p style={{ color: "#6B7280" }}>
                • Wait a few minutes and check again
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
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