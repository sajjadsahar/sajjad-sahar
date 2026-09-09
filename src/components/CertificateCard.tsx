import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  KeyRound, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { Certificate } from '../types.js';
import { OrganizationLogo } from './OrganizationLogo.js';

interface CertificateCardProps {
  certificate: Certificate;
  onSelectCertificate: (c: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onSelectCertificate }) => {
  return (
    <div
      id={`certificate-card-${certificate.id}`}
      className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between"
    >
      <div>
        {/* Certificate Thumbnail Header */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#060810] border-b border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <img
            src={certificate.fileUrl}
            alt={certificate.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          
          {/* Category Pill */}
          <div className="absolute top-3 left-3 max-w-[65%]">
            <span className="px-2.5 py-1 rounded bg-[#04060a]/90 backdrop-blur-md border border-slate-700 text-slate-200 font-mono text-[10px] uppercase tracking-wider font-semibold line-clamp-1">
              {certificate.category}
            </span>
          </div>

          {/* Authenticity & Featured Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {certificate.featured && (
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
              <OrganizationLogo organization={certificate.issuingOrganization} className="w-3.5 h-3.5" />
              <span className="font-semibold text-white">{certificate.issuingOrganization}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-md border border-slate-700/80 text-slate-300 text-[10px]">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{certificate.expiryDate || 'No Expiration'}</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3">
          {/* Issue Date & Org */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Issued: {certificate.issueDate}</span>
            </span>
          </div>

          {/* Full Certificate Title */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
            {certificate.title}
          </h3>

          {/* Credential ID */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <KeyRound className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="text-[11px]">ID:</span>
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[210px]" title={certificate.certificateId}>
              {certificate.certificateId}
            </span>
          </div>

          {/* Skills preview tags */}
          {certificate.skillsCovered && certificate.skillsCovered.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {certificate.skillsCovered.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-medium"
                >
                  {skill}
                </span>
              ))}
              {certificate.skillsCovered.length > 3 && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                  +{certificate.skillsCovered.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
        <button
          onClick={() => onSelectCertificate(certificate)}
          id={`btn-view-cert-${certificate.id}`}
          className="px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-700 dark:text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold transition-all shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        {certificate.verificationUrl ? (
          <a
            href={certificate.verificationUrl}
            target="_blank"
            rel="noreferrer"
            id={`btn-verify-link-${certificate.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white dark:bg-[#060810] hover:border-cyan-400 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 font-mono text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Open official verification portal"
          >
            <span>Verify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[11px] font-mono text-slate-400 italic">
            Institutional Verification
          </span>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
