import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import { Project } from '../../types.js';
import { createProject, updateProject, deleteProject, enhanceAIText } from '../../services/api.js';

interface AdminProjectsProps {
  projects: Project[];
  onRefresh: () => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ projects, onRefresh }) => {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState<string>('');

  const startNewProject = () => {
    setIsNew(true);
    setTechInput('React, Node.js, Express, MongoDB');
    setEditingProject({
      title: '',
      category: 'Web',
      description: '',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      githubUrl: 'https://github.com/sajjadsahar',
      liveDemoUrl: '',
      featured: true,
      challenges: '',
      whatILearned: '',
      features: ['Authentication with JWT', 'Responsive design', 'RESTful API integration']
    });
  };

  const startEditProject = (p: Project) => {
    setIsNew(false);
    const docId = p._id || p.id;
    setTechInput(Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''));
    setEditingProject({ ...p, id: docId, _id: docId });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Project ID is missing.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.description) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const parsedTechnologies = techInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const projectPayload = {
        ...editingProject,
        technologies: parsedTechnologies
      };

      const targetId = editingProject._id || editingProject.id;
      if (isNew) {
        await createProject(projectPayload);
      } else if (targetId) {
        await updateProject(targetId, { ...projectPayload, id: targetId, _id: targetId });
      } else {
        throw new Error('Project ID is missing for update operation.');
      }
      setEditingProject(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!editingProject?.title) {
      alert('Please enter a project title first.');
      return;
    }
    setEnhancing(true);
    try {
      const prompt = `Project Title: ${editingProject.title}. Tech Stack: ${(editingProject.technologies || []).join(', ')}. Current description: ${editingProject.description || ''}. Provide a polished, professional 3-sentence technical summary and 3 key challenges.`;
      const res = await enhanceAIText(prompt, 'project');
      if (res.text) {
        setEditingProject(prev => ({
          ...prev,
          description: res.text
        }));
      }
    } catch (err: any) {
      alert('AI enhancement unavailable: ' + err.message);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-500" />
            <span>Manage Projects ({projects.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add, edit, or remove showcase engineering projects
          </p>
        </div>

        <button
          onClick={startNewProject}
          id="btn-admin-add-project"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {projects.map((p) => {
            const itemDocId = p._id || p.id;
            return (
            <div key={itemDocId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-cover rounded-xl shrink-0 bg-slate-950"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {p.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {p.description}
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Tech: {p.technologies.join(', ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => startEditProject(p)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(itemDocId)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={() => setEditingProject(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {isNew ? 'Create New Project' : 'Edit Project'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={editingProject.category || 'Web'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Web">Web</option>
                    <option value="MERN">MERN</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Database">Database</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Project Description *</label>
                  <button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={enhancing}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{enhancing ? 'AI Thinking...' : 'AI Enhance with Gemini'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Project Image / Screenshot URL</label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">GitHub URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.liveDemoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit-proj-featured"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="edit-proj-featured" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Key Engineering Challenges</label>
                <textarea
                  rows={2}
                  value={editingProject.challenges || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value })}
                  placeholder="Architectural obstacles faced and how they were solved..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
                  <span>{loading ? 'Saving...' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
