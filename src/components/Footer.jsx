'use client';

import Link from 'next/link';
import { CodeBracketSquareIcon, SparklesIcon, BookOpenIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer 
      className="border-t transition-colors duration-300 mt-auto"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      <div className="container mx-auto px-6 pt-16 pb-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4 pr-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div 
                className="p-2 rounded-xl transition-transform group-hover:scale-105 shadow-md"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <CodeBracketSquareIcon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold font-theme-heading tracking-tight" style={{ color: 'var(--text-main)' }}>
                Codewalk <span className="text-sm px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ml-1" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>Blog</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-theme-body opacity-80 max-w-md" style={{ color: 'var(--text-muted)' }}>
              My personal digital garden and portfolio showcasing software engineering articles, technical projects, and visual snapshots powered by FastAPI and Next.js.
            </p>
          </div>

          {/* Column 2: Sections Navigation */}
          <div className="space-y-3 font-theme-body">
            <h3 className="font-extrabold text-xs uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2">
                  <BookOpenIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                  <span>Blog Articles</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2">
                  <PhotoIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                  <span>Gallery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture & Features */}
          <div className="space-y-3 font-theme-body">
            <h3 className="font-extrabold text-xs uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>
              Tech Stack
            </h3>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li className="flex items-center gap-2">⚡ FastAPI Backend</li>
              <li className="flex items-center gap-2">⚛️ Next.js 14+ UI</li>
              <li className="flex items-center gap-2">📝 Editor.js Blocks</li>
              <li className="flex items-center gap-2">☁️ Cloudinary Storage</li>
            </ul>
          </div>

          {/* Column 4: Links & Source */}
          <div className="space-y-3 font-theme-body">
            <h3 className="font-extrabold text-xs uppercase tracking-widest opacity-60" style={{ color: 'var(--text-main)' }}>
              Connect & Source
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2"
                >
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <Link href="/editor/new" className="transition-opacity opacity-80 hover:opacity-100 flex items-center gap-2">
                  <span>Author Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div 
          className="border-t pt-6 mt-8 flex flex-col md:flex-row justify-between items-center font-theme-body gap-4 text-xs opacity-75"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <p>&copy; {new Date().getFullYear()} Codewalk Blog Platform. Built with passion & code.</p>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;