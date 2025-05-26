'use client';

import React from 'react';

export default function LoadSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:0s]" />
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-3 h-3 bg-yellow-600 rounded-full animate-bounce [animation-delay:0.4s]" />
        <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:0s]" />
        <div className="w-3 h-3 bg-sky-600 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-3 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
