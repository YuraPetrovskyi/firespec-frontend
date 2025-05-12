"use client";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="w-full bg-indigo-100 shadow-sm px-4 py-2 flex justify-between items-center sticky top-0 z-10">
      <Link href="/projects">
        <Image src="/logo.png" alt="Logo" width={100} height={40} style={{ width: '100px', height: '40px' }} priority/>
      </Link>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white px-2 py-2 rounded hover:bg-gray-300 font-semibold"
        >
          {user.name}
        </button>

        {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );

}
