import React from 'react';

export default React.memo(function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <span className="text-red-400 text-2xl font-bold">!</span>
      </div>
      <p className="text-red-400 font-semibold text-sm">Failed to load data</p>
      <p className="text-gray-500 text-xs text-center max-w-xs">{message}</p>
      <p className="text-gray-600 text-xs">Check that VITE_JOTFORM_API_KEY is set in .env</p>
    </div>
  );
});
