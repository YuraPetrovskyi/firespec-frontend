"use client";

import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Не показуємо navbar на сторінці логіну (тобто "/") якщо користувач не залогінений
  if (!user && pathname === "/") return null;

  return (
    <nav className="w-full bg-indigo-100 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600">🔥 FireSpec</div>
      {user && <UserMenu />}
    </nav>
  );
}
