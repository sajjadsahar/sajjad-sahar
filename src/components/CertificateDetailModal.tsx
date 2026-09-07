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
  Eye, 
  Building2,
  FileText
} from 'lucide-react';
import { Certificate } from '../types.js';

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

  const isPdf = certificate.fileType === 'pdf' || certificate.fileUrl.endsWith('.pdf');

  return (
    <div 
      id="certificate-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="certificate-detail-card"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                Verified Credential
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                {certificate.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              id="btn-close-certificate-modal"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Document Preview (Image or PDF frame) */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center relative min-h-[280px] sm:min-h-[380px] shadow-inner">
            {isPdf ? (
              <div className="w-full h-96 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                <FileText className="w-16 h-16 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-lg">{certificate.title} (PDF)</h4>
                  <p className="text-xs text-slate-400 mt-1">Official Portable Document Format</p>
                </div>
                <a
                  href={certificate.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full PDF in New Tab</span>
                </a>
              </div>
            ) : (
              <img
                src={certificate.fileUrl}
                alt={certificate.title}
                referrerPolicy="no-referrer"
                className="max-h-[460px] w-auto object-contain mx-auto"
              />
            )}

            {/* Authenticity Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Certificate</span>
            </div>
          </div>

          {/* Key Credential Metadata Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                Issuing Organization
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {certificate.issuingOrganization}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Issue Date
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {certificate.issueDate} {certificate.expiryDate ? `(Exp: ${certificate.expiryDate})` : '• No Expiration'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1">
                  Credential ID
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                  {certificate.certificateId}
                </span>
              </div>
              <button
                onClick={copyId}
                className="p-2 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
                title="Copy Credential ID"
                aria-label="Copy Credential ID"
              >
                {copiedId ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Description */}
          {certificate.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Curriculum &amp; Program Scope
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {certificate.description}
              </p>
            </div>
          )}

          {/* Skills Covered Pills */}
          {certificate.skillsCovered && certificate.skillsCovered.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Competencies &amp; Skills Validated
              </h4>
              <div className="flex flex-wrap gap-2">
                {certificate.skillsCovered.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Category: {certificate.category}
          </div>

          <div className="flex items-center gap-3">
            {certificate.verificationUrl && (
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noreferrer"
                id="btn-verify-certificate-modal"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify on Issuing Portal</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            )}

            <a
              href={certificate.fileUrl}
              target="_blank"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
