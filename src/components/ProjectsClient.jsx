'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { SparklesIcon, FolderIcon, LinkIcon, CodeBracketIcon, ArrowRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ProjectsClient() {
  const { items, fetchContent, loading } = useContentStore();
  const [selectedTech, setSelectedTech] = useState('all');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchContent('project'); // Fetch only project items
  }, [fetchContent]);

  // Extract unique technologies across all project items' extra_metadata
  const allTechnologies = [
    'all',
    ...new Set(
      items.flatMap((item) => item.extra_metadata?.technologies || [])
    ),
  ];

  // Filter items by selected technology
  const filteredItems = selectedTech === 'all'
    ? items
    : items.filter((item) => item.extra_metadata?.technologies?.includes(selectedTech));

  // Helper to extract the first image found in Editor.js block content for card preview
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
            <SparklesIcon className="h-4 w-4" />
            <span>My Portfolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-theme-heading tracking-tight">
            Engineering <span style={{ color: 'var(--accent)' }}>Projects</span>
          </h1>
          <p className="text-sm sm:text-base opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
            A collection of my Engineering work and projects. It includes full-stack and desktop applications, open source APIs, UI Applications and more which I have developed throughout my career.
          </p>
        </div>

        {/* Technology Filters */}
        {allTechnologies.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2" data-aos="fade-up">
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTech === tech ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 border'
                }`}
                style={{
                  backgroundColor: selectedTech === tech ? 'var(--accent)' : 'var(--card-bg)',
                  borderColor: selectedTech === tech ? 'var(--accent)' : 'var(--border-color)',
                  color: selectedTech === tech ? 'var(--bg-primary)' : 'var(--text-main)',
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 opacity-60 font-medium">
            Loading project items...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 space-y-3 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <FolderIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-bold font-theme-heading">No projects found</h3>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Check back later or publish new projects from your author dashboard.</p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
          {filteredItems.map((item) => {
            const coverImage = extractCoverImage(item.content);
            const techStack = item.extra_metadata?.technologies || [];
            const projectLink = item.extra_metadata?.project_link;
            const githubUrl = item.extra_metadata?.github_url;

            return (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden border shadow-md flex flex-col justify-between transition-all hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  {/* Optional Image Preview */}
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
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-theme-heading tracking-tight group-hover:opacity-90">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed opacity-80 font-theme-body line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                        {item.meta_description || 'Explore the technical architecture, features, and implementation details of this project.'}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1"
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                          >
                            <CpuChipIcon className="h-3 w-3" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Links & Read More */}
                <div className="px-6 sm:px-8 py-4 border-t flex items-center justify-between bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    {projectLink && (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border transition-all hover:scale-110 shadow-sm"
                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--accent)' }}
                        title="Live Demo"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border transition-all hover:scale-110 shadow-sm"
                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                        title="GitHub Repository"
                      >
                        <CodeBracketIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${item.slug}`}
                    className="inline-flex items-center gap-1.5 font-extrabold text-sm group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--accent)' }}
                  >
                    <span>Read Details</span>
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