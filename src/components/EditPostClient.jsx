'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentMetadataForm from '@/components/ContentMetadataForm';
import ProjectMetadataInputs from '@/components/ProjectMetadataForm';
import EditorJsWrapper from '@/components/EditorJSWrapper';
import { useContentStore } from '@/store/useContentStore';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EditPostClient({ id }) {
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const { items, fetchContent, updateContent, loading } = useContentStore();

  const [formData, setFormData] = useState({
    title: '',
    content_type: 'blog',
    content: null, // Initialized as null until loaded
    extra_metadata: {},
    tag_names: '',
    meta_description: '',
    is_published: false,
  });

  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(true);

  // Fetch items if not already loaded, then find the specific item by ID
  useEffect(() => {
    if (!isAdmin) return;

    const loadItem = async () => {
      if (items.length === 0) {
        await fetchContent();
      }
      setFetching(false);
    };
    loadItem();
  }, [isAdmin, items, fetchContent]);

  // Pre-fill form when items are available
  useEffect(() => {
    if (items.length > 0) {
      const itemToEdit = items.find((i) => i.id === Number(id));
      if (itemToEdit) {
        setFormData({
          title: itemToEdit.title || '',
          content_type: itemToEdit.content_type || 'blog',
          content: itemToEdit.content || {},
          extra_metadata: itemToEdit.extra_metadata || {},
          tag_names: itemToEdit.tags ? itemToEdit.tags.map((t) => t.name).join(', ') : '',
          meta_description: itemToEdit.meta_description || '',
          is_published: itemToEdit.is_published ?? false,
        });
      }
    }
  }, [items, id]);

  // Block rendering until auth verification finishes
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

  // Prevent flash of content if user is unauthorized
  if (!isAdmin) {
    return null;
  }

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleExtraMetadataChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      extra_metadata: { ...prev.extra_metadata, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    const tagArray = formData.tag_names
      ? formData.tag_names.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tag_names: tagArray,
    };

    const result = await updateContent(Number(id), payload);
    if (result.success) {
      router.push(`/${result.data.content_type}s/${result.data.slug}`);
    } else {
      alert(result.error || 'Failed to update entry.');
    }
  };

  // Show loading skeleton while fetching data or waiting for content to populate
  if (fetching || formData.content === null) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center py-32 opacity-60 font-medium">
          Loading content for editing...
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

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="space-y-8">
          
          {/* Back Navigation & Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold opacity-75 hover:opacity-100 transition-opacity"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <CheckIcon className="h-4 w-4" />
              <span>{loading ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-theme-heading">
              Edit <span style={{ color: 'var(--accent)' }}>Content Entry</span>
            </h1>
            <p className="text-sm opacity-80 font-theme-body" style={{ color: 'var(--text-muted)' }}>
              Modify your article, update project metadata, or refine your gallery post.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Box 1: Core Metadata & Content Type */}
            <div 
              className="p-8 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <ContentMetadataForm 
                formData={formData} 
                onChange={handleFieldChange} 
                errors={errors} 
              />

              {/* Conditional Project Fields */}
              {formData.content_type === 'project' && (
                <ProjectMetadataInputs 
                  extraMetadata={formData.extra_metadata} 
                  onChange={handleExtraMetadataChange} 
                />
              )}
            </div>

            {/* Box 2: Editor.js Block Content (Rendered only when data is fully loaded) */}
            <div 
              className="p-8 rounded-3xl border shadow-xl backdrop-blur-xl space-y-4"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <label className="block text-xs font-extrabold uppercase tracking-widest opacity-70">
                Body Content (Block Editor)
              </label>
              <EditorJsWrapper 
                initialData={formData.content}
                onChange={(contentData) => handleFieldChange('content', contentData)} 
              />
            </div>

            {/* Bottom Submit Action */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl flex items-center gap-2.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <CheckIcon className="h-5 w-5" />
                <span>{loading ? 'Saving Changes...' : 'Save & Publish Updates'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}