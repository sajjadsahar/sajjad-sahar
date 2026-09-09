import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  User, 
  AlertCircle, 
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUsernameOrEmail('');
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(usernameOrEmail.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your login info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="admin-login-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="admin-login-card"
        className="w-full max-w-md bg-[#0b0f19] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Admin CMS Portal
              </h2>
              <p className="text-xs text-slate-300">
                Manage all portfolio content in real time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="off"
                name="admin_login_username"
                id="admin-username-input"
                spellCheck={false}
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#060810] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="new-password"
                name="admin_login_password"
                id="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#060810] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-submit-admin-login"
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
