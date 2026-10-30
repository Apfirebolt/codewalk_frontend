'use client';

import React from 'react';
import { BookOpenIcon, SparklesIcon, PhotoIcon, TagIcon } from '@heroicons/react/24/outline';

const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Article', icon: BookOpenIcon, desc: 'Technical write-up or story' },
  { id: 'project', label: 'Project Showcase', icon: SparklesIcon, desc: 'App portfolio item & tech stack' },
  { id: 'gallery', label: 'Gallery Snapshot', icon: PhotoIcon, desc: 'Visual moment or photo essay' },
];

export default function ContentMetadataForm({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      
      {/* Content Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-extrabold uppercase tracking-widest opacity-70">
          Select Section / Content Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.content_type === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange('content_type', type.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                  isSelected ? 'shadow-md scale-[1.02]' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--accent)' : 'var(--card-bg)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                  color: isSelected ? 'var(--bg-primary)' : 'var(--text-main)',
                }}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <p className="font-bold text-sm font-theme-heading">{type.label}</p>
                  <p className="text-[11px] opacity-80 font-theme-body">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g., Building a Scalable FastAPI Backend with PostgreSQL"
          className="w-full px-4 py-3.5 text-base rounded-2xl border focus:outline-none transition-colors shadow-inner font-theme-heading font-semibold"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: errors.title ? '#f43f5e' : 'var(--border-color)',
            color: 'var(--text-main)',
          }}
          required
        />
        {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title}</p>}
      </div>

      {/* Tags Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80 flex items-center gap-1.5">
          <TagIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
          <span>Tags (Comma separated)</span>
        </label>
        <input
          type="text"
          value={formData.tag_names}
          onChange={(e) => onChange('tag_names', e.target.value)}
          placeholder="Python, FastAPI, NextJS, WebDev"
          className="w-full px-4 py-3 text-sm rounded-2xl border focus:outline-none transition-colors shadow-inner"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        />
      </div>

      {/* SEO Meta Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider font-theme-heading opacity-80">
          Meta Description (SEO Summary)
        </label>
        <textarea
          rows={2}
          value={formData.meta_description}
          onChange={(e) => onChange('meta_description', e.target.value)}
          placeholder="Short summary for search engines and social cards..."
          className="w-full px-4 py-3 text-sm rounded-2xl border focus:outline-none transition-colors shadow-inner resize-none"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        />
      </div>

      {/* Publish Toggle */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) => onChange('is_published', e.target.checked)}
          className="w-5 h-5 rounded-lg accent-[var(--accent)] cursor-pointer"
        />
        <label htmlFor="is_published" className="text-sm font-semibold cursor-pointer select-none">
          Publish immediately (Make visible on public feed)
        </label>
      </div>

    </div>
  );
}