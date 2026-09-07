import React, { useEffect, useState } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Code2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GitHubRepo } from '../types.js';
import { fetchGitHubRepos } from '../services/api.js';

interface GitHubSectionProps {
  githubUsername?: string;
}

export const GitHubSection: React.FC<GitHubSectionProps> = ({ githubUsername = 'sajjadsahar' }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGitHubRepos();
      setRepos(data.repos || []);
    } catch (err: any) {
      setError('Unable to load GitHub repositories at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, [githubUsername]);

  return (
    <section id="github-section" className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b0f19] border border-slate-700/80 text-slate-300 text-xs font-mono uppercase tracking-[0.2em] font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Open-Source Activity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            GitHub Repositories
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal">
            Direct synchronization with my GitHub development profile (<a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 font-mono font-bold underline underline-offset-2">@{githubUsername}</a>).
          </p>
        </div>

        {/* Repos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#0b0f19] border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                id={`repo-card-${repo.name}`}
                className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors font-mono">
                        {repo.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed font-normal">
                    {repo.description || 'Public GitHub software project repository.'}
                  </p>

                  {/* Topics / Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded bg-[#060810] border border-slate-700 text-slate-300 font-mono text-[10px] font-medium"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer stats */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono font-medium">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {repo.language || 'Code'}
                  </span>

                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-cyan-400" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
