"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/projects");
    }
  }, [status, router]);

  // Показуємо спінер, поки NextAuth перевіряє сесію
  if (status === "loading") {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Checking session...</p>
      </main>
    );
  }

  // Якщо не залогінений → показуємо форму входу
  return (
    <main className="h-screen w-full flex items-center justify-center relative">
      {status !== "authenticated" && <LoginModal />}
    </main>
  );
}

// import { useAuth } from "@/context/AuthContext";
// import LoginModal from "@/components/LoginModal";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       router.push("/projects");
//     }
//   }, [user, router]);

//   return (
//     <main className="h-screen w-full flex items-center justify-center relative">
//       {!user && <LoginModal />}
//     </main>
//   );
// }
