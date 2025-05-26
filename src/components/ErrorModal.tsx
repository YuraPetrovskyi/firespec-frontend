'use client';

import React from 'react';


interface Props {
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: Props) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative mx-5 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-6">Something went wrong</h2>
        <p className="mt-3 text-gray-700">{message}</p>


        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>

        {/* Закриття по хрестику */}
        {/* <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Close modal"
        >
          ×
        </button> */}
      </div>
    </div>
  );
}
