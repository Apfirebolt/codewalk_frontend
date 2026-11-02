'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HomeIcon, ShieldExclamationIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center space-y-8 relative">
          
          {/* Subtle background glow effect using accent color */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 blur-[120px] rounded-full pointer-events-none opacity-25"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          {/* Icon Badge */}
          <div 
            className="relative z-10 w-20 h-20 mx-auto rounded-3xl border flex items-center justify-center shadow-xl backdrop-blur-xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent)',
            }}
          >
            <ShieldExclamationIcon className="h-10 w-10" />
          </div>

          {/* Heading & Error Code */}
          <div className="relative z-10 space-y-3">
            <span 
              className="text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border inline-block shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--accent)' 
              }}
            >
              Error 403 • Access Denied
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-theme-heading tracking-tight">
              You need <span style={{ color: 'var(--accent)' }}>admin privileges</span>
            </h1>
            <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
              This section of the control center is restricted. Please sign in with an authorized administrator account to view or modify entries.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold font-theme-heading transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
              }}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold font-theme-heading border transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-100 opacity-80 backdrop-blur-md"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span>Sign In as Admin</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Unauthorized;