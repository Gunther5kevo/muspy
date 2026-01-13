'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, BookOpen, CreditCard, UserCircle, Shield, Settings, MessageCircle, FileText } from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn the basics of using Muspy Ho\'s',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Understanding verification',
        'Navigating the platform'
      ]
    },
    {
      icon: CreditCard,
      title: 'Bookings & Payments',
      description: 'Everything about making and managing bookings',
      articles: [
        'How to book a provider',
        'Payment methods accepted',
        'Understanding pricing',
        'Cancellation and refund policy'
      ]
    },
    {
      icon: UserCircle,
      title: 'For Providers',
      description: 'Resources for service providers',
      articles: [
        'Becoming a verified provider',
        'Setting your rates',
        'Managing your calendar',
        'Getting paid and payouts'
      ]
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      description: 'Staying safe on our platform',
      articles: [
        'Safety guidelines',
        'Reporting issues',
        'Privacy protection',
        'Account security tips'
      ]
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Managing your account preferences',
      articles: [
        'Updating your profile',
        'Notification settings',
        'Changing password',
        'Deleting your account'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Communication',
      description: 'Messaging and support',
      articles: [
        'Using in-app messaging',
        'Contacting support',
        'Managing notifications',
        'Language preferences'
      ]
    }
  ];

  const popularArticles = [
    {
      title: 'How do I book a provider?',
      category: 'Bookings',
      views: '12.5K'
    },
    {
      title: 'What payment methods are accepted?',
      category: 'Payments',
      views: '10.2K'
    },
    {
      title: 'How does provider verification work?',
      category: 'Safety',
      views: '9.8K'
    },
    {
      title: 'What is your cancellation policy?',
      category: 'Bookings',
      views: '8.9K'
    },
    {
      title: 'How do I become a verified provider?',
      category: 'Providers',
      views: '7.6K'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      {/* Hero Section with Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            How can we <span className="bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>help</span> you?
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: '#4B5563' }}>
            Search our knowledge base or browse categories below
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: '#6A0DAD' }} />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 text-lg focus:outline-none focus:ring-4 shadow-xl transition-all"
                style={{ borderColor: '#E5C7FF', focusRingColor: 'rgba(106, 13, 173, 0.1)' }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="text-4xl font-bold mb-2" style={{ color: '#6A0DAD' }}>250+</div>
            <div style={{ color: '#6B7280' }}>Help Articles</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="text-4xl font-bold mb-2" style={{ color: '#6A0DAD' }}>24/7</div>
            <div style={{ color: '#6B7280' }}>Support Available</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border text-center" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
            <div className="text-4xl font-bold mb-2" style={{ color: '#6A0DAD' }}>&lt;2h</div>
            <div style={{ color: '#6B7280' }}>Avg Response Time</div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-4xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
          Browse by Category
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-2xl transition-all cursor-pointer group"
              style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
            >
              <div className="w-16 h-16 bg-gradient-luxury rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#2B0E3F' }}>
                {category.title}
              </h3>
              <p className="mb-6" style={{ color: '#6B7280' }}>
                {category.description}
              </p>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a 
                      href="#"
                      className="text-sm hover:underline flex items-center gap-2"
                      style={{ color: '#6A0DAD' }}
                    >
                      <FileText className="w-4 h-4" />
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-4xl font-serif font-bold text-center mb-12" style={{ color: '#2B0E3F' }}>
          Popular Articles
        </h2>

        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
          {popularArticles.map((article, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center justify-between p-6 hover:bg-purple-50 transition-colors border-b last:border-b-0"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <FileText className="w-6 h-6" style={{ color: '#6A0DAD' }} />
                <div>
                  <h3 className="font-bold text-lg" style={{ color: '#2B0E3F' }}>
                    {article.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    {article.category}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                {article.views} views
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-luxury rounded-3xl p-12 text-center shadow-2xl">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h3 className="text-4xl font-serif font-bold text-white mb-4">
            Still Need Help?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#E5C7FF' }}>
            Can't find what you're looking for? Our support team is here to assist you 24/7.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/contact"
              className="inline-block bg-white px-10 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl"
              style={{ color: '#6A0DAD' }}
            >
              Contact Support
            </a>
            <a 
              href="/faq"
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-purple-900 transition-all shadow-xl"
            >
              View FAQ
            </a>
          </div>
          
          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 text-white">
            <div>
              <div className="font-bold mb-2">Email</div>
              <a href="mailto:support@muspyhos.com" className="hover:underline">
                support@muspyhos.com
              </a>
            </div>
            <div>
              <div className="font-bold mb-2">Phone</div>
              <a href="tel:+15551234567" className="hover:underline">
                +1 (555) 123-4567
              </a>
            </div>
            <div>
              <div className="font-bold mb-2">Live Chat</div>
              <div>Available 24/7</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}