'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Upload, MapPin, DollarSign, Calendar, FileText, ArrowRight, CheckCircle } from 'lucide-react';

export default function ProviderSetupPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    hourlyRate: '',
    services: '',
    availability: '',
    experience: '',
    phoneNumber: '',
    instagram: '',
    twitter: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (profile?.role !== 'provider') {
      router.push('/dashboard');
    }
  }, [user, profile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.bio || formData.bio.length < 50) {
        toast.error('Bio must be at least 50 characters');
        return false;
      }
      if (!formData.location) {
        toast.error('Please enter your location');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.hourlyRate || formData.hourlyRate < 10) {
        toast.error('Please enter a valid hourly rate (min $10)');
        return false;
      }
      if (!formData.services) {
        toast.error('Please describe your services');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);

    try {
      // Update user profile in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          bio: formData.bio,
          location: formData.location,
          hourly_rate: parseFloat(formData.hourlyRate),
          services: formData.services,
          availability: formData.availability,
          experience: formData.experience,
          phone_number: formData.phoneNumber,
          instagram: formData.instagram,
          twitter: formData.twitter,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile completed successfully!');
      router.push('/provider-dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'About You', icon: FileText },
    { number: 2, title: 'Services & Pricing', icon: DollarSign },
    { number: 3, title: 'Additional Info', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(229, 199, 255, 0.3)' }}>
            <Upload className="w-4 h-4" style={{ color: '#6A0DAD' }} />
            <span className="text-sm font-medium" style={{ color: '#2B0E3F' }}>Provider Onboarding</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: '#2B0E3F' }}>
            Complete Your Profile
          </h1>
          <p className="text-lg" style={{ color: '#4B5563' }}>
            Help clients get to know you better
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all"
                    style={{
                      backgroundColor: step >= s.number ? '#6A0DAD' : '#E5E7EB',
                      color: step >= s.number ? 'white' : '#9CA3AF'
                    }}
                  >
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span 
                    className="text-sm font-medium text-center"
                    style={{ color: step >= s.number ? '#2B0E3F' : '#9CA3AF' }}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className="h-1 flex-1 mx-4 rounded"
                    style={{ backgroundColor: step > s.number ? '#6A0DAD' : '#E5E7EB' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border" style={{ borderColor: 'rgba(229, 199, 255, 0.3)' }}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: About You */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Tell us about yourself *
                  </label>
                  <textarea
                    name="bio"
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 resize-none"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="Share your story, experience, and what makes you unique... (min 50 characters)"
                  />
                  <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                    {formData.bio.length}/50 characters minimum
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    <MapPin className="w-4 h-4 inline mr-2" style={{ color: '#6A0DAD' }} />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Services & Pricing */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    <DollarSign className="w-4 h-4 inline mr-2" style={{ color: '#6A0DAD' }} />
                    Hourly Rate (USD) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    required
                    min="10"
                    step="5"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="150"
                  />
                  <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                    Minimum rate: $10/hour
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Services Offered *
                  </label>
                  <textarea
                    name="services"
                    required
                    value={formData.services}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 resize-none"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="Describe the services you provide..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    <Calendar className="w-4 h-4 inline mr-2" style={{ color: '#6A0DAD' }} />
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="e.g., Mon-Fri 9AM-5PM, Weekends by appointment"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="e.g., 5+ years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="@yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                    Twitter Handle (Optional)
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#D1D5DB',
                      '--tw-ring-color': '#6A0DAD'
                    }}
                    placeholder="@yourusername"
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border" style={{ borderColor: 'rgba(106, 13, 173, 0.2)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#2B0E3F' }}>
                    📸 Profile Photo Coming Soon
                  </h4>
                  <p className="text-sm" style={{ color: '#4B5563' }}>
                    You'll be able to upload your profile photo from your dashboard after completing this setup.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#6A0DAD',
                    border: '2px solid #6A0DAD'
                  }}
                >
                  ← Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? 'Saving...' : (
                    <>
                      Complete Setup
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@muspyhos.com" 
              className="font-semibold"
              style={{ color: '#6A0DAD' }}
            >
              support@muspyhos.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}