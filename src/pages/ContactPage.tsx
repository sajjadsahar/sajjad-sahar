import React, { useEffect, useState } from 'react';
import { ContactSection } from '../components/ContactSection.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { Profile } from '../types.js';

export const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData()
      .then(res => setProfile(res.data.profile))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100">
      <Navbar profile={profile} onOpenSearch={() => {}} onOpenAdmin={() => {}} />
      <main className="pt-20">
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} onOpenAdmin={() => {}} />
    </div>
  );
};

export default ContactPage;
