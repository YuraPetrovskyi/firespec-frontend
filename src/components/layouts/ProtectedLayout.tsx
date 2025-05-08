"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../Navbar";

interface Props {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Перенаправлення на логін
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // або покажи <LoadingSpinner />
  }

  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
