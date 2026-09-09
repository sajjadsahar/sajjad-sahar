import React, { useEffect, useState } from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard.js';
import { AdminLoginModal } from '../components/admin/AdminLoginModal.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { useAuth } from '../context/AuthContext.js';
import { fetchPortfolioData } from '../services/profileService.js';
import { PortfolioData } from '../types.js';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetchPortfolioData();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) return <LoadingSpinner fullScreen message="Loading Admin Workspace..." />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] flex items-center justify-center p-4">
        <AdminLoginModal
          isOpen={true}
          onClose={() => { window.location.href = '/'; }}
          onLoginSuccess={loadData}
        />
      </div>
    );
  }

  return (
    <AdminDashboard
      portfolioData={data}
      onRefreshData={loadData}
      onExitAdmin={() => { window.location.href = '/'; }}
    />
  );
};

export default AdminDashboardPage;
