import React, { useEffect, useState } from 'react';
import { BlogSection } from '../components/BlogSection.js';
import { BlogReaderModal } from '../components/BlogReaderModal.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { Profile, Blog } from '../types.js';

export const BlogPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData()
      .then(res => {
        setProfile(res.data.profile);
        setBlogs(res.data.blogs || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] text-slate-900 dark:text-slate-100">
      <Navbar profile={profile} onOpenSearch={() => {}} onOpenAdmin={() => {}} />
      <main className="pt-20">
        <BlogSection blogs={blogs.filter(b => b.published)} onSelectBlog={setSelectedBlog} />
      </main>
      <Footer profile={profile} onOpenAdmin={() => {}} />
      <BlogReaderModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
    </div>
  );
};

export default BlogPage;
