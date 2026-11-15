# TerraAnalog: NASA Planetary Analog Explorer

Peta interaktif situs analog di Bumi untuk lokasi pendaratan dan markas di Bulan dan Mars. Dibangun dengan React, Vite, TypeScript, Tailwind, dan Leaflet (peta citra Esri). **Tidak butuh API key.**

> Proyek ini harus dibangun dulu. Membuka `index.html` dengan klik dua kali akan menampilkan halaman kosong. Gunakan salah satu cara di bawah.

## Menjalankan di lokal
Kebutuhan: Node.js LTS (20 atau lebih baru, https://nodejs.org) dan koneksi internet (peta, font).

- **Windows:** klik dua kali `run.bat`
- **Mac/Linux:** `./run.sh`
- **Manual:** `npm install`, lalu `npm run dev` (http://localhost:3000) atau `npm start` (http://localhost:4173)

## Online lewat GitHub Pages
1. Push repo ke GitHub (cabang `main`).
2. Settings > Pages > Source: **GitHub Actions**.
3. Tunggu workflow "Deploy to GitHub Pages" selesai di tab Actions. Situs aktif di `https://USERNAME.github.io/NAMA-REPO/`.

## Struktur singkat
- `src/components/`: halaman dan komponen (peta, panel analisis, perbandingan, sumber data).
- `src/data/`: data situs analog, material, dan sumber data.
- `src/utils/`: perhitungan geografi dan pencocokan material (`geoMath.test.ts` berisi tes).
- `.github/workflows/deploy.yml`: otomatisasi deploy.

Catatan: data dan skor di aplikasi adalah ringkasan untuk demo. Verifikasi ke sumber resmi (NASA, ESA, USGS) sebelum dipakai sebagai rujukan ilmiah.
