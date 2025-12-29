"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    // Event handlers
    const handleOnline = () => {
      console.log("🟢 Network: Online");
      setIsOnline(true);
      toast.success("🟢 Back online! Syncing data...", {
        duration: 3000,
        position: "bottom-center",
      });
    };

    const handleOffline = () => {
      console.log("🔴 Network: Offline");
      setIsOnline(false);
      toast.error("🔴 You are offline. Changes will be saved locally.", {
        duration: 4000,
        position: "bottom-center",
      });
    };

    // Subscribe to network status change events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup - unsubscribe on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
