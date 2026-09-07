import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Sliders, 
  Layers,
  Wand2
} from 'lucide-react';
import { generateAIImage } from '../../services/api.js';

export const AdminAIStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '3:2'>('16:9');
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('1K');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Modern MERN Web App Mockup', prompt: 'Futuristic glassmorphism web dashboard interface displaying code analytics, dark mode navy and cyan theme, clean UI layout, 8k crisp details' },
    { label: 'AI & Neural Network Visualization', prompt: '3D glowing neural network with interconnected data nodes, deep blue and emerald green palette, cinematic depth of field, software engineering concept' },
    { label: 'Certificate Verification Banner', prompt: 'Official executive certification award certificate emblem with gold seal, modern sleek tech diploma, high resolution render' },
    { label: 'Developer Workspace Hero', prompt: 'Minimalist high-tech software engineer workstation with multi-monitor code setup, ambient twilight backlighting, clean aesthetic' }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setError(null);
    try {
      const res = await generateAIImage(prompt, aspectRatio, resolution);
      setGeneratedImage(res.imageUrl);
    } catch (err: any) {
      setError(err.message || 'Image generation failed. Ensure GEMINI_API_KEY is configured.');
    } finally {
      setGenerating(false);
    }
  };

  const copyUrl = () => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <span>AI Asset Studio (Gemini Pro)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate customized project mockups, visual banners, and certificate graphics with 1K, 2K, or 4K resolution
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Suggestions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Quick Prompts for Portfolio Assets:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(p.prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 text-xs font-medium border border-slate-200/60 dark:border-slate-700 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">Prompt Description *</label>
          <textarea
            rows={3}
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want Gemini to generate (e.g. A sleek, modern dashboard UI preview of a real-time police dispatch system...)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {(['16:9', '4:3', '1:1', '3:2'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Target Resolution Quality</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    resolution === res
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>{generating ? 'Gemini is Synthesizing Asset...' : `Generate ${resolution} Image with Gemini`}</span>
        </button>
      </form>

      {/* Result Display */}
      {generatedImage && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-500" />
              <span>Generated Output ({resolution} • {aspectRatio})</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={copyUrl}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL' : 'Copy Image URL'}</span>
              </button>
              <a
                href={generatedImage}
                download="gemini_asset.png"
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
              src={generatedImage}
              alt="AI Generated Asset"
              referrerPolicy="no-referrer"
              className="w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
};
