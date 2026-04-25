import React from 'react';

export default React.memo(function EmptyState({ message = 'No events match your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
        <span className="text-gray-500 text-2xl">?</span>
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
});
