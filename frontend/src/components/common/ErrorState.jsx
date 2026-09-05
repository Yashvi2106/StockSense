import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this data.',
  onRetry
}) => (
  <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-900/50 flex flex-col items-center justify-center text-center my-4">
    <div className="w-12 h-12 rounded-full bg-rose-900/40 text-rose-400 flex items-center justify-center mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h4 className="text-base font-semibold text-white">{title}</h4>
    <p className="mt-1 text-sm text-gray-400 max-w-md">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Request
      </button>
    )}
  </div>
);
