import React, { useEffect, useState } from 'react';
import { ProjectsSection } from '../components/ProjectsSection.js';
import { ProjectDetailModal } from '../components/ProjectDetailModal.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { Profile, Project } from '../types.js';

export const ProjectsPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData()
      .then(res => {
        setProfile(res.data.profile);
        setProjects(res.data.projects || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100">
      <Navbar profile={profile} onOpenSearch={() => {}} onOpenAdmin={() => {}} />
      <main className="pt-20">
        <ProjectsSection projects={projects} onSelectProject={setSelectedProject} />
      </main>
      <Footer profile={profile} onOpenAdmin={() => {}} />
      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default ProjectsPage;
