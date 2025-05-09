"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ModalConfirm from "./ModalConfirm";

type Props = {
  onClose: () => void;
};

export default function UserMenu({ onClose }: Props) {
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className=" p-2 flex flex-col justify-between absolute right-0 mt-2 min-w-[150px] min-h-[200px] bg-white shadow-lg border rounded-md z-10">
      <p className="text-lg font-bold	text-center mt-1">Menue</p>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
      >
        Logout
      </button>
      <button
        onClick={() => onClose()}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400"
      >
        Close
      </button>

      {showConfirm && (
        <ModalConfirm
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          nameAction="Logout"
          onConfirm={() => {
            logout();
            onClose();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
