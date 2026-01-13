'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-serif font-bold mb-6" style={{ color: '#2B0E3F' }}>
            Get in <span className="bg-gradient-luxury bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Touch</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#4B5563' }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Mail,
              title: 'Email Us',
              content: 'support@muspyhos.com',
              link: 'mailto:support@muspyhos.com'
            },
            {
              icon: Phone,
              title: 'Call Us',
              content: '+1 (555) 123-4567',
              link: 'tel:+15551234567'
            },
            {
              icon: MapPin,
              title: 'Visit Us',
              content: '123 Premium St, Suite 100\nSan Francisco, CA 94102',
              link: null
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border text-center hover:shadow-2xl transition-shadow" style={{ borderColor: 'rgba(229, 199, 255, 0.2)' }}>
              <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B0E3F' }}>{item.title}</h3>
              {item.link ? (
                <a href={item.link} className="text-lg hover:underline" style={{ color: '#6A0DAD' }}>
                  {item.content}
                </a>
              ) : (
                <p className="text-lg whitespace-pre-line" style={{ color: '#4B5563' }}>{item.content}</p>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
            <h2 className="text-3xl font-serif font-bold mb-8 text-center" style={{ color: '#2B0E3F' }}>
              Send Us a Message
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2B0E3F' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ borderColor: '#E5E7EB' }}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-luxury text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}