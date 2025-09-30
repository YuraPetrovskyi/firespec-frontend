"use client";

import LoginButton from "@/components/LoginButton";

export default function HomePage() {
  return (
    <main className="h-screen w-full flex items-center justify-center relative">
      <LoginButton />
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
