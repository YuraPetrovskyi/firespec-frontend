"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
      >
        {user.name}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
