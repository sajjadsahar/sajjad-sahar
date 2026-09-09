import React, { useState } from 'react';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Facebook, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  MessageCircle,
  MapPin,
  Clock,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Profile } from '../types.js';
import { 
  DEFAULT_FACEBOOK_URL, 
  DEFAULT_WHATSAPP_NUMBER, 
  getWhatsAppLink, 
  getFacebookUrl 
} from '../utils/social.js';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = profile?.socialLinks?.email || '65441@students.riphah.edu.pk';
  const whatsappNumber = profile?.socialLinks?.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const whatsappUrl = getWhatsAppLink(whatsappNumber);
  const facebookUrl = getFacebookUrl(profile?.socialLinks?.facebook);
  const linkedinUrl = profile?.socialLinks?.linkedin || 'https://linkedin.com/in/sajjadsahar';
  const githubUrl = profile?.socialLinks?.github || `https://github.com/${profile?.githubUsername || 'sajjadsahar'}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const contactMethods = [
    {
      id: 'contact-whatsapp',
      name: 'WhatsApp Direct',
      label: 'Fastest Response',
      value: whatsappNumber,
      description: 'Ideal for immediate project discussions, internships, or quick queries.',
      href: whatsappUrl,
      actionText: 'Chat on WhatsApp',
      isPrimary: true,
      icon: (
        <svg className="w-6 h-6 fill-current text-emerald-400" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'contact-email',
      name: 'Official Email',
      label: 'Direct Inquiries',
      value: emailAddress,
      description: 'Send project proposals, employment opportunities, and formal correspondence.',
      href: `mailto:${emailAddress}`,
      actionText: 'Send Email',
      copyAction: true,
      icon: <Mail className="w-6 h-6 text-cyan-400" />,
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'contact-linkedin',
      name: 'LinkedIn',
      label: 'Professional Profile',
      value: 'sajjadsahar',
      description: 'Connect to view academic credentials, recommendations, and trajectory.',
      href: linkedinUrl,
      actionText: 'Connect on LinkedIn',
      icon: <Linkedin className="w-6 h-6 text-sky-400" />,
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
    },
    {
      id: 'contact-facebook',
      name: 'Facebook',
      label: 'Social Profile',
      value: 'sajjad.sahar.942',
      description: 'Personal social profile for community discussions and public posts.',
      href: facebookUrl,
      actionText: 'Visit Facebook Profile',
      icon: <Facebook className="w-6 h-6 text-blue-400" />,
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    },
    {
      id: 'contact-github',
      name: 'GitHub',
      label: 'Open Source',
      value: profile?.githubUsername || 'sajjadsahar',
      description: 'Explore full-stack repositories, code architectures, and commits.',
      href: githubUrl,
      actionText: 'Explore GitHub Profile',
      icon: <Github className="w-6 h-6 text-slate-200" />,
      badgeColor: 'bg-slate-700/50 text-slate-200 border-slate-600'
    }
  ];

  return (
    <section id="contact" className="py-24 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Direct Channels</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let&apos;s Connect
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Have a project idea, collaboration opportunity, internship opportunity, or simply want to connect? Feel free to reach out.
          </p>
        </motion.div>

        {/* Featured WhatsApp Direct Hero Card - Easy to find & instant connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-emerald-50/80 dark:bg-gradient-to-r dark:from-[#06241a] dark:via-[#0b1924] dark:to-[#0b0f19] border-2 border-emerald-500/40 dark:border-emerald-500/50 p-6 sm:p-8 shadow-xl shadow-emerald-500/5 dark:shadow-emerald-950/20 group hover:border-emerald-500 transition-all">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-white dark:bg-emerald-500/20 border border-emerald-400/40 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                      Direct WhatsApp
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {whatsappNumber}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-normal">
                    Click below to initiate a WhatsApp conversation immediately. Pre-formatted with a project inquiry.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <a
                  id="btn-whatsapp-hero-cta"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 text-white dark:text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 dark:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Start WhatsApp Chat</span>
                  <ExternalLink className="w-4 h-4 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 p-6 flex flex-col justify-between shadow-sm transition-all group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border font-semibold ${item.badgeColor}`}>
                    {item.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-mono text-cyan-600 dark:text-cyan-400 font-semibold truncate">
                    {item.value}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  id={`btn-contact-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#060810] hover:bg-cyan-500 hover:text-slate-950 dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm"
                >
                  <span>{item.actionText}</span>
                  {!item.href.startsWith('mailto:') && <ExternalLink className="w-3.5 h-3.5" />}
                </a>

                {item.copyAction && (
                  <button
                    onClick={copyEmail}
                    id="btn-copy-contact-email"
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#060810] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 shadow-sm"
                    title="Copy Email Address"
                    aria-label="Copy Email Address"
                  >
                    {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {/* Location & Availability Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.4 }}
            className="rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 p-6 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-semibold">
                  Location &amp; Status
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Base &amp; Timezone
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
                  Based in <strong className="text-slate-900 dark:text-white font-semibold">Islamabad, Pakistan</strong> (PKT / UTC+5). Open to global remote roles and on-site opportunities.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Typical response time: &lt; 12 hours</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Status: Open for Full-Stack &amp; AI Roles</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Student at Riphah International University</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
