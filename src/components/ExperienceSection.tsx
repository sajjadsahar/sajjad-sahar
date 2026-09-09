import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { Experience } from '../types.js';

interface ExperienceSectionProps {
  experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const [filter, setFilter] = useState<'All' | 'Education' | 'Experience'>('All');

  const filtered = (experience || []).filter(item => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  return (
    <section id="experience" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Academic &amp; Professional Trajectory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Education &amp; Experience
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            A comprehensive record of formal software engineering studies, academic distinctions, student leadership, and development initiatives.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(['All', 'Education', 'Experience'] as const).map((type) => (
            <button
              key={type}
              id={`timeline-filter-${type.toLowerCase()}`}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${
                filter === type
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                  : 'bg-white dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 font-medium shadow-sm'
              }`}
            >
              {type === 'All' ? 'All Milestones' : type}
            </button>
          ))}
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-cyan-600/50 before:to-slate-300 dark:before:to-slate-700">
          {filtered.map((item) => (
            <div 
              key={item.id}
              id={`experience-item-${item.id}`}
              className="relative group animate-in fade-in duration-300"
            >
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[21px] sm:-left-[25px] top-2 w-4 h-4 rounded-full bg-cyan-500 dark:bg-cyan-400 ring-4 ring-white dark:ring-[#0b0f19] shadow-md group-hover:scale-125 transition-transform" />

              {/* Card Container */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all space-y-4">
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        item.type === 'Education' 
                          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' 
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {item.type}
                      </span>
                      {item.current && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-cyan-700 dark:text-cyan-300 text-[10px] font-mono flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {item.position}
                    </h3>
                    <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mt-0.5 font-bold">
                      {item.organization}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-600 dark:text-slate-300 space-y-1 sm:text-right font-medium">
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>{item.startDate} — {item.endDate}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>

                {/* Achievements List */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      Key Highlights &amp; Outcomes
                    </h4>
                    <ul className="space-y-1.5">
                      {item.achievements.map((ach, i) => (
                        <li key={i} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2 font-normal">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400 mt-0.5 shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {item.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
