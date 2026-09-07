import React from 'react';
import { 
  Eye, 
  FolderGit2, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { AnalyticsSummary, Project, Certificate, ContactMessage } from '../../types.js';

interface AdminOverviewProps {
  analytics: AnalyticsSummary | null;
  projects: Project[];
  certificates: Certificate[];
  messages: ContactMessage[];
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  analytics,
  projects,
  certificates,
  messages,
  onNavigateTab
}) => {
  const unreadMessages = (messages || []).filter(m => !m.read).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Full-Stack CMS Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome, Sajjad Sahar
        </h2>
        <p className="text-white/80 text-sm max-w-2xl leading-relaxed">
          Manage your live portfolio content, certificates, projects, and incoming inquiries. Changes apply instantly across the public portfolio.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Page Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase font-semibold">Page Views</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.totalPageViews || 0}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active visitor tracking</span>
          </div>
        </div>

        {/* Total Projects */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-indigo-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase font-semibold">Live Projects</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {projects.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {(projects || []).filter(p => p.featured).length} featured on homepage
          </div>
        </div>

        {/* Total Certificates */}
        <div 
          onClick={() => onNavigateTab('certificates')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase font-semibold">Certificates</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {certificates.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            All credentials verified &amp; viewable
          </div>
        </div>

        {/* Contact Inquiries */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-purple-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase font-semibold">Messages</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{messages.length}</span>
            {unreadMessages > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white font-mono">
                {unreadMessages} new
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Stored directly in portfolio database
          </div>
        </div>

      </div>

      {/* Quick Actions & Recent Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Launchers */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Fast CMS Actions</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('projects')}
              className="p-3.5 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors"
            >
              <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">+ Add Project</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Showcase code or apps</div>
            </button>

            <button
              onClick={() => onNavigateTab('certificates')}
              className="p-3.5 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors"
            >
              <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">+ Add Certificate</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Upload new credential</div>
            </button>

            <button
              onClick={() => onNavigateTab('blogs')}
              className="p-3.5 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors"
            >
              <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">+ Write Article</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Post technical insights</div>
            </button>

            <button
              onClick={() => onNavigateTab('ai-studio')}
              className="p-3.5 rounded-xl text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors"
            >
              <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">AI Image Studio</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Generate 1K/2K/4K mockups</div>
            </button>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span>Recent Inquiries</span>
            </h3>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All ({messages.length})
            </button>
          </div>

          <div className="space-y-2">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigateTab('messages')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    {msg.name} ({msg.email})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {msg.createdAt.substring(0, 10)}
                  </span>
                </div>
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {msg.subject}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {msg.message}
                </p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                No inquiries received yet. They will appear here when visitors reach out.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
