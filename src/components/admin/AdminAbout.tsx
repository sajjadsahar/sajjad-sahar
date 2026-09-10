import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Save, 
  GraduationCap, 
  Globe, 
  FileText,
  ExternalLink 
} from 'lucide-react';
import { Profile } from '../../types.js';
import { updateProfile, enhanceAIText } from '../../services/api.js';
import { DEFAULT_FACEBOOK_URL, DEFAULT_WHATSAPP_NUMBER, getWhatsAppLink } from '../../utils/social.js';

interface AdminAboutProps {
  profile: Profile;
  onRefresh: () => void;
}

export const AdminAbout: React.FC<AdminAboutProps> = ({ profile, onRefresh }) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAIBioAssist = async () => {
    setEnhancing(true);
    try {
      const prompt = `Rewrite and polish this developer bio for Sajjad Sahar (BS Software Engineering at Riphah International University, CGPA 3.98, specializing in MERN stack, AI/ML, and object-oriented systems in Java and C++): "${formData.bio}". Make it punchy, technical, and compelling.`;
      const res = await enhanceAIText(prompt, 'bio');
      if (res.text) {
        setFormData(prev => ({ ...prev, bio: res.text }));
      }
    } catch (err: any) {
      alert('AI assistant unavailable: ' + err.message);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            <span>Edit Profile &amp; Bio Content</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Modify personal bio, academic standing, social handles, and resume URL
          </p>
        </div>

        {success && (
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-500" />
            Profile Saved!
          </span>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
        
        {/* Core Identity */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Personal &amp; Academic Credentials
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Professional Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">University</label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Academic Program</label>
              <input
                type="text"
                required
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Current Semester</label>
              <input
                type="text"
                required
                value={formData.currentSemester}
                onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Bio & Philosophy */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Narrative &amp; Engineering Philosophy
          </h3>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Quick Bio Summary</label>
              <button
                type="button"
                onClick={handleAIBioAssist}
                disabled={enhancing}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>{enhancing ? 'AI Polishing...' : 'AI Rephrase Bio'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Detailed About Me (Story &amp; Drive)</label>
            <textarea
              rows={4}
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Engineering Philosophy</label>
              <textarea
                rows={3}
                value={formData.philosophy}
                onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Short &amp; Long-Term Goals</label>
              <textarea
                rows={3}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links & Resume URL */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Social Links &amp; Resume PDF
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Official Student Email</label>
              <input
                type="email"
                value={formData.socialLinks.email || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, email: e.target.value } 
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.socialLinks.github || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, github: e.target.value } 
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Facebook Profile URL</label>
              <input
                type="text"
                value={formData.socialLinks.facebook || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                })}
                placeholder={DEFAULT_FACEBOOK_URL}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Default: <span className="font-mono text-cyan-600 dark:text-cyan-400">{DEFAULT_FACEBOOK_URL}</span>
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">WhatsApp Contact Number</label>
              <input
                type="text"
                value={formData.socialLinks.whatsapp || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, whatsapp: e.target.value } 
                })}
                placeholder={DEFAULT_WHATSAPP_NUMBER}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  International Wa.me URL:{' '}
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {getWhatsAppLink(formData.socialLinks.whatsapp || DEFAULT_WHATSAPP_NUMBER).split('?')[0]}
                  </span>
                </span>
                <a
                  href={getWhatsAppLink(formData.socialLinks.whatsapp || DEFAULT_WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Profile Photo URL / Path</label>
              <div className="flex items-center gap-3">
                <img
                  src={formData.avatarUrl || '/sajjad_photo.jpg'}
                  alt="Profile Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="/sajjad_photo.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Resume / CV Download Link</label>
              <input
                type="text"
                value={formData.resumeUrl || ''}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://example.com/Sajjad_Sahar_Resume.pdf"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
