import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Trophy, 
  Check, 
  X, 
  Sparkles 
} from 'lucide-react';
import { Achievement } from '../../types.js';
import { createAchievement, updateAchievement, deleteAchievement } from '../../services/api.js';

interface AdminAchievementsProps {
  achievements: Achievement[];
  onRefresh: () => void;
}

export const AdminAchievements: React.FC<AdminAchievementsProps> = ({ achievements, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Partial<Achievement> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNew = () => {
    setIsNew(true);
    setEditingItem({
      title: '',
      organization: 'Riphah International University',
      date: new Date().getFullYear().toString(),
      category: 'Academic',
      description: '',
      featured: true
    });
  };

  const startEdit = (item: Achievement) => {
    setIsNew(false);
    setEditingItem({ ...item });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.organization) {
      setError('Title and organization are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isNew) {
        await createAchievement(editingItem);
      } else if (editingItem.id) {
        await updateAchievement(editingItem.id, editingItem);
      }
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Manage Awards &amp; Honors ({achievements.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add academic distinctions, hackathon milestones, and scholarship recognitions
          </p>
        </div>

        <button
          onClick={startNew}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{item.organization}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => startEdit(item)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Add Achievement' : 'Edit Achievement'}
              </h3>
              <button onClick={() => setEditingItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Date</label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={editingItem.category || 'Academic'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Competition">Competition</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Recognition">Recognition</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Achievement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
