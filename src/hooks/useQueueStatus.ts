"use client";

import { useState, useEffect } from "react";
import { getQueueCount } from "@/lib/offlineQueue";

/**
 * Hook to monitor offline queue status
 * Returns the count of pending items in the queue
 */
export const useQueueStatus = () => {
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    // Initial count
    const updateCount = async () => {
      const count = await getQueueCount();
      setQueueCount(count);
    };

    updateCount();

    // Poll for changes every 2 seconds
    const interval = setInterval(updateCount, 2000);

    return () => clearInterval(interval);
  }, []);

  return queueCount;
};
