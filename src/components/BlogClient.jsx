'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { BookOpenIcon, MagnifyingGlassIcon, CalendarDaysIcon, EyeIcon, ArrowRightIcon, TagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BlogClient() {
  const { items, fetchContent, loading } = useContentStore();
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchContent('blog');
  }, [fetchContent]);

  // Extract unique tags across all blog items
  const allTags = ['all', ...new Set(items.flatMap((item) => item.tags?.map((t) => t.name) || []))];

  // Filter items by tag and search query
  const filteredItems = items.filter((item) => {
    const matchesTag = selectedTag === 'all' || item.tags?.some((t) => t.name === selectedTag);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.meta_description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Helper to extract the first image found in Editor.js block content for article previews
  const extractCoverImage = (content) => {
    if (!content || !content.blocks) return null;
    const imageBlock = content.blocks.find((block) => block.type === 'image');
    return imageBlock?.data?.file?.url || null;
  };

  // Estimate reading time based on text length or blocks
  const estimateReadTime = (content) => {
    if (!content || !content.blocks) return '3 min read';
    const totalWords = content.blocks.reduce((acc, block) => {
      if (block.type === 'paragraph' || block.type === 'header') {
        return acc + (block.data?.text?.split(' ').length || 0);
      }
      return acc;
    }, 0);
    const minutes = Math.ceil(totalWords / 200);
    return `${Math.max(1, minutes)} min read`;
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
            <BookOpenIcon className="h-4 w-4" />
            <span>My Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-theme-heading tracking-tight">
            Developer <span style={{ color: 'var(--accent)' }}>Articles</span>
          </h1>
          <p className="text-sm sm:text-base opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
            Articles which deep dive into software engineering, architectural patterns, backend systems, web development related to my experiences and learnings in the field and about me 😀.
          </p>
        </div>

        {/* Search Bar & Tag Filters */}
        <div className="max-w-xl mx-auto space-y-4" data-aos="fade-up">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border shadow-inner focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          {allTags.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 opacity-60 font-medium">
            Loading blog articles...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 space-y-3 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <BookOpenIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-bold font-theme-heading">No articles found</h3>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or check back later for new posts.</p>
          </div>
        )}

        {/* Blog Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
          {filteredItems.map((item) => {
            const coverImage = extractCoverImage(item.content);
            const readTime = estimateReadTime(item.content);

            return (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden border shadow-md flex flex-col justify-between transition-all hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  {/* Article Cover Image */}
                  {coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <img
                        src={coverImage}
                        alt={item.title}
                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between text-xs opacity-70 font-theme-body">
                      <span className="flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {new Date(item.date_posted).toLocaleDateString()}</span>
                      <span>{readTime}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-theme-heading tracking-tight group-hover:opacity-90">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed opacity-80 font-theme-body line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                        {item.meta_description || 'Read the full article for code snippets, architecture breakdowns, and insights.'}
                      </p>
                    </div>

                    {/* Article Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                          >
                            <TagIcon className="h-3 w-3" />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Views & Read Article Button */}
                <div className="px-6 sm:px-8 py-4 border-t flex items-center justify-between bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="flex items-center gap-1.5 text-xs opacity-70">
                    <EyeIcon className="h-4 w-4" /> {item.views} views
                  </span>

                  <Link
                    href={`/blog/${item.slug}`}
                    className="inline-flex items-center gap-1.5 font-extrabold text-sm group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--accent)' }}
                  >
                    <span>Read Article</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}