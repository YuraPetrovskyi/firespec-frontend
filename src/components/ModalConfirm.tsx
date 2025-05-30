'use client';

import { useEffect, useState } from "react";

interface ModalConfirmProps {
  title: string;
  message: string;
  nameAction: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  confirmColor?: 'red' | 'blue' | 'green'; // 🔧 підтримка різних кольорів
  isAsync?: boolean; // чи очікувати асинхронну функцію
  loadingText?: string;
}

export default function ModalConfirm({
  message,
  title,
  nameAction,
  onConfirm,
  onCancel,
  confirmColor = 'red',
  isAsync = true,
  loadingText = 'Processing...',
}: ModalConfirmProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClick = async () => {
    if (isAsync) {
      setIsLoading(true);
      try {
        await onConfirm();
      } finally {
        setIsLoading(false);
      }
    } else {
      onConfirm();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel(); // Закрити після анімації
      setIsClosing(false);
    }, 300); // має відповідати duration у tailwind
  };

  const confirmClass = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
  }[confirmColor];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-80 
          ${isClosing ? 'animate-zoom-out' : 'animate-zoom-in'}`}
      >
        <h2 className="text-2xl text-center font-extrabold mb-4">{title}</h2>
        <p className="text-lg text-gray-800 font-semibold text-center mb-6">{message}</p>
        <div className="flex justify-between items-center mt-6 gap-3 font-semibold">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded 
                      hover:scale-105 active:scale-95 hover:shadow-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`text-white px-4 py-2 rounded min-w-[80px] flex
              items-center justify-center gap-2 
              hover:scale-105 active:scale-95 hover:shadow-lg transition duration-200
              ${confirmClass} ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
              </svg>
            )}
            {isLoading ? loadingText : nameAction}
          </button>
        </div>
      </div>
    </div>
  );
}
