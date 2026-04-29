# 🚀 SF Production Kanban - Railway Deployment Guide

## Fitur Aplikasi
✅ Real-time WebSocket update (Socket.IO)
✅ Multi-device sync tanpa refresh
✅ Status production kanban yang dinamis
✅ Reset data functionality
✅ **NEW:** Multi-section support (Treatment Area & StockFit)
✅ **NEW:** Separate data storage per section
✅ **NEW:** Section selection modal on first load

---

## Multi-Section Feature (NEW)

Aplikasi sekarang mendukung **2 area terpisah** dengan data yang tidak tercampur:
- 🏥 **Treatment Area** - Data tersimpan terpisah
- 📦 **StockFit** - Data tersimpan terpisah

Data masing-masing area disimpan di:
- Server: `data_treatment.json` dan `data_stockfit.json`
- Browser: `kanban_status_treatment` dan `kanban_status_stockfit` (localStorage)

---

## Step 1: Push Kode ke GitHub 

✅ Sudah dilakukan! Code dengan fitur multi-section sudah ter-push.

Jika ada update lagi, gunakan:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

---

## Step 2: Deploy ke Railway.app

### 2.1 Buka Railway
- Go to: https://railway.app
- Klik **"Login"** (atau sign up dengan GitHub)

### 2.2 Create New Project (atau update existing)
- Jika sudah pernah deploy, Railway akan **otomatis redeploy** setelah push ke GitHub
- Jika belum pernah, klik **"Create New Project"**
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
- ✅ Persisten data files: `data_treatment.json` dan `data_stockfit.json`

---

## Step 3: Akses Aplikasi

Setelah deployment selesai (~2-5 menit):

1. Buka domain yang diberikan Railway
2. Pilih area: **Treatment Area** atau **StockFit**
3. Aplikasi akan berjalan dengan real-time WebSocket
4. Buka dari multiple devices/browsers
5. Update data di satu device, langsung muncul di semua device lain!

---

## 📱 Testing Real-Time Sync dengan Multi-Section

```
Device 1 (Treatment Area):  https://your-railway-url.up.railway.app
Device 2 (StockFit):        https://your-railway-url.up.railway.app
Device 3 (Treatment Area):  https://your-railway-url.up.railway.app

Hasil:
- Update Treatment Area di Device 1 → Terlihat di Device 3 (same section)
- Update StockFit di Device 2 → Tidak terlihat di Device 1 & 3 (different section)
- Setiap device bisa beda section yang dipilih
- Data tetap terpisah dan tidak mix ✨
```

---

## 📋 Verifikasi Deploy Status Railway

Untuk mengecek status deployment di Railway:

1. Login ke https://railway.app
2. Pilih project "SF Production Kanban"
3. Lihat status deployment di bagian "Deployments"
4. Jika terlihat **"Success"** = Sudah deploy dan live ✅
5. Jika terlihat **"Building"** = Sedang deploy (tunggu ~1-3 menit)

---

## ⚙️ Cara Update Kode Mendatang

Setiap kali ada perubahan:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Railway akan **auto-redeploy** dalam ~30 detik! Tidak perlu setup ulang.

---

## 🔧 Environment Variables (jika perlu)

Jika di masa depan perlu setup environment variables:

1. Di Railway dashboard → Pilih project
2. Klik tab **"Variables"**
3. Tambahkan variabel yang diperlukan

Saat ini tidak perlu, karena semua config sudah default.

---

## 🔗 Bonus: Custom Domain (Optional)

Di Railway dashboard, bisa setup custom domain seperti:
- `kanban.company.com`
- Tapi free tier sudah cukup dengan railway.app domain

---

## ✅ Deployment Checklist

- [x] Code pushed ke GitHub
- [ ] GitHub repo connected ke Railway
- [ ] Railway deployment selesai (lihat status "Success")
- [ ] Bisa akses dari Railway domain
- [ ] Bisa pilih Treatment Area / StockFit
- [ ] Data tersimpan terpisah per section
- [ ] Real-time update bekerja antar device

---

## 📞 Troubleshooting

**Q: Deployment gagal di Railway?**
A: Cek build logs di Railway dashboard → tab "Deployments"

**Q: Data tidak tersimpan setelah Railway restart?**
A: Data files (`data_treatment.json`, `data_stockfit.json`) perlu disimpan di Railway storage (bisa tambahkan nanti)

**Q: Beda section A dan B tercampur?**
A: Tidak seharusnya. Cek browser console untuk error, atau clear localStorage dan coba lagi.

---

## 🎉 Selesai!

Aplikasi Anda sekarang LIVE dengan fitur multi-section yang komprehensif! 

✅ Treatment Area dan StockFit berjalan dengan data terpisah
✅ Real-time sync bekerja per section
✅ Accessible dari mana saja

Perlu bantuan? Tanya saja! 👇

---
**Last Updated:** 29 April 2026
**Version:** 2.0 (Multi-Section Support)
