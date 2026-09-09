import React from 'react';
import { Building2, Cloud, Sparkles, Code2, ShieldCheck, GraduationCap } from 'lucide-react';

interface OrganizationLogoProps {
  organization: string;
  className?: string;
  showName?: boolean;
}

export const OrganizationLogo: React.FC<OrganizationLogoProps> = ({ 
  organization, 
  className = 'w-4 h-4',
  showName = false
}) => {
  const orgLower = (organization || '').toLowerCase().trim();

  const renderIcon = () => {
    if (orgLower === 'google') {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="Google">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    }

    if (orgLower.includes('google cloud')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="Google Cloud">
          <path fill="#4285F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
        </svg>
      );
    }

    if (orgLower === 'cisco') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-cyan-400`} aria-label="Cisco">
          <rect x="2" y="10" width="1.8" height="6" rx="0.9" />
          <rect x="5.5" y="7" width="1.8" height="9" rx="0.9" />
          <rect x="9" y="4" width="1.8" height="12" rx="0.9" />
          <rect x="13.2" y="4" width="1.8" height="12" rx="0.9" />
          <rect x="16.7" y="7" width="1.8" height="9" rx="0.9" />
          <rect x="20.2" y="10" width="1.8" height="6" rx="0.9" />
        </svg>
      );
    }

    if (orgLower === 'anthropic') {
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] p-0.5">
          <Sparkles className={className} />
        </span>
      );
    }

    if (orgLower.includes('apna college')) {
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-400 p-0.5">
          <GraduationCap className={className} />
        </span>
      );
    }

    return <Building2 className={`${className} text-cyan-400`} />;
  };

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      {renderIcon()}
      {showName && <span>{organization}</span>}
    </span>
  );
};
