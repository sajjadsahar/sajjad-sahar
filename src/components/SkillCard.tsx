import React from 'react';
import { Sparkles } from 'lucide-react';
import { Skill } from '../types.js';

interface SkillCardProps {
  skill: Skill;
  onHover?: (id: string | null) => void;
  onClick?: (skill: Skill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onHover, onClick }) => {
  const getProficiencyColor = (prof: string | number) => {
    const p = String(prof).toLowerCase();
    if (p.includes('advanced') || p.includes('expert')) {
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
    }
    if (p.includes('intermediate') || p.includes('proficient')) {
      return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400';
    }
    return 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400';
  };

  return (
    <div
      id={`skill-card-${skill.id}`}
      onMouseEnter={() => onHover?.(skill.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(skill)}
      className="p-4 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
            {skill.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              {skill.name}
            </h4>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {skill.category}
            </span>
          </div>
        </div>

        {skill.featured && (
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
        <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${getProficiencyColor(skill.proficiency)}`}>
          {String(skill.proficiency)}
        </span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {skill.yearsOfExperience || '1+ yr'}
        </span>
      </div>
    </div>
  );
};

export default SkillCard;
