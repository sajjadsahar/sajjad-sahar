import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { PortfolioData, Project, Certificate, Blog } from '../types.js';
import { fetchPortfolioData, trackPageView } from '../services/api.js';

// Layout & Section Components
import { Navbar } from '../components/Navbar.js';
import { HeroSection } from '../components/HeroSection.js';
import { AboutSection } from '../components/AboutSection.js';
import { SkillsSection } from '../components/SkillsSection.js';
import { ProjectsSection } from '../components/ProjectsSection.js';
import { CertificatesSection } from '../components/CertificatesSection.js';
import { ExperienceSection } from '../components/ExperienceSection.js';
import { AchievementsSection } from '../components/AchievementsSection.js';
import { GitHubSection } from '../components/GitHubSection.js';
import { BlogSection } from '../components/BlogSection.js';
import { ResumeSection } from '../components/ResumeSection.js';
import { ContactSection } from '../components/ContactSection.js';
import { Footer } from '../components/Footer.js';

// Modals
import { ProjectDetailModal } from '../components/ProjectDetailModal.js';
import { CertificateDetailModal } from '../components/CertificateDetailModal.js';
import { BlogReaderModal } from '../components/BlogReaderModal.js';
import { GlobalSearchModal } from '../components/GlobalSearchModal.js';
import { AdminLoginModal } from '../components/admin/AdminLoginModal.js';
import { AdminDashboard } from '../components/admin/AdminDashboard.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';

export const HomePage: React.FC = () => {
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

  // Global Keyboard shortcut (Cmd/Ctrl + K)
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
    return <LoadingSpinner fullScreen message="Initializing Sajjad Sahar Portfolio..." />;
  }

  if (viewMode === 'admin' && isAuthenticated) {
    return (
      <AdminDashboard
        portfolioData={data}
        onRefreshData={loadData}
        onExitAdmin={() => setViewMode('public')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100 transition-colors selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation */}
      <Navbar
        profile={data.profile}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection
          profile={data.profile}
          onOpenAdmin={handleOpenAdmin}
        />

        <AboutSection profile={data.profile} experience={data.experience || []} />

        <SkillsSection 
          skills={data.skills || []} 
          projects={data.projects || []}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        <ProjectsSection
          projects={data.projects || []}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        <CertificatesSection
          certificates={data.certificates || []}
          onSelectCertificate={(c) => setSelectedCertificate(c)}
        />

        <ExperienceSection experience={data.experience || []} />

        <AchievementsSection achievements={data.achievements || []} />

        <GitHubSection githubUsername={data.profile?.socialLinks?.github ? data.profile.socialLinks.github.split('/').pop() : 'sajjadsahar'} />

        <BlogSection
          blogs={(data.blogs || []).filter(b => b.published)}
          onSelectBlog={(b) => setSelectedBlog(b)}
        />

        <ResumeSection
          profile={data.profile}
          experience={data.experience || []}
          projects={data.projects || []}
          certificates={data.certificates || []}
          skills={data.skills || []}
        />

        <ContactSection profile={data.profile} />
      </main>

      {/* Footer */}
      <Footer
        profile={data.profile}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Modals */}
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

export default HomePage;
