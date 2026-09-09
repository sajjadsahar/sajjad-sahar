import React from 'react';
import { AdminLoginModal } from '../components/admin/AdminLoginModal.js';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] flex items-center justify-center p-4">
      <AdminLoginModal
        isOpen={true}
        onClose={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }}
        onLoginSuccess={() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }}
      />
    </div>
  );
};

export default LoginPage;
