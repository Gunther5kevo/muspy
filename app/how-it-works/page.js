import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, Calendar, Shield, Star, Lock, Award } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            How It Works
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#4B5563' }}>
            Simple, secure, and transparent. Here's how Muspy Ho's connects you with verified professional providers.
          </p>
        </div>

        {/* For Clients */}
        <section className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
            For Clients
          </h2>
          
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
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <div className="text-5xl font-serif font-bold mb-4" style={{ color: 'rgba(229, 199, 255, 0.3)' }}>
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3" style={{ color: '#2B0E3F' }}>
                  {item.title}
                </h3>
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
        </section>

        {/* For Providers */}
        <section className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
            For Providers
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Apply & Verify', desc: 'Submit application with ID verification' },
              { icon: Award, title: 'Create Profile', desc: 'Upload photos, set rates, add bio' },
              { icon: Calendar, title: 'Set Availability', desc: 'Control your schedule and bookings' },
              { icon: Star, title: 'Get Booked', desc: 'Accept requests and earn income' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <div className="w-12 h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#2B0E3F' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Features */}
        <section className="bg-white rounded-2xl p-12 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
            Safety & Trust
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'ID Verification', desc: 'Government ID and selfie verification for all providers' },
              { icon: Lock, title: 'Secure Payments', desc: 'All transactions encrypted and PCI-compliant' },
              { icon: Award, title: 'Quality Control', desc: 'Monitored reviews and rating system' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>{item.title}</h3>
                <p style={{ color: '#6B7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            Ready to Get Started?
          </h3>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="btn-primary">
              Create Account
            </Link>
            <Link href="/providers" className="btn-secondary">
              Browse Providers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}