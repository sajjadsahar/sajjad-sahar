import React, { useEffect, useState } from 'react';
import { CertificatesSection } from '../components/CertificatesSection.js';
import { CertificateDetailModal } from '../components/CertificateDetailModal.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { Profile, Certificate } from '../types.js';

export const CertificatesPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData()
      .then(res => {
        setProfile(res.data.profile);
        setCertificates(res.data.certificates || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100">
      <Navbar profile={profile} onOpenSearch={() => {}} onOpenAdmin={() => {}} />
      <main className="pt-20">
        <CertificatesSection certificates={certificates} onSelectCertificate={setSelectedCert} />
      </main>
      <Footer profile={profile} onOpenAdmin={() => {}} />
      <CertificateDetailModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
};

export default CertificatesPage;
