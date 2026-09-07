import React, { useState, useMemo } from 'react';
import { 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  Eye, 
  SlidersHorizontal,
  Building2,
  FileCheck
} from 'lucide-react';
import { Certificate, CertificateCategory } from '../types.js';

interface CertificatesSectionProps {
  certificates: Certificate[];
  onSelectCertificate: (c: Certificate) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ 
  certificates, 
  onSelectCertificate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'organization' | 'featured'>('featured');

  const categories = [
    'All',
    'Web Development',
    'Programming',
    'AI / Machine Learning',
    'Database',
    'Cybersecurity',
    'Cloud'
  ];

  const filteredCertificates = useMemo(() => {
    let list = (certificates || []).filter((cert) => {
      const matchCat = selectedCategory === 'All' || (cert.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchQuery = !q ||
        (cert.title || '').toLowerCase().includes(q) ||
        (cert.issuingOrganization || '').toLowerCase().includes(q) ||
        (cert.certificateId || '').toLowerCase().includes(q) ||
        (cert.skillsCovered || []).some(s => (s || '').toLowerCase().includes(q));

      return matchCat && matchQuery;
    });

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
    } else if (sortBy === 'organization') {
      list.sort((a, b) => a.issuingOrganization.localeCompare(b.issuingOrganization));
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b0f19] border border-slate-700/80 text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificates &amp; Specializations
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal">
            Globally recognized professional credentials validating industry-standard expertise in Full-Stack development, AI/ML, and system architecture.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cert-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-md whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                      : 'bg-[#0b0f19] text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400 font-medium'
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
                placeholder="Search certificates or ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-[#060810] border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#060810] border border-slate-700 px-3 py-1.5 rounded-md text-xs shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#0b0f19] text-slate-200">Featured First</option>
                <option value="newest" className="bg-[#0b0f19] text-slate-200">Newest First</option>
                <option value="oldest" className="bg-[#0b0f19] text-slate-200">Oldest First</option>
                <option value="organization" className="bg-[#0b0f19] text-slate-200">By Organization</option>
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
              className="group bg-[#0b0f19] border border-slate-700/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Certificate Thumbnail Header */}
                <div className="relative h-48 w-full overflow-hidden bg-[#060810] border-b border-slate-800 flex items-center justify-center">
                  <img
                    src={cert.fileUrl}
                    alt={cert.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#04060a]/80 backdrop-blur-md border border-slate-700 text-slate-200 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {cert.category}
                    </span>
                  </div>

                  {/* Authenticity Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {cert.featured && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" /> Core
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-[10px] flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{cert.issuingOrganization}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{cert.issueDate}</span>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h3>

                  <div className="text-xs text-slate-400 font-mono font-medium">
                    Credential ID: <span className="font-semibold text-slate-200">{cert.certificateId}</span>
                  </div>

                  {/* Skills tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {cert.skillsCovered.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-[#060810] border border-slate-700 text-slate-300 font-mono text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skillsCovered.length > 3 && (
                      <span className="px-2 py-0.5 rounded bg-[#060810] border border-slate-700 text-slate-400 font-mono text-[10px]">
                        +{cert.skillsCovered.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 border-t border-slate-800 mt-4 flex items-center justify-between">
                <button
                  onClick={() => onSelectCertificate(cert)}
                  id={`btn-view-cert-${cert.id}`}
                  className="text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 group/btn font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Credential</span>
                </button>

                {cert.verificationUrl && (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    id={`btn-verify-link-${cert.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#060810] hover:border-cyan-400 text-slate-200 hover:text-cyan-300 font-mono text-xs font-semibold transition-colors border border-slate-700"
                    title="Open official verification portal"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
