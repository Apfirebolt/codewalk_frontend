"use client";

import { useEffect } from "react";
import AOS from "aos";
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from "@/store/useAuthStore";

// Styles
import "aos/dist/aos.css";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import './main.css';

export default function RootLayout({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // 1. Initialize Authentication state from cookies
    initializeAuth();

    // 2. Initialize AOS animations
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });

    // 3. Restore saved theme from localStorage on initial load
    const savedTheme = localStorage.getItem('codewalk_theme') || 'dark';
    const root = document.documentElement;
    ['light', 'dark', 'neon', 'argon'].forEach((t) => root.classList.remove(t));
    root.classList.add(savedTheme);
  }, [initializeAuth]);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body 
        className="font-theme-body transition-colors duration-300 min-h-screen flex flex-col"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-main)',
        }}
      >
        <ToastContainer 
          position="bottom-right" 
          theme="colored"
          autoClose={3000}
        />
        {children}
      </body>
    </html>
  );
}