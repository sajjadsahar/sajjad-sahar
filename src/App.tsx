import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { 
  PortfolioData, 
  Project, 
  Certificate, 
  Blog 
} from './types.js';
import { fetchPortfolioData, trackPageView } from './services/api.js';

// Layout & Public Components
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { AboutSection } from './components/AboutSection.js';
import { SkillsSection } from './components/SkillsSection.js';
import { ProjectsSection } from './components/ProjectsSection.js';
import { CertificatesSection } from './components/CertificatesSection.js';
import { ExperienceSection } from './components/ExperienceSection.js';
import { AchievementsSection } from './components/AchievementsSection.js';
import { GitHubSection } from './components/GitHubSection.js';
import { BlogSection } from './components/BlogSection.js';
import { ResumeSection } from './components/ResumeSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';

// Modals
import { ProjectDetailModal } from './components/ProjectDetailModal.js';
import { CertificateDetailModal } from './components/CertificateDetailModal.js';
import { BlogReaderModal } from './components/BlogReaderModal.js';
import { GlobalSearchModal } from './components/GlobalSearchModal.js';
import { AdminLoginModal } from './components/admin/AdminLoginModal.js';

// Admin CMS Dashboard
import { AdminDashboard } from './components/admin/AdminDashboard.js';

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await fetchPortfolioData();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    trackPageView(window.location.pathname || '/');
  }, [loadData]);

  // Global Keyboard shortcut for fast search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setViewMode('admin');
    } else {
      setAdminLoginOpen(true);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#04060a] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xl font-mono animate-pulse">
          SS.
        </div>
        <div className="text-xs font-mono text-slate-300 tracking-wider">
          Initializing Sajjad Sahar Portfolio...
        </div>
      </div>
    );
  }

  // Admin CMS Mode
  if (viewMode === 'admin' && isAuthenticated) {
    return (
      <AdminDashboard
        portfolioData={data}
        onRefreshData={loadData}
        onExitAdmin={() => setViewMode('public')}
      />
    );
  }

  // Public Portfolio View
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100 transition-colors selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation */}
      <Navbar
        profile={data.profile}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Hero Section */}
      <main>
        <HeroSection
          profile={data.profile}
          onOpenAdmin={handleOpenAdmin}
        />

        {/* About Section */}
        <AboutSection profile={data.profile} experience={data.experience || []} />

        {/* Skills Section */}
        <SkillsSection 
          skills={data.skills || []} 
          projects={data.projects || []}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        {/* Projects Section */}
        <ProjectsSection
          projects={data.projects || []}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        {/* Certificates Section */}
        <CertificatesSection
          certificates={data.certificates || []}
          onSelectCertificate={(c) => setSelectedCertificate(c)}
        />

        {/* Experience & Education Timeline */}
        <ExperienceSection experience={data.experience || []} />

        {/* Achievements Section */}
        <AchievementsSection achievements={data.achievements || []} />

        {/* Live GitHub Section */}
        <GitHubSection githubUsername={data.profile?.socialLinks?.github ? data.profile.socialLinks.github.split('/').pop() : 'sajjadsahar'} />

        {/* Technical Blog Section */}
        <BlogSection
          blogs={(data.blogs || []).filter(b => b.published)}
          onSelectBlog={(b) => setSelectedBlog(b)}
        />

        {/* Interactive Resume Section */}
        <ResumeSection
          profile={data.profile}
          experience={data.experience || []}
          projects={data.projects || []}
          certificates={data.certificates || []}
          skills={data.skills || []}
        />

        {/* Contact Section */}
        <ContactSection profile={data.profile} />
      </main>

      {/* Footer */}
      <Footer
        profile={data.profile}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <BlogReaderModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        projects={data.projects || []}
        certificates={data.certificates || []}
        skills={data.skills || []}
        blogs={data.blogs || []}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setSearchOpen(false);
        }}
        onSelectCertificate={(c) => {
          setSelectedCertificate(c);
          setSearchOpen(false);
        }}
        onSelectBlog={(b) => {
          setSelectedBlog(b);
          setSearchOpen(false);
        }}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setAdminLoginOpen(false);
          setViewMode('admin');
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
