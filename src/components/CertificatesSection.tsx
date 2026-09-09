import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Eye, 
  SlidersHorizontal,
  Calendar,
  Clock,
  KeyRound
} from 'lucide-react';
import { Certificate } from '../types.js';
import { OrganizationLogo } from './OrganizationLogo.js';

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
            <div
              key={cert.id}
              id={`certificate-card-${cert.id}`}
              className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Certificate Thumbnail Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#060810] border-b border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <img
                    src={cert.fileUrl}
                    alt={cert.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 max-w-[65%]">
                    <span className="px-2.5 py-1 rounded bg-[#04060a]/90 backdrop-blur-md border border-slate-700 text-slate-200 font-mono text-[10px] uppercase tracking-wider font-semibold line-clamp-1">
                      {cert.category}
                    </span>
                  </div>

                  {/* Authenticity & Featured Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {cert.featured && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/90 text-slate-950 border border-cyan-400 font-mono text-[10px] flex items-center gap-1 font-bold shadow-sm">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-[10px] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" /> Verified
                    </span>
                  </div>

                  {/* Organization Logo & Expiry bottom overlay on image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
                    <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/80">
                      <OrganizationLogo organization={cert.issuingOrganization} className="w-3.5 h-3.5" />
                      <span className="font-semibold text-white">{cert.issuingOrganization}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700/80 text-slate-300 text-[10px]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{cert.expiryDate || 'No Expiration'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  {/* Issue Date & Org */}
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Issued: {cert.issueDate}</span>
                    </span>
                  </div>

                  {/* Full Certificate Title */}
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                    {cert.title}
                  </h3>

                  {/* Credential ID */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="text-[11px]">ID:</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[210px]" title={cert.certificateId}>
                      {cert.certificateId}
                    </span>
                  </div>

                  {/* Skills preview tags */}
                  {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {cert.skillsCovered.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skillsCovered.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                          +{cert.skillsCovered.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <button
                  onClick={() => onSelectCertificate(cert)}
                  id={`btn-view-cert-${cert.id}`}
                  className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-700 dark:text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    id={`btn-verify-link-${cert.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white dark:bg-[#060810] hover:border-cyan-400 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 font-mono text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                    title="Open official verification portal"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                    Verified Credential
                  </span>
                )}
              </div>
            </div>
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
