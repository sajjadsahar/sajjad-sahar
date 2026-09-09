import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
  fullScreen = false
}) => {
  const boxSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${boxSizes[size]} rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono animate-pulse shadow-sm`}>
        SS.
      </div>
      {message && (
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wider">
          {message}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#04060a] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12 flex items-center justify-center">
      {content}
    </div>
  );
};

export default LoadingSpinner;
