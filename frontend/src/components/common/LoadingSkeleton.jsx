import React from 'react';

export const CardSkeleton = ({ className = '' }) => (
  <div className={`p-6 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse ${className}`}>
    <div className="h-4 w-28 bg-gray-800 rounded mb-4"></div>
    <div className="h-8 w-40 bg-gray-700/80 rounded mb-2"></div>
    <div className="h-4 w-24 bg-gray-800 rounded"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-36 bg-gray-800 rounded"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-12 bg-gray-800 rounded"></div>
        <div className="h-8 w-12 bg-gray-800 rounded"></div>
        <div className="h-8 w-12 bg-gray-800 rounded"></div>
      </div>
    </div>
    <div className="h-72 w-full bg-gray-800/50 rounded-xl"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 animate-pulse">
    <div className="h-6 w-36 bg-gray-800 rounded mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800">
          <div className="h-4 w-32 bg-gray-800 rounded"></div>
          <div className="h-4 w-20 bg-gray-800 rounded"></div>
          <div className="h-4 w-16 bg-gray-800 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);
