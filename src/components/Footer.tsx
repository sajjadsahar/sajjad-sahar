import React from 'react';
import { 
  Terminal, 
  ArrowUp, 
  Heart, 
  Github, 
  Linkedin, 
  Facebook, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';
import { Profile } from '../types.js';

interface FooterProps {
  profile: Profile;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#080808] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-400 shadow-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-base">
                {profile.name}
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {profile.program} • {profile.university} (CGPA {profile.cgpa})
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono uppercase tracking-wider text-gray-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#certificates" className="hover:text-cyan-400 transition-colors">Certificates</a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
            <a href="#achievements" className="hover:text-cyan-400 transition-colors">Achievements</a>
            <a href="#blog" className="hover:text-cyan-400 transition-colors">Blog</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>

          {/* Back to top & Admin */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors"
              title="Admin CMS Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              id="btn-scroll-to-top"
              className="p-2.5 rounded-md bg-white/[0.03] hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400 border border-white/10 transition-colors shadow-sm"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 font-mono">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with MERN, TypeScript &amp; Sophisticated Dark architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
