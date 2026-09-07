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
    <section id="resume" className="py-20 relative bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 text-xs font-mono uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Professional Resume &amp; Profile
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
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
                className="px-6 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF CV</span>
              </a>
            )}

            <button
              onClick={handlePrint}
              id="btn-print-resume"
              className="px-4 py-2.5 rounded-md bg-white/[0.03] hover:border-cyan-500/30 text-gray-300 font-mono uppercase tracking-wider text-xs flex items-center gap-2 border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Live Resume Document Card */}
        <div 
          id="printable-resume-card"
          className="max-w-4xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-12 space-y-8"
        >
          {/* Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-cyan-400 font-mono text-sm mt-0.5">
                {profile.title}
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed">
                {profile.bio}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-gray-400 font-mono sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Islamabad, Pakistan</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{profile.socialLinks.email || '65441@students.riphah.edu.pk'}</span>
              </div>
              {profile.socialLinks.whatsapp && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.socialLinks.whatsapp}</span>
                </div>
              )}
              {profile.socialLinks.github && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.socialLinks.github.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Education</span>
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="font-semibold text-white text-base">
                  {profile.university}
                </h4>
                <p className="text-xs text-gray-400">
                  {profile.program} ({profile.currentSemester})
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded sm:self-start">
                CGPA: {profile.cgpa} / 4.0
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Coursework: Data Structures &amp; Algorithms, Object Oriented Programming (Java, C++), Database Management Systems, Operating Systems, Software Requirements Engineering.
            </p>
          </div>

          {/* Core Technical Proficiencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Technical Skills</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-white font-mono">Web &amp; MERN: </span>
                <span className="text-gray-400">React.js, Node.js, Express.js, MongoDB, JavaScript (ES6+), Tailwind CSS, Vite</span>
              </div>
              <div>
                <span className="font-medium text-white font-mono">Programming &amp; Systems: </span>
                <span className="text-gray-400">Java (OOP), C++ (Data Structures &amp; Dynamic Memory), Python, SQL</span>
              </div>
              <div>
                <span className="font-medium text-white font-mono">Artificial Intelligence: </span>
                <span className="text-gray-400">Machine Learning, Neural Networks, NLP, Generative AI SDKs</span>
              </div>
              <div>
                <span className="font-medium text-white font-mono">Tools &amp; DevOps: </span>
                <span className="text-gray-400">Git, GitHub, REST APIs, Postman, Linux Terminal, JWT Authentication</span>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Selected Engineering Projects</span>
            </h3>
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">
                      {p.title}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{p.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="text-[11px] font-mono text-cyan-400">
                    Tech: {p.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Certifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Certifications &amp; Credentials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certificates.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="font-medium text-white">{c.title}</div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {c.issuingOrganization} • ID: {c.certificateId}
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
