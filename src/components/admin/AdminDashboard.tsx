import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Award, 
  Code2, 
  UserCheck, 
  GraduationCap, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Menu, 
  X,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { 
  PortfolioData, 
  AnalyticsSummary, 
  ContactMessage 
} from '../../types.js';
import { fetchAnalytics, fetchContactMessages } from '../../services/api.js';

import { AdminOverview } from './AdminOverview.js';
import { AdminProjects } from './AdminProjects.js';
import { AdminCertificates } from './AdminCertificates.js';
import { AdminSkills } from './AdminSkills.js';
import { AdminAbout } from './AdminAbout.js';
import { AdminExperience } from './AdminExperience.js';
import { AdminAchievements } from './AdminAchievements.js';
import { AdminBlogs } from './AdminBlogs.js';
import { AdminMessages } from './AdminMessages.js';
import { AdminAIStudio } from './AdminAIStudio.js';
import { AdminSettings } from './AdminSettings.js';

interface AdminDashboardProps {
  portfolioData: PortfolioData;
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  portfolioData,
  onRefreshData,
  onExitAdmin
}) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const loadAdminExtraData = async () => {
    try {
      const [anRes, msgRes] = await Promise.all([
        fetchAnalytics(),
        fetchContactMessages()
      ]);
      setAnalytics(anRes || null);
      setMessages(msgRes || []);
    } catch (err) {
      console.error('Failed to load extra admin data:', err);
    }
  };

  useEffect(() => {
    loadAdminExtraData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: (portfolioData.projects || []).length },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: (portfolioData.certificates || []).length },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'about', label: 'Profile & Bio', icon: UserCheck },
    { id: 'experience', label: 'Experience', icon: GraduationCap },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'blogs', label: 'Blog Posts', icon: BookOpen, badge: (portfolioData.blogs || []).length },
    { id: 'messages', label: 'Inquiries', icon: MessageSquare, badge: (messages || []).filter(m => !m.read).length || undefined },
    { id: 'ai-studio', label: 'AI Studio', icon: Sparkles, highlight: true },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    onExitAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white lg:hidden"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight">
                Sajjad Sahar Portfolio CMS
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Admin Role • MERN Platform
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Preview Button */}
          <button
            onClick={onExitAdmin}
            id="btn-admin-preview-public"
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            title="View Live Public Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            id="btn-admin-logout"
            className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium text-xs flex items-center gap-1.5 transition-colors"
            title="Log out of CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + View Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-2">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : item.highlight
                        ? 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick status card */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-1">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
              Auto-Sync Database
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Updates made here persist instantaneously to public visitors and across reloads.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <div 
              className="w-72 h-full bg-white dark:bg-slate-900 p-6 space-y-2 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">
                CMS Modules
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Panel Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <AdminOverview
              analytics={analytics}
              projects={portfolioData.projects}
              certificates={portfolioData.certificates}
              messages={messages}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjects
              projects={portfolioData.projects}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'certificates' && (
            <AdminCertificates
              certificates={portfolioData.certificates}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'skills' && (
            <AdminSkills
              skills={portfolioData.skills}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'about' && (
            <AdminAbout
              profile={portfolioData.profile}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'experience' && (
            <AdminExperience
              experience={portfolioData.experience}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'achievements' && (
            <AdminAchievements
              achievements={portfolioData.achievements}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'blogs' && (
            <AdminBlogs
              blogs={portfolioData.blogs}
              onRefresh={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'messages' && (
            <AdminMessages
              messages={messages}
              onRefresh={() => {
                loadAdminExtraData();
              }}
            />
          )}

          {activeTab === 'ai-studio' && (
            <AdminAIStudio />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              onRefreshAll={() => {
                onRefreshData();
                loadAdminExtraData();
              }}
            />
          )}
        </main>

      </div>

    </div>
  );
};
