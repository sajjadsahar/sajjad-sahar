import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Download, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Clock, 
  FileText,
  KeyRound,
  Tag,
  Info
} from 'lucide-react';
import { Certificate } from '../types.js';
import { OrganizationLogo } from './OrganizationLogo.js';

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({ certificate, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (certificate) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const copyId = () => {
    navigator.clipboard.writeText(certificate.certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const docUrl = certificate.certificateDocument?.url || certificate.fileUrl || '';
  const isPdf = certificate.fileType === 'pdf' || 
    certificate.certificateDocument?.fileType === 'pdf' || 
    (docUrl && docUrl.toLowerCase().includes('.pdf')) ||
    (docUrl && docUrl.startsWith('data:application/pdf'));

  return (
    <div 
      id="certificate-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="certificate-detail-card"
        className="w-full max-w-4xl bg-[#0b0f19] border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#060810] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                <span>Verified Credential</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{certificate.issuingOrganization}</span>
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg line-clamp-1">
                {certificate.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              id="btn-close-certificate-modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Document Preview (Image or PDF frame) */}
          <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-[#060810] flex items-center justify-center relative min-h-[260px] sm:min-h-[360px] shadow-inner">
            {isPdf ? (
              <div className="w-full h-96 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <FileText className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">{certificate.title} (PDF)</h4>
                  <p className="text-xs text-slate-300 mt-1">Official Portable Document Format</p>
                </div>
                {docUrl && (
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Full PDF in New Tab</span>
                  </a>
                )}
              </div>
            ) : (
              <img
                src={docUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'}
                alt={certificate.title}
                referrerPolicy="no-referrer"
                className="max-h-[460px] w-auto object-contain mx-auto"
              />
            )}

            {/* Authenticity Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-cyan-950/90 backdrop-blur-md border border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verified Certificate</span>
            </div>
          </div>

          {/* Key Credential Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Issuing Organization */}
            <div className="p-4 rounded-xl bg-[#060810] border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <OrganizationLogo organization={certificate.issuingOrganization} className="w-3.5 h-3.5" />
                <span>Issuing Organization</span>
              </span>
              <span className="font-bold text-white text-sm">
                {certificate.issuingOrganization}
              </span>
            </div>

            {/* Issue Date */}
            <div className="p-4 rounded-xl bg-[#060810] border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Issue Date</span>
              </span>
              <span className="font-bold text-white text-sm">
                {certificate.issueDate}
              </span>
            </div>

            {/* Expiration Status */}
            <div className="p-4 rounded-xl bg-[#060810] border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Expiration Status</span>
              </span>
              <span className="font-bold text-slate-200 text-sm">
                {certificate.expiryDate || 'No Expiration'}
              </span>
            </div>

            {/* Category */}
            <div className="p-4 rounded-xl bg-[#060810] border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Category</span>
              </span>
              <span className="font-semibold text-cyan-300 text-xs line-clamp-1" title={certificate.category}>
                {certificate.category}
              </span>
            </div>

          </div>

          {/* Credential ID Card with Copy Feature */}
          <div className="p-4 rounded-xl bg-[#060810] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Official Credential ID</span>
              </span>
              <div className="font-mono font-bold text-cyan-300 text-sm sm:text-base break-all select-all">
                {certificate.certificateId}
              </div>
            </div>
            <button
              onClick={copyId}
              id="btn-copy-credential-id"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors self-start sm:self-center shrink-0"
              title="Copy Credential ID to clipboard"
            >
              {copiedId ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {certificate.description && (
            <div className="space-y-2 p-4 rounded-xl bg-[#060810] border border-slate-800">
              <h4 className="text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Certificate Overview &amp; Curriculum Scope</span>
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {certificate.description}
              </p>
            </div>
          )}

          {/* Skills Covered Pills */}
          {certificate.skillsCovered && certificate.skillsCovered.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                Competencies &amp; Skills Validated
              </h4>
              <div className="flex flex-wrap gap-2">
                {certificate.skillsCovered.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-[#060810] border border-slate-700 text-slate-200 font-mono text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-[#060810] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Category: <span className="text-slate-200 font-semibold">{certificate.category}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Verification button or "Verification link not available" */}
            {certificate.verificationUrl ? (
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noreferrer"
                id="btn-verify-certificate-modal"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify on Issuing Portal</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            ) : (
              <div 
                id="verification-link-status"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-slate-700 text-slate-300 font-mono text-xs"
                title="Direct verification link not published by issuing organization"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verification link not available</span>
              </div>
            )}

            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                download
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isPdf ? 'Download PDF' : 'Download Document'}</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
