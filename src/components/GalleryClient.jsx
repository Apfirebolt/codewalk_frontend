'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { PhotoIcon, EyeIcon, CalendarDaysIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function GalleryClient() {
  const { items, fetchContent, loading } = useContentStore();
  const [selectedTag, setSelectedTag] = useState('all');
  const [activeImageModal, setActiveImageModal] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchContent('gallery'); // Fetch only gallery items
  }, [fetchContent]);

  // Extract unique tags for filtering
  const allTags = ['all', ...new Set(items.flatMap((item) => item.tags?.map((t) => t.name) || []))];

  // Filter items by selected tag
  const filteredItems = selectedTag === 'all' 
    ? items 
    : items.filter((item) => item.tags?.some((t) => t.name === selectedTag));

  // Helper to extract the first image found in Editor.js block content
  const extractCoverImage = (content) => {
    if (!content || !content.blocks) return null;
    const imageBlock = content.blocks.find((block) => block.type === 'image');
    return imageBlock?.data?.file?.url || null;
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-widest shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
            <PhotoIcon className="h-4 w-4" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-theme-heading tracking-tight">
            Gallery <span style={{ color: 'var(--accent)' }}>Snapshots</span>
          </h1>
          <p className="text-sm sm:text-base opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
            Moments, travel captures, and creative snapshots captured through the lens and stored via cloud media.
          </p>
        </div>

        {/* Tag Filters */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2" data-aos="fade-up">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTag === tag ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 border'
                }`}
                style={{
                  backgroundColor: selectedTag === tag ? 'var(--accent)' : 'var(--card-bg)',
                  borderColor: selectedTag === tag ? 'var(--accent)' : 'var(--border-color)',
                  color: selectedTag === tag ? 'var(--bg-primary)' : 'var(--text-main)',
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 opacity-60 font-medium">
            Loading gallery snapshots...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 space-y-3 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <PhotoIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-bold font-theme-heading">No gallery snapshots found</h3>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Check back later or upload new moments from your author dashboard.</p>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
          {filteredItems.map((item) => {
            const coverImage = extractCoverImage(item.content);
            if (!coverImage) return null; // Skip if no image block found

            return (
              <div
                key={item.id}
                onClick={() => setActiveImageModal({ url: coverImage, title: item.title, description: item.meta_description })}
                className="group relative rounded-3xl overflow-hidden border shadow-md cursor-pointer transition-all hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={coverImage}
                    alt={item.title}
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-lg font-bold font-theme-heading leading-snug">{item.title}</h3>
                    {item.meta_description && (
                      <p className="text-xs opacity-80 line-clamp-2 mt-1">{item.meta_description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-[11px] opacity-75">
                      <span className="flex items-center gap-1"><CalendarDaysIcon className="h-3.5 w-3.5" /> {new Date(item.date_posted).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><EyeIcon className="h-3.5 w-3.5" /> {item.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Interactive Lightbox Modal */}
      {activeImageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImageModal(null)}
        >
          <div 
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden border shadow-2xl p-4 sm:p-6 space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold font-theme-heading">{activeImageModal.title}</h3>
              <button
                onClick={() => setActiveImageModal(null)}
                className="p-2 rounded-full border transition-all hover:scale-110 cursor-pointer"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
              <img src={activeImageModal.url} alt={activeImageModal.title} className="object-contain w-full h-full bg-black/40" />
            </div>

            {activeImageModal.description && (
              <p className="text-sm opacity-80 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {activeImageModal.description}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}