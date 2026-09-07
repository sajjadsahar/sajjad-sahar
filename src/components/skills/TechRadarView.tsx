import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info, Crosshair, FolderGit2 } from 'lucide-react';
import { Skill, Project } from '../../types.js';
import { SkillTooltip } from './SkillTooltip.js';
import { CategoryTooltip } from './CategoryTooltip.js';
import { getSkillProficiencyScore } from '../../utils/skillHelpers.js';

interface TechRadarViewProps {
  skills: Skill[];
  projects?: Project[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProject?: (project: Project) => void;
}

interface RadarNode {
  skill: Skill;
  x: number;
  y: number;
  categoryIndex: number;
  categoryName: string;
  radius: number;
  angle: number;
  color: string;
}

export const TechRadarView: React.FC<TechRadarViewProps> = ({
  skills,
  projects = [],
  selectedCategory,
  onSelectCategory,
  onSelectProject
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [pinnedSkill, setPinnedSkill] = useState<Skill | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const categories = [
    { name: 'Programming', color: '#38bdf8', angleStart: 0 },
    { name: 'Frontend', color: '#2dd4bf', angleStart: 60 },
    { name: 'Backend', color: '#34d399', angleStart: 120 },
    { name: 'Database', color: '#fbbf24', angleStart: 180 },
    { name: 'Tools', color: '#a78bfa', angleStart: 240 },
    { name: 'AI / Machine Learning', color: '#f472b6', angleStart: 300 }
  ];

  const center = 300;
  const maxRadius = 250;
  const tiers = [
    { name: 'Advanced / Mastery', radius: 110, bg: 'rgba(56, 189, 248, 0.06)', stroke: 'rgba(56, 189, 248, 0.25)' },
    { name: 'Intermediate / Core', radius: 185, bg: 'rgba(255, 255, 255, 0.02)', stroke: 'rgba(255, 255, 255, 0.1)' },
    { name: 'Emerging / Learning', radius: 255, bg: 'rgba(255, 255, 255, 0.01)', stroke: 'rgba(255, 255, 255, 0.06)' }
  ];

  // Calculate coordinates for skills on the radar
  const nodes: RadarNode[] = useMemo(() => {
    return skills.map((skill, idx) => {
      let catIndex = categories.findIndex(
        c => c.name.toLowerCase() === skill.category.toLowerCase()
      );
      if (catIndex === -1) catIndex = 0;
      const cat = categories[catIndex];

      // Radius based on proficiency score (higher score = closer to center for mastery radar)
      const score = getSkillProficiencyScore(skill.proficiency);
      // Invert score so 100% is near center (radius ~ 60-100), 50% is near rim (radius ~ 240)
      const normScore = Math.max(0.2, Math.min(1, score / 100));
      const baseRadius = 60 + (1 - normScore) * (maxRadius - 80);

      // Distribute angle within the 60 degree sector
      const sectorSpan = 52; // leave 8 deg padding
      // Seed offset based on string id
      const hash = skill.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const angleOffset = 4 + (hash % sectorSpan);
      const angleDeg = cat.angleStart + angleOffset;
      const angleRad = (angleDeg - 90) * (Math.PI / 180);

      // Slight jitter to prevent exact overlaps
      const jitterRadius = baseRadius + ((idx % 3) - 1) * 8;
      const x = center + jitterRadius * Math.cos(angleRad);
      const y = center + jitterRadius * Math.sin(angleRad);

      return {
        skill,
        x,
        y,
        categoryIndex: catIndex,
        categoryName: cat.name,
        radius: jitterRadius,
        angle: angleDeg,
        color: cat.color
      };
    });
  }, [skills]);

  const activeSkill = pinnedSkill || hoveredSkill;

  return (
    <div className="relative w-full rounded-2xl bg-[#0b0f19] border border-slate-700/80 p-4 sm:p-6 lg:p-8 overflow-hidden backdrop-blur-sm shadow-sm">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Interactive Technology Ecosystem Radar
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
            Radial visualization showing proficiency depth from Core Mastery (inner core) to Emerging Technologies (outer ring). Hover or tap any node to inspect project integrations.
          </p>
        </div>

        {/* Quick Category Focus Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'bg-[#060810] text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            All Sectors
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-white/20 text-white font-bold border border-cyan-400/60'
                  : 'bg-[#060810] text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Display */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* SVG Canvas */}
        <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full overflow-visible drop-shadow-2xl"
          >
            <defs>
              <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Radar Center Ambient Glow */}
            <circle cx={center} cy={center} r={tiers[0].radius + 20} fill="url(#radarCenterGlow)" />

            {/* Concentric Tier Circles */}
            {tiers.map((tier, idx) => (
              <g key={tier.name}>
                <circle
                  cx={center}
                  cy={center}
                  r={tier.radius}
                  fill={tier.bg}
                  stroke={tier.stroke}
                  strokeWidth="1"
                  strokeDasharray={idx === 0 ? 'none' : '4 4'}
                />
                <text
                  x={center}
                  y={center - tier.radius + 14}
                  textAnchor="middle"
                  className="fill-gray-500 text-[10px] font-mono uppercase tracking-widest pointer-events-none select-none"
                >
                  {tier.name}
                </text>
              </g>
            ))}

            {/* Radial Category Axes & Labels */}
            {categories.map((cat) => {
              const angleRad = (cat.angleStart - 90) * (Math.PI / 180);
              const x2 = center + maxRadius * Math.cos(angleRad);
              const y2 = center + maxRadius * Math.sin(angleRad);
              const labelX = center + (maxRadius + 22) * Math.cos(angleRad);
              const labelY = center + (maxRadius + 22) * Math.sin(angleRad);
              const isCatActive = selectedCategory === 'All' || selectedCategory === cat.name || hoveredCategory === cat.name;

              return (
                <g key={cat.name} className="transition-opacity duration-300">
                  <line
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke={cat.color}
                    strokeWidth={isCatActive ? 1.5 : 0.6}
                    strokeOpacity={isCatActive ? 0.4 : 0.1}
                  />
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor={labelX > center ? 'start' : labelX < center ? 'end' : 'middle'}
                    className="text-[11px] font-mono font-bold select-none cursor-pointer transition-colors"
                    fill={isCatActive ? cat.color : '#6b7280'}
                    onClick={() => onSelectCategory(cat.name)}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {cat.name}
                  </text>
                </g>
              );
            })}

            {/* Center Core Hub */}
            <circle cx={center} cy={center} r="6" fill="#38bdf8" />
            <circle cx={center} cy={center} r="16" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />

            {/* Active connecting beam to center */}
            {activeSkill && (
              (() => {
                const activeNode = nodes.find(n => n.skill.id === activeSkill.id);
                if (!activeNode) return null;
                return (
                  <g>
                    <line
                      x1={center}
                      y1={center}
                      x2={activeNode.x}
                      y2={activeNode.y}
                      stroke={activeNode.color}
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      strokeOpacity="0.8"
                    />
                    <circle
                      cx={activeNode.x}
                      cy={activeNode.y}
                      r="16"
                      fill="none"
                      stroke={activeNode.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                      className="animate-ping"
                    />
                  </g>
                );
              })()
            )}

            {/* Skill Nodes */}
            {nodes.map((node) => {
              const isMatchCat = selectedCategory === 'All' || selectedCategory.toLowerCase() === node.categoryName.toLowerCase();
              const isHovered = activeSkill?.id === node.skill.id;
              const opacity = isMatchCat ? (isHovered ? 1 : 0.9) : 0.2;

              return (
                <g
                  key={node.skill.id}
                  id={`radar-node-${node.skill.id}`}
                  className="cursor-pointer transition-all duration-200"
                  opacity={opacity}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPinnedSkill(pinnedSkill?.id === node.skill.id ? null : node.skill);
                  }}
                  onMouseEnter={() => setHoveredSkill(node.skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Subtle Node Halo */}
                  {isHovered && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="14"
                      fill={node.color}
                      fillOpacity="0.2"
                      filter="url(#nodeGlow)"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 7 : node.skill.featured ? 5.5 : 4}
                    fill={node.color}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />

                  {/* Skill Short Label */}
                  <text
                    x={node.x}
                    y={node.y - 8}
                    textAnchor="middle"
                    className="text-[9px] font-mono font-medium pointer-events-none select-none transition-all"
                    fill={isHovered ? '#ffffff' : '#cbd5e1'}
                  >
                    {node.skill.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Detail Panel / Floating Info */}
        <div className="w-full lg:w-96 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeSkill ? (
              <div key={activeSkill.id} className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Inspecting Selected Technology
                  </span>
                  {pinnedSkill && (
                    <button
                      onClick={() => setPinnedSkill(null)}
                      className="text-[10px] font-mono text-slate-300 hover:text-white underline font-medium"
                    >
                      Clear Pin
                    </button>
                  )}
                </div>
                <SkillTooltip
                  skill={activeSkill}
                  projects={projects}
                  onSelectProject={onSelectProject}
                  onClose={() => {
                    setPinnedSkill(null);
                    setHoveredSkill(null);
                  }}
                />
              </div>
            ) : hoveredCategory ? (
              <div key={hoveredCategory} className="w-full">
                <CategoryTooltip
                  category={hoveredCategory}
                  skills={skills}
                  projects={projects}
                  onSelectProject={onSelectProject}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-2xl bg-[#060810] border border-slate-700/80 text-center space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                  <Crosshair className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">
                    Hover Over Any Technology Node
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                    Explore Sajjad’s practical toolchain mapped by competency depth. Each point links directly to verified projects and real application code.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-left">
                  <div className="p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Total Tech</div>
                    <div className="text-sm font-bold text-cyan-400">{skills.length}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Core Mastery</div>
                    <div className="text-sm font-bold text-white">
                      {skills.filter(s => String(s.proficiency).toLowerCase().includes('adv')).length}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Domains</div>
                    <div className="text-sm font-bold text-teal-400">6</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 font-medium">Distance from Center:</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Inner: Production Mastery
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Middle: Core Stack
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Outer: Emerging &amp; LLMs
          </span>
        </div>
        <div className="text-slate-400 font-medium">
          Tip: Tap any node to lock inspection
        </div>
      </div>

    </div>
  );
};
