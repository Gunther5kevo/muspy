'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div 
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{
        background: "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/signup" 
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 transition-colors"
          style={{ color: "#6A0DAD" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Sign Up</span>
        </Link>

        <div 
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 border"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: "#2B0E3F" }}
            >
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base" style={{ color: "#6B7280" }}>
              Last updated: January 9, 2026
            </p>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none space-y-6 sm:space-y-8">
            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                1. Acceptance of Terms
              </h2>
              <p style={{ color: "#374151" }}>
                By accessing and using Muspy Ho's platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                2. Description of Service
              </h2>
              <p style={{ color: "#374151" }}>
                Muspy Ho's is a platform that connects clients with verified service providers in the beauty and wellness industry. We provide the technology and infrastructure to facilitate bookings, but we are not a party to the actual service agreements between clients and providers.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                3. User Accounts
              </h2>
              <div style={{ color: "#374151" }} className="space-y-3">
                <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the confidentiality of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information remains current and accurate</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                4. User Conduct
              </h2>
              <div style={{ color: "#374151" }} className="space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Harass, abuse, or harm another person</li>
                  <li>Submit false or misleading information</li>
                  <li>Interfere with or disrupt the platform or servers</li>
                  <li>Attempt to gain unauthorized access to any portion of the platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                5. Provider Obligations
              </h2>
              <div style={{ color: "#374151" }} className="space-y-3">
                <p>Service providers using our platform agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about their services, qualifications, and availability</li>
                  <li>Maintain appropriate licenses and certifications required by law</li>
                  <li>Deliver services professionally and as described</li>
                  <li>Respect client privacy and confidentiality</li>
                  <li>Comply with all applicable health and safety regulations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                6. Payments and Refunds
              </h2>
              <p style={{ color: "#374151" }}>
                All payments are processed securely through our platform. Refund policies vary by service provider and are subject to their individual terms. Muspy Ho's facilitates payments but is not responsible for disputes between clients and providers regarding refunds.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                7. Cancellation Policy
              </h2>
              <p style={{ color: "#374151" }}>
                Cancellation policies are set by individual service providers. Please review the specific cancellation terms before booking. Late cancellations or no-shows may result in charges as determined by the provider's policy.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                8. Intellectual Property
              </h2>
              <p style={{ color: "#374151" }}>
                The platform and its original content, features, and functionality are owned by Muspy Ho's and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of our platform.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                9. Limitation of Liability
              </h2>
              <p style={{ color: "#374151" }}>
                Muspy Ho's acts as a platform connecting clients and providers. We are not liable for the quality, safety, or legality of services provided. To the maximum extent permitted by law, Muspy Ho's shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                10. Dispute Resolution
              </h2>
              <p style={{ color: "#374151" }}>
                Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration in accordance with the laws of your jurisdiction. You agree to waive your right to a jury trial or class action lawsuit.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                11. Modifications to Terms
              </h2>
              <p style={{ color: "#374151" }}>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification. Your continued use of the platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                12. Termination
              </h2>
              <p style={{ color: "#374151" }}>
                We may terminate or suspend your account immediately, without prior notice, for any violation of these Terms of Service. Upon termination, your right to use the platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4"
                style={{ color: "#2B0E3F" }}
              >
                13. Contact Information
              </h2>
              <p style={{ color: "#374151" }}>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3" style={{ color: "#6A0DAD" }}>
                <p>Email: legal@muspyhos.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}