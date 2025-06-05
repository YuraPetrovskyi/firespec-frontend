"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ModalConfirm from "./ModalConfirm";
import { toast } from "react-hot-toast";
import { syncOfflineData } from '@/lib/syncOfflineData';

type Props = {
  onClose: () => void;
};

export default function UserMenu({ onClose }: Props) {
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 🟡 sync on demand
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncOfflineData();
      toast.success('✅ Data synced successfully');
      // fetchProjects(); // reload from IndexedDB or fresh
    } catch (e) {
      toast.error('❌ Failed to sync data');
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className=" p-2 flex flex-col justify-between absolute right-0 mt-2 min-w-[150px] min-h-[200px] bg-white shadow-lg border rounded-md z-10">
      <p className="text-lg font-bold	text-center mt-1">Profile</p>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 text-sm text-white px-2 py-2 rounded-xl 
                  hover:bg-red-600 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-200"
      >
        Logout
      </button>
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-gray-500 text-white font-bold px-2 py-2 rounded-xl
          hover:bg-gray-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSyncing ? 'Syncing...' : '🔄 Sync'}
      </button>
      <button
        onClick={() => onClose()}
        className="bg-gray-300 text-sm text-gray-800 px-2 py-2 rounded-xl 
                  hover:bg-gray-400 hover:scale-105 active:scale-95 hover:shadow-lg transition duration-200"
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
