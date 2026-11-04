"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  ArrowRightIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CodeBracketSquareIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      router.push("/");
    }
  }

  // Handle Google OAuth Success Response
  async function handleGoogleSuccess(credentialResponse) {
    setLocalError("");
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        router.push("/");
      } else {
        setLocalError(result.error || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setLocalError("An unexpected error occurred during Google sign in.");
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div 
        className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-main)',
        }}
      >
        <Header />

        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12">
          {/* Unified Single Container with Modern Split Layout */}
          <div
            data-aos="fade-up"
            className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border backdrop-blur-xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Left Side: Form Fields (Cols 7/12) */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              
              {/* Brand Header */}
              <div
                className="flex flex-col items-start space-y-2 mb-2"
                data-aos="fade-down"
                data-aos-delay="100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="p-2.5 rounded-2xl shadow-md flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    <CodeBracketSquareIcon className="h-6 w-6" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full uppercase tracking-widest font-extrabold" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                    Personal Blog
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight font-theme-heading">
                  Welcome back to <span style={{ color: 'var(--accent)' }}>Codewalk</span>
                </h1>
              </div>

              {(error || localError) && (
                <div className="text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl font-medium text-sm">
                  {localError || error}
                </div>
              )}

              {/* Google Sign-In Button */}
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setLocalError(
                      "Google Sign-In was unsuccessful. Please try again."
                    )
                  }
                  useOneTap
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center my-1">
                <div className="flex-grow border-t" style={{ borderColor: 'var(--border-color)' }} />
                <span className="px-3 text-[10px] uppercase tracking-widest opacity-50 font-extrabold">
                  Or sign in with email
                </span>
                <div className="flex-grow border-t" style={{ borderColor: 'var(--border-color)' }} />
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 font-theme-body"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80"
                    style={{ color: 'var(--text-main)' }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40" style={{ color: 'var(--text-main)' }}>
                      <EnvelopeIcon className="h-4 w-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border focus:outline-none transition-colors shadow-inner"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                      }}
                      placeholder="author@codewalk.org"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80"
                    style={{ color: 'var(--text-main)' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40" style={{ color: 'var(--text-main)' }}>
                      <LockClosedIcon className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border focus:outline-none transition-colors shadow-inner"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer mt-3 rounded-2xl font-theme-heading hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  <span>
                    {loading ? "Authenticating..." : "Sign in to Dashboard"}
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>

              {/* Footer Link */}
              <div
                className="text-center font-theme-body pt-4 border-t text-sm opacity-80"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                data-aos="fade-in"
                data-aos-delay="300"
              >
                Don't have an author account?{" "}
                <Link
                  href="/register"
                  className="font-bold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Sign up
                </Link>
              </div>
            </div>

            {/* Right Side: Developer Workspace Showcase (Cols 5/12) */}
            <div className="hidden lg:col-span-5 lg:relative lg:flex items-center justify-center p-6 overflow-hidden min-h-[520px]">
              <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl border flex flex-col justify-end p-8" style={{ borderColor: 'var(--border-color)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                  alt="Developer Workspace"
                  fill
                  priority
                  className="object-cover opacity-85 scale-105 hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/10 text-white border border-white/20">
                      <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
                      <span>Digital Space</span>
                    </div>
                    <blockquote className="space-y-1.5">
                      <p className="text-sm italic font-theme-body text-gray-200 leading-relaxed">
                        "First, solve the problem. Then, write the code and share the story."
                      </p>
                      <footer className="text-xs opacity-75 font-theme-heading tracking-widest uppercase">
                        — John Johnson
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}