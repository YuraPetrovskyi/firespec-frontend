# 📦 Offline Queue Implementation Guide

## 🎯 Overview

The Offline Queue system allows the app to save API requests when offline and automatically sync them when the connection is restored.

## ✅ What's Implemented:

### 1. **IndexedDB Schema Update**

- **Database**: `firespec-db` (version 2)
- **New Store**: `offline-queue`
  - Auto-incrementing `id`
  - Stores: url, method, data, headers, timestamp, retryCount, status

### 2. **Offline Queue Library** (`src/lib/offlineQueue.ts`)

#### Functions:

- **`addToQueue(url, method, data, headers)`** - Add request to queue
- **`getQueueItems()`** - Get all pending items
- **`getQueueCount()`** - Get count of pending items
- **`processQueue()`** - Process all pending requests (auto-called on reconnect)
- **`clearCompletedQueue()`** - Remove completed/failed items
- **`clearAllQueue()`** - Clear entire queue (use with caution)

### 3. **Auto-Sync on Reconnect**

- Integrated into `useOnlineStatus` hook
- Automatically processes queue when network restored
- Shows toast notifications with sync results

### 4. **UI Indicators**

- **Offline banner**: Shows pending count `(X pending)`
- **Desktop indicator**: Orange badge with queue count
- **Hook**: `useQueueStatus()` for real-time queue monitoring

---

## 🚀 Usage Examples:

### Example 1: Create Inspection Offline

```typescript
import { addToQueue } from "@/lib/offlineQueue";

const handleCreateInspection = async (data: InspectionData) => {
  const url = `/api/inspections`;
  const method = "POST";

  // Check if online
  if (!navigator.onLine) {
    // Save to queue instead of making request
    await addToQueue(url, method, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    toast.success("Saved offline. Will sync when online.");
    return;
  }

  // If online, make normal request
  try {
    const response = await axios.post(url, data);
    toast.success("Inspection created!");
  } catch (error) {
    handleApiError(error);
  }
};
```

### Example 2: Update Inspection Offline

```typescript
import { addToQueue } from "@/lib/offlineQueue";

const handleUpdateInspection = async (id: number, data: InspectionData) => {
  const url = `/api/inspections/${id}`;
  const method = "PUT";

  if (!navigator.onLine) {
    await addToQueue(url, method, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    toast.success("Changes saved offline. Will sync when online.");
    return;
  }

  // Normal online request
  try {
    const response = await axios.put(url, data);
    toast.success("Inspection updated!");
  } catch (error) {
    handleApiError(error);
  }
};
```

### Example 3: Using with React Component

```typescript
"use client";

import { useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useQueueStatus } from "@/hooks/useQueueStatus";
import { addToQueue } from "@/lib/offlineQueue";

export default function InspectionForm() {
  const isOnline = useOnlineStatus();
  const queueCount = useQueueStatus();

  const handleSubmit = async (formData) => {
    if (!isOnline) {
      // Queue the request
      await addToQueue("/api/inspections", "POST", formData);
      alert(`Saved offline. ${queueCount + 1} items in queue.`);
    } else {
      // Normal API call
      await axios.post("/api/inspections", formData);
    }
  };

  return (
    <div>
      {!isOnline && queueCount > 0 && (
        <div className="bg-yellow-100 p-2 rounded">
          ⚠️ {queueCount} items waiting to sync
        </div>
      )}

      <form onSubmit={handleSubmit}>{/* Your form fields */}</form>
    </div>
  );
}
```

---

## 🧪 Testing:

### Test Scenario 1: Create Offline

1. Open DevTools → Network → Select "Offline"
2. Try to create a new inspection
3. Check console: `📥 Added to offline queue: { method: 'POST', url: '/api/inspections' }`
4. Check banner: Shows `(1 pending)`
5. Go back online
6. Check console: `🔄 Processing 1 queued requests...`
7. Check toast: `🟢 Back online! Synced 1 items`

### Test Scenario 2: Multiple Queued Items

1. Go offline
2. Create 3 inspections
3. Update 2 existing inspections
4. Banner shows: `(5 pending)`
5. Desktop indicator shows: Orange badge with "5"
6. Go online
7. All 5 items sync automatically

### Test Scenario 3: Failed Sync (Retry Logic)

1. Queue an item with invalid data
2. Go online
3. Item fails to sync (retryCount incremented)
4. After 3 failed attempts, status changes to 'failed'

---

## 🔧 Advanced Usage:

### Manual Queue Processing

```typescript
import { processQueue } from "@/lib/offlineQueue";

const handleManualSync = async () => {
  const result = await processQueue();
  console.log(`Synced: ${result.success}, Failed: ${result.failed}`);
};
```

### Clear Completed Items

```typescript
import { clearCompletedQueue } from "@/lib/offlineQueue";

const handleCleanup = async () => {
  await clearCompletedQueue();
  console.log("Cleaned up old queue items");
};
```

### Check Queue Status

```typescript
import { getQueueCount, getQueueItems } from "@/lib/offlineQueue";

const checkQueue = async () => {
  const count = await getQueueCount();
  const items = await getQueueItems();

  console.log(`${count} items pending`);
  console.log("Queue items:", items);
};
```

---

## 📊 Queue Item Structure:

```typescript
interface QueueItem {
  id?: number; // Auto-generated
  url: string; // API endpoint
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any; // Request body
  headers?: Record<string, string>;
  timestamp: number; // When queued
  retryCount: number; // Failed attempts
  status: "pending" | "processing" | "failed" | "completed";
}
```

---

## ⚠️ Important Notes:

1. **Authentication**: Include auth token in headers when queueing
2. **Retry Limit**: Items fail permanently after 3 attempts
3. **Storage**: Queue stored in IndexedDB (persistent)
4. **Auto-Sync**: Happens automatically on reconnect (no manual intervention needed)
5. **Performance**: Queue polling every 2 seconds (adjust if needed)

---

## 🎯 Next Steps:

After implementing offline queue in your components:

1. ✅ **Offline Queue** ← Current
2. ⏳ **PWA Manifest** - Make app installable
3. ⏳ **Service Worker** - Cache static files
4. ⏳ **Background Sync** - Advanced sync strategies

---

## 🐛 Troubleshooting:

**Queue not processing?**

- Check browser console for errors
- Verify IndexedDB version updated to 2
- Clear browser data and refresh

**Items stuck in queue?**

- Check `retryCount` - may have failed 3 times
- Verify API endpoint is correct
- Check authentication headers

**Queue count not updating?**

- `useQueueStatus` polls every 2 seconds
- Force refresh or check browser console
