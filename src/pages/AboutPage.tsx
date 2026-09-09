import React, { useEffect, useState } from 'react';
import { AboutSection } from '../components/AboutSection.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { Profile, Experience } from '../types.js';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData()
      .then(res => {
        setProfile(res.data.profile);
        setExperience(res.data.experience || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100">
      <Navbar profile={profile} onOpenSearch={() => {}} onOpenAdmin={() => {}} />
      <main className="pt-20">
        <AboutSection profile={profile} experience={experience} />
      </main>
      <Footer profile={profile} onOpenAdmin={() => {}} />
    </div>
  );
};

export default AboutPage;
