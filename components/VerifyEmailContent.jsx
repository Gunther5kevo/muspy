'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

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
        </div>

        <div
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border text-center"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          {/* Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          {/* Heading */}
          <h1
            className="text-2xl sm:text-3xl font-serif font-bold mb-3 sm:mb-4"
            style={{ color: "#2B0E3F" }}
          >
            Check Your Email
          </h1>

          {/* Message */}
          <p className="mb-4 sm:mb-6 text-base sm:text-lg" style={{ color: "#4B5563" }}>
            We've sent a verification email to:
          </p>
          
          <div 
            className="mb-4 sm:mb-6 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base break-all"
            style={{ backgroundColor: "rgba(229, 199, 255, 0.2)", color: "#6A0DAD" }}
          >
            {email}
          </div>

          <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: "#6B7280" }}>
            Click the link in the email to verify your account and complete your registration.
          </p>

          {/* Steps */}
          <div className="text-left space-y-3 sm:space-y-4 mb-6 sm:mb-8 bg-gray-50 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1 text-sm sm:text-base" style={{ color: "#2B0E3F" }}>Check your inbox</p>
                <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>Look for an email from Muspy Ho's</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1 text-sm sm:text-base" style={{ color: "#2B0E3F" }}>Click the verification link</p>
                <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>This will activate your account</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: "#6A0DAD" }} />
              <div>
                <p className="font-medium mb-1 text-sm sm:text-base" style={{ color: "#2B0E3F" }}>Sign in to your account</p>
                <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>Start browsing or setup your profile</p>
              </div>
            </div>
          </div>

          {/* Didn't receive email */}
          <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: "#E5E7EB" }}>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: "#6B7280" }}>
              Didn't receive the email?
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <p style={{ color: "#6B7280" }}>
                • Check your spam or junk folder
              </p>
              <p style={{ color: "#6B7280" }} className="break-all">
                • Make sure {email} is correct
              </p>
              <p style={{ color: "#6B7280" }}>
                • Wait a few minutes and check again
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 sm:mt-8">
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 btn-primary text-sm sm:text-base"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
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