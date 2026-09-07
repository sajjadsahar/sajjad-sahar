import React from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Medal, 
  Star, 
  Calendar, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';
import { Achievement } from '../types.js';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return <Trophy className="w-5 h-5 text-cyan-400" />;
      case 'competition':
        return <Medal className="w-5 h-5 text-cyan-300" />;
      case 'scholarship':
        return <Award className="w-5 h-5 text-cyan-400" />;
      default:
        return <Star className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="achievements" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b0f19] border border-slate-700/80 text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Honors &amp; Recognition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Awards &amp; Key Achievements
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal">
            A testament to consistency, algorithmic problem-solving speed, and academic excellence at Riphah International University and regional competitions.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              id={`achievement-card-${item.id}`}
              className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-[#060810] border border-slate-700 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Title & Organization */}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{item.organization}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Footer Date & Status */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {item.date}
                </span>
                {item.featured && (
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Honor
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
