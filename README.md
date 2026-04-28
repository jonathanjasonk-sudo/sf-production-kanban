# SF Production Kanban Status System

Interactive Hourly Production Kanban board yang dapat diakses via IP Hosting.

## Fitur

✅ **Interactive Circles** - Tap untuk memilih status
✅ **Real-time Updates** - Perubahan langsung terlihat
✅ **Data Persistence** - Data tersimpan di localStorage (browser)
✅ **Network Access** - Bisa diakses dari perangkat lain via IP
✅ **Responsive Design** - Kompatibel dengan desktop dan mobile

## Status Colors

- 🟢 **GREEN (OK)** - Production SF Selesai / Already taken by assembly
- 🟡 **YELLOW** - Sudah 50%+
- 🔴 **RED** - Under 50%
- ⚫ **EMPTY** - Belum ada data

## Cara Menggunakan

### Metode 1: Buka File Langsung (Paling Sederhana)
```bash
1. Buka file index.html di browser (double-click atau drag ke browser)
2. Klik circle untuk membuka menu pilihan status
3. Pilih salah satu status
4. Data akan tersimpan otomatis
```

### Metode 2: Jalankan via Node.js Server (Rekomendasi untuk Network)

**Persyaratan:**
- Node.js terinstall

**Setup:**
```bash
1. Buka Command Prompt / Terminal
2. Navigasi ke folder SF Project:
   cd "c:\Users\pw0kc\Desktop\SF Project"

3. Install dependencies:
   npm install

4. Jalankan server:
   npm start
```

**Akses:**
- Local: http://localhost:3000
- Network: http://[YOUR_IP]:3000
  (Ganti [YOUR_IP] dengan IP address komputer Anda)

Untuk cari IP address Anda:
```bash
# Windows Command Prompt
ipconfig

# Linux / Mac
ifconfig
```

## Struktur File

```
SF Project/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Client-side logic
├── server.js           # Node.js server (optional)
├── package.json        # Dependencies
└── README.md          # This file
```

## Cara Kerja

1. **Klik circle** pada tabel kanban
2. **Modal popup** akan muncul dengan 4 pilihan status
3. **Pilih status** yang sesuai
4. **Circle berubah warna** dan data tersimpan secara otomatis

## Catatan Penting

- Data tersimpan di **localStorage** (per browser per device)
- Jika ingin data shared across multiple devices, perlu database backend (bisa ditambahkan kemudian)
- Saat ini data tidak akan hilang meskipun browser ditutup (localStorage persistent)
- Untuk reset semua data: Buka DevTools (F12) → Console → `localStorage.clear()`

## Troubleshooting

**Q: Data tidak tersimpan?**
A: Pastikan browser tidak dalam mode Incognito/Private. LocalStorage tidak bekerja di mode tersebut.

**Q: Tidak bisa akses dari perangkat lain?**
A: Pastikan:
1. Server Node.js berjalan
2. Firewall tidak memblokir port 3000
3. Gunakan IP address yang benar (bukan localhost)

**Q: Ingin mengubah jumlah line/jam?**
A: Edit file script.js:
```javascript
const LINES = ['E3', 'E4', 'E5', 'E6']; // Ubah di sini
const JAMS = ['JAM 1', 'JAM 2', 'JAM 3', 'JAM 4', 'JAM 5', 'JAM 6']; // dan di sini
```

## Pengembangan Lebih Lanjut

Untuk fitur advanced:
- Database backend (MySQL, MongoDB)
- User authentication
- History/Log tracking
- Export to Excel
- Real-time sync across devices

Hubungi developer untuk fitur tambahan! 📞

---
**Last Updated:** 28 April 2026
