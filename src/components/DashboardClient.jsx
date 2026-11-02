'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import { useRequireAdmin } from '@/hooks/useRequireAdmin'; // Import admin verification hook
import { 
  BookOpenIcon, 
  FolderIcon, 
  PhotoIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TABS = [
  { id: 'all', label: 'All Entries', icon: BookOpenIcon },
  { id: 'blog', label: 'Blogs', icon: BookOpenIcon },
  { id: 'project', label: 'Projects', icon: FolderIcon },
  { id: 'gallery', label: 'Gallery', icon: PhotoIcon },
];

export default function DashboardEntriesClient() {
  // Use custom admin check hook
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();
  
  const { items, fetchContent, deleteContent, loading } = useContentStore();
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  console.log('isAdmin:', isAdmin);

  useEffect(() => {
    // Only initialize AOS and fetch content once admin status is confirmed
    fetchContent();
  }, [isAdmin, fetchContent]);

  // Show loading spinner while authenticating/verifying role
  if (authLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-theme-body"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
      >
        <p className="text-sm font-bold animate-pulse" style={{ color: 'var(--accent)' }}>
          Verifying admin access...
        </p>
      </div>
    );
  }

  // Prevent flash of content before router push triggers
  if (!isAdmin) {
    return null;
  }

  // Filter items based on active tab
  const filteredItems = activeTab === 'all'
    ? items
    : items.filter((item) => item.content_type === activeTab);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove any associated media from Cloudinary.`)) {
      setDeletingId(id);
      const result = await deleteContent(id);
      setDeletingId(null);
      if (!result.success) {
        alert(result.error || 'Failed to delete item.');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-10">
        
        {/* Page Header & New Post Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-aos="fade-down">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm inline-block" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
              Author Control Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-theme-heading tracking-tight">
              Manage <span style={{ color: 'var(--accent)' }}>Entries</span>
            </h1>
            <p className="text-sm opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
              Overview, edit, or delete all published and draft items across your blog, projects, and gallery.
            </p>
          </div>

          <Link
            href="/content/new"
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2 hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create New Entry</span>
          </Link>
        </div>

        {/* Content Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--border-color)' }} data-aos="fade-up">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.id === 'all' ? items.length : items.filter((i) => i.content_type === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive ? 'shadow-md scale-105' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--card-bg)',
                  borderColor: isActive ? 'var(--accent)' : 'var(--border-color)',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-main)',
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-black/20 text-current' : 'bg-black/10 dark:bg-white/10'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && items.length === 0 && (
          <div className="text-center py-24 opacity-60 font-medium">
            Loading entries...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 space-y-3 border rounded-3xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <BookOpenIcon className="h-12 w-12 mx-auto opacity-40" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-bold font-theme-heading">No entries found</h3>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-muted)' }}>Get started by creating your first article, project, or gallery snapshot.</p>
          </div>
        )}

        {/* Entries Table / List */}
        {filteredItems.length > 0 && (
          <div 
            className="rounded-3xl border shadow-xl overflow-hidden backdrop-blur-xl"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            data-aos="fade-up"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-extrabold uppercase tracking-wider opacity-60 bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                    <th className="py-4 px-6">Title & Type</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Views</th>
                    <th className="py-4 px-6">Date Posted</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                      
                      {/* Title & Type */}
                      <td className="py-4 px-6 space-y-1">
                        <Link 
                          href={`/${item.content_type}s/${item.slug}`}
                          className="font-bold font-theme-heading text-base hover:underline line-clamp-1"
                          style={{ color: 'var(--text-main)' }}
                        >
                          {item.title}
                        </Link>
                        <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--accent)' }}>
                          {item.content_type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {item.is_published ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                            <CheckCircleIcon className="h-4 w-4" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                            <XCircleIcon className="h-4 w-4" /> Draft
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="py-4 px-6 text-sm opacity-80">
                        <span className="flex items-center gap-1.5">
                          <EyeIcon className="h-4 w-4 opacity-60" /> {item.views}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-sm opacity-80">
                        <span className="flex items-center gap-1.5">
                          <CalendarDaysIcon className="h-4 w-4 opacity-60" /> {new Date(item.date_posted).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Actions (Edit & Delete) */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/content/edit/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all hover:scale-105 shadow-sm"
                          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
                          title="Edit Entry"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all hover:scale-105 shadow-sm cursor-pointer disabled:opacity-50"
                          style={{ borderColor: 'rgba(244, 63, 94, 0.3)', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}
                          title="Delete Entry"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          <span>{deletingId === item.id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}