'use client';

import React from 'react';
import { LinkIcon, CodeBracketIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export default function ProjectMetadataInputs({ extraMetadata, onChange }) {
  return (
    <div 
      className="p-6 rounded-3xl border space-y-4 shadow-sm animate-in fade-in duration-200"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--accent)',
      }}
    >
      <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <CpuChipIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
        <h3 className="font-extrabold text-sm uppercase tracking-wider font-theme-heading">
          Project-Specific Metadata
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Link */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" /> Live Demo URL
          </label>
          <input
            type="url"
            value={extraMetadata.project_link || ''}
            onChange={(e) => onChange('project_link', e.target.value)}
            placeholder="https://myportfolio.com"
            className="w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none shadow-inner"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          />
        </div>

        {/* GitHub URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <CodeBracketIcon className="h-3.5 w-3.5" /> GitHub Repository
          </label>
          <input
            type="url"
            value={extraMetadata.github_url || ''}
            onChange={(e) => onChange('github_url', e.target.value)}
            placeholder="https://github.com/user/repo"
            className="w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none shadow-inner"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          />
        </div>
      </div>

      {/* Technologies Stack */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs font-bold uppercase tracking-wider opacity-80">
          Technologies Used (Comma separated)
        </label>
        <input
          type="text"
          value={extraMetadata.technologies ? extraMetadata.technologies.join(', ') : ''}
          onChange={(e) => onChange('technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
          placeholder="FastAPI, Next.js, PostgreSQL, TailwindCSS"
          className="w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none shadow-inner"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />
      </div>
    </div>
  );
}