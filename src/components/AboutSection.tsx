import React from 'react';
import { 
  GraduationCap, 
  Lightbulb, 
  Target, 
  Compass, 
  CheckCircle2, 
  Award, 
  Code, 
  Briefcase,
  Terminal
} from 'lucide-react';
import { Profile, Experience } from '../types.js';

interface AboutSectionProps {
  profile: Profile;
  experience?: Experience[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, experience = [] }) => {
  const educationItems = (experience || []).filter(e => e.type === 'Education');

  return (
    <section id="about" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Engineering Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Sajjad Sahar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Passionate software engineer building modern full-stack web applications and applying artificial intelligence to real-world challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Academic & Background Story */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Narrative Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Academic Rigor &amp; Technical Foundation</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
                {profile.aboutText || profile.bio}
              </p>

              {/* University Profile Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase font-semibold tracking-wider">
                    University &amp; Degree
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-base mt-1">
                    {profile.university}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {profile.program} • {profile.currentSemester}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase font-semibold tracking-wider">
                    Academic Merit
                  </div>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 text-base mt-1 flex items-center gap-2">
                    <span>CGPA {profile.cgpa} / 4.0</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                      Dean&apos;s Honor List
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    Consistently ranked in the top 1% of the department
                  </div>
                </div>
              </div>
            </div>

            {/* Development Philosophy & Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Development Philosophy
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {profile.developmentPhilosophy || "Code is crafted once but read, iterated, and scaled continuously. I adhere to clean architecture, testable services, and responsive UX."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Career Goals
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {profile.careerGoals || "Aiming to engineer mission-critical cloud-native services and fuse generative AI capabilities into enterprise web architectures."}
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Timeline & Key Milestones */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 shadow-sm transition-all space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>Journey &amp; Education</span>
                </h3>
                <span className="text-xs font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30 px-2.5 py-1 rounded font-semibold">
                  5th Semester
                </span>
              </div>

              {/* Interactive Vertical Timeline */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-cyan-600/40 before:to-slate-300 dark:before:to-white/10">
                
                {/* 1. BS Software Engineering */}
                <div className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 dark:bg-cyan-400 ring-4 ring-white dark:ring-[#04060a]" />
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">2022 — 2026 (Expected)</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    BS Software Engineering
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
                    Riphah International University • CGPA: 3.98
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                    Key courses: Advanced Data Structures &amp; Algorithms, Object-Oriented Software Design (Java &amp; C++), Database Systems (SQL &amp; NoSQL), Operating Systems, Software Testing.
                  </p>
                </div>

                {/* 2. Full-Stack MERN & Systems Dev */}
                <div className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 dark:bg-cyan-400 ring-4 ring-white dark:ring-[#04060a]" />
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">2023 — Present</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    Full-Stack MERN &amp; Systems Architecture
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
                    Wanderlust, Police Management &amp; FIR Engines
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                    Engineered production-grade REST APIs, normalized relational databases, high-performance C++ pointer models, and modern React interfaces.
                  </p>
                </div>

                {/* 3. AI & Machine Learning Specialization */}
                <div className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 dark:bg-cyan-400 ring-4 ring-white dark:ring-[#04060a]" />
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">2024 — Present</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    Artificial Intelligence &amp; NLP Explorations
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">
                    DeepLearning.AI &amp; Research Experiments
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                    Building neural networks, text embeddings, and intelligent assistants with TensorFlow, Python, and modern LLM APIs.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
