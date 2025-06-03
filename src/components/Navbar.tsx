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
    <nav className="w-full bg-gray-300 shadow-sm px-4 py-2 flex justify-between items-center sticky top-0 z-10">
      <Link href="/projects">
        <Image src="/logo.png" alt="Logo" width={100} height={40} style={{ width: '100px', height: '40px' }} priority/>
      </Link>
      {/* <p className="text-sm text-gray-600 text-center">Token expires at: {expiryTime}</p> */}

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white px-2 py-2 rounded hover:bg-gray-400 text-gray-600 font-semibold"
        >
          {user.name}
        </button>

        {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );

}
