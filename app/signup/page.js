"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { UserPlus, Briefcase } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const defaultRole = searchParams.get("role") || "client";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: defaultRole,
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup...');
      await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      
      console.log('Signup complete, redirecting to email verification');
      
      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(to bottom right, #F8F5FF, #FFFFFF, #E5C7FF)",
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center">
              <span className="text-white font-serif text-2xl">M</span>
            </div>
          </Link>
          <h1
            className="text-3xl font-serif font-bold mb-2"
            style={{ color: "#2B0E3F" }}
          >
            Join Muspy Ho's
          </h1>
          <p style={{ color: "#4B5563" }}>Create your exclusive account</p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border"
          style={{ borderColor: "rgba(229, 199, 255, 0.3)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#374151" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: "#D1D5DB",
                  "--tw-ring-color": "#6A0DAD",
                }}
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "#374151" }}
              >
                I want to
              </label>
              <div className="space-y-3">
                <label
                  className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                  style={{
                    borderColor:
                      formData.role === "client" ? "#6A0DAD" : "#D1D5DB",
                    backgroundColor:
                      formData.role === "client"
                        ? "rgba(229, 199, 255, 0.2)"
                        : "transparent",
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === "client"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-3"
                    style={{ accentColor: "#6A0DAD" }}
                  />
                  <UserPlus
                    className="w-5 h-5 mr-3"
                    style={{ color: "#6A0DAD" }}
                  />
                  <div>
                    <div className="font-semibold" style={{ color: "#2B0E3F" }}>
                      Book Services
                    </div>
                    <div className="text-sm" style={{ color: "#4B5563" }}>
                      Browse and book verified providers
                    </div>
                  </div>
                </label>

                <label
                  className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                  style={{
                    borderColor:
                      formData.role === "provider" ? "#6A0DAD" : "#D1D5DB",
                    backgroundColor:
                      formData.role === "provider"
                        ? "rgba(229, 199, 255, 0.2)"
                        : "transparent",
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === "provider"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-3"
                    style={{ accentColor: "#6A0DAD" }}
                  />
                  <Briefcase
                    className="w-5 h-5 mr-3"
                    style={{ color: "#6A0DAD" }}
                  />
                  <div>
                    <div className="font-semibold" style={{ color: "#2B0E3F" }}>
                      Offer Services
                    </div>
                    <div className="text-sm" style={{ color: "#4B5563" }}>
                      Create profile and accept bookings
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-1 mr-2 rounded"
                  style={{ accentColor: "#6A0DAD" }}
                  required
                />
                <span className="text-sm" style={{ color: "#4B5563" }}>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="transition-colors"
                    style={{ color: "#6A0DAD" }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="transition-colors"
                    style={{ color: "#6A0DAD" }}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: "#4B5563" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: "#6A0DAD" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="transition-colors"
            style={{ color: "#4B5563" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}