import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Award, 
  Upload, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Check, 
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Certificate } from '../../types.js';
import { createCertificate, updateCertificate, deleteCertificate, uploadAsset } from '../../services/api.js';

interface AdminCertificatesProps {
  certificates: Certificate[];
  onRefresh: () => void;
}

export const AdminCertificates: React.FC<AdminCertificatesProps> = ({ certificates, onRefresh }) => {
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewCert = () => {
    setIsNew(true);
    setEditingCert({
      title: '',
      issuingOrganization: 'Meta',
      issueDate: new Date().toISOString().substring(0, 10),
      expiryDate: '',
      certificateId: 'CERT-' + Math.floor(100000 + Math.random() * 900000),
      fileUrl: 'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0f?auto=format&fit=crop&w=1200&q=80',
      fileType: 'image',
      skillsCovered: ['React', 'Full-Stack Development'],
      category: 'Web Development',
      verificationUrl: 'https://coursera.org/verify/',
      featured: true,
      description: 'Comprehensive program covering industry-standard engineering patterns.'
    });
  };

  const startEditCert = (c: Certificate) => {
    setIsNew(false);
    setEditingCert({ ...c });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await deleteCertificate(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await uploadAsset(base64, file.name, file.type.includes('pdf') ? 'pdf' : 'image');
        setEditingCert(prev => ({
          ...prev,
          fileUrl: res.url,
          fileType: res.fileType
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.title || !editingCert?.issuingOrganization || !editingCert?.certificateId) {
      setError('Title, organization, and certificate ID are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isNew) {
        await createCertificate(editingCert);
      } else if (editingCert.id) {
        await updateCertificate(editingCert.id, editingCert);
      }
      setEditingCert(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <span>Manage Certificates &amp; Credentials ({certificates.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showcase verified achievements with live URLs and credential numbers
          </p>
        </div>

        <button
          onClick={startNewCert}
          id="btn-admin-add-cert"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {certificates.map((c) => (
            <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={c.fileUrl}
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-cover rounded-xl shrink-0 bg-slate-950"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {c.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {c.issuingOrganization}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    ID: {c.certificateId} • Issued: {c.issueDate} • Category: {c.category}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Skills: {c.skillsCovered.join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {c.verificationUrl && (
                  <a
                    href={c.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-emerald-600 text-slate-500 transition-colors"
                    title="Test Verification Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => startEditCert(c)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Edit Certificate"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={() => setEditingCert(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {isNew ? 'Add Verified Certificate' : 'Edit Certificate'}
              </h3>
              <button
                onClick={() => setEditingCert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    placeholder="e.g. Meta Front-End Developer Specialization"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuingOrganization || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuingOrganization: e.target.value })}
                    placeholder="e.g. Meta, DeepLearning.AI, Oracle, Stanford"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Credential ID *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.certificateId || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, certificateId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Issue Date</label>
                  <input
                    type="date"
                    value={editingCert.issueDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={editingCert.category || 'Web Development'}
                    onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Database">Database</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Upload Certificate File / Image */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Certificate Document (Image or PDF)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950/60 file:text-emerald-700 dark:file:text-emerald-300"
                  />
                  {uploading && <span className="text-emerald-600 text-xs">Uploading...</span>}
                </div>
                <div className="pt-2">
                  <span className="text-[11px] text-slate-500">Or enter direct URL:</span>
                  <input
                    type="text"
                    value={editingCert.fileUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, fileUrl: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Official Verification URL</label>
                <input
                  type="text"
                  value={editingCert.verificationUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingCert.skillsCovered) ? editingCert.skillsCovered.join(', ') : ''}
                  onChange={(e) => setEditingCert({ 
                    ...editingCert, 
                    skillsCovered: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description / Scope</label>
                <textarea
                  rows={2}
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-cert-featured"
                  checked={Boolean(editingCert.featured)}
                  onChange={(e) => setEditingCert({ ...editingCert, featured: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="edit-cert-featured" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Feature in Core Credentials
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
