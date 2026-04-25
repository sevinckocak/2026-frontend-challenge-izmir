import React from 'react';

export default React.memo(function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
      </div>
      <p className="text-gray-400 text-xs tracking-widest uppercase">Loading evidence...</p>
    </div>
  );
});
