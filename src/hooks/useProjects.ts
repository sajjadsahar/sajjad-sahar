import { useState, useEffect, useCallback, useMemo } from 'react';
import { Project } from '../types.js';
import { fetchProjects } from '../services/projectService.js';

export function useProjects(initialCategory = 'All') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      const matchCat = selectedCategory === 'All' || 
        (project.category || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'MERN' && (project.technologies || []).some(t => t.toLowerCase().includes('mern') || t.toLowerCase().includes('react') || t.toLowerCase().includes('node')));
      
      const matchQuery = !searchQuery ||
        (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return {
    projects,
    filteredProjects,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    reload: loadProjects
  };
}

export default useProjects;
