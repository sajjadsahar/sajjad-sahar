import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Clock, 
  FolderGit2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Skill, Project } from '../../types.js';
import { getSkillDescription, getSkillProficiencyScore, findRelatedProjects } from '../../utils/skillHelpers.js';

interface SkillTooltipProps {
  skill: Skill;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  position?: 'top' | 'bottom' | 'fixed' | 'inline';
  onClose?: () => void;
}

export const SkillTooltip: React.FC<SkillTooltipProps> = ({
  skill,
  projects = [],
  onSelectProject,
  onClose
}) => {
  const description = getSkillDescription(skill);
  const score = getSkillProficiencyScore(skill.proficiency);
  const relatedProjects = findRelatedProjects(skill, projects);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-80 sm:w-88 p-4 rounded-xl bg-[#080d1a] border border-cyan-500/40 text-white shadow-2xl shadow-black/80 backdrop-blur-xl z-50 pointer-events-auto text-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              <span>{skill.name}</span>
              {skill.featured && (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
              )}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-semibold">
            {skill.category}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
            {skill.proficiency}
          </span>
          {skill.yearsOfExperience && (
            <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              {skill.yearsOfExperience} exp
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="py-2.5 text-xs text-slate-200 leading-relaxed font-normal">
        {description}
      </div>

      {/* Competency Mastery Bar */}
      <div className="py-2 border-t border-slate-800 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
          <span className="flex items-center gap-1 text-slate-200 font-medium">
            <Zap className="w-3 h-3 text-cyan-400" />
            Applied Proficiency
          </span>
          <span className="text-cyan-300 font-bold">{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Related Projects Section */}
      <div className="pt-2.5 border-t border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1 font-bold">
            <FolderGit2 className="w-3 h-3 text-cyan-400" />
            Portfolio Projects ({relatedProjects.length})
          </span>
          {relatedProjects.length > 0 && (
            <span className="text-[9px] font-mono text-cyan-300 font-semibold">
              Interactive
            </span>
          )}
        </div>

        {relatedProjects.length > 0 ? (
          <div className="space-y-1.5">
            {relatedProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                id={`skill-rel-proj-${p.id}`}
                onClick={() => onSelectProject && onSelectProject(p)}
                className="w-full text-left p-2 rounded-lg bg-[#04060a] hover:bg-cyan-950/40 border border-slate-700/80 hover:border-cyan-400 transition-all group flex items-center justify-between"
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 group-hover:text-slate-200 truncate">
                    {p.category} &bull; {(p.technologies || []).slice(0, 3).join(', ')}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-[#04060a] border border-slate-800 text-[11px] text-slate-300 italic flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span>Applied in academic engineering coursework &amp; lab systems</span>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {onClose && (
        <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="text-[10px] font-mono text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 font-medium"
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
};
