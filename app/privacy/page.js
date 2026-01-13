'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <Navbar />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">

          <div 
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 border"
            style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-gradient-luxury rounded-2xl">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base" style={{ color: "#6B7280" }}>
                Last updated: January 9, 2026
              </p>
            </div>

            <div className="prose prose-sm sm:prose-base max-w-none space-y-6 sm:space-y-8">
              <section>
                <p style={{ color: "#374151" }} className="text-base sm:text-lg">
                  At Muspy Ho's, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section>
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Database className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#6A0DAD" }} />
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-bold"
                    style={{ color: "#2B0E3F" }}
                  >
                    1. Information We Collect
                  </h2>
                </div>
                
                <div style={{ color: "#374151" }} className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>Personal Information</h3>
                    <p>When you create an account, we collect:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Full name and email address</li>
                      <li>Phone number (optional)</li>
                      <li>Profile photo (optional)</li>
                      <li>Payment information (processed securely through third-party providers)</li>
                      <li>Service preferences and booking history</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>Provider Information</h3>
                    <p>For service providers, we additionally collect:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Business name and description</li>
                      <li>Certifications and licenses</li>
                      <li>Service offerings and pricing</li>
                      <li>Availability and location information</li>
                      <li>Portfolio photos and work samples</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>Automatically Collected Information</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Usage data and analytics</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#6A0DAD" }} />
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-bold"
                    style={{ color: "#2B0E3F" }}
                  >
                    2. How We Use Your Information
                  </h2>
                </div>
                
                <div style={{ color: "#374151" }}>
                  <p className="mb-3">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage your account</li>
                    <li>Process bookings and payments</li>
                    <li>Connect clients with service providers</li>
                    <li>Send booking confirmations and reminders</li>
                    <li>Provide customer support</li>
                    <li>Improve our platform and services</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Detect and prevent fraud or abuse</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#6A0DAD" }} />
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-bold"
                    style={{ color: "#2B0E3F" }}
                  >
                    3. Information Sharing
                  </h2>
                </div>
                
                <div style={{ color: "#374151" }} className="space-y-3">
                  <p>We share your information only in the following circumstances:</p>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>With Service Providers</h3>
                    <p>When you book a service, we share necessary information with the provider (name, contact details, booking details).</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>With Service Partners</h3>
                    <p>We use trusted third-party services for:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Payment processing (Stripe, PayPal)</li>
                      <li>Email communications</li>
                      <li>Analytics and performance monitoring</li>
                      <li>Cloud storage and hosting</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#2B0E3F" }}>Legal Requirements</h3>
                    <p>We may disclose your information if required by law or to protect our rights, safety, or property.</p>
                  </div>

                  <p className="font-semibold" style={{ color: "#6A0DAD" }}>
                    We will never sell your personal information to third parties.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#6A0DAD" }} />
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-bold"
                    style={{ color: "#2B0E3F" }}
                  >
                    4. Data Security
                  </h2>
                </div>
                
                <div style={{ color: "#374151" }} className="space-y-3">
                  <p>We implement industry-standard security measures to protect your information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure authentication and password hashing</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and monitoring</li>
                    <li>Secure payment processing (PCI DSS compliant)</li>
                  </ul>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Note: While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Bell className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#6A0DAD" }} />
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-bold"
                    style={{ color: "#2B0E3F" }}
                  >
                    5. Your Privacy Rights
                  </h2>
                </div>
                
                <div style={{ color: "#374151" }}>
                  <p className="mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Object:</strong> Object to certain data processing activities</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, contact us at privacy@muspyhos.com
                  </p>
                </div>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  6. Cookies and Tracking
                </h2>
                <div style={{ color: "#374151" }}>
                  <p className="mb-3">We use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Improve security and prevent fraud</li>
                  </ul>
                  <p className="mt-3">
                    You can control cookie settings through your browser preferences. Note that disabling cookies may affect platform functionality.
                  </p>
                </div>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  7. Data Retention
                </h2>
                <p style={{ color: "#374151" }}>
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will remove or anonymize your personal data within 30 days, except where retention is required by law.
                </p>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  8. Children's Privacy
                </h2>
                <p style={{ color: "#374151" }}>
                  Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  9. International Data Transfers
                </h2>
                <p style={{ color: "#374151" }}>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.
                </p>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  10. Changes to This Policy
                </h2>
                <p style={{ color: "#374151" }}>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a prominent notice on our platform. Your continued use after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 
                  className="text-xl sm:text-2xl font-serif font-bold mb-4"
                  style={{ color: "#2B0E3F" }}
                >
                  11. Contact Us
                </h2>
                <p style={{ color: "#374151" }}>
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(229, 199, 255, 0.2)" }}>
                  <div className="space-y-2" style={{ color: "#2B0E3F" }}>
                    <p><strong>Email:</strong> <span style={{ color: "#6A0DAD" }}>privacy@muspyhos.com</span></p>
                    <p><strong>Phone:</strong> <span style={{ color: "#6A0DAD" }}>+1 (555) 123-4567</span></p>
                    <p><strong>Address:</strong> Muspy Ho's Privacy Team, 123 Beauty Avenue, Suite 456, New York, NY 10001</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}