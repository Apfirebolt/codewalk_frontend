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
  BookOpenIcon,
  ClockIcon,
  CodeBracketIcon,
  LinkIcon as LinkIconOutline
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BlogDetailClient({ slug }) {
  const router = useRouter();
  const { currentItem, fetchContentBySlug, clearCurrentItem, loading } = useContentStore();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    fetchContentBySlug(slug);

    return () => {
      clearCurrentItem();
    };
  }, [slug, fetchContentBySlug, clearCurrentItem]);

  // Estimate reading time based on block text length
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-theme-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center py-32 opacity-60">
          Loading article...
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
          <BookOpenIcon className="h-16 w-16 opacity-40" style={{ color: 'var(--accent)' }} />
          <h2 className="text-2xl font-bold font-theme-heading">Article not found</h2>
          <p className="opacity-70 text-sm">The article you are looking for does not exist or has been removed.</p>
          <Link href="/blog" className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md mt-2" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(currentItem.content);

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
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold opacity-75 hover:opacity-100 transition-opacity"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Articles</span>
          </Link>
        </div>

        {/* Article Header & Meta */}
        <div className="space-y-4" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3 text-xs opacity-75 font-theme-body">
            <span className="flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {new Date(currentItem.date_posted).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {readTime}</span>
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

        {/* Render Editor.js Block Content */}
        <div 
          className="p-6 sm:p-12 rounded-3xl border shadow-xl backdrop-blur-xl space-y-6"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {currentItem.content?.blocks?.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p 
                    key={index} 
                    className="text-base sm:text-lg leading-relaxed font-theme-body" 
                    style={{ color: 'var(--text-main)' }} 
                    dangerouslySetInnerHTML={{ __html: block.data.text }} 
                  />
                );

              case 'header':
                const Tag = `h${block.data.level || 3}`;
                const headerClasses = block.data.level === 2 
                  ? "text-2xl sm:text-3xl font-bold font-theme-heading mt-8 mb-4 tracking-tight" 
                  : "text-xl sm:text-2xl font-semibold font-theme-heading mt-6 mb-3 tracking-tight";
                return <Tag key={index} className={headerClasses} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

              case 'list':
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                const listStyle = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
                return (
                  <ListTag key={index} className={`${listStyle} list-inside space-y-2 pl-4 font-theme-body text-base sm:text-lg my-4`}>
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
                  <div key={index} className="space-y-3 my-8">
                    <div className="relative rounded-2xl overflow-hidden border shadow-md aspect-[16/9] w-full" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={imageUrl} alt={caption || currentItem.title} className="object-cover w-full h-full" />
                    </div>
                    {caption && (
                      <p className="text-center text-xs sm:text-sm italic opacity-75 font-theme-body" style={{ color: 'var(--text-muted)' }}>
                        {caption}
                      </p>
                    )}
                  </div>
                );

              case 'quote':
                return (
                  <blockquote 
                    key={index} 
                    className="p-6 rounded-2xl border-l-4 my-6 italic text-base sm:text-lg shadow-sm"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--accent)', color: 'var(--text-main)' }}
                  >
                    <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.data.caption && (
                      <cite className="block text-xs font-bold uppercase tracking-widest mt-2 not-italic opacity-70">
                        — {block.data.caption}
                      </cite>
                    )}
                  </blockquote>
                );

              case 'table':
                const contentRows = block.data?.content || [];
                const withHeadings = block.data?.withHeadings;
                return (
                  <div key={index} className="overflow-x-auto my-6 border rounded-2xl" style={{ borderColor: 'var(--border-color)' }}>
                    <table className="w-full text-left border-collapse text-sm sm:text-base">
                      <tbody>
                        {contentRows.map((row, rIdx) => {
                          const isHeader = withHeadings && rIdx === 0;
                          return (
                            <tr key={rIdx} className={isHeader ? "border-b bg-black/5 dark:bg-white/5 font-extrabold" : "border-b"} style={{ borderColor: 'var(--border-color)' }}>
                              {row.map((cell, cIdx) => {
                                const CellTag = isHeader ? 'th' : 'td';
                                return (
                                  <CellTag key={cIdx} className="p-3.5" dangerouslySetInnerHTML={{ __html: cell }} />
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );

              case 'code':
                return (
                  <div key={index} className="my-6 rounded-2xl overflow-hidden border shadow-inner bg-black/90 text-white font-mono text-xs sm:text-sm p-5 overflow-x-auto" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/50 text-[11px] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><CodeBracketIcon className="h-4 w-4" /> Code Snippet</span>
                    </div>
                    <pre><code>{block.data.code}</code></pre>
                  </div>
                );

              case 'linkTool':
                const linkMeta = block.data?.meta || {};
                const linkUrl = block.data?.link;
                if (!linkUrl) return null;
                return (
                  <a
                    key={index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 sm:p-5 rounded-2xl border transition-all hover:scale-[1.01] my-6 shadow-sm group"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-start gap-4">
                      {linkMeta.image?.url && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: 'var(--border-color)' }}>
                          <img src={linkMeta.image.url} alt={linkMeta.title || 'Link thumbnail'} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider opacity-60">
                          <LinkIconOutline className="h-3 w-3" /> {new URL(linkUrl).hostname}
                        </div>
                        <h4 className="font-bold font-theme-heading text-base group-hover:underline">{linkMeta.title || linkUrl}</h4>
                        {linkMeta.description && (
                          <p className="text-xs opacity-75 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{linkMeta.description}</p>
                        )}
                      </div>
                    </div>
                  </a>
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