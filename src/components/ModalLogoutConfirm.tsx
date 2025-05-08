"use client";

import { useEffect, useState } from "react";

type ModalLogoutConfirmProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ModalLogoutConfirm({ title, message, onConfirm, onCancel }: ModalLogoutConfirmProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-80 transform transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <h2 className="text-lg text-center font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
