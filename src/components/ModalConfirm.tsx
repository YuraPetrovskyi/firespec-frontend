'use client';

import { useEffect, useState } from "react";

interface ModalConfirmDeleteProps {
  title: string;
  message: string;
  nameAction: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirmDelete({ message, title, nameAction, onConfirm, onCancel }: ModalConfirmDeleteProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-80 transform transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <h2 className="text-xl text-center font-extrabold mb-4">{title}</h2>
        <p className="text-lg text-gray-800 font-semibold text-center mb-6">{message}</p>
        <div className="flex justify-between items-center mt-6 gap-3 font-semibold">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {nameAction}
          </button>
        </div>
      </div>
    </div>
  );
}