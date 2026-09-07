import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Phone, 
  Linkedin, 
  Github, 
  Facebook, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  Copy
} from 'lucide-react';
import { Profile } from '../types.js';
import { sendContactMessage } from '../services/api.js';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendContactMessage(formData);
      setSuccessMessage(res.message || 'Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit your message. Please try again or reach out directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.socialLinks.email || '65441@students.riphah.edu.pk');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 text-xs font-mono uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Let&apos;s Build Something Impactful
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Have a project in mind, an internship opportunity, or want to collaborate on AI and Full-Stack systems? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-white">
                  Direct Contact Channels
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  I typically respond within 24 hours. Messages submitted here are stored directly in the database and monitored via the Admin CMS.
                </p>
              </div>

              {/* Direct Info Items */}
              <div className="space-y-4">
                
                {/* Email Item with 1-click copy */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-gray-400 font-medium tracking-wider">Official Email</div>
                      <a 
                        href={`mailto:${profile.socialLinks.email || '65441@students.riphah.edu.pk'}`} 
                        className="text-xs sm:text-sm font-mono text-white hover:text-cyan-400 transition-colors"
                      >
                        {profile.socialLinks.email || '65441@students.riphah.edu.pk'}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                    title="Copy Email"
                    aria-label="Copy Email"
                  >
                    {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp Item */}
                {profile.socialLinks.whatsapp && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-gray-400 font-medium tracking-wider">WhatsApp Direct</div>
                        <div className="text-xs sm:text-sm font-mono text-white">
                          {profile.socialLinks.whatsapp}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${profile.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono uppercase tracking-wider text-xs transition-colors"
                    >
                      Chat
                    </a>
                  </div>
                )}

              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <span className="text-xs font-mono uppercase tracking-[0.15em] text-gray-400 block">
                  Find Me Online:
                </span>
                <div className="flex items-center gap-3">
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/40 border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400 font-mono text-xs transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-cyan-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/40 border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400 font-mono text-xs transition-colors"
                    >
                      <Github className="w-4 h-4 text-gray-400" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.socialLinks.facebook && (
                    <a
                      href={profile.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/40 border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400 font-mono text-xs transition-colors"
                    >
                      <Facebook className="w-4 h-4 text-cyan-400" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Send a Direct Message
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Fill in your details below and your note will be delivered straight to Sajjad.
                </p>
              </div>

              {/* Feedback messages */}
              {successMessage && (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3 text-cyan-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-mono">Message Delivered!</p>
                    <p className="text-xs text-cyan-400/80 mt-0.5">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-mono">Submission Error</p>
                    <p className="text-xs text-red-400/80 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                      Your Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-500"
                    />
                  </div>

                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    Subject / Topic <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Full-Stack MERN Project Collaboration / Internship Inquiry"
                    className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-500"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    Message Details <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your note, project requirements, or question here..."
                    className="w-full px-4 py-2.5 rounded-md bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-500 resize-y"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  id="btn-submit-contact-form"
                  className="w-full py-3.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-mono uppercase tracking-wider text-xs shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message to Sajjad'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
