'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  CodeBracketSquareIcon, 
  BookOpenIcon, 
  FolderIcon, 
  PhotoIcon, 
  PlusCircleIcon,
  BellIcon,
  Bars3Icon, 
  XMarkIcon,
  SwatchIcon,
  CheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Midnight' },
  { id: 'neon', name: 'Neon' },
  { id: 'argon', name: 'Argon' },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth, logout } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const themeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Check if current user has admin role
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    initializeAuth();
    const savedTheme = localStorage.getItem('codewalk_theme') || 'dark';
    console.log('Saved theme:', savedTheme);
    setCurrentTheme(savedTheme);
    applyThemeClass(savedTheme);
  }, [initializeAuth]);

  const applyThemeClass = (themeName) => {
    const root = document.documentElement;
    ['light', 'dark', 'neon', 'argon'].forEach((t) => root.classList.remove(t));
    root.classList.add(themeName);
    localStorage.setItem('codewalk_theme', themeName);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyThemeClass(themeId);
    setIsThemeDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsThemeDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        opacity: 0.98
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl transition-all shadow-md group-hover:scale-105 group-hover:rotate-3"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <CodeBracketSquareIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold font-theme-heading tracking-tight flex items-center gap-1.5"
                style={{ color: 'var(--text-main)' }}
              >
                Code
                <span className="text-xs px-2 py-0.5 rounded-full uppercase tracking-widest font-bold"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >Walk
                </span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold opacity-60" style={{ color: 'var(--text-muted)' }}>
                Digital Space of Amit PR
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Blog, Projects, Gallery) */}
        <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <Link 
            href="/blog" 
            className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all ${
              pathname.startsWith('/blog') ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={pathname.startsWith('/blog') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <BookOpenIcon className="h-4 w-4" />
            <span>Blog</span>
          </Link>

          <Link 
            href="/projects" 
            className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all ${
              pathname.startsWith('/projects') ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={pathname.startsWith('/projects') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <SparklesIcon className="h-4 w-4" />
            <span>Projects</span>
          </Link>

          <Link 
            href="/gallery" 
            className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all ${
              pathname.startsWith('/gallery') ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={pathname.startsWith('/gallery') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
          >
            <PhotoIcon className="h-4 w-4" />
            <span>Gallery</span>
          </Link>
        </nav>

        {/* Right Side: Actions, Theme Switcher, & User Auth */}
        <div className="flex items-center gap-3">
          
          {/* Quick Create Button (Gated strictly for Admin users) */}
          {isAuthenticated && isAdmin && (
            <Link
              href="/content/new"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-sm"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span>New Post</span>
            </Link>
          )}

          {/* Theme Selector Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2.5 rounded-2xl border flex items-center gap-2 transition-all shadow-sm hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)'
              }}
              aria-label="Select theme"
            >
              <SwatchIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              <span className="hidden sm:inline font-semibold uppercase tracking-wider text-xs">
                {currentTheme}
              </span>
            </button>

            {isThemeDropdownOpen && (
              <div 
                className="absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl border py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>
                  Color Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className="w-full text-sm text-left px-4 py-2.5 font-medium flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <span>{t.name}</span>
                    {currentTheme === t.id && (
                      <CheckIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Authentication Status / Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all shadow-sm hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)'
                }}
              >
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Avatar" className="w-7 h-7 rounded-full object-cover border-2" style={{ borderColor: 'var(--accent)' }} />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-inner"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    {(user.username || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-sm max-w-[110px] truncate">
                  {user.username || user.email}
                </span>
              </button>

              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[10px] uppercase font-extrabold tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                    <p className="font-bold text-sm truncate mt-0.5" style={{ color: 'var(--text-main)' }}>{user.username || user.email}</p>
                  </div>

                  {/* Create New Post (Admin Only) */}
                  {isAdmin && (
                    <Link
                      href="/content/new"
                      className="w-full text-left px-4 py-2.5 font-medium text-sm flex items-center gap-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ color: 'var(--text-main)' }}
                    >
                      <PlusCircleIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                      <span>Create New Post</span>
                    </Link>
                  )}

                  <Link
                    href="/settings"
                    className="w-full text-left px-4 py-2.5 font-medium text-sm flex items-center gap-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-main)' }}
                  >
                    <Cog6ToothIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    <span>Account Settings</span>
                  </Link>

                  <div className="my-1 border-t" style={{ borderColor: 'var(--border-color)' }}></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 font-medium text-sm flex items-center gap-2.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl border transition-all hover:opacity-100 opacity-80"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-md hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: 'var(--text-main)' }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b px-5 py-5 space-y-3 shadow-2xl backdrop-blur-2xl"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          {isAuthenticated && user && (
            <div className="px-4 py-3 rounded-2xl mb-3 flex items-center gap-3 border shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              {user.profile_image ? (
                <img src={user.profile_image} alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: 'var(--accent)' }} />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {(user.username || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-50" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                <p className="font-bold text-sm truncate" style={{ color: 'var(--text-main)' }}>{user.username || user.email}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1.5 font-medium">
            <Link
              href="/blog"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
              style={pathname.startsWith('/blog') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Blog Articles</span>
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
              style={pathname.startsWith('/projects') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
            >
              <SparklesIcon className="h-5 w-5" />
              <span>Projects Showcase</span>
            </Link>

            <Link
              href="/gallery"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
              style={pathname.startsWith('/gallery') ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
            >
              <PhotoIcon className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="pt-2 border-t space-y-1.5" style={{ borderColor: 'var(--border-color)' }}>
              {/* Create New Post (Admin Only) */}
              {isAdmin && (
                <Link
                  href="/content/new"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Create New Post</span>
                </Link>
              )}

              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors"
                style={pathname === '/settings' ? { backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' } : { color: 'var(--text-main)' }}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium border transition-colors text-sm"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium transition-colors shadow-sm text-sm"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;