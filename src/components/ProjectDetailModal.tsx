import React, { useEffect } from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  Calendar, 
  Tag, 
  Eye,
  Layers
} from 'lucide-react';
import { Project } from '../types.js';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      id="project-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="project-detail-card"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={project.imageUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            id="btn-close-project-modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges & Title overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600/90 text-white font-mono text-xs font-semibold backdrop-blur-md">
                {project.category}
              </span>
              {project.date && (
                <span className="flex items-center gap-1 text-xs text-slate-300 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.date}
                </span>
              )}
              {project.views !== undefined && (
                <span className="flex items-center gap-1 text-xs text-slate-300 font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  {project.views} views
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-700 dark:text-slate-300">
          
          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                id="btn-project-modal-demo"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live Application</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                id="btn-project-modal-github"
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Code Repository</span>
              </a>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Project Overview &amp; Architecture</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </div>

          {/* Technologies Used */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Technologies &amp; Architecture Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Key Features &amp; Capabilities</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <li 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Challenges & Solutions */}
          {project.challenges && (
            <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Engineering Challenges Faced &amp; Solved</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {/* What I Learned */}
          {project.whatILearned && (
            <div className="p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>Key Takeaways &amp; What I Learned</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.whatILearned}
              </p>
            </div>
          )}

          {/* Screenshots Gallery if available */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Application Screenshots
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.screenshots.map((src, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img 
                      src={src} 
                      alt={`${project.title} screenshot ${i + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {project.category} • Sajjad Sahar
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
