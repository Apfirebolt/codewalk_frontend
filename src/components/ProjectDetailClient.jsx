'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  EyeIcon, 
  TagIcon, 
  FolderGit2Icon,
  LinkIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ProjectDetailClient({ slug }) {
  const router = useRouter();
  const { currentItem, fetchContentBySlug, clearCurrentItem, loading } = useContentStore();

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
          Loading project details...
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
          <FolderGit2Icon className="h-16 w-16 opacity-40" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold font-theme-heading">Project not found</h2>
          <p className="opacity-70 text-sm">The project you are looking for does not exist or has been removed.</p>
          <Link href="/projects" className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md mt-2" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const techStack = currentItem.extra_metadata?.technologies || [];
  const projectLink = currentItem.extra_metadata?.project_link;
  const githubUrl = currentItem.extra_metadata?.github_url;

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
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold opacity-75 hover:opacity-100 transition-opacity"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Header & Metadata Card */}
        <div 
          className="p-8 sm:p-10 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          data-aos="fade-up"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>Project Showcase</span>
            </div>

            <div className="flex items-center gap-4 text-xs opacity-75 font-theme-body">
              <span className="flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {new Date(currentItem.date_posted).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><EyeIcon className="h-4 w-4" /> {currentItem.views} views</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-theme-heading tracking-tight leading-tight">
              {currentItem.title}
            </h1>

            {currentItem.meta_description && (
              <p className="text-base sm:text-lg opacity-85 leading-relaxed font-theme-body" style={{ color: 'var(--text-muted)' }}>
                {currentItem.meta_description}
              </p>
            )}
          </div>

          {/* Action Links (Live Demo & GitHub) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {projectLink && (
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md flex items-center gap-2 hover:scale-105"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <LinkIcon className="h-4 w-4" />
                <span>Visit Live Demo</span>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border shadow-sm flex items-center gap-2 hover:opacity-100 opacity-90"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <CodeBracketIcon className="h-4 w-4" />
                <span>Source Code (GitHub)</span>
              </a>
            )}
          </div>

          {/* Tech Stack Chips */}
          {techStack.length > 0 && (
            <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-extrabold uppercase tracking-widest opacity-60">Technologies & Architecture</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}
                  >
                    <CpuChipIcon className="h-3.5 w-3.5" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Render Editor.js Block Content */}
        <div 
          className="p-6 sm:p-10 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h3 className="text-xs font-extrabold uppercase tracking-widest opacity-60 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            Architecture & Implementation Guide
          </h3>

          {currentItem.content?.blocks?.map((block, index) => {
            switch (block.type) {
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

              case 'list':
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                return (
                  <ListTag key={index} className="list-inside space-y-2 pl-4 font-theme-body text-base">
                    {block.data.items.map((itemText, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: itemText }} />
                    ))}
                  </ListTag>
                );

              case 'image':
                const imageUrl = block.data?.file?.url;
                const caption = block.data?.caption;
                if (!imageUrl) return null;
                return (
                  <div key={index} className="space-y-2 my-6">
                    <div className="relative rounded-2xl overflow-hidden border shadow-md aspect-[16/9] w-full" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={imageUrl} alt={caption || currentItem.title} className="object-cover w-full h-full" />
                    </div>
                    {caption && (
                      <p className="text-center text-xs italic opacity-70 font-theme-body" style={{ color: 'var(--text-muted)' }}>
                        {caption}
                      </p>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}