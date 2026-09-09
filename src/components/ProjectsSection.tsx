import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Search, 
  Layers, 
  Eye, 
  ArrowRight,
  Code
} from 'lucide-react';
import { Project } from '../types.js';

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
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#060810] border-b border-slate-200 dark:border-slate-800">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900/80 dark:bg-[#04060a]/80 backdrop-blur-md border border-slate-700 text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {project.category}
                    </span>
                  </div>

                  {/* Views & Featured */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {project.featured && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/90 text-slate-950 border border-cyan-400 font-mono text-[10px] flex items-center gap-1 font-bold shadow-sm">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                    {project.views !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 dark:bg-[#04060a]/80 backdrop-blur-md text-white font-mono text-[10px] flex items-center gap-1 border border-slate-700 font-medium">
                        <Eye className="w-3 h-3" /> {project.views}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(project)}
                  id={`btn-view-project-${project.id}`}
                  className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 group/btn font-bold"
                >
                  <span>Architecture &amp; Docs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`link-github-${project.id}`}
                      className="p-2 rounded-md bg-white dark:bg-[#060810] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
                      title="View GitHub Repository"
                      aria-label="GitHub Repo"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`link-demo-${project.id}`}
                      className="p-2 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-colors"
                      title="Live Demo"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
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
