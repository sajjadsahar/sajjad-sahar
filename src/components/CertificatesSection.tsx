import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  SlidersHorizontal
} from 'lucide-react';
import { Certificate } from '../types.js';
import { CertificateCard } from './CertificateCard.js';

interface CertificatesSectionProps {
  certificates: Certificate[];
  onSelectCertificate: (c: Certificate) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ 
  certificates, 
  onSelectCertificate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Certificates');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'oldest' | 'organization' | 'name'>('featured');

  const filterCategories = [
    'All Certificates',
    'Artificial Intelligence',
    'Generative AI',
    'Data Science',
    'Programming',
    'Cloud',
    'Web Development'
  ];

  const parseCertDate = (d: string) => {
    const ts = new Date(d).getTime();
    return isNaN(ts) ? 0 : ts;
  };

  const filteredCertificates = useMemo(() => {
    const list = (certificates || []).filter((cert) => {
      // Category filter matching
      const matchCat = (() => {
        if (selectedCategory === 'All Certificates' || selectedCategory === 'All') return true;
        const cat = (cert.category || '').toLowerCase();
        const filter = selectedCategory.toLowerCase();
        if (cat.includes(filter)) return true;
        if (filter === 'artificial intelligence' && (cat.includes('/ ai') || cat.includes('ai literacy') || cat.includes('generative ai'))) {
          return true;
        }
        return false;
      })();

      // Search matching (Title, Organization, Category, Credential ID)
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        (cert.title || '').toLowerCase().includes(q) ||
        (cert.issuingOrganization || '').toLowerCase().includes(q) ||
        (cert.category || '').toLowerCase().includes(q) ||
        (cert.certificateId || '').toLowerCase().includes(q) ||
        (cert.description || '').toLowerCase().includes(q) ||
        (cert.skillsCovered || []).some(s => (s || '').toLowerCase().includes(q));

      return matchCat && matchQuery;
    });

    // Sorting
    if (sortBy === 'newest') {
      list.sort((a, b) => parseCertDate(b.issueDate) - parseCertDate(a.issueDate));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => parseCertDate(a.issueDate) - parseCertDate(b.issueDate));
    } else if (sortBy === 'organization') {
      list.sort((a, b) => a.issuingOrganization.localeCompare(b.issuingOrganization));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [certificates, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="certificates" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Verified Credentials ({certificates.length})</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Certificates &amp; Credentials
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Verified professional credentials in Generative AI, Cloud Engineering, Data Science, and Modern Web Development.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {filterCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cert-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-md whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'bg-white dark:bg-[#0b0f19] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 font-medium shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, org, ID, category..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-white dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#060810] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md text-xs shrink-0 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Featured First</option>
                <option value="newest" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Newest First</option>
                <option value="oldest" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Oldest First</option>
                <option value="organization" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">By Organization</option>
                <option value="name" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Certificate Name</option>
              </select>
            </div>

          </div>

        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onSelectCertificate={onSelectCertificate}
            />
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-mono text-sm font-medium">
            No certificates found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

      </div>
    </section>
  );
};
