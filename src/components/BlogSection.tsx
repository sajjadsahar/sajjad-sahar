import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles,
  Tag
} from 'lucide-react';
import { Blog } from '../types.js';

interface BlogSectionProps {
  blogs: Blog[];
  onSelectBlog: (b: Blog) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs, onSelectBlog }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Full-Stack', 'Systems & OOP', 'AI & Machine Learning', 'Database'];

  const filteredBlogs = useMemo(() => {
    return (blogs || []).filter((b) => {
      const matchCat = selectedCategory === 'All' || (b.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      const q = searchQuery.toLowerCase();
      const matchQuery = !q ||
        (b.title || '').toLowerCase().includes(q) ||
        (b.excerpt || '').toLowerCase().includes(q) ||
        (b.tags || []).some(t => (t || '').toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <section id="blog" className="py-20 relative bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 text-xs font-mono uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span>Technical Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineering Blog &amp; Notes
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Explorations into software architecture, scalable web systems, data structures in C++, and applied AI integrations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-md whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              id={`blog-card-${blog.id}`}
              onClick={() => onSelectBlog(blog)}
              className="group cursor-pointer bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#111] border-b border-white/5">
                  <img
                    src={blog.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 font-mono text-[10px] uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {blog.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {blog.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-400 font-mono text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Read button */}
              <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1.5">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  {blog.views !== undefined ? `${blog.views} reads` : ''}
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-mono text-sm">
            No articles found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

      </div>
    </section>
  );
};
