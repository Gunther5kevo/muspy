'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Heart, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            About <span className="bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Muspy Ho's</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#4B5563' }}>
            We're revolutionizing the way people connect with professional service providers through trust, transparency, and technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
          <h2 className="text-4xl font-serif font-bold text-center mb-8" style={{ color: '#2B0E3F' }}>Our Mission</h2>
          <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed" style={{ color: '#4B5563' }}>
            At Muspy Ho's, we believe everyone deserves access to verified, professional service providers they can trust. We've built a platform that prioritizes safety, transparency, and quality, creating a space where clients and providers can connect with confidence. Our rigorous verification process, secure payment systems, and community-driven reviews ensure that every interaction on our platform meets the highest standards of professionalism and integrity.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>Our Values</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: 'Safety First',
              description: 'Comprehensive verification and background checks for all providers'
            },
            {
              icon: Heart,
              title: 'Trust & Respect',
              description: 'Building a community based on mutual respect and authenticity'
            },
            {
              icon: Users,
              title: 'Inclusivity',
              description: 'Creating opportunities for diverse professionals to thrive'
            },
            {
              icon: Award,
              title: 'Excellence',
              description: 'Maintaining the highest standards of quality and service'
            }
          ].map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border text-center hover:shadow-2xl transition-shadow" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B0E3F' }}>{value.title}</h3>
              <p style={{ color: '#6B7280' }}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>Our Story</h2>
            <div className="space-y-4" style={{ color: '#4B5563' }}>
              <p className="text-lg">
                Muspy Ho's was founded with a simple yet powerful vision: to create a safe, transparent marketplace where professional service providers and clients can connect with complete peace of mind.
              </p>
              <p className="text-lg">
                We recognized a gap in the market for a platform that truly prioritizes verification, safety, and quality. Too often, people struggle to find trustworthy professionals, and providers lack a secure platform to showcase their talents.
              </p>
              <p className="text-lg">
                Today, we're proud to serve thousands of clients and verified providers, facilitating connections built on trust, respect, and professionalism. Our community continues to grow, united by our commitment to excellence and safety.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-luxury rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative aspect-square rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #E5C7FF, #6A0DAD)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-8xl font-serif">✦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to right, #2B0E3F, #6A0DAD)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Verified Providers' },
              { number: '50,000+', label: 'Happy Clients' },
              { number: '100,000+', label: 'Bookings Completed' },
              { number: '4.9/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg" style={{ color: '#E5C7FF' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}