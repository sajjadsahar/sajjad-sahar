import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  Code2
} from 'lucide-react';
import { Skill, Project } from '../../types.js';
import { 
  CATEGORY_METADATA, 
  getSkillProficiencyScore, 
  getCategoryRelatedProjects,
  findRelatedProjects 
} from '../../utils/skillHelpers.js';
import { SkillTooltip } from './SkillTooltip.js';

interface DomainAnalyticsViewProps {
  skills: Skill[];
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onFilterCategory?: (cat: string) => void;
}

export const DomainAnalyticsView: React.FC<DomainAnalyticsViewProps> = ({
  skills,
  projects = [],
  onSelectProject,
  onFilterCategory
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Frontend');
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const domainNames = ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'AI / Machine Learning'];

  const domainStats = domainNames.map(domain => {
    const domainSkills = skills.filter(s => s.category.toLowerCase() === domain.toLowerCase());
    const advanced = domainSkills.filter(s => 
      String(s.proficiency).toLowerCase().includes('adv') || (typeof s.proficiency === 'number' && s.proficiency >= 85)
    ).length;
    const intermediate = domainSkills.filter(s => 
      String(s.proficiency).toLowerCase().includes('inter') || (typeof s.proficiency === 'number' && s.proficiency >= 65 && s.proficiency < 85)
    ).length;
    const learning = domainSkills.length - advanced - intermediate;
    const relatedProjects = getCategoryRelatedProjects(domain, projects);

    const avgProficiency = domainSkills.length > 0
      ? Math.round(domainSkills.reduce((acc, s) => acc + getSkillProficiencyScore(s.proficiency), 0) / domainSkills.length)
      : 0;

    return {
      domain,
      skills: domainSkills,
      count: domainSkills.length,
      advanced,
      intermediate,
      learning: Math.max(0, learning),
      avgProficiency,
      relatedProjects
    };
  });

  const currentStats = domainStats.find(d => d.domain === selectedDomain) || domainStats[0];
  const meta = CATEGORY_METADATA[selectedDomain] || CATEGORY_METADATA['All'];

  return (
    <div className="rounded-2xl bg-[#0b0f19] border border-slate-700/80 p-4 sm:p-6 lg:p-8 backdrop-blur-sm space-y-8 shadow-sm">
      
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Domain Competency &amp; Implementation Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
            Quantitative analysis of technical depth, proficiency tiers, and project implementations across domains.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Advanced (85%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Intermediate (70%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Learning</span>
          </div>
        </div>
      </div>

      {/* Domain Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domainStats.map((d) => {
          const isSelected = selectedDomain === d.domain;
          return (
            <div
              key={d.domain}
              id={`domain-stat-card-${d.domain.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => {
                setSelectedDomain(d.domain);
                setActiveSkill(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-cyan-500/[0.12] border-cyan-400 shadow-lg shadow-cyan-950/40'
                  : 'bg-[#060810] border-slate-800 hover:border-slate-700 hover:bg-[#0b0f19]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {d.domain}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#04060a] border border-slate-700 text-cyan-300 font-bold">
                  {d.avgProficiency}% Avg
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-300 mb-3 flex items-center justify-between font-medium">
                <span>{d.count} Technologies</span>
                <span>{d.relatedProjects.length} Projects</span>
              </div>

              {/* Stacked Proficiency Progress Bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(d.advanced / Math.max(1, d.count)) * 100}%` }}
                  className="bg-cyan-400 h-full"
                  title={`${d.advanced} Advanced`}
                />
                <div
                  style={{ width: `${(d.intermediate / Math.max(1, d.count)) * 100}%` }}
                  className="bg-blue-500 h-full"
                  title={`${d.intermediate} Intermediate`}
                />
                <div
                  style={{ width: `${(d.learning / Math.max(1, d.count)) * 100}%` }}
                  className="bg-purple-400 h-full"
                  title={`${d.learning} Learning`}
                />
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-400 font-medium flex justify-between">
                <span>{d.advanced} Adv</span>
                <span>{d.intermediate} Inter</span>
                <span>{d.learning} Learn</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain Inspector Details */}
      <div className="p-6 rounded-2xl bg-[#060810] border border-slate-700/80 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {selectedDomain} Technical Deep Dive
              </h4>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${meta.tagColor} font-semibold`}>
                {meta.focus}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed font-normal">
              {meta.description}
            </p>
          </div>

          {onFilterCategory && (
            <button
              onClick={() => onFilterCategory(selectedDomain)}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all self-start lg:self-auto"
            >
              Filter Cards by {selectedDomain}
            </button>
          )}
        </div>

        {/* Skills Pills in this domain */}
        <div className="mt-6">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5 font-bold">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technologies in this Domain (Click or hover to inspect)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {currentStats.skills.map((skill) => {
              const isSkillActive = activeSkill?.id === skill.id;
              const hasProjects = findRelatedProjects(skill, projects).length > 0;

              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkill(isSkillActive ? null : skill)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSkillActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/40'
                      : 'bg-[#0b0f19] border-slate-800 hover:border-cyan-400 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs truncate">
                    {skill.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 font-medium flex items-center justify-between mt-1">
                    <span>{skill.proficiency}</span>
                    {hasProjects && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Has linked projects" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Skill Inspection Popover */}
        <AnimatePresence>
          {activeSkill && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Inspecting: {activeSkill.name}
                </span>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="text-[11px] font-mono text-slate-300 hover:text-white underline font-medium"
                >
                  Close
                </button>
              </div>
              <SkillTooltip
                skill={activeSkill}
                projects={projects}
                onSelectProject={onSelectProject}
                onClose={() => setActiveSkill(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Featured Projects for this domain */}
        {currentStats.relatedProjects.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5 font-bold">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-world Implementations in this Domain</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentStats.relatedProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject && onSelectProject(p)}
                  className="p-3 rounded-xl bg-[#0b0f19] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-400 text-left transition-all group flex items-start justify-between"
                >
                  <div className="truncate mr-2">
                    <h5 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                      {p.title}
                    </h5>
                    <div className="text-[10px] font-mono text-slate-300 mt-0.5 truncate">
                      {(p.technologies || []).slice(0, 4).join(', ')}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 flex-shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
