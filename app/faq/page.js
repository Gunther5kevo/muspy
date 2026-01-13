'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'For Clients',
      questions: [
        {
          q: 'How do I book a provider?',
          a: 'Browse our verified provider directory, select a provider that meets your needs, choose your preferred date and time, and complete the secure booking process. You\'ll receive instant confirmation via email.'
        },
        {
          q: 'Are all providers verified?',
          a: 'Yes! Every provider goes through our rigorous verification process including government ID verification, selfie verification, and comprehensive background checks before being approved on our platform.'
        },
        {
          q: 'How do payments work?',
          a: 'All payments are processed securely through our encrypted payment system. We accept major credit cards and digital payment methods. Your payment information is never shared with providers.'
        },
        {
          q: 'What is your cancellation policy?',
          a: 'Cancellation policies vary by provider. Most providers offer free cancellation up to 24-48 hours before the scheduled appointment. Please review the specific provider\'s cancellation policy before booking.'
        },
        {
          q: 'Can I leave reviews?',
          a: 'Absolutely! We encourage honest reviews after each booking. Your feedback helps maintain our community standards and assists other clients in making informed decisions.'
        }
      ]
    },
    {
      category: 'For Providers',
      questions: [
        {
          q: 'How do I become a provider?',
          a: 'Click "Apply as Provider" and complete our application form. You\'ll need to provide valid government ID, professional photos, and pass our verification process including background checks.'
        },
        {
          q: 'What are the fees?',
          a: 'Muspy Ho\'s charges a service fee on each booking to cover platform operations, payment processing, and customer support. The exact fee structure is provided during the application process.'
        },
        {
          q: 'How do I get paid?',
          a: 'Payments are processed automatically and transferred to your linked bank account on a weekly basis. You can track all earnings through your provider dashboard.'
        },
        {
          q: 'Can I set my own rates?',
          a: 'Yes! You have complete control over your pricing. You can set your hourly rates, package deals, and any additional fees. You can also adjust your rates at any time.'
        },
        {
          q: 'How do I manage my availability?',
          a: 'Use your provider dashboard to set your availability calendar, block off dates, and manage booking requests. You have full control over when you work.'
        }
      ]
    },
    {
      category: 'Safety & Security',
      questions: [
        {
          q: 'How does Muspy Ho\'s ensure safety?',
          a: 'We implement multiple safety measures including mandatory ID verification, background checks, secure payment processing, in-platform messaging, review systems, and 24/7 customer support.'
        },
        {
          q: 'Is my personal information secure?',
          a: 'Yes. We use industry-standard encryption and security protocols to protect your data. Your payment information is processed through PCI-compliant systems and is never shared with other users.'
        },
        {
          q: 'What if I have a safety concern?',
          a: 'Contact our support team immediately at support@muspyhos.com or use the emergency contact feature in your account. We take all safety concerns seriously and investigate promptly.'
        }
      ]
    }
  ];

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            Frequently Asked <span className="bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Questions</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#4B5563' }}>
            Find answers to common questions about our platform, bookings, and services
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div 
                      key={questionIndex}
                      className="bg-white rounded-2xl shadow-lg border overflow-hidden transition-all"
                      style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}
                    >
                      <button
                        onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-lg font-bold pr-8" style={{ color: '#2B0E3F' }}>
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                        ) : (
                          <ChevronDown className="w-6 h-6 flex-shrink-0" style={{ color: '#6A0DAD' }} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-8 pb-6">
                          <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-luxury rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-serif font-bold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-xl mb-8" style={{ color: '#E5C7FF' }}>
            Our support team is here to help you 24/7
          </p>
          <a 
            href="/contact"
            className="inline-block bg-white px-10 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl"
            style={{ color: '#6A0DAD' }}
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}