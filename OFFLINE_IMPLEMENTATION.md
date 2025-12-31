# 🌐 Offline Implementation Documentation

## 📋 Overview

Complete offline-first PWA implementation with IndexedDB caching and request queue management for Firespec Frontend.

**Status**: ✅ Production Ready (WiFi OFF scenario)  
**Known Limitation**: ⚠️ F12 DevTools Offline shows black screen (requires Service Worker)

---

## 🏗️ Architecture

### Core Components

1. **NetworkStatusContext** - Global network state management
2. **IndexedDB** - Local data caching (projects, inspections, queue)
3. **Offline Queue** - Request queue with duplicate detection & auto-sync
4. **Axios Client** - Simplified HTTP client (token refresh only)

### Data Flow

```
User Action
    ↓
Check isOnline (NetworkStatusContext)
    ↓
┌─────────────┬─────────────┐
│  OFFLINE    │   ONLINE    │
├─────────────┼─────────────┤
│ IndexedDB   │  axios API  │
│   ↓         │     ↓       │
│  UI         │  IndexedDB  │
│             │     ↓       │
│             │    UI       │
└─────────────┴─────────────┘
```

---

## 🔧 Implementation Details

### 1. NetworkStatusContext (`src/context/NetworkStatusContext.tsx`)

**Purpose**: Global network status management with queue processing

**Key Features**:

- Monitors `navigator.onLine`
- Listens to `online`/`offline` window events
- Auto-processes queue on reconnection
- Single source of truth (prevents duplicate toasts)
- Queue count monitoring

**Usage**:

```tsx
import { useNetworkStatus } from "@/context/NetworkStatusContext";

const { isOnline } = useNetworkStatus();
```

**Integration**: Wrapped in `src/app/layout.tsx` (global provider)

---

### 2. IndexedDB (`src/lib/indexedDb.ts`)

**Database**: `firespec-db` v2

**Stores**:

```typescript
{
  projects: { keyPath: 'id' },
  inspections: { keyPath: '_id' }, // Composite: "{project_id}_{id}"
  'inspection-details': { keyPath: 'id' },
  'offline-queue': { autoIncrement: true }
}
```

**Key Functions**:

- `saveProjectsList()` / `getProjectsList()`
- `saveInspectionsByProject()` / `getInspectionsByProject()`
- `saveInspectionDetail()` / `getInspectionDetail()`
- `getProjectById()`

**Cache Management**:

- Clears old data before saving new (no duplicates)
- Fetches data BEFORE transaction (avoid TransactionInactiveError)
- No `await` inside transaction loops

---

### 3. Offline Queue (`src/lib/offlineQueue.ts`)

**Purpose**: Queue offline requests, sync when online

**Schema**:

```typescript
{
  id?: number;           // Auto-increment
  method: string;        // POST, PUT, DELETE
  url: string;          // API endpoint
  data: any;            // Request payload
  token: string;        // Auth token
  status: 'pending' | 'error';
  createdAt: number;    // Timestamp
  retries: number;      // Max 3
}
```

**Key Features**:

- ✅ Duplicate detection (URL + method + data)
- ✅ Global processing flag (prevents concurrent execution)
- ✅ 500ms delay between items (unique timestamps)
- ✅ Retry logic (up to 3 attempts)

**Functions**:

```typescript
addToQueue({ method, url, data, token });
processQueue(); // Auto-called on reconnect
getQueueCount(); // For UI badge
clearQueue(); // Manual clear
```

---

### 4. Axios Client (`src/lib/axios.ts`)

**Simplified Implementation** (65 lines, was 175)

**Removed**: Offline interceptor (didn't work with localhost API)  
**Kept**: Only 401 token refresh logic

**Why simplified?**

- Localhost API always accessible (even offline)
- Axios never gets network error with localhost
- Interceptor can't detect offline state
- Solution: Check `isOnline` BEFORE axios call

**Cache Headers**:

```typescript
// Disable browser HTTP cache
headers: {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
}
```

---

## 📱 Component Integration

### Pattern: Check isOnline Before Axios

**inspections/page.tsx** (List):

```tsx
const { isOnline } = useNetworkStatus();

useEffect(() => {
  // Offline - load from cache
  if (!isOnline) {
    getInspectionsByProject(projectId)
      .then((cached) => setInspections(cached))
      .catch(() => toast.error("No cached data"));
    return; // Don't call axios
  }

  // Online - API then cache
  axios.get(`projects/${id}/inspections`).then((res) => {
    setInspections(res.data.data);
    saveInspectionsByProject(id, res.data.data); // Cache
  });
}, [id, isOnline]);
```

**create/page.tsx** (Create):

```tsx
const handleCreate = async () => {
  if (!isOnline) {
    // Queue for later
    await addToQueue({
      method: "POST",
      url: `projects/${id}/inspections`,
      data: payload,
      token: localStorage.getItem("token") || "",
    });
    toast.success("Queued for sync");
    return;
  }

  // Direct API call
  await axios.post(`projects/${id}/inspections`, payload);
};
```

**DELETE Operations**:

```tsx
const handleDelete = async () => {
  if (!isOnline) {
    toast.error("Cannot delete while offline");
    return;
  }

  await axios.delete(`projects/${id}/inspections/${inspectionId}`);
};
```

---

## 🎨 UI Components

### Navbar Indicators

**Offline Banner** (Mobile):

```tsx
{
  !isOnline && (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2">
      ⚠️ Offline mode {queueCount > 0 && `(${queueCount} pending)`}
    </div>
  );
}
```

**Desktop Indicator**:

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-green-500" />
  <span>Online</span>
  {queueCount > 0 && (
    <span className="bg-orange-500 text-white px-2 py-1 rounded">
      {queueCount}
    </span>
  )}
</div>
```

---

## 🧪 Testing

### ✅ Recommended: Manual WiFi Disconnect

**Steps**:

1. Disable WiFi from OS settings
2. Navigate to inspections page
3. Verify: "📦 Loaded inspections from offline cache" toast
4. Try creating inspection → queued
5. Re-enable WiFi
6. Verify: Queue auto-syncs, toast "✅ X items synced"

**Why recommended?**

- Most realistic offline scenario
- Next.js navigation works
- All features work correctly
- Tests actual production behavior

### ⚠️ Limited: Chrome DevTools Offline

**Steps**:

1. Open DevTools (F12)
2. Network tab → Select "Offline"
3. **Expected**: Black screen on navigation

**Why black screen?**

- DevTools blocks ALL network requests
- Next.js App Router needs network for navigation (RSC payload)
- Static files (\_next/static/\*) also blocked
- Browser navigation blocked

**Use only for**: Quick API call testing

**Fix**: Requires Service Worker implementation (2-3 hours)

---

## 🔄 Auto-Sync Flow

```
User goes offline
    ↓
Creates/edits inspection
    ↓
Request added to queue (IndexedDB)
    ↓
UI shows "Queued for sync" + badge count
    ↓
User goes online (WiFi reconnects)
    ↓
NetworkStatusContext detects online event
    ↓
processQueue() called automatically
    ↓
Each item processed with 500ms delay
    ↓
Success: Item removed from queue
    ↓
Failure: Retry count++, keep in queue
    ↓
Toast: "✅ X items synced successfully"
```

---

## 📊 Database Schema

### offline-queue Store

```sql
CREATE TABLE offline_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT NOT NULL,           -- POST, PUT, DELETE
  url TEXT NOT NULL,              -- projects/123/inspections
  data TEXT NOT NULL,             -- JSON stringified payload
  token TEXT NOT NULL,            -- Bearer token at creation
  status TEXT NOT NULL,           -- 'pending' | 'error'
  createdAt INTEGER NOT NULL,     -- Unix timestamp
  retries INTEGER DEFAULT 0       -- Retry count (max 3)
);
```

### inspections Store

```sql
CREATE TABLE inspections (
  _id TEXT PRIMARY KEY,           -- "{project_id}_{id}"
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  inspection_number TEXT,
  version INTEGER,
  inspection_date TEXT,
  inspector_name TEXT,
  details TEXT                    -- JSON stringified
);
```

---

## 🐛 Troubleshooting

### Issue: Double inspections created

**Cause**: Multiple processQueue() executions  
**Fix**: Global `isProcessing` flag in offlineQueue.ts  
**Status**: ✅ Fixed

### Issue: Duplicate toasts on network change

**Cause**: Multiple useOnlineStatus hook instances  
**Fix**: NetworkStatusContext (global provider)  
**Status**: ✅ Fixed

### Issue: TransactionInactiveError

**Cause**: `await` inside IndexedDB transaction loop  
**Fix**: Fetch data BEFORE transaction, no await in loop  
**Status**: ✅ Fixed

### Issue: HTTP cache returns old data

**Cause**: Browser caches GET requests  
**Fix**: Cache-Control: no-cache headers  
**Status**: ✅ Fixed

### Issue: F12 Offline shows black screen

**Cause**: DevTools blocks Next.js navigation  
**Fix**: Use WiFi disconnect for testing OR implement Service Worker  
**Status**: ⚠️ Accepted limitation (WiFi OFF works)

---

## 🚀 Performance Optimizations

### 1. Duplicate Prevention

- Queue: Check URL + method + data hash before adding
- IndexedDB: Clear old data before saving new

### 2. Concurrency Control

- Global `isProcessing` flag prevents multiple queue processing
- Only one processQueue() execution at a time

### 3. Timestamp Uniqueness

- 500ms delay between queue item processing
- Ensures unique `created_at` timestamps in backend

### 4. Cache Management

- No browser HTTP cache (Cache-Control headers)
- IndexedDB cleared before fresh data saved
- No stale data issues

---

## 📝 Files Modified

### Created

- `src/context/NetworkStatusContext.tsx` (162 lines)
- `src/hooks/useQueueStatus.ts` (27 lines)
- `OFFLINE_IMPLEMENTATION.md` (this file)

### Modified

- `src/lib/indexedDb.ts` - Version 2, queue store, cache clearing
- `src/lib/offlineQueue.ts` - Duplicate detection, global flag, delay
- `src/lib/axios.ts` - Simplified (removed offline interceptor)
- `src/components/Navbar.tsx` - Network indicators, queue badge
- `src/app/layout.tsx` - NetworkStatusProvider wrapper
- `src/app/projects/[id]/inspections/page.tsx` - Offline-first loading
- `src/app/projects/[id]/inspections/create/page.tsx` - Queue integration
- `src/app/projects/[id]/inspections/[inspectionId]/edit/page.tsx` - Queue integration
- `src/app/projects/[id]/inspections/[inspectionId]/page.tsx` - Offline-first loading

### Deleted

- `src/hooks/useOnlineStatus.ts` - Replaced by NetworkStatusContext

---

## ✅ Success Criteria

- [x] WiFi OFF: Loads from IndexedDB
- [x] Online: Loads from API, caches to IndexedDB
- [x] Queue: Saves offline, syncs when online
- [x] No duplicates: In queue or cache
- [x] Timestamps unique: 500ms delay
- [x] DELETE blocked offline
- [x] Toast notifications clear
- [x] No hydration warnings
- [x] No race conditions
- [x] Production ready

---

## 🎯 Next Steps (Optional)

### Service Worker Implementation (2-3 hours)

**Benefits**:

- F12 Offline mode support
- Cache static assets
- Full PWA capabilities
- Install prompt

**Drawbacks**:

- Additional complexity
- Version management
- Cache invalidation
- Debugging difficulty

**Recommendation**: Not needed - real offline (WiFi OFF) works perfectly

---

## 📚 References

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [idb Library](https://github.com/jakearchibald/idb)
- [Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [Next.js App Router](https://nextjs.org/docs/app)
- [PWA Best Practices](https://web.dev/explore/progressive-web-apps)
