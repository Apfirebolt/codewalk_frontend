'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContentStore } from '@/store/useContentStore';
import Cookie from 'js-cookie';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  EyeIcon, 
  TagIcon, 
  PhotoIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  LinkIcon as LinkIconOutline,
  CodeBracketIcon,
  TableCellsIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- Recursive Comment Item Component ---
function CommentItem({ comment, contentId, currentUserId, onReply, onEdit, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [editBody, setEditBody] = useState(comment.body);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUserId === comment.user_id;

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSubmitting(true);
    await onReply(comment.id, replyBody);
    setReplyBody('');
    setIsReplying(false);
    setSubmitting(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editBody.trim()) return;
    setSubmitting(true);
    await onEdit(comment.id, editBody);
    setIsEditing(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-4 pt-4 first:pt-0">
      <div 
        className="p-5 rounded-2xl border shadow-sm space-y-3"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
      >
        {/* Comment Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center font-bold text-xs uppercase" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--accent)' }}>
              {comment.user?.profile_image ? (
                <img src={comment.user.profile_image} alt={comment.user.username} className="w-full h-full object-cover" />
              ) : (
                (comment.user?.username?.[0] || 'U')
              )}
            </div>
            <div>
              <h5 className="font-bold text-xs font-theme-heading">
                {comment.user?.first_name ? `${comment.user.first_name} ${comment.user.last_name || ''}` : (comment.user?.username || 'Anonymous')}
              </h5>
              <span className="text-[10px] opacity-60">
                {new Date(comment.date_created).toLocaleDateString()} {comment.is_edited && '(edited)'}
              </span>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 rounded-lg border opacity-70 hover:opacity-100 transition-opacity"
                style={{ borderColor: 'var(--border-color)' }}
                title="Edit comment"
              >
                <PencilSquareIcon className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => onDelete(comment.id)}
                className="p-1.5 rounded-lg border opacity-70 hover:opacity-100 text-rose-500 transition-opacity"
                style={{ borderColor: 'var(--border-color)' }}
                title="Delete comment"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Comment Body / Edit Form */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3 pt-2">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm leading-relaxed opacity-90 font-theme-body" style={{ color: 'var(--text-main)' }}>
            {comment.body}
          </p>
        )}

        {/* Reply Action Trigger */}
        {!isEditing && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="inline-flex items-center gap-1.5 text-xs font-bold opacity-75 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowUturnLeftIcon className="h-3.5 w-3.5" /> Reply
            </button>
          </div>
        )}
      </div>

      {/* Reply Input Box */}
      {isReplying && (
        <form onSubmit={handlePostReply} className="ml-6 sm:ml-10 space-y-3 p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder={`Replying to @${comment.user?.username || 'user'}...`}
            rows={2}
            className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border"
              style={{ borderColor: 'var(--border-color)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              <PaperAirplaneIcon className="h-3.5 w-3.5" /> Post Reply
            </button>
          </div>
        </form>
      )}

      {/* Nested Child Replies Recursion */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 sm:ml-10 pl-4 border-l-2 space-y-4" style={{ borderColor: 'var(--border-color)' }}>
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              contentId={contentId} 
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default function GalleryDetailClient({ slug }) {
  const { currentItem, comments, fetchContentBySlug, fetchComments, createComment, updateComment, deleteComment, clearCurrentItem, loading } = useContentStore();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const [newCommentBody, setNewCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

    // Decode user ID from token cookie if available
    const token = Cookie.get('token');
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        setCurrentUserId(payload.id || payload.sub);
      } catch (e) {
        console.error("Failed to decode auth token:", e);
      }
    }

    fetchContentBySlug(slug).then((res) => {
      if (res.success && res.data?.id) {
        fetchComments(res.data.id);
      }
    });

    return () => {
      clearCurrentItem();
    };
  }, [slug, fetchContentBySlug, fetchComments, clearCurrentItem]);

  const handlePostTopComment = async (e) => {
    e.preventDefault();
    if (!newCommentBody.trim() || !currentItem) return;
    setSubmittingComment(true);
    await createComment(currentItem.id, { body: newCommentBody, parent_id: null });
    setNewCommentBody('');
    setSubmittingComment(false);
  };

  const handleReplyToComment = async (parentId, body) => {
    await createComment(currentItem.id, { body, parent_id: parentId });
  };

  const handleEditComment = async (commentId, body) => {
    await updateComment(commentId, currentItem.id, { body });
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(commentId, currentItem.id);
    }
  };

  if (loading && !currentItem) {
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

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12">
        
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

        {/* Render Editor.js Blocks */}
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

              case 'list':
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                const listStyle = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
                return (
                  <ListTag key={index} className={`${listStyle} list-inside space-y-2 pl-4 font-theme-body text-base my-4`}>
                    {block.data.items.map((itemText, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: itemText }} />
                    ))}
                  </ListTag>
                );

              case 'table':
                const contentRows = block.data?.content || [];
                const withHeadings = block.data?.withHeadings;
                return (
                  <div key={index} className="overflow-x-auto my-6 border rounded-2xl" style={{ borderColor: 'var(--border-color)' }}>
                    <table className="w-full text-left border-collapse text-sm">
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

        {/* --- COMMENTS SECTION --- */}
        <div 
          className="p-6 sm:p-10 rounded-3xl border shadow-xl backdrop-blur-xl space-y-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <ChatBubbleLeftRightIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-bold font-theme-heading">
              Discussion ({comments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0)})
            </h3>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handlePostTopComment} className="space-y-3">
            <textarea
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              rows={3}
              className="w-full p-4 rounded-2xl border text-sm focus:outline-none focus:ring-2 shadow-sm"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>

          {/* Comments List / Tree */}
          <div className="space-y-6 pt-4 divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {comments.length === 0 ? (
              <p className="text-sm opacity-60 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <CommentItem 
                  key={comment.id}
                  comment={comment}
                  contentId={currentItem.id}
                  currentUserId={currentUserId}
                  onReply={handleReplyToComment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>
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