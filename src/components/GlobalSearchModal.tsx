import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FolderGit2, Award, Wrench, BookOpen, ArrowRight } from 'lucide-react';
import { Project, Certificate, Skill, Blog } from '../types.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  blogs: Blog[];
  onSelectProject: (p: Project) => void;
  onSelectCertificate: (c: Certificate) => void;
  onSelectBlog: (b: Blog) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  certificates,
  skills,
  blogs,
  onSelectProject,
  onSelectCertificate,
  onSelectBlog
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { projects: [], certificates: [], skills: [], blogs: [] };

    return {
      projects: (projects || []).filter(p => 
        (p.title || '').toLowerCase().includes(q) || 
        (p.technologies || []).some(t => (t || '').toLowerCase().includes(q)) ||
        (p.category || '').toLowerCase().includes(q)
      ).slice(0, 4),
      certificates: (certificates || []).filter(c => 
        (c.title || '').toLowerCase().includes(q) || 
        (c.issuingOrganization || '').toLowerCase().includes(q) ||
        (c.certificateId || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.skillsCovered || []).some(s => (s || '').toLowerCase().includes(q))
      ).slice(0, 6),
      skills: (skills || []).filter(s => 
        (s.name || '').toLowerCase().includes(q) || 
        (s.category || '').toLowerCase().includes(q)
      ).slice(0, 6),
      blogs: (blogs || []).filter(b => 
        (b.title || '').toLowerCase().includes(q) || 
        (b.tags || []).some(t => (t || '').toLowerCase().includes(q))
      ).slice(0, 3)
    };
  }, [query, projects, certificates, skills, blogs]);

  if (!isOpen) return null;

  const totalResults = filtered.projects.length + filtered.certificates.length + filtered.skills.length + filtered.blogs.length;

  return (
    <div 
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="global-search-modal"
        className="w-full max-w-2xl bg-[#0b0f19] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#080c14]">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            id="search-input-field"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, certificates, skills, blogs... (e.g. MERN, Java, Meta, React)"
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-[#0b0f19] text-slate-300 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-300 text-sm">
              <p>Type to search across Sajjad Sahar's portfolio.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['MERN', 'Java OOP', 'C++', 'Meta Certificate', 'MongoDB', 'AI / ML'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#060810] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-10 text-center text-slate-300 font-mono">
              <p className="text-sm font-semibold">No results matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;React&quot;, &quot;Java&quot;, &quot;Certificate&quot;, or &quot;SQL&quot;</p>
            </div>
          )}

          {/* Projects results */}
          {filtered.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({filtered.projects.length})</span>
              </div>
              <div className="space-y-1.5">
                {filtered.projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#060810] hover:bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                        {p.description}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-mono shrink-0 ml-2 font-semibold">
                      {p.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates results */}
          {filtered.certificates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Certificates ({filtered.certificates.length})</span>
              </div>
              <div className="space-y-1.5">
                {filtered.certificates.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCertificate(c);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#060810] hover:bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {c.issuingOrganization} • ID: {c.certificateId}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills results */}
          {filtered.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                <Wrench className="w-3.5 h-3.5" />
                <span>Skills ({filtered.skills.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-lg bg-[#060810] border border-slate-700/80 text-xs flex items-center justify-between font-mono"
                  >
                    <span className="font-medium text-slate-200">{s.name}</span>
                    <span className="text-[10px] text-cyan-300 font-bold">{s.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogs results */}
          {filtered.blogs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Blogs ({filtered.blogs.length})</span>
              </div>
              <div className="space-y-1.5">
                {filtered.blogs.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      onSelectBlog(b);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#060810] hover:bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition-colors"
                  >
                    <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {b.title}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {b.excerpt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-[#080c14] border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Press <kbd className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">ESC</kbd> to exit</span>
          <span className="text-cyan-400 font-semibold">{totalResults} items found</span>
        </div>
      </div>
    </div>
  );
};
