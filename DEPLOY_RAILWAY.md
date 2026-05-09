# 🚀 Deploy ke Railway.app

## Step 1: Buat GitHub Repository

1. Buka https://github.com/new
2. Nama repo: `sf-production-kanban`
3. Klik "Create repository"
4. Jangan initialize dengan README (karena sudah ada)

## Step 2: Push ke GitHub

Jalankan commands ini di terminal project:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sf-production-kanban.git
git push -u origin main
```

(Ganti `YOUR_USERNAME` dengan username GitHub Anda)

## Step 3: Deploy ke Railway

1. Buka https://railway.app
2. Klik "Create New Project"
3. Pilih "Deploy from GitHub repo"
4. Connect GitHub account Anda
5. Pilih repo `sf-production-kanban`
6. Railway akan otomatis detect Node.js project
7. Klik "Deploy"

## Step 4: Configure Environment

Railway akan otomatis:
- Detect `package.json` dan install dependencies
- Run `npm start` (sesuai dengan script di package.json)
- Assign domain (contoh: `https://sf-kanban.up.railway.app/`)

## Selesai! ✅

Aplikasi Anda akan live di URL yang diberikan Railway dengan real-time WebSocket berjalan lancar!

### Tips:
- Gunakan public URL dari Railway untuk buka dari device lain
- Real-time update akan tetap bekerja across all devices
- Free tier Railway cukup untuk kebutuhan ini

---

Sudah siap? Mau saya bantu step-by-step? 👇
