// eslint-disable-next-line no-unused-vars
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff88] to-[#1e3a8a] rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#00ff88] animate-spin"></div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] to-[#1e3a8a] rounded blur opacity-20"></div>
            <span className="relative text-slate-200 text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;