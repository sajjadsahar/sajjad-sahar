import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Layout, 
  Server, 
  Database as DbIcon, 
  Wrench, 
  BrainCircuit, 
  Sparkles, 
  Search, 
  Filter,
  Layers,
  Crosshair,
  BarChart3,
  FolderGit2,
  ExternalLink,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { Skill, SkillCategory, SkillProficiency, Project } from '../types.js';
import { 
  getSkillDescription, 
  getSkillProficiencyScore, 
  findRelatedProjects, 
  CATEGORY_METADATA 
} from '../utils/skillHelpers.js';
import { SkillTooltip } from './skills/SkillTooltip.js';
import { CategoryTooltip } from './skills/CategoryTooltip.js';
import { TechRadarView } from './skills/TechRadarView.js';
import { DomainAnalyticsView } from './skills/DomainAnalyticsView.js';

interface SkillsSectionProps {
  skills: Skill[];
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
}

type ViewMode = 'grid' | 'radar' | 'analytics';

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills = [],
  projects = [],
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [hoveredCategoryTab, setHoveredCategoryTab] = useState<string | null>(null);
  const [selectedProficiencyFilter, setSelectedProficiencyFilter] = useState<'All' | 'Advanced' | 'Intermediate' | 'Core Only'>('All');

  const categories = [
    { label: 'All', icon: Sparkles },
    { label: 'Programming', icon: Code2 },
    { label: 'Frontend', icon: Layout },
    { label: 'Backend', icon: Server },
    { label: 'Database', icon: DbIcon },
    { label: 'Tools', icon: Wrench },
    { label: 'AI / Machine Learning', icon: BrainCircuit },
  ];

  const filteredSkills = useMemo(() => {
    return (skills || []).filter(skill => {
      const matchCat = selectedCategory === 'All' || skill.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        (skill.name || '').toLowerCase().includes(q) ||
        (skill.category || '').toLowerCase().includes(q) ||
        String(skill.proficiency || '').toLowerCase().includes(q);

      let matchProf = true;
      if (selectedProficiencyFilter === 'Advanced') {
        matchProf = String(skill.proficiency).toLowerCase().includes('adv') || (typeof skill.proficiency === 'number' && skill.proficiency >= 85);
      } else if (selectedProficiencyFilter === 'Intermediate') {
        matchProf = String(skill.proficiency).toLowerCase().includes('inter') || (typeof skill.proficiency === 'number' && skill.proficiency >= 65 && skill.proficiency < 85);
      } else if (selectedProficiencyFilter === 'Core Only') {
        matchProf = Boolean(skill.featured);
      }

      return matchCat && matchQuery && matchProf;
    });
  }, [skills, selectedCategory, searchQuery, selectedProficiencyFilter]);

  const getProficiencyBadge = (level: SkillProficiency) => {
    const score = getSkillProficiencyScore(level);
    if (score >= 85) {
      return {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-300',
        border: 'border-cyan-500/30',
        dot: 'bg-cyan-400',
        bar: 'from-cyan-500 to-teal-400'
      };
    } else if (score >= 65) {
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
        bar: 'from-blue-500 to-indigo-400'
      };
    } else {
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
        bar: 'from-purple-500 to-pink-400'
      };
    }
  };

  // Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-black/25 overflow-hidden">
      
      {/* Background Decorative Ambient Radial Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Motion Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-cyan-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            <span>Interactive Engineering Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Skills &amp; Technologies
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Practical competencies across full-stack systems, core data structures, databases, and generative AI. Hover over any technology or category to view linked portfolio projects and technical architecture details.
          </p>
        </motion.div>

        {/* Interactive Visualization Mode Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-2 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#060810] rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('grid')}
              id="view-mode-grid"
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('radar')}
              id="view-mode-radar"
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                viewMode === 'radar'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Tech Radar</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              id="view-mode-analytics"
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                viewMode === 'analytics'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Domain Matrix</span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-700 dark:text-slate-300 px-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
              <strong className="text-slate-900 dark:text-white font-bold">{skills.length}</strong> Technologies
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-500">
              &bull;
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <strong className="text-white font-bold">{projects.length}</strong> Live Projects
            </span>
          </div>
        </motion.div>

        {/* View Mode 1: Tech Radar Visualization */}
        {viewMode === 'radar' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <TechRadarView
              skills={skills}
              projects={projects}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSelectProject={onSelectProject}
            />
          </motion.div>
        )}

        {/* View Mode 2: Domain Analytics Matrix */}
        {viewMode === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <DomainAnalyticsView
              skills={skills}
              projects={projects}
              onSelectProject={onSelectProject}
              onFilterCategory={(cat) => {
                setSelectedCategory(cat);
                setViewMode('grid');
              }}
            />
          </motion.div>
        )}

        {/* View Mode 3: Enhanced Card Grid with Interactive Tooltips */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            
            {/* Filter Controls & Search */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Category Tabs with Hover Tooltip */}
              <div className="relative flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  const isHovered = hoveredCategoryTab === cat.label;

                  return (
                    <div 
                      key={cat.label} 
                      className="relative"
                      onMouseEnter={() => setHoveredCategoryTab(cat.label)}
                      onMouseLeave={() => setHoveredCategoryTab(null)}
                    >
                      <motion.button
                        id={`skill-cat-${cat.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => setSelectedCategory(cat.label)}
                        whileTap={{ scale: 0.96 }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-lg whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                            : 'bg-white dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-sm'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </motion.button>

                      {/* Category Hover Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <div className="absolute left-0 top-full mt-2 z-50 pointer-events-none hidden md:block">
                            <CategoryTooltip
                              category={cat.label}
                              skills={skills}
                              projects={projects}
                              onSelectProject={onSelectProject}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Search & Quick Tier Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                {/* Tier Filter dropdown/pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#060810] p-1 rounded-lg border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
                  {(['All', 'Advanced', 'Core Only'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedProficiencyFilter(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all ${
                        selectedProficiencyFilter === lvl
                          ? 'bg-cyan-500 text-slate-950 dark:bg-white/20 dark:text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search React, C++, SQL..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* Category Banner Summary for active selection */}
            {selectedCategory !== 'All' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-slate-200">
                    <strong className="text-white">{selectedCategory} Domain:</strong>{' '}
                    {CATEGORY_METADATA[selectedCategory]?.description || 'Engineered with clean patterns and testing.'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold whitespace-nowrap self-start sm:self-auto"
                >
                  Reset to All
                </button>
              </motion.div>
            )}

            {/* Skills Grid with Motion Stagger & Viewport Reveal */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => {
                  const badge = getProficiencyBadge(skill.proficiency);
                  const score = getSkillProficiencyScore(skill.proficiency);
                  const relatedProjects = findRelatedProjects(skill, projects);
                  const isHovered = hoveredSkillId === skill.id;

                  return (
                    <motion.div
                      layout
                      variants={cardVariants}
                      key={skill.id}
                      id={`skill-card-${skill.id}`}
                      onMouseEnter={() => setHoveredSkillId(skill.id)}
                      onMouseLeave={() => setHoveredSkillId(null)}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="relative p-4 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 transition-all group flex flex-col justify-between cursor-pointer shadow-sm"
                      onClick={() => setHoveredSkillId(isHovered ? null : skill.id)}
                    >
                      {/* Top Row: Title, Category, Experience */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                              <span>{skill.name}</span>
                              {skill.featured && (
                                <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                              )}
                            </h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {skill.category}
                            </span>
                          </div>

                          {skill.yearsOfExperience && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0 font-medium">
                              {skill.yearsOfExperience}
                            </span>
                          )}
                        </div>

                        {/* Brief descriptive snippet */}
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                          {getSkillDescription(skill)}
                        </p>
                      </div>

                      {/* Bottom row: Proficiency Bar & Related Projects badge */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        
                        {/* Progress Meter */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Proficiency</span>
                            <span className="text-slate-800 dark:text-slate-200 font-bold">{score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${score}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${badge.bar}`}
                            />
                          </div>
                        </div>

                        {/* Badges & Projects Indicator */}
                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${badge.bg} ${badge.text} ${badge.border} font-semibold`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{skill.proficiency}</span>
                          </div>

                          {relatedProjects.length > 0 ? (
                            <span 
                              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-semibold"
                              title={`${relatedProjects.length} linked projects in portfolio`}
                            >
                              <FolderGit2 className="w-3 h-3" />
                              <span>{relatedProjects.length} {relatedProjects.length === 1 ? 'proj' : 'projs'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 font-medium">
                              Foundational
                            </span>
                          )}
                        </div>

                      </div>

                      {/* Hover Tooltip Overlay for this Skill Card */}
                      <AnimatePresence>
                        {isHovered && (
                          <div 
                            className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50 hidden sm:block pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SkillTooltip
                              skill={skill}
                              projects={projects}
                              onSelectProject={onSelectProject}
                              onClose={() => setHoveredSkillId(null)}
                            />
                          </div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Touch Modal / Dialog for Pinned Skill */}
            <AnimatePresence>
              {hoveredSkillId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:hidden">
                  <div className="relative max-w-sm w-full">
                    {(() => {
                      const active = skills.find(s => s.id === hoveredSkillId);
                      if (!active) return null;
                      return (
                        <SkillTooltip
                          skill={active}
                          projects={projects}
                          onSelectProject={(p) => {
                            setHoveredSkillId(null);
                            if (onSelectProject) onSelectProject(p);
                          }}
                          onClose={() => setHoveredSkillId(null)}
                        />
                      );
                    })()}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Empty Search / Filter State */}
            {filteredSkills.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
              >
                <Filter className="w-8 h-8 text-gray-500 mx-auto" />
                <div className="text-gray-300 font-medium text-sm">
                  No skills matched your criteria
                </div>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  No technology entries found matching &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo; with &ldquo;{selectedProficiencyFilter}&rdquo; filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setSelectedProficiencyFilter('All');
                  }}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
