import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Search, 
  Layers, 
  Code
} from 'lucide-react';
import { Project } from '../types.js';
import { ProjectCard } from './ProjectCard.js';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'MERN', 'Web', 'Java', 'C++', 'Database', 'AI / ML'];

  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      const matchCat = selectedCategory === 'All' || 
        (project.category || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'MERN' && (project.technologies || []).some(t => t.toLowerCase().includes('mern') || t.toLowerCase().includes('react') || t.toLowerCase().includes('node')));
      
      const matchQuery = !searchQuery ||
        (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Featured Projects</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineering Projects &amp; Architecture
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            From complete MERN stack platforms to high-performance C++ data structures, robust Java OOP architectures, and normalized SQL engines.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`proj-cat-${cat.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'bg-white dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 font-medium shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects (React, Java, C++)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-white dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-sm"
            />
          </div>

        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-mono text-sm font-medium">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

      </div>
    </section>
  );
};
