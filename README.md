# SF Production Kanban Status System

Interactive Hourly Production Kanban board yang dapat diakses via IP Hosting.

## Fitur

✅ **Interactive Circles** - Tap untuk memilih status
✅ **Real-time Updates** - Perubahan langsung terlihat
✅ **Data Persistence** - Data tersimpan di localStorage (browser) dan server
✅ **Network Access** - Bisa diakses dari perangkat lain via IP
✅ **Responsive Design** - Kompatibel dengan desktop dan mobile
✅ **Multi-Section Support** - Data terpisah untuk Treatment Area dan StockFit
✅ **Section Selection** - Pilih area saat pertama kali masuk

## Status Colors

- 🟢 **GREEN (OK)** - Production SF Selesai / Already taken by assembly
- 🟡 **YELLOW** - Sudah 50%+
- 🔴 **RED** - Under 50%
- ⚫ **EMPTY** - Belum ada data

## Sistem Multi-Section

Sistem ini sekarang mendukung **2 area terpisah** dengan data yang tidak tercampur:
- **🏥 Treatment Area** - Data treatment area tersimpan terpisah
- **📦 StockFit** - Data stockfit tersimpan terpisah

### Cara Kerja Multi-Section:
1. Saat pertama kali membuka aplikasi, akan ada modal pemilihan area
2. Pilih **Treatment Area** atau **StockFit**
3. Setiap area memiliki data kanban tersendiri yang tidak tercampur
4. Tombol **🔀** di header untuk berpindah ke area lain
5. Data setiap area tersimpan di:
   - **Browser localStorage**: Untuk akses lokal
   - **Server files**: 
     - `data_treatment.json` untuk Treatment Area
     - `data_stockfit.json` untuk StockFit

## Cara Menggunakan

### Metode 1: Buka File Langsung (Paling Sederhana)
```bash
1. Buka file index.html di browser (double-click atau drag ke browser)
2. Pilih area: Treatment Area atau StockFit
3. Klik circle untuk membuka menu pilihan status
4. Pilih salah satu status
5. Data akan tersimpan otomatis (terpisah per area)
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
- Local: http://localhost:1234
- Network: http://[YOUR_IP]:1234
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
├── index.html              # Main HTML file
├── style.css               # Styling
├── script.js               # Client-side logic
├── server.js               # Node.js server (multi-section support)
├── package.json            # Dependencies
├── data_treatment.json     # Data file untuk Treatment Area
├── data_stockfit.json      # Data file untuk StockFit
└── README.md              # This file
```

## Cara Kerja

1. **Buka aplikasi** → Pilih area (Treatment Area atau StockFit)
2. **Klik circle** pada tabel kanban
3. **Modal popup** akan muncul dengan 4 pilihan status
4. **Pilih status** yang sesuai
5. **Circle berubah warna** dan data tersimpan otomatis
6. **Ganti area** dengan klik tombol 🔀 untuk melihat data area lain

## Catatan Penting

### Data Persistence
- Data **Treatment Area** dan **StockFit** disimpan **TERPISAH**
- Data tersimpan di **localStorage** (per browser per device)
- Saat server jalan, data juga tersimpan di `data_treatment.json` dan `data_stockfit.json`
- Jika ingin shared data across multiple devices dengan real-time update, pastikan server jalan

### Switching Between Areas
- Klik tombol 🔀 di header untuk berpindah area
- Semua data area yang sebelumnya akan tetap tersimpan
- Tidak ada percampuran data antar area

### Data Backup
- Data Treatment Area: `data_treatment.json`
- Data StockFit: `data_stockfit.json`
- Backup ini otomatis dibuat saat server jalan

## Troubleshooting

**Q: Data tidak tersimpan?**
A: Pastikan:
1. Browser tidak dalam mode Incognito/Private (localStorage tidak bekerja di mode tersebut)
2. Jika menggunakan server, pastikan server running dengan `npm start`

**Q: Data dari area A tertampil di area B?**
A: Ini seharusnya tidak terjadi. Coba:
1. Bersihkan localStorage browser dengan membuka DevTools (F12) → Console
2. Ketik: `localStorage.clear()`
3. Refresh halaman dan pilih area lagi

**Q: Tidak bisa akses dari perangkat lain?**
A: Pastikan:
1. Server Node.js berjalan dengan `npm start`
2. Firewall tidak memblokir port 1234
3. Gunakan IP address yang benar (bukan localhost)
4. Contoh: http://192.168.1.100:1234

**Q: Ingin mengubah jumlah line/jam?**
A: Edit file script.js:
```javascript
const LINES = ['E3', 'E4', 'E5', 'E6']; // Ubah di sini
const JAMS = ['JAM 1', 'JAM 2', 'JAM 3', 'JAM 4', 'JAM 5', 'JAM 6', 'JAM 7', 'JAM 8', 'JAM 9', 'JAM 10']; // dan di sini
```

**Q: Bagaimana cara reset data satu area saja?**
A: 
1. Pilih area yang ingin direset
2. Klik tombol 🔄 (Reset) di header
3. Hanya data area tersebut yang akan direset, area lain tetap aman

## Pengembangan Lebih Lanjut

Untuk fitur advanced:
- User authentication per area
- History/Log tracking per area
- Export to Excel per area
- Real-time sync across multiple devices
- Mobile app version
- API integration

Hubungi developer untuk fitur tambahan! 📞

---
**Last Updated:** 29 April 2026
**Version:** 2.0 (Multi-Section Support)
