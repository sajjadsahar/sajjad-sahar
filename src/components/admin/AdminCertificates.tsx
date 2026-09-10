import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Award, 
  Upload, 
  ExternalLink, 
  X, 
  Check, 
  FileText,
  Sparkles,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Certificate } from '../../types.js';
import { createCertificate, updateCertificate, deleteCertificate } from '../../services/api.js';
import { OrganizationLogo } from '../OrganizationLogo.js';

interface AdminCertificatesProps {
  certificates: Certificate[];
  onRefresh: () => void;
}

export const AdminCertificates: React.FC<AdminCertificatesProps> = ({ certificates, onRefresh }) => {
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillsInput, setSkillsInput] = useState<string>('');

  const startNewCert = () => {
    setIsNew(true);
    setError(null);
    setSelectedFile(null);
    setFilePreview(null);
    setSkillsInput('');
    setEditingCert({
      title: '',
      issuingOrganization: '',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      expiryDate: 'Never',
      certificateId: '',
      fileUrl: '',
      fileType: 'image',
      skillsCovered: [],
      category: 'Artificial Intelligence / Generative AI',
      verificationUrl: '',
      featured: false,
      description: ''
    });
  };

  const startEditCert = (c: Certificate) => {
    setIsNew(false);
    setError(null);
    setSelectedFile(null);
    const docId = c._id || c.id;
    const existingUrl = c.certificateDocument?.url || c.fileUrl || '';
    setFilePreview(existingUrl || null);
    setSkillsInput(Array.isArray(c.skillsCovered) ? c.skillsCovered.join(', ') : (c.skillsCovered || ''));
    setEditingCert({ 
      ...c,
      id: docId,
      _id: docId,
      fileUrl: existingUrl,
      fileType: c.certificateDocument?.fileType || c.fileType || (existingUrl.toLowerCase().includes('.pdf') ? 'pdf' : 'image')
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Cannot delete: Certificate ID is missing.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await deleteCertificate(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase();
    const isImage = file.type.startsWith('image/') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp');
    const isPdf = file.type === 'application/pdf' || ext.endsWith('.pdf');

    if (!isImage && !isPdf) {
      setError('Invalid file format. Only JPG, JPEG, PNG, WEBP images and PDF documents are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large. Maximum allowed document size is 20MB.');
      e.target.value = '';
      return;
    }

    setError(null);
    setSelectedFile(file);

    const docType: 'image' | 'pdf' = isPdf ? 'pdf' : 'image';
    setEditingCert(prev => prev ? ({ ...prev, fileType: docType }) : null);

    try {
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    } catch {
      setFilePreview(file.name);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.title || !editingCert?.issuingOrganization || !editingCert?.certificateId) {
      setError('Title, organization, and certificate ID are required.');
      return;
    }

    const hasDocument = selectedFile || editingCert.fileUrl || editingCert.certificateDocument?.url;
    if (!hasDocument) {
      setError('Please provide a certificate document (upload an image/PDF or enter a document URL).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedSkills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (selectedFile) {
        // Multi-part form upload with binary file
        const formData = new FormData();
        formData.append('certificateDocument', selectedFile);
        formData.append('title', editingCert.title.trim());
        formData.append('issuingOrganization', editingCert.issuingOrganization.trim());
        formData.append('certificateId', editingCert.certificateId.trim());
        formData.append('issueDate', editingCert.issueDate || '');
        formData.append('expiryDate', editingCert.expiryDate || 'Never');
        formData.append('category', editingCert.category || 'Web Development');
        formData.append('skillsCovered', JSON.stringify(parsedSkills));
        formData.append('description', editingCert.description || '');
        formData.append('verificationUrl', (editingCert.verificationUrl || '').trim());
        formData.append('featured', String(Boolean(editingCert.featured)));
        if (editingCert.fileUrl) {
          formData.append('fileUrl', editingCert.fileUrl);
        }

        const targetId = editingCert._id || editingCert.id;
        if (isNew) {
          await createCertificate(formData);
        } else if (targetId) {
          await updateCertificate(targetId, formData);
        } else {
          throw new Error('Certificate ID is missing for update operation.');
        }
      } else {
        // No new file chosen: preserve existing document and submit JSON payload
        const preservedUrl = editingCert.fileUrl || editingCert.certificateDocument?.url || '';
        const isPdfUrl = preservedUrl.toLowerCase().includes('.pdf') || preservedUrl.startsWith('data:application/pdf');
        const docType: 'image' | 'pdf' = isPdfUrl ? 'pdf' : (editingCert.fileType || 'image');

        const targetId = editingCert._id || editingCert.id;
        const payload: Partial<Certificate> = {
          ...editingCert,
          id: targetId,
          _id: targetId,
          title: editingCert.title.trim(),
          issuingOrganization: editingCert.issuingOrganization.trim(),
          certificateId: editingCert.certificateId.trim(),
          verificationUrl: (editingCert.verificationUrl || '').trim(),
          skillsCovered: parsedSkills,
          fileUrl: preservedUrl,
          fileType: docType,
          certificateDocument: editingCert.certificateDocument || (preservedUrl ? {
            url: preservedUrl,
            publicId: '',
            fileType: docType
          } : undefined)
        };

        if (isNew) {
          await createCertificate(payload);
        } else if (targetId) {
          await updateCertificate(targetId, payload);
        } else {
          throw new Error('Certificate ID is missing for update operation.');
        }
      }

      setEditingCert(null);
      setSelectedFile(null);
      setFilePreview(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions: string[] = [
    'Data Science / Programming / AI',
    'Artificial Intelligence / Generative AI',
    'Artificial Intelligence / Cloud / Generative AI',
    'Artificial Intelligence',
    'Artificial Intelligence / AI Literacy',
    'Web Development / MERN Stack',
    'Artificial Intelligence / Machine Learning',
    'Web Development',
    'Programming',
    'Data Science',
    'Cloud',
    'Database',
    'Other'
  ];

  const isCurrentDocPdf = (url?: string | null, file?: File | null, type?: string) => {
    if (file) {
      return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    }
    if (type === 'pdf') return true;
    if (url) {
      return url.toLowerCase().includes('.pdf') || url.startsWith('data:application/pdf');
    }
    return false;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>Manage Certificates &amp; Credentials ({certificates.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage real verified credentials, upload certificate documents (Image or PDF), IDs, dates, and verification links.
          </p>
        </div>

        <button
          onClick={startNewCert}
          id="btn-admin-add-cert"
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {certificates.map((c) => {
            const itemDocId = c._id || c.id;
            const docUrl = c.certificateDocument?.url || c.fileUrl || '';
            const isPdf = isCurrentDocPdf(docUrl, null, c.certificateDocument?.fileType || c.fileType);

            return (
              <div key={itemDocId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Thumbnail / Document Indicator */}
                  {isPdf ? (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-16 h-12 rounded-xl shrink-0 bg-rose-950/40 border border-rose-800/60 flex flex-col items-center justify-center text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition-colors group/pdf shadow-sm"
                      title="Click to view PDF document in new tab"
                    >
                      <FileText className="w-5 h-5 group-hover/pdf:scale-110 transition-transform" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">PDF</span>
                    </a>
                  ) : (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-16 h-12 rounded-xl shrink-0 overflow-hidden bg-slate-950 border border-slate-700 block shadow-sm"
                      title="Click to view full certificate image"
                    >
                      <img
                        src={docUrl}
                        alt={c.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </a>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {c.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1">
                        <OrganizationLogo organization={c.issuingOrganization} className="w-3 h-3" />
                        {c.issuingOrganization}
                      </span>
                      {c.featured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${isPdf ? 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10' : 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-500/10'}`}>
                        {isPdf ? 'PDF Document' : 'Image'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                      <span><strong>ID:</strong> {c.certificateId}</span>
                      <span><strong>Issued:</strong> {c.issueDate}</span>
                      <span><strong>Expires:</strong> {c.expiryDate || 'Never'}</span>
                      <span><strong>Category:</strong> {c.category}</span>
                    </div>
                    {c.skillsCovered && c.skillsCovered.length > 0 && (
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Skills: {c.skillsCovered.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {docUrl && (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-cyan-400 text-slate-600 dark:text-slate-400 transition-colors"
                      title={isPdf ? 'Open PDF Certificate in new tab' : 'Open Certificate Image in new tab'}
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  {c.verificationUrl && (
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-cyan-400 text-slate-600 dark:text-slate-400 transition-colors"
                      title="Open Official Verification Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => startEditCert(c)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Edit Certificate"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(itemDocId)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Create Modal */}
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
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
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
                    placeholder="e.g. Data Science Essentials With Python"
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
                    placeholder="e.g. Cisco, Google Cloud, Apna College"
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
                    placeholder="Exact credential ID"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Issue Date</label>
                  <input
                    type="text"
                    value={editingCert.issueDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    placeholder="e.g. July 25, 2026 or July 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Expiration Status</label>
                  <input
                    type="text"
                    value={editingCert.expiryDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiryDate: e.target.value })}
                    placeholder="e.g. Never or No Expiration"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={editingCert.category || 'Artificial Intelligence'}
                  onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Certificate Document (Image or PDF) Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 dark:text-slate-200 block">
                    1. Certificate Document (Image or PDF)
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Supported: JPG, JPEG, PNG, WEBP, PDF (max 20MB)
                  </span>
                </div>

                {/* Current or Selected Document Preview */}
                {filePreview && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    {isCurrentDocPdf(filePreview, selectedFile, editingCert.fileType) ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs truncate">
                            {selectedFile ? `Selected: ${selectedFile.name}` : (editingCert.certificateDocument?.originalName || 'Saved PDF Document')}
                          </span>
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB (Ready to save)` : 'Current saved document'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={filePreview} 
                          alt="Certificate Preview" 
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 rounded-lg object-cover bg-slate-950 border border-slate-700 shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs truncate">
                            {selectedFile ? `Selected: ${selectedFile.name}` : 'Current Certificate Image'}
                          </span>
                          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB (Ready to save)` : 'Current saved document'}
                          </span>
                        </div>
                      </div>
                    )}

                    {(!selectedFile && filePreview) && (
                      <a
                        href={filePreview}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-cyan-400 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileSelect}
                    className="w-full text-xs file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer file:transition-colors text-slate-700 dark:text-slate-300"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    2. Or enter image/document URL:
                  </label>
                  <input
                    type="text"
                    value={editingCert.fileUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingCert(prev => prev ? ({ ...prev, fileUrl: val }) : null);
                      if (!selectedFile && val) {
                        setFilePreview(val);
                      }
                    }}
                    placeholder="https://... (or leave blank if uploading document above)"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <span className="text-[10px] text-slate-400 italic block mt-0.5">
                    If both a file and a URL are provided, the uploaded document file will be used as primary.
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  3. Official Verification URL (Leave empty if none exists — never invent URLs)
                </label>
                <input
                  type="text"
                  value={editingCert.verificationUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, verificationUrl: e.target.value })}
                  placeholder="Only enter genuine verified URL. Leave blank if not available."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">4. Skills Covered (comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Python, Machine Learning, Data Visualization"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">5. Description / Scope</label>
                <textarea
                  rows={2}
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  placeholder="Detailed curriculum overview, validated competencies, project scope..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-cert-featured"
                  checked={Boolean(editingCert.featured)}
                  onChange={(e) => setEditingCert({ ...editingCert, featured: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="edit-cert-featured" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  6. Feature this certificate prominently
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'Saving Document & Certificate...' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCertificates;
