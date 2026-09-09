import React from 'react';
import { Github, Linkedin, Mail, MessageCircle, Globe } from 'lucide-react';
import { SocialLinks as SocialLinksType } from '../types.js';

interface SocialLinksProps {
  links?: SocialLinksType;
  className?: string;
  variant?: 'pills' | 'icons' | 'compact';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = '',
  variant = 'icons'
}) => {
  if (!links) return null;

  const socialItems = [
    {
      name: 'GitHub',
      url: links.github,
      icon: Github,
      color: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400'
    },
    {
      name: 'LinkedIn',
      url: links.linkedin,
      icon: Linkedin,
      color: 'hover:text-cyan-500 hover:border-cyan-400'
    },
    {
      name: 'Email',
      url: links.email ? `mailto:${links.email}` : undefined,
      icon: Mail,
      color: 'hover:text-emerald-500 hover:border-emerald-400'
    },
    {
      name: 'WhatsApp',
      url: links.whatsapp ? `https://wa.me/${links.whatsapp.replace(/[^0-9]/g, '')}` : undefined,
      icon: MessageCircle,
      color: 'hover:text-green-500 hover:border-green-400'
    }
  ].filter(item => Boolean(item.url));

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {socialItems.map(item => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              id={`social-link-${item.name.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-all shadow-sm ${item.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialItems.map(item => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            id={`social-icon-${item.name.toLowerCase()}`}
            className={`p-2 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 transition-all shadow-sm ${item.color}`}
            title={item.name}
            aria-label={item.name}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
