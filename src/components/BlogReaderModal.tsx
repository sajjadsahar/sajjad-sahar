import React, { useEffect, useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  Tag,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Blog } from '../types.js';

interface BlogReaderModalProps {
  blog: Blog | null;
  onClose: () => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ blog, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (blog) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [blog, onClose]);

  if (!blog) return null;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href.split('#')[0] + `#blog-${blog.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic paragraph and heading formatter for clean markdown display without external syntax breakage
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((p, idx) => {
      if (p.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-3">{p.replace('# ', '')}</h1>;
      }
      if (p.startsWith('## ')) {
        return <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-5 mb-2.5">{p.replace('## ', '')}</h2>;
      }
      if (p.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">{p.replace('### ', '')}</h3>;
      }
      if (p.startsWith('- ') || p.startsWith('* ')) {
        const items = p.split('\n');
        return (
          <ul key={idx} className="list-disc list-inside space-y-1 my-3 pl-2 text-slate-700 dark:text-slate-300">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-base text-slate-700 dark:text-slate-300 leading-relaxed my-3">
          {p}
        </p>
      );
    });
  };

  return (
    <div 
      id="blog-reader-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="blog-reader-card"
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold">
              {blog.category}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Sajjad Sahar Technical Insights
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              id="btn-share-blog"
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Share article link"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              id="btn-close-blog-modal"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
          
          {/* Title & Metadata */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {blog.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {blog.readingTimeMinutes} min read
              </span>
              {blog.views !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  {blog.views} reads
                </span>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={blog.coverImage}
                alt={blog.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="article-body">
            {renderFormattedContent(blog.content)}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Tags:</span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              SS
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Written by Sajjad Sahar
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Software Engineering student @ Riphah International University • CGPA 3.98
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            {blog.readingTimeMinutes} min read
          </span>
        </div>

      </div>
    </div>
  );
};
