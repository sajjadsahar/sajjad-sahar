import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  Briefcase, 
  Check, 
  X 
} from 'lucide-react';
import { Experience } from '../../types.js';
import { createExperience, updateExperience, deleteExperience } from '../../services/api.js';

interface AdminExperienceProps {
  experience: Experience[];
  onRefresh: () => void;
}

export const AdminExperience: React.FC<AdminExperienceProps> = ({ experience, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNew = () => {
    setIsNew(true);
    setEditingItem({
      type: 'Experience',
      position: '',
      organization: '',
      location: 'Islamabad, Pakistan',
      startDate: '2024',
      endDate: 'Present',
      current: true,
      description: '',
      achievements: ['Delivered key modules on schedule'],
      technologies: ['React', 'Node.js']
    });
  };

  const startEdit = (item: Experience) => {
    setIsNew(false);
    const docId = item._id || item.id;
    setEditingItem({ ...item, id: docId, _id: docId });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Experience ID is missing.');
      return;
    }
    if (!window.confirm('Delete this milestone?')) return;
    try {
      await deleteExperience(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.position || !editingItem?.organization) {
      setError('Position and organization are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const targetId = editingItem._id || editingItem.id;
      if (isNew) {
        await createExperience(editingItem);
      } else if (targetId) {
        await updateExperience(targetId, { ...editingItem, id: targetId, _id: targetId });
      } else {
        throw new Error('Experience ID is missing for update operation.');
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
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span>Manage Timeline &amp; Experience ({experience.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add or edit educational records, internships, and project leadership roles
          </p>
        </div>

        <button
          onClick={startNew}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Milestone</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {experience.map((item) => {
          const itemDocId = item._id || item.id;
          return (
          <div key={itemDocId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.position}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  item.type === 'Education' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {item.type}
                </span>
                {item.current && (
                  <span className="text-[10px] text-emerald-600 font-semibold">• Current</span>
                )}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {item.organization}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {item.startDate} — {item.endDate} • {item.location}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => startEdit(item)}
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

      {editingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Add Milestone' : 'Edit Milestone'}
              </h3>
              <button onClick={() => setEditingItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Type</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Education">Education</option>
                    <option value="Experience">Experience</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Position / Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.position || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Organization / School *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingItem.startDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                    placeholder="e.g. 2022 or Oct 2023"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">End Date</label>
                  <input
                    type="text"
                    value={editingItem.endDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                    placeholder="e.g. Present or 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
