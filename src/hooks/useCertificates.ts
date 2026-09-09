import { useState, useEffect, useCallback, useMemo } from 'react';
import { Certificate } from '../types.js';
import { fetchCertificates } from '../services/certificateService.js';

export function useCertificates(initialCategory = 'All') {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCertificates();
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const filteredCertificates = useMemo(() => {
    let list = (certificates || []).filter((cert) => {
      const catLower = selectedCategory.toLowerCase().trim();
      const matchCat = selectedCategory === 'All' ||
        selectedCategory === 'All Certificates' ||
        (cert.category || '').toLowerCase().includes(catLower) ||
        (catLower === 'artificial intelligence' && ((cert.category || '').toLowerCase().includes('/ ai') || (cert.category || '').toLowerCase().includes('ai literacy') || (cert.category || '').toLowerCase().includes('generative ai')));

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        cert.title.toLowerCase().includes(q) ||
        cert.issuingOrganization.toLowerCase().includes(q) ||
        cert.certificateId.toLowerCase().includes(q) ||
        (cert.category || '').toLowerCase().includes(q) ||
        (cert.description || '').toLowerCase().includes(q) ||
        (cert.skillsCovered || []).some(s => s.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });

    const parseCertDate = (d: string) => {
      const ts = new Date(d).getTime();
      return isNaN(ts) ? 0 : ts;
    };

    if (sortBy === 'newest') {
      list.sort((a, b) => parseCertDate(b.issueDate) - parseCertDate(a.issueDate));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => parseCertDate(a.issueDate) - parseCertDate(b.issueDate));
    } else if (sortBy === 'organization') {
      list.sort((a, b) => a.issuingOrganization.localeCompare(b.issuingOrganization));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [certificates, selectedCategory, searchQuery, sortBy]);

  return {
    certificates,
    filteredCertificates,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    reload: loadCertificates
  };
}

export default useCertificates;
