# 🚀 SF Production Kanban - Railway Deployment Guide

## Fitur Aplikasi
✅ Real-time WebSocket update (Socket.IO)
✅ Multi-device sync tanpa refresh
✅ Status production kanban yang dinamis
✅ Reset data functionality

---

## Step 1: Push Kode ke GitHub 

Jalankan di terminal project ini:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sf-production-kanban.git
git push -u origin main
```

**Catatan:** Ganti `YOUR_USERNAME` dengan username GitHub Anda.

---

## Step 2: Deploy ke Railway.app

### 2.1 Buka Railway
- Go to: https://railway.app
- Klik **"Login"** (atau sign up dengan GitHub)

### 2.2 Create New Project
- Klik **"Create New Project"**
- Pilih **"Deploy from GitHub repo"**

### 2.3 Connect GitHub
- Authorize Railway untuk akses GitHub
- Pilih repository: **sf-production-kanban**
- Klik **"Deploy"**

### 2.4 Railway akan otomatis:
- ✅ Detect Node.js project
- ✅ Install dependencies (npm install)
- ✅ Run `npm start`
- ✅ Assign public domain (misal: `sf-kanban-prod.up.railway.app`)

---

## Step 3: Akses Aplikasi

Setelah deployment selesai (~2-5 menit):

1. Buka domain yang diberikan Railway
2. Aplikasi akan berjalan dengan real-time WebSocket
3. Buka dari multiple devices/browsers
4. Update data di satu device, langsung muncul di semua device lain!

---

## 📱 Testing Real-Time Sync

```
Device 1: https://your-railway-url.up.railway.app
Device 2: https://your-railway-url.up.railway.app (same link)
Device 3: https://your-railway-url.up.railway.app (same link)

Update data di Device 1 → Lihat update real-time di Device 2 & 3 ✨
```

---

## ⚙️ Cara Update Kode

Jika nanti ada perubahan:

```bash
git add .
git commit -m "Update description"
git push
```

Railway akan **auto-redeploy** dalam ~30 detik!

---

## 🔗 Bonus: Custom Domain (Optional)

Di Railway dashboard, bisa setup custom domain seperti:
- `kanban.company.com`
- Tapi free tier sudah cukup dengan railway.app domain

---

## ✅ Selesai!

Aplikasi Anda sekarang LIVE dan accessible dari mana saja dengan real-time sync! 🎉

Perlu bantuan? Tanya saja! 👇
