import React, { useState } from 'react';
import { 
  ArrowDown, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Facebook, 
  Phone, 
  Terminal, 
  Sparkles, 
  Code2, 
  GraduationCap, 
  Award,
  Layers,
  Cpu,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Profile } from '../types.js';
import { getWhatsAppLink, getFacebookUrl } from '../utils/social.js';
import sajjadPhoto from '../assets/images/sajjad_sahar_photo_1788856658150.jpg';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stack' | 'about'>('profile');

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.socialLinks.email || '65441@students.riphah.edu.pk');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section 
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden tech-grid dark:tech-grid"
    >
      {/* Subtle ambient cyan glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-900/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Personal Brand & Hook */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Elegant eyebrow divider line & category */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="h-px w-12 bg-cyan-500/50" />
              <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold">
                Full-Stack &amp; AI Engineer
              </span>
            </div>

            {/* Academic distinction pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-800 dark:text-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
              <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{profile.university} • {profile.currentSemester}</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold border-l border-slate-300 dark:border-slate-700 pl-2">
                CGPA {profile.cgpa}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {profile.name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                {profile.title}
              </p>
            </div>

            {/* Introduction statement */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              I&apos;m a Software Engineering student passionate about building modern web applications with the <span className="text-slate-900 dark:text-white border-b-2 border-cyan-500 dark:border-cyan-400 font-semibold">MERN stack</span> and exploring Artificial Intelligence to solve real-world problems.
            </p>

            {/* Core Mission Banner */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 max-w-2xl flex items-center gap-3.5 text-sm text-slate-700 dark:text-slate-200 hover:border-cyan-500/40 transition-all shadow-sm">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                &ldquo;I build modern software, learn emerging technologies, and solve real-world problems.&rdquo;
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#projects"
                id="cta-view-work"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3 rounded-md font-bold text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 group"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  download="Sajjad_Sahar_Resume.pdf"
                  id="cta-download-cv"
                  className="border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400/60 bg-white dark:bg-[#0b0f19] hover:bg-slate-50 dark:hover:bg-[#121828] text-slate-800 dark:text-slate-100 px-8 py-3 rounded-md font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Direct Download CV (PDF)"
                >
                  <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Download CV</span>
                </a>
              )}

              <a
                href="#contact"
                id="cta-contact-me"
                className="border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 px-6 py-3 rounded-md font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links Row */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Connect:</span>
              <div className="flex items-center gap-2">
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="social-link-github"
                    className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
                    title="GitHub Profile"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="social-link-linkedin"
                    className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors shadow-sm"
                    title="LinkedIn Profile"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={getFacebookUrl(profile.socialLinks.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="social-link-facebook"
                  className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors shadow-sm"
                  title="Facebook Profile"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={getWhatsAppLink(profile.socialLinks.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="social-link-whatsapp"
                  className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors shadow-sm"
                  title="WhatsApp (03485039425)"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-4 h-4" />
                </a>
                {profile.socialLinks.email && (
                  <button
                    onClick={copyEmail}
                    id="btn-copy-hero-email"
                    className="p-2.5 rounded-lg bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors relative shadow-sm"
                    title="Copy Email"
                    aria-label="Copy Email"
                  >
                    {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Developer Terminal & Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Profile Card Header with Avatar */}
              <div className="bg-[#0b0f19] backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden hover:border-cyan-500/40 transition-all">
                
                {/* Terminal Window Top Bar */}
                <div className="px-4 py-3 bg-[#070a12] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      sajjad-sahar@engine ~ zsh
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded font-semibold">
                    Active
                  </div>
                </div>

                {/* Profile Avatar & Mini Bio Header */}
                <div className="p-5 flex items-center gap-4 border-b border-slate-800 bg-[#080c16]">
                  <div className="relative shrink-0">
                    <img
                      src={
                        profile.avatarUrl && !profile.avatarUrl.includes('photo-1534528741775-53994a69daeb')
                          ? profile.avatarUrl
                          : sajjadPhoto
                      }
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover ring-1 ring-cyan-500/40 shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-cyan-400 ring-2 ring-[#04060a]" title="Online & Coding" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono font-medium">
                      BS Software Engineering @ Riphah
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">
                      Islamabad • CGPA 3.98 / 4.0
                    </p>
                  </div>
                </div>

                {/* Code / Interactive Terminal Content */}
                <div className="p-5 font-mono text-xs text-slate-200 space-y-3 bg-[#060810]">
                  <div className="text-slate-400">
                    <span className="text-cyan-400 font-bold">$</span> cat developer_manifest.json
                  </div>
                  
                  <div className="p-3.5 rounded-xl bg-[#030408] text-slate-100 overflow-x-auto border border-slate-800 space-y-1">
                    <div><span className="text-cyan-400">&quot;engineer&quot;</span>: <span className="text-emerald-400">&quot;Sajjad Sahar&quot;</span>,</div>
                    <div><span className="text-cyan-400">&quot;stack&quot;</span>: [<span className="text-slate-200">&quot;MongoDB&quot;</span>, <span className="text-slate-200">&quot;Express&quot;</span>, <span className="text-slate-200">&quot;React&quot;</span>, <span className="text-slate-200">&quot;Node.js&quot;</span>],</div>
                    <div><span className="text-cyan-400">&quot;systems&quot;</span>: [<span className="text-slate-200">&quot;Java (OOP)&quot;</span>, <span className="text-slate-200">&quot;C++ (DSA)&quot;</span>, <span className="text-slate-200">&quot;SQL&quot;</span>],</div>
                    <div><span className="text-cyan-400">&quot;aiFocus&quot;</span>: [<span className="text-slate-200">&quot;Machine Learning&quot;</span>, <span className="text-slate-200">&quot;NLP&quot;</span>, <span className="text-slate-200">&quot;LLMs&quot;</span>],</div>
                    <div><span className="text-cyan-400">&quot;cgpa&quot;</span>: <span className="text-cyan-300 font-bold">3.98</span>
                  </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2.5 rounded-xl bg-[#0b0e1a] border border-slate-800">
                      <div className="font-bold text-sm text-cyan-400 font-mono">3.98</div>
                      <div className="text-[10px] text-slate-300 uppercase font-mono tracking-wider font-semibold">CGPA</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b0e1a] border border-slate-800">
                      <div className="font-bold text-sm text-cyan-400 font-mono">5th</div>
                      <div className="text-[10px] text-slate-300 uppercase font-mono tracking-wider font-semibold">Semester</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b0e1a] border border-slate-800">
                      <div className="font-bold text-sm text-emerald-400 font-mono">Top 1%</div>
                      <div className="text-[10px] text-slate-300 uppercase font-mono tracking-wider font-semibold">Merit</div>
                    </div>
                  </div>

                </div>

                {/* Card footer badges */}
                <div className="px-5 py-3 bg-[#070a12] border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    Full-Stack &amp; AI Architect
                  </span>
                  <a 
                    href="#skills" 
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>View Stack</span>
                    <ArrowDown className="w-3 h-3" />
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
