"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { processQueue, getQueueCount } from "@/lib/offlineQueue";

interface NetworkStatusContextType {
  isOnline: boolean;
  checkConnectivity: () => Promise<boolean>;
}

const NetworkStatusContext = createContext<
  NetworkStatusContextType | undefined
>(undefined);

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  // Функція для перевірки реального з'єднання (працює з F12 Offline)
  const checkConnectivity = async (): Promise<boolean> => {
    // Для розробки просто повертаємо navigator.onLine
    // В продакшні можна додати ping до реального API
    return navigator.onLine;
  };

  useEffect(() => {
    // Check queue on mount if online
    const checkQueueOnMount = async () => {
      // Використовуємо navigator.onLine напряму для швидкості
      if (navigator.onLine) {
        const count = await getQueueCount();
        if (count > 0) {
          console.log(`🔄 Found ${count} items in queue, processing...`);
          try {
            const result = await processQueue();
            if (result.success > 0) {
              toast.success(`✅ Synced ${result.success} pending items`, {
                duration: 4000,
                position: "bottom-center",
              });
            }
            if (result.failed > 0) {
              toast.error(`⚠️ ${result.failed} items failed to sync`, {
                duration: 4000,
                position: "bottom-center",
              });
            }
          } catch (error) {
            console.error("Failed to process queue on mount:", error);
          }
        }
      }
    };

    checkQueueOnMount();

    // Event handlers
    const handleOnline = async () => {
      console.log("🟢 Network: Online");
      setIsOnline(true);

      // Automatically process offline queue when connection restored
      try {
        const result = await processQueue();
        if (result.success > 0) {
          toast.success(`🟢 Back online! Synced ${result.success} items`, {
            duration: 4000,
            position: "bottom-center",
          });
        } else {
          toast.success("🟢 Back online!", {
            duration: 3000,
            position: "bottom-center",
          });
        }

        if (result.failed > 0) {
          toast.error(`⚠️ ${result.failed} items failed to sync`, {
            duration: 4000,
            position: "bottom-center",
          });
        }
      } catch (error) {
        console.error("Failed to process queue:", error);
        toast.success("🟢 Back online!", {
          duration: 3000,
          position: "bottom-center",
        });
      }
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

  return (
    <NetworkStatusContext.Provider value={{ isOnline, checkConnectivity }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error(
      "useNetworkStatus must be used within NetworkStatusProvider"
    );
  }
  return context;
}
