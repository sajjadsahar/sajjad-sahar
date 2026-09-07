import React from 'react';
import { motion } from 'motion/react';
import { Layers, FolderGit2, Sparkles, ExternalLink } from 'lucide-react';
import { Skill, Project } from '../../types.js';
import { CATEGORY_METADATA, getCategoryRelatedProjects } from '../../utils/skillHelpers.js';

interface CategoryTooltipProps {
  category: string;
  skills: Skill[];
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
}

export const CategoryTooltip: React.FC<CategoryTooltipProps> = ({
  category,
  skills,
  projects = [],
  onSelectProject
}) => {
  const meta = CATEGORY_METADATA[category] || CATEGORY_METADATA['All'];
  const categorySkills = category === 'All' 
    ? skills 
    : skills.filter(s => s.category.toLowerCase() === category.toLowerCase());
  
  const relatedProjects = getCategoryRelatedProjects(category, projects);

  const advancedCount = categorySkills.filter(s => 
    String(s.proficiency).toLowerCase().includes('adv') || (typeof s.proficiency === 'number' && s.proficiency >= 85)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-76 sm:w-84 p-4 rounded-xl bg-[#080d1a] border border-cyan-500/40 text-white shadow-2xl shadow-black/80 backdrop-blur-xl z-50 pointer-events-auto text-left"
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/80">
        <div>
          <h4 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{category} Domain</span>
          </h4>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold">
            {meta.focus}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-white">
            {categorySkills.length} Technologies
          </span>
          <div className="text-[10px] font-mono text-slate-300">
            {advancedCount} at Advanced level
          </div>
        </div>
      </div>

      <p className="py-2 text-xs text-slate-200 leading-relaxed font-normal">
        {meta.description}
      </p>

      {/* Related Projects */}
      <div className="pt-2 border-t border-slate-700/80">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1 font-bold">
          <FolderGit2 className="w-3 h-3 text-cyan-400" />
          <span>Featured Implementations</span>
        </div>

        {relatedProjects.length > 0 ? (
          <div className="space-y-1">
            {relatedProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProject && onSelectProject(p)}
                className="w-full text-left p-1.5 rounded-md bg-[#04060a] hover:bg-cyan-950/40 border border-slate-700/80 hover:border-cyan-400 transition-all group flex items-center justify-between"
              >
                <span className="text-[11px] text-slate-200 group-hover:text-cyan-300 truncate font-semibold">
                  {p.title}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 flex-shrink-0 ml-1.5" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-slate-300 italic">
            Applied across academic engineering &amp; algorithm assignments.
          </div>
        )}
      </div>
    </motion.div>
  );
};
