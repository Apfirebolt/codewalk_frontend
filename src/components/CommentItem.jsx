import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, ArrowUturnLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const CommentItem = ({ comment, contentId, currentUserId, onReply, onEdit, onDelete }) => {
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

export default CommentItem;
