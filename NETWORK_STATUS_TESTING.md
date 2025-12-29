# 🧪 Network Status Hook Testing Guide

## ✅ What's Implemented:

### 1. **Hook `useOnlineStatus`**

- File: `src/hooks/useOnlineStatus.ts`
- Real-time network status monitoring
- Uses `navigator.onLine` API
- Listens to `online` and `offline` events

### 2. **Visual Indicators in Navbar**

#### **Offline Banner (yellow)**

- Appears at the top when there's no connection
- Contains icon and message: "📡 Offline mode - Changes will sync when online"
- Pulsing icon animation

#### **Status Indicator (desktop)**

- Small dot on the right side of Navbar
- 🟢 Green + "Online" - connected
- 🔴 Red + "Offline" - disconnected
- Pulsing dot animation

---

## 🧪 How to Test:

### **Method 1: Chrome DevTools (easiest)**

1. Open FireSpec in Chrome
2. Press `F12` (open DevTools)
3. Go to **Network** tab
4. Find the **"No throttling"** dropdown
5. Select **"Offline"**

**What you'll see:**

- ✅ Yellow banner at top: "📡 Offline mode..."
- ✅ Red dot + "Offline" in Navbar
- ✅ Console: "🔴 Network: Offline"

6. Switch back to **"No throttling"**

**What you'll see:**

- ✅ Banner disappears
- ✅ Green dot + "Online"
- ✅ Console: "🟢 Network: Online"

---

### **Method 2: Turn Off WiFi (real test)**

1. Open FireSpec
2. Turn off WiFi on your computer
3. Observe UI changes
4. Turn WiFi back on

---

### **Method 3: Developer Console**

Open browser console and execute:

```javascript
// Simulate offline
window.dispatchEvent(new Event("offline"));

// Simulate online
window.dispatchEvent(new Event("online"));
```

---

## 📊 What to Test:

### ✅ Visual Changes:

- [ ] Banner appears when offline
- [ ] Banner disappears when online
- [ ] Dot changes color (green ↔ red)
- [ ] Text changes (Online ↔ Offline)
- [ ] Pulsing animation works

### ✅ Console Logs:

- [ ] When offline: `🔴 Network: Offline`
- [ ] When online: `🟢 Network: Online`

### ✅ Responsiveness:

- [ ] **Desktop**: Dot + text visible
- [ ] **Mobile**: Only dot visible (larger size)

---

## 🎯 Next Steps:

After successful testing, proceed to:

1. **Offline Queue** - saving requests for later synchronization
2. **PWA Manifest** - installable app
3. **Service Worker** - static file caching

---

## 🐛 Troubleshooting:

**Problem:** Indicator doesn't change

- Check console for errors
- Try reloading the page

**Problem:** Banner doesn't appear

- Make sure you're using component with `useAuth()` (Navbar only shows for authenticated users)

**Problem:** Dot not visible on desktop

- Check window width (breakpoint `sm:` = 640px)
