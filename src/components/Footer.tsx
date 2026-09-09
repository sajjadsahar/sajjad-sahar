import React from 'react';
import { 
  Terminal, 
  ArrowUp, 
  Github, 
  Linkedin, 
  Facebook, 
  Mail, 
  ShieldCheck,
  Phone
} from 'lucide-react';
import { Profile } from '../types.js';
import { getFacebookUrl, getWhatsAppLink } from '../utils/social.js';

interface FooterProps {
  profile: Profile;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const facebookUrl = getFacebookUrl(profile?.socialLinks?.facebook);
  const whatsappUrl = getWhatsAppLink(profile?.socialLinks?.whatsapp);
  const linkedinUrl = profile?.socialLinks?.linkedin || 'https://linkedin.com/in/sajjadsahar';
  const githubUrl = profile?.socialLinks?.github || `https://github.com/${profile?.githubUsername || 'sajjadsahar'}`;
  const email = profile?.socialLinks?.email || '65441@students.riphah.edu.pk';

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#04060a] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0b0f19] border border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-lg font-mono shadow-sm">
              SS.
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-base">
                {profile.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                {profile.program} • {profile.university} (CGPA {profile.cgpa})
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#certificates" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Certificates</a>
            <a href="#experience" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Experience</a>
            <a href="#achievements" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Achievements</a>
            <a href="#blog" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Blog</a>
            <a href="#resume" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Resume</a>
            <a href="#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</a>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors shadow-sm"
              title="Facebook Profile"
              aria-label="Facebook Profile"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors shadow-sm"
              title="Chat on WhatsApp (03485039425)"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${email}`}
              className="p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
              title="Send Email"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Back to top & Admin */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              id="footer-admin-btn"
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors font-semibold"
              title="Admin CMS Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              id="btn-scroll-to-top"
              className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with MERN, TypeScript &amp; High-Contrast Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
