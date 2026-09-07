import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';
import { Profile } from '../types.js';

interface NavbarProps {
  profile: Profile | null;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  profile, 
  onOpenSearch, 
  onOpenAdmin,
  activeSection 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Experience', href: '#experience' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Blog', href: '#blog' },
    { label: 'Resume', href: '#resume' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? isDark 
            ? 'bg-[#04060a]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/60' 
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-md shadow-slate-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo - Styled with SS. and cyan accent */}
          <a 
            href="#hero" 
            id="nav-logo"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-black/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl font-mono tracking-tighter shadow-md shadow-cyan-950/40 group-hover:border-cyan-400 transition-all">
              SS.
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-bold tracking-tight text-lg text-slate-900 dark:text-white">
                <span>{profile?.name || 'Sajjad Sahar'}</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500" title="Active & Available" />
              </div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                Full-Stack &amp; AI Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 uppercase tracking-wider ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30'
                      : 'text-slate-300 dark:text-slate-200 hover:text-white dark:hover:text-cyan-300 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Action Utilities */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Global Search Button */}
            <button
              id="btn-global-search"
              onClick={onOpenSearch}
              className="p-2 text-slate-300 dark:text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
              title="Search projects, certificates & skills"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="p-2 text-slate-300 dark:text-slate-200 hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Resume Download */}
            {profile?.resumeUrl && (
              <a
                id="btn-nav-resume"
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-100 bg-white/5 hover:bg-white/15 rounded-md transition-all border border-slate-700 hover:border-cyan-400/50"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CV</span>
              </a>
            )}

            {/* Admin CMS Portal Trigger */}
            <button
              id="btn-admin-portal-trigger"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all shadow-md ${
                isAuthenticated
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Admin CMS' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="btn-mobile-search"
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-white rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="btn-mobile-theme"
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-white rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden border-b border-slate-800 bg-[#04060a]/98 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <button
              id="btn-mobile-admin"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl bg-indigo-600 text-white"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
