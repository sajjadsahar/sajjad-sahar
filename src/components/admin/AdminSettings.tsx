import React, { useState } from 'react';
import { 
  Settings, 
  KeyRound, 
  Database, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Server, 
  ShieldAlert,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { updateAdminCredentials, resetDatabase } from '../../services/api.js';

interface AdminSettingsProps {
  onRefreshAll: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onRefreshAll }) => {
  const [formData, setFormData] = useState({
    username: 'sajjad',
    email: 'sajjad@example.com',
    currentPassword: '',
    newPassword: ''
  });
  const [savingCreds, setSavingCreds] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [credsSuccess, setCredsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      setError('Please provide your current password to make security changes.');
      return;
    }

    setSavingCreds(true);
    setError(null);
    setCredsSuccess(false);
    try {
      await updateAdminCredentials({
        username: formData.username,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined
      });
      setCredsSuccess(true);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setTimeout(() => setCredsSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials.');
    } finally {
      setSavingCreds(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all data back to Sajjad Sahar default showcase entries?')) return;
    setResetting(true);
    try {
      await resetDatabase();
      alert('Database successfully restored to default seed state!');
      onRefreshAll();
    } catch (err: any) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          <span>System Configuration &amp; Security</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Update admin authentication credentials, view deployment architecture, and manage database state
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Credentials Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Admin Authentication Credentials
            </h3>
          </div>
          {credsSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Updated successfully
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateCreds} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Current Password *</label>
              <input
                type="password"
                required
                placeholder="Enter current password (demo: sajjad123)"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">New Password (leave empty to keep current)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingCreds}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            {savingCreds ? 'Saving...' : 'Update Admin Credentials'}
          </button>
        </form>
      </div>

      {/* Production Deployment Architecture & MongoDB Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Server className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            MERN Production Architecture &amp; Deployment
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The backend runs a unified Express.js engine with RESTful endpoints (`/api/projects`, `/api/certificates`, `/api/skills`, `/api/blogs`, `/api/contact`, `/api/auth`).
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2">
          <div className="text-emerald-400 font-semibold">// Environment Variables configured in .env.example</div>
          <div>PORT=3000</div>
          <div>JWT_SECRET=sajjad_sahar_mern_portfolio_secret_key_2025</div>
          <div>MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/portfolio</div>
          <div>CLOUDINARY_CLOUD_NAME=demo_cloud</div>
          <div>GEMINI_API_KEY=&lt;configured_server_side&gt;</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Vercel Deployment (Frontend &amp; Serverless):</span>
            <span className="text-slate-500 dark:text-slate-400">Run `npm run build` with Output Directory set to `dist`.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Render / Railway Deployment:</span>
            <span className="text-slate-500 dark:text-slate-400">Build: `npm run build`, Start: `npm run start` (spins up node dist/server.cjs on port 3000).</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Database */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-sm text-red-900 dark:text-red-300">
            Database Seed Reset
          </h3>
        </div>
        <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
          Restore all certificates, projects, skills, and about data back to Sajjad Sahar&apos;s default state. Useful for resetting test changes.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          disabled={resetting}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Restoring...' : 'Restore Default Seed Data'}</span>
        </button>
      </div>

    </div>
  );
};
