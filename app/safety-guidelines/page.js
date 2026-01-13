'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, UserCheck, Phone, FileCheck } from 'lucide-react';

export default function Safety() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            Safety <span className="bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Guidelines</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#4B5563' }}>
            Your safety is our top priority. Learn about our comprehensive safety measures and best practices for a secure experience.
          </p>
        </div>

        {/* Our Safety Commitment */}
        <section className="mb-16">
          <div className="bg-gradient-luxury rounded-3xl p-12 text-center shadow-2xl">
            <Shield className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Our Safety Commitment
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#E5C7FF' }}>
              We've built multiple layers of protection into our platform to ensure every interaction is safe, secure, and trustworthy. From verification to payment processing, safety is embedded in everything we do.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="mb-16">
          <h2 className="text-4xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
            Platform Safety Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: UserCheck,
                title: 'ID Verification',
                description: 'All providers must verify their identity with government-issued ID and live selfie verification'
              },
              {
                icon: FileCheck,
                title: 'Background Checks',
                description: 'Comprehensive screening process including criminal background checks for all providers'
              },
              {
                icon: Lock,
                title: 'Secure Payments',
                description: 'PCI-compliant encrypted payment processing protects your financial information'
              },
              {
                icon: Eye,
                title: 'Profile Monitoring',
                description: 'Continuous monitoring of provider profiles and user activity for suspicious behavior'
              },
              {
                icon: CheckCircle,
                title: 'Review System',
                description: 'Transparent rating and review system helps maintain quality and accountability'
              },
              {
                icon: Phone,
                title: '24/7 Support',
                description: 'Round-the-clock customer support team ready to assist with any concerns'
              },
              {
                icon: Shield,
                title: 'Data Protection',
                description: 'Industry-standard encryption protects your personal information and privacy'
              },
              {
                icon: AlertTriangle,
                title: 'Report System',
                description: 'Easy-to-use reporting tools for flagging inappropriate behavior or safety concerns'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-2xl transition-shadow" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
                <div className="w-14 h-14 bg-gradient-luxury rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2B0E3F' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Tips for Clients */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
            <h2 className="text-3xl font-serif font-bold mb-8" style={{ color: '#2B0E3F' }}>
              Safety Tips for Clients
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Choose Verified Providers',
                  tips: [
                    'Always book providers with verified badges',
                    'Read reviews and ratings from other clients',
                    'Check provider profiles thoroughly before booking',
                    'Look for providers with substantial booking history'
                  ]
                },
                {
                  title: 'Communicate Through the Platform',
                  tips: [
                    'Use our in-app messaging system for all communications',
                    'Never share personal contact information before meeting',
                    'Keep all booking arrangements within the platform',
                    'Report any requests to communicate off-platform'
                  ]
                },
                {
                  title: 'Trust Your Instincts',
                  tips: [
                    'If something feels wrong, cancel the booking',
                    'Don\'t feel pressured to proceed with uncomfortable situations',
                    'Report any suspicious behavior immediately',
                    'Contact support if you have safety concerns'
                  ]
                },
                {
                  title: 'Meet Safely',
                  tips: [
                    'Share your booking details with a trusted friend or family member',
                    'Meet in public locations when possible for first meetings',
                    'Verify the provider\'s identity upon meeting',
                    'Keep your phone charged and accessible'
                  ]
                }
              ].map((section, index) => (
                <div key={index} className="border-l-4 pl-6" style={{ borderColor: '#6A0DAD' }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#2B0E3F' }}>{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#6A0DAD' }} />
                        <span style={{ color: '#4B5563' }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips for Providers */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
            <h2 className="text-3xl font-serif font-bold mb-8" style={{ color: '#2B0E3F' }}>
              Safety Tips for Providers
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Screen Your Clients',
                  tips: [
                    'Review client profiles and ratings before accepting bookings',
                    'Trust your instincts about potential clients',
                    'You have the right to decline any booking',
                    'Report suspicious profiles or behavior'
                  ]
                },
                {
                  title: 'Protect Your Information',
                  tips: [
                    'Never share your home address until necessary',
                    'Use the platform\'s messaging system',
                    'Keep financial information private',
                    'Don\'t share personal social media accounts'
                  ]
                },
                {
                  title: 'Set Clear Boundaries',
                  tips: [
                    'Clearly communicate your services and limitations',
                    'Establish and enforce professional boundaries',
                    'Have a cancellation policy and stick to it',
                    'Don\'t feel obligated to accommodate unreasonable requests'
                  ]
                },
                {
                  title: 'Safety During Bookings',
                  tips: [
                    'Share your schedule with someone you trust',
                    'Keep your phone accessible at all times',
                    'Meet new clients in public settings when possible',
                    'Have an emergency contact plan in place'
                  ]
                }
              ].map((section, index) => (
                <div key={index} className="border-l-4 pl-6" style={{ borderColor: '#C1A35E' }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#2B0E3F' }}>{section.title}</h3>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C1A35E' }} />
                        <span style={{ color: '#4B5563' }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What to Do If Something Goes Wrong */}
        <section className="mb-16">
          <div className="bg-red-50 rounded-3xl p-12 shadow-xl border border-red-100">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="w-12 h-12" style={{ color: '#DC2626' }} />
              <h2 className="text-3xl font-serif font-bold" style={{ color: '#2B0E3F' }}>
                If Something Goes Wrong
              </h2>
            </div>
            
            <div className="space-y-4 mb-8" style={{ color: '#4B5563' }}>
              <p className="text-lg">
                If you experience or witness any safety concerns, harassment, or inappropriate behavior:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#2B0E3F' }}>Immediate Danger</h3>
                  <p className="mb-2">Contact local emergency services (911) immediately</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Your safety is the top priority - don't hesitate to call for help</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-red-200">
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#2B0E3F' }}>Platform Issues</h3>
                  <p className="mb-2">Contact support: <a href="mailto:support@muspyhos.com" className="font-bold hover:underline" style={{ color: '#6A0DAD' }}>support@muspyhos.com</a></p>
                  <p className="mb-2">Emergency hotline: <a href="tel:+15551234567" className="font-bold hover:underline" style={{ color: '#6A0DAD' }}>+1 (555) 123-4567</a></p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Available 24/7 for safety concerns</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-lg mb-3" style={{ color: '#2B0E3F' }}>Use Our Reporting Tools</h3>
              <p style={{ color: '#4B5563' }}>
                Every profile and booking has a "Report" button. Use it to flag inappropriate behavior, harassment, safety concerns, or terms of service violations. Our team investigates all reports promptly and takes appropriate action.
              </p>
            </div>
          </div>
        </section>

        {/* Community Standards */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
              Building a Safe Community Together
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: '#4B5563' }}>
              Safety is a shared responsibility. By following these guidelines and treating each other with respect, we create a trusted community where everyone can feel secure. Thank you for helping us maintain the highest safety standards.
            </p>
            <a 
              href="/contact"
              className="inline-block bg-gradient-luxury text-white px-10 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl"
            >
              Contact Safety Team
            </a>
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}