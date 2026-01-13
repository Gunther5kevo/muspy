import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Calendar, Shield, Star, Lock, Award } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 pb-24 sm:pb-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6" style={{ color: '#2B0E3F' }}>
            How It Works
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4" style={{ color: '#4B5563' }}>
            Simple, secure, and transparent. Here's how Muspy Ho's connects you with verified professional providers.
          </p>
        </div>

        {/* For Clients */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 sm:mb-12" style={{ color: '#2B0E3F' }}>
            For Clients
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <div className="text-4xl sm:text-5xl font-serif font-bold mb-3 sm:mb-4" style={{ color: 'rgba(229, 199, 255, 0.3)' }}>
                  {item.step}
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3" style={{ color: '#2B0E3F' }}>
                  {item.title}
                </h3>
                <p className="mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#4B5563' }}>
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* For Providers */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 sm:mb-12" style={{ color: '#2B0E3F' }}>
            For Providers
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: CheckCircle, title: 'Apply & Verify', desc: 'Submit application with ID verification' },
              { icon: Award, title: 'Create Profile', desc: 'Upload photos, set rates, add bio' },
              { icon: Calendar, title: 'Set Availability', desc: 'Control your schedule and bookings' },
              { icon: Star, title: 'Get Booked', desc: 'Accept requests and earn income' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 sm:p-6 shadow-lg text-center border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-sm sm:text-base" style={{ color: '#2B0E3F' }}>{item.title}</h3>
                <p className="text-xs sm:text-sm" style={{ color: '#6B7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Features */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 sm:mb-12" style={{ color: '#2B0E3F' }}>
            Safety & Trust
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Shield, title: 'ID Verification', desc: 'Government ID and selfie verification for all providers' },
              { icon: Lock, title: 'Secure Payments', desc: 'All transactions encrypted and PCI-compliant' },
              { icon: Award, title: 'Quality Control', desc: 'Monitored reviews and rating system' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>{item.title}</h3>
                <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6" style={{ color: '#2B0E3F' }}>
            Ready to Get Started?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/signup" className="btn-primary text-sm sm:text-base">
              Create Account
            </Link>
            <Link href="/providers" className="btn-secondary text-sm sm:text-base">
              Browse Providers
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}