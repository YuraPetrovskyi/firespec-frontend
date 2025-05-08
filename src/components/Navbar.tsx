"use client";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  // const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Не показуємо navbar на сторінці логіну (тобто "/") якщо користувач не залогінений
  // if (!user && pathname === "/") return null;
  if (!user) return null;

  // return (
  //   <nav className="w-full bg-indigo-100 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
  //     <div className="text-xl font-bold text-blue-600">🔥 FireSpec</div>
  //     {user && <UserMenu />}
  //   </nav>
  // );
  return (
    <nav className="w-full bg-indigo-100 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <Link href="/projects">
        <Image src="/logo.png" alt="Logo" width={140} height={40} className="cursor-pointer" />
      </Link>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-white px-4 py-2 rounded hover:bg-gray-300 font-semibold"
        >
          {user.name}
        </button>

        {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );

}
