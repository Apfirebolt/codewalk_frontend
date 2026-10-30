'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  EyeIcon, 
  TagIcon, 
  PhotoIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function GalleryDetailClient({ slug }) {
  const router = useRouter();
  const { currentItem, fetchContentBySlug, clearCurrentItem, loading } = useContentStore();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchContentBySlug(slug);

    return () => {
      clearCurrentItem();
    };
  }, [slug, fetchContentBySlug, clearCurrentItem]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center py-32 opacity-60">
          Loading gallery snapshot...
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center py-32 space-y-4">
          <PhotoIcon className="h-16 w-16 opacity-40" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold font-theme-heading">Snapshot not found</h2>
          <p className="opacity-70 text-sm">The snapshot you are looking for does not exist or has been removed.</p>
          <Link href="/gallery" className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md mt-2" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
            Back to Gallery
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8">
        
        {/* Back Navigation */}
        <div data-aos="fade-down">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold opacity-75 hover:opacity-100 transition-opacity"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Gallery</span>
          </Link>
        </div>

        {/* Header & Meta */}
        <div className="space-y-4" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3 text-xs opacity-75 font-theme-body">
            <span className="flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {new Date(currentItem.date_posted).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><EyeIcon className="h-4 w-4" /> {currentItem.views} views</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-theme-heading tracking-tight leading-tight">
            {currentItem.title}
          </h1>

          {currentItem.meta_description && (
            <p className="text-base sm:text-lg opacity-80 leading-relaxed font-theme-body" style={{ color: 'var(--text-muted)' }}>
              {currentItem.meta_description}
            </p>
          )}

          {/* Tags */}
          {currentItem.tags && currentItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {currentItem.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                >
                  <TagIcon className="h-3.5 w-3.5" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Render Editor.js Blocks (Images & Captions) */}
        <div 
          className="p-6 sm:p-10 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {currentItem.content?.blocks?.map((block, index) => {
            switch (block.type) {
              case 'image':
                const imageUrl = block.data?.file?.url;
                const caption = block.data?.caption;
                if (!imageUrl) return null;
                return (
                  <div key={index} className="space-y-3 group">
                    <div 
                      onClick={() => {
                        setActiveImage({ url: imageUrl, caption });
                        setIsLightboxOpen(true);
                      }}
                      className="relative rounded-2xl overflow-hidden border shadow-md cursor-pointer aspect-[16/10] w-full"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <img src={imageUrl} alt={caption || currentItem.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="px-4 py-2 rounded-xl backdrop-blur-md bg-black/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                          <ArrowsPointingOutIcon className="h-4 w-4" /> Click to expand
                        </span>
                      </div>
                    </div>
                    {caption && (
                      <p className="text-center text-xs sm:text-sm italic opacity-75" style={{ color: 'var(--text-muted)' }}>
                        {caption}
                      </p>
                    )}
                  </div>
                );

              case 'paragraph':
                return (
                  <p key={index} className="text-base leading-relaxed font-theme-body" style={{ color: 'var(--text-main)' }} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                );

              case 'header':
                const Tag = `h${block.data.level || 3}`;
                const headerClasses = block.data.level === 2 
                  ? "text-2xl font-bold font-theme-heading mt-6 mb-2" 
                  : "text-xl font-semibold font-theme-heading mt-4 mb-2";
                return <Tag key={index} className={headerClasses} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

              default:
                return null;
            }
          })}
        </div>

      </main>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && activeImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full border bg-black/60 text-white transition-all hover:scale-110 cursor-pointer border-white/20"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <img src={activeImage.url} alt="Fullscreen preview" className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl" />
            {activeImage.caption && (
              <p className="text-white text-sm mt-4 italic text-center max-w-xl opacity-90">
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}