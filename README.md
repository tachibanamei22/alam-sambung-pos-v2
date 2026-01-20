# Alam Sambung POS

**Alam Sambung POS** is a simple, offline-first Point of Sale (POS) web app built for small merchandise booths, such as anime convention stalls.

The app is designed to be:

- ✅ Easy to use
- ✅ Fully offline after installation
- ✅ Single-device friendly
- ✅ No server, no account, no cloud dependency

---

## ✨ Features

### 📦 Items Management

- Add items with:
  - Name
  - Price
  - Stock
  - Optional image
- Edit item name, price, and image
- Increase / decrease stock
- Delete items that are no longer sold  
  _(sales history remains safe)_

### 🛒 Checkout

- Tap items to add to cart
- Increase / decrease quantity safely (no overselling)
- Automatic total calculation
- One-tap **Complete Sale**

### 📊 Recap

- View all past transactions
- See total sales and transaction count
- Item names and quantities are preserved per sale
- **Reset Event** button to start a new convention/day

### 📱 PWA (Installable App)

- Installable on:
  - Android (Chrome)
  - iPhone / iPad (Safari)
  - Desktop (Chrome / Edge)
- Works fully offline after first install
- Data stored locally on the device (IndexedDB)

---

## 🧠 Design Philosophy

- **Offline-first**: internet is not required during events
- **Single-device POS**: avoids sync conflicts and human error
- **Low learning curve**: usable by non-technical users
- **Local data ownership**: no external servers

---

## 🚀 Getting Started (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Run on local network (for phone / tablet testing)

```bash
npm run dev -- --host
```

Then open the **Network URL** shown in terminal on your phone/tablet browser.

---

## 📲 Install on Phone / Tablet (PWA)

### Android (Chrome)

1. Open the app URL in Chrome
2. Tap menu (⋮)
3. Select **Add to Home Screen**

### iPhone / iPad (Safari only)

1. Open the app URL in Safari
2. Tap **Share**
3. Select **Add to Home Screen**

> ⚠️ Chrome on iOS does NOT support PWA install — use Safari.

---

## 📴 Offline Usage

After installation:

- The app works without internet
- Data is saved locally on the device
- Do **NOT** clear browser data unless you want to reset everything

---

## 🔄 Event Reset

Use **Reset Event** in the Recap page to:

- Clear all sales history
- Start a new convention/day
- Keep items and stock intact

---

## ⚠️ Important Notes

- This app is designed for **one device per booth**
- Data does **not sync** across devices
- Sharing the app link does not share data
- Do not use incognito/private mode

---

## 🛠 Tech Stack

- **React + TypeScript**
- **Vite**
- **IndexedDB (Dexie.js)**
- **PWA (Service Worker)**

---

## 📄 License

This project is intended for personal and small business use.
You are free to modify and adapt it for your own needs.

---

## 🙌 Acknowledgements

Built with the goal of helping small creators manage sales more easily at events and conventions.
