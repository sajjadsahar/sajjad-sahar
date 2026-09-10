import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Sparkles, 
  Check, 
  X, 
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { Blog } from '../../types.js';
import { createBlog, updateBlog, deleteBlog, enhanceAIText } from '../../services/api.js';

interface AdminBlogsProps {
  blogs: Blog[];
  onRefresh: () => void;
}

export const AdminBlogs: React.FC<AdminBlogsProps> = ({ blogs, onRefresh }) => {
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNew = () => {
    setIsNew(true);
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '# Article Title\n\nIntroduction paragraph detailing the engineering problem...\n\n## System Architecture\n\nExplain technical choices here.\n\n- Key advantage 1\n- Key advantage 2\n\n## Conclusion\n\nSummary and takeaways.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      category: 'Full-Stack',
      tags: ['React', 'Node.js', 'Engineering'],
      publishedAt: new Date().toISOString().substring(0, 10),
      readingTimeMinutes: 5,
      published: true
    });
  };

  const startEdit = (b: Blog) => {
    setIsNew(false);
    const docId = b._id || b.id;
    setEditingBlog({ ...b, id: docId, _id: docId });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Blog ID is missing.');
      return;
    }
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteBlog(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete blog');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.content) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const targetId = editingBlog._id || editingBlog.id;
      if (isNew) {
        await createBlog(editingBlog);
      } else if (targetId) {
        await updateBlog(targetId, { ...editingBlog, id: targetId, _id: targetId });
      } else {
        throw new Error('Blog ID is missing for update operation.');
      }
      setEditingBlog(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!editingBlog?.title) {
      alert('Please enter an article title first.');
      return;
    }
    setEnhancing(true);
    try {
      const prompt = `Write a compelling 2-sentence excerpt and a technical markdown outline for an engineering blog article titled "${editingBlog.title}". Topics covered: ${(editingBlog.tags || []).join(', ')}.`;
      const res = await enhanceAIText(prompt, 'blog');
      if (res.text) {
        setEditingBlog(prev => ({
          ...prev,
          excerpt: prev?.excerpt || res.text.substring(0, 150) + '...',
          content: prev?.content + '\n\n' + res.text
        }));
      }
    } catch (err: any) {
      alert('AI assistant unavailable: ' + err.message);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span>Manage Blog Articles ({blogs.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Draft, publish, edit, or remove technical write-ups and system notes
          </p>
        </div>

        <button
          onClick={startNew}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {blogs.map((b) => {
          const itemDocId = b._id || b.id;
          return (
          <div key={itemDocId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={b.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"}
                alt={b.title}
                referrerPolicy="no-referrer"
                className="w-16 h-12 object-cover rounded-xl shrink-0 bg-slate-950"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
                    {b.category}
                  </span>
                  {!b.published && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{b.excerpt}</p>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-3">
                  <span>{b.publishedAt}</span>
                  <span>•</span>
                  <span>{b.readingTimeMinutes} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => startEdit(b)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(itemDocId)}
                className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {editingBlog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setEditingBlog(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Create Article' : 'Edit Article'}
              </h3>
              <button onClick={() => setEditingBlog(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingBlog.category || 'Full-Stack'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Article Content (Markdown) *</label>
                  <button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={enhancing}
                    className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{enhancing ? 'Generating outline...' : 'AI Outline with Gemini'}</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  required
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editingBlog.coverImage || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingBlog.tags) ? editingBlog.tags.join(', ') : ''}
                    onChange={(e) => setEditingBlog({ 
                      ...editingBlog, 
                      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-blog-published"
                  checked={Boolean(editingBlog.published)}
                  onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="edit-blog-published" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Publish to Live Blog
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
