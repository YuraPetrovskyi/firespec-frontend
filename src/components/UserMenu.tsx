"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ModalConfirm from "./ModalConfirm";
import { toast } from "react-hot-toast";
import { syncOfflineData } from "@/lib/syncOfflineData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserMenu({ isOpen, onClose }: Props) {
  const { logout, user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  // 🟡 sync on demand
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncOfflineData();
      toast.success("✅ Data synced successfully");
    } catch (e) {
      toast.error("❌ Failed to sync data");
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm transition-all duration-200 ${
        isClosing ? "bg-opacity-0" : "bg-opacity-50"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl p-6 w-11/12 max-w-sm mx-4 transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            Profile
          </h3>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-2xl font-bold mb-3">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500">{user?.email || ""}</p>
            {user?.role && (
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                {user.role}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-blue-700 hover:scale-105 active:scale-95 transition-transform duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              flex items-center justify-center gap-2"
          >
            {isSyncing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Sync Data
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg
              hover:bg-red-700 hover:scale-105 active:scale-95 transition-transform duration-200
              flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg
              hover:bg-gray-400 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Close
          </button>
        </div>

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
    </div>
  );
}
