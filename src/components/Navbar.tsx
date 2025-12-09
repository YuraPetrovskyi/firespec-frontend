"use client";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import { parseJwt } from "@/lib/parseJwt";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // const { token } = useAuth();
  // const payload = token ? parseJwt(token) : null;

  // const expiryTime = payload?.exp
  //   ? new Date(payload.exp * 1000).toLocaleString()
  //   : "N/A";

  if (!user) return null;

  return (
    <nav className="w-full bg-gray-300 shadow-sm px-4 py-2 flex justify-between items-center sticky gap-4 top-0 z-10">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={40}
            style={{ width: "100px", height: "40px" }}
            priority
          />
        </Link>
        <Link
          href="/projects"
          className="bg-gray-600 hover:bg-gray-400 text-white text-center px-2 sm:px-4 py-2 rounded-lg font-medium transition"
        >
          Projects
        </Link>

        {user.role === "admin" && (
          <Link
            href="/admin"
            className="bg-red-600 hover:bg-red-700 text-white text-center px-2 sm:px-4 py-2 rounded-lg font-medium transition"
          >
            Admin
          </Link>
        )}
      </div>
      {/* <p className="text-sm text-gray-600 text-center">Token expires at: {expiryTime}</p> */}

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white px-2 sm:px-4 py-2 rounded hover:bg-gray-400 text-gray-600 font-semibold flex items-center gap-2"
        >
          {/* User Avatar Icons - Multiple options */}
          
          {/* Option 1: Simple Circle with Initial */}
          <div className="sm:hidden w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Option 2: User Icon SVG - commented out, uncomment to use */}
          {/* <svg className="sm:hidden w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg> */}

          {/* Option 3: Inspector/Worker Icon - commented out, uncomment to use */}
          {/* <svg className="sm:hidden w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.22-2.84 8.16-6 9.06-3.16-.9-6-4.84-6-9.06V6.43l6-2.25zM12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 5c-1.93 0-3.5 1.57-3.5 3.5V17h7v-1.5c0-1.93-1.57-3.5-3.5-3.5z"/>
          </svg> */}

          {/* Option 4: Profile Badge Icon - commented out, uncomment to use */}
          {/* <svg className="sm:hidden w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg> */}

          {/* Name - visible on larger screens */}
          <span className="hidden sm:inline">{user.name}</span>
        </button>

        <UserMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </nav>
  );
}
