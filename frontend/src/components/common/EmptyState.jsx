import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction
}) => (
  <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800/80 flex flex-col items-center justify-center text-center my-4">
    <div className="w-12 h-12 rounded-full bg-gray-800/60 text-gray-400 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-base font-semibold text-white">{title}</h4>
    <p className="mt-1 text-sm text-gray-400 max-w-sm">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-500/20"
      >
        {actionText}
      </button>
    )}
  </div>
);
