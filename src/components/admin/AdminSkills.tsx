import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Code2, 
  Sparkles, 
  Check, 
  X,
  Sliders
} from 'lucide-react';
import { Skill, SkillCategory } from '../../types.js';
import { createSkill, updateSkill, deleteSkill } from '../../services/api.js';

interface AdminSkillsProps {
  skills: Skill[];
  onRefresh: () => void;
}

export const AdminSkills: React.FC<AdminSkillsProps> = ({ skills, onRefresh }) => {
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewSkill = () => {
    setIsNew(true);
    setEditingSkill({
      name: '',
      category: 'MERN & Full-Stack',
      proficiency: 90,
      icon: 'Code2',
      featured: true
    });
  };

  const startEditSkill = (s: Skill) => {
    setIsNew(false);
    const docId = s._id || s.id;
    setEditingSkill({ ...s, id: docId, _id: docId });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Skill ID is missing.');
      return;
    }
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) {
      setError('Skill name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const targetId = editingSkill._id || editingSkill.id;
      if (isNew) {
        await createSkill(editingSkill);
      } else if (targetId) {
        await updateSkill(targetId, { ...editingSkill, id: targetId, _id: targetId });
      } else {
        throw new Error('Skill ID is missing for update operation.');
      }
      setEditingSkill(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            <span>Manage Skills &amp; Proficiencies ({skills.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure technical competencies, proficiency percentages, and display categories
          </p>
        </div>

        <button
          onClick={startNewSkill}
          id="btn-admin-add-skill"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => {
          const itemDocId = s._id || s.id;
          return (
          <div
            key={itemDocId}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {s.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {s.proficiency}%
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {s.category}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => startEditSkill(s)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Edit Skill"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(itemDocId)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {editingSkill && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={() => setEditingSkill(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isNew ? 'Add Technical Skill' : 'Edit Skill'}
              </h3>
              <button onClick={() => setEditingSkill(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. React.js, Java, C++, MongoDB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={editingSkill.category || 'MERN & Full-Stack'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="MERN & Full-Stack">MERN &amp; Full-Stack</option>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                  <option value="Databases & Tools">Databases &amp; Tools</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Proficiency Level</label>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{editingSkill.proficiency || 85}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={editingSkill.proficiency || 85}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-skill-featured"
                  checked={Boolean(editingSkill.featured)}
                  onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="edit-skill-featured" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Feature in Core Matrix
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
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
                  <span>{loading ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
