'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, Shield, Star, Calendar, Award, Lock, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      {/* Use Navbar Component */}
      <Navbar />

      {/* Hero Section - Premium Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Overline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)' }}>
              <Award className="w-4 h-4" style={{ color: '#6A0DAD' }} />
              <span className="text-sm font-medium" style={{ color: '#2B0E3F' }}>Private. Verified. Exclusive.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl font-serif font-bold leading-tight" style={{ color: '#2B0E3F' }}>
              Book with
              <span className="block bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
                Confidence
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xl leading-relaxed" style={{ color: '#374151' }}>
              Your trusted network for professional service providers — curated for safety, comfort, and peace of mind.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: '#6A0DAD' }} />
                <span style={{ color: '#374151' }}>ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: '#6A0DAD' }} />
                <span style={{ color: '#374151' }}>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: '#6A0DAD' }} />
                <span style={{ color: '#374151' }}>24/7 Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/providers" 
                className="btn-primary"
              >
                Browse Providers
              </Link>
              <Link 
                href="/signup?role=provider" 
                className="btn-secondary"
              >
                Apply as Provider
              </Link>
            </div>
          </div>

          {/* Right Side - Featured Provider Card */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-luxury rounded-3xl blur-3xl opacity-20"></div>
            
            {/* Provider Preview Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-full aspect-square rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #E5C7FF, #6A0DAD)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-6xl font-serif">✦</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1" style={{ backgroundColor: '#6A0DAD', color: 'white' }}>
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </div>
              </div>

              {/* Provider Info */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-serif font-bold" style={{ color: '#2B0E3F' }}>Premium Provider</h3>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: '#C1A35E', color: '#C1A35E' }} />
                  ))}
                  <span className="ml-2 font-medium" style={{ color: '#4B5563' }}>5.0 (127 reviews)</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#6A0DAD' }}>$150</div>
                    <div className="text-sm" style={{ color: '#4B5563' }}>per hour</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#6A0DAD' }}>500+</div>
                    <div className="text-sm" style={{ color: '#4B5563' }}>bookings</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center pt-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)', color: '#2B0E3F' }}>
                    Available Today
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E5D9B6', color: '#2B0E3F' }}>
                    Top Rated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - For Clients - Detailed Version */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
              How It Works
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#4B5563' }}>
              Simple, secure, and transparent. Here's how Muspy Ho's connects you with verified professional providers.
            </p>
          </div>

          {/* For Clients - Detailed Steps */}
          <div className="mb-20">
            <h3 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
              For Clients
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: CheckCircle,
                  title: 'Browse & Discover',
                  description: 'Explore verified provider profiles with photos, reviews, ratings, and availability.',
                  details: ['Search by location, rating, price', 'View detailed profiles', 'Read real reviews', 'Check availability']
                },
                {
                  step: '02',
                  icon: Calendar,
                  title: 'Book Securely',
                  description: 'Select your preferred date and time. Pay securely through our encrypted platform.',
                  details: ['Choose date & time', 'Secure payment processing', 'Instant confirmation', 'Calendar sync']
                },
                {
                  step: '03',
                  icon: Star,
                  title: 'Meet & Review',
                  description: 'Connect with your provider and share your experience through our review system.',
                  details: ['Receive booking details', 'In-app messaging', 'Leave honest reviews', 'Build trust']
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-2xl transition-shadow" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                  <div className="text-5xl font-serif font-bold mb-4" style={{ color: 'rgba(229, 199, 255, 0.3)' }}>
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-serif font-bold mb-3" style={{ color: '#2B0E3F' }}>
                    {item.title}
                  </h4>
                  <p className="mb-4" style={{ color: '#4B5563' }}>
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                        <CheckCircle className="w-4 h-4" style={{ color: '#6A0DAD' }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
              For Providers
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: CheckCircle, title: 'Apply & Verify', desc: 'Submit application with ID verification' },
                { icon: Award, title: 'Create Profile', desc: 'Upload photos, set rates, add bio' },
                { icon: Calendar, title: 'Set Availability', desc: 'Control your schedule and bookings' },
                { icon: Star, title: 'Get Booked', desc: 'Accept requests and earn income' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center border hover:shadow-xl transition-shadow" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                  <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: '#2B0E3F' }}>{item.title}</h4>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20" style={{ background: 'linear-gradient(to right, #2B0E3F, #6A0DAD)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Safety & Trust
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#E5C7FF' }}>
              Every provider goes through rigorous verification to ensure your peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "ID Verification", desc: "Government ID and selfie verification for all providers" },
              { icon: CheckCircle, title: "Background Check", desc: "Comprehensive screening process" },
              { icon: Lock, title: "Secure Payments", desc: "All transactions encrypted and PCI-compliant" },
              { icon: Award, title: "Quality Control", desc: "Monitored reviews and rating system" }
            ].map((item, index) => (
              <div key={index} className="backdrop-blur-md rounded-xl p-6 text-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm" style={{ color: '#E5C7FF' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-luxury rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-4xl font-serif font-bold text-white mb-6">
            Ready to Experience Premium Service?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#E5C7FF' }}>
            Join our exclusive community of discerning clients and verified providers
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/signup" 
              className="inline-block bg-white px-10 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl"
              style={{ color: '#6A0DAD' }}
            >
              Create Account
            </Link>
            <Link 
              href="/providers" 
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-purple-900 transition-all shadow-xl"
            >
              Browse Providers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 border-t" style={{ backgroundColor: '#2B0E3F', borderColor: 'rgba(229, 199, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif text-xl">M</span>
                </div>
                <h4 className="text-lg font-serif font-bold">Muspy Ho's</h4>
              </div>
              <p className="text-sm" style={{ color: '#E5C7FF' }}>
                Premium booking made simple, safe, and exclusive
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#E5C7FF' }}>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@muspyhos.com" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <p className="text-sm" style={{ color: '#E5C7FF' }}>&copy; 2026 Muspy Ho's. All rights reserved. Crafted with excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}