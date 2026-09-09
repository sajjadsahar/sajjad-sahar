import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { Profile, Experience, Project, Certificate, Skill } from '../types.js';
import { getWhatsAppLink } from '../utils/social.js';

interface ResumeSectionProps {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  profile,
  experience,
  projects,
  certificates,
  skills
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="resume" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Professional Resume &amp; Profile
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            A comprehensive, verified summary of academic credentials, engineering proficiencies, and production projects.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                download="Sajjad_Sahar_Resume.pdf"
                id="btn-download-resume-pdf"
                className="px-6 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF CV</span>
              </a>
            )}

            <button
              onClick={handlePrint}
              id="btn-print-resume"
              className="px-4 py-2.5 rounded-md bg-white dark:bg-[#0b0f19] hover:border-cyan-500/50 text-slate-700 dark:text-slate-200 font-mono uppercase tracking-wider text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm font-medium"
            >
              <Printer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Live Resume Document Card */}
        <div 
          id="printable-resume-card"
          className="max-w-4xl mx-auto bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8"
        >
          {/* Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm mt-0.5 font-semibold">
                {profile.title}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <a href={`mailto:${profile.socialLinks.email || '65441@students.riphah.edu.pk'}`} className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                  {profile.socialLinks.email || '65441@students.riphah.edu.pk'}
                </a>
              </div>
              {profile.socialLinks.whatsapp && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <a 
                    href={getWhatsAppLink(profile.socialLinks.whatsapp)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors underline decoration-dotted"
                    title="Chat on WhatsApp"
                  >
                    {profile.socialLinks.whatsapp}
                  </a>
                </div>
              )}
              {profile.socialLinks.github && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                    {profile.socialLinks.github.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 font-bold">
              <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Education</span>
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                  {profile.university}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {profile.program} ({profile.currentSemester})
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded sm:self-start font-bold">
                CGPA: {profile.cgpa} / 4.0
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Coursework: Data Structures &amp; Algorithms, Object Oriented Programming (Java, C++), Database Management Systems, Operating Systems, Software Requirements Engineering.
            </p>
          </div>

          {/* Core Technical Proficiencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 font-bold">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Technical Skills</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-slate-900 dark:text-white font-mono">Web &amp; MERN: </span>
                <span className="text-slate-600 dark:text-slate-300">React.js, Node.js, Express.js, MongoDB, JavaScript (ES6+), Tailwind CSS, Vite</span>
              </div>
              <div>
                <span className="font-medium text-slate-900 dark:text-white font-mono">Programming &amp; Systems: </span>
                <span className="text-slate-600 dark:text-slate-300">Java (OOP), C++ (Data Structures &amp; Dynamic Memory), Python, SQL</span>
              </div>
              <div>
                <span className="font-medium text-slate-900 dark:text-white font-mono">Artificial Intelligence: </span>
                <span className="text-slate-600 dark:text-slate-300">Machine Learning, Neural Networks, NLP, Generative AI SDKs</span>
              </div>
              <div>
                <span className="font-medium text-slate-900 dark:text-white font-mono">Tools &amp; DevOps: </span>
                <span className="text-slate-600 dark:text-slate-300">Git, GitHub, REST APIs, Postman, Linux Terminal, JWT Authentication</span>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 font-bold">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Selected Engineering Projects</span>
            </h3>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {p.title}
                    </span>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 font-semibold">{p.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {p.description}
                  </p>
                  <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                    Tech: {p.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Certifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 font-bold">
              <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Certifications &amp; Credentials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certificates.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-slate-700/70">
                  <div className="font-semibold text-slate-900 dark:text-white">{c.title}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                    {c.issuingOrganization} • ID: {c.certificateId} • {c.issueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
