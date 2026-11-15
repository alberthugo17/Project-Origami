# Origami: NASA Planetary Analog Explorer

**Planetary Analog & Aerospace Material Explorer**: aplikasi web geospasial interaktif untuk memetakan situs analog di Bumi bagi calon lokasi pendaratan dan markas di **Bulan** dan **Mars**, sekaligus mengevaluasi kecocokan material dirgantara pada setiap lokasi.

Dikembangkan untuk **NASA Space Apps Challenge, Local Event Surabaya (14-15 November 2026)**.

## Tim CyberLife - BT

| No | Nama Anggota |
| -- | ------------ |
| 1 | Hugo Antonio Hien Wijaya |
| 2 | I Kadek Mahesa Arta Wibawa |
| 3 | Yosua Gavrilla Santoso |
| 4 | Nirwasita Dwi Ardiyanti |

Teknologi: React 19, TypeScript, Tailwind CSS v4, Leaflet (citra satelit Esri), Motion, dan Vite. **Tidak membutuhkan API key.**

## Cara Menjalankan Program

> Proyek ini harus dibangun (build) dulu. Membuka `index.html` dengan klik dua kali akan menampilkan halaman kosong. Gunakan salah satu cara di bawah.

**Kebutuhan:** [Node.js LTS](https://nodejs.org) versi 20 atau lebih baru, serta koneksi internet (untuk peta satelit dan font).

### Cara cepat

- **Windows:** klik dua kali `run.bat`
- **Mac / Linux:** jalankan `./run.sh` di terminal (jika belum bisa dijalankan: `chmod +x run.sh`)

Script akan memasang dependensi, membangun aplikasi, lalu menjalankannya di **http://localhost:4173**. Tekan `Ctrl+C` untuk berhenti.

### Cara manual

```bash
npm install        # pasang dependensi (sekali saja)
npm run dev        # mode pengembangan: http://localhost:3000
```

atau untuk versi hasil build:

```bash
npm start          # build lalu jalankan di http://localhost:4173
```

### Perintah lain

| Perintah | Fungsi |
| -------- | ------ |
| `npm run build` | Membangun aplikasi ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build yang sudah ada |
| `npm run lint` | Pengecekan tipe TypeScript |

### Online lewat GitHub Pages

1. Push repo ke GitHub (cabang `main`).
2. Buka **Settings > Pages > Source** lalu pilih **GitHub Actions**.
3. Tunggu workflow "Deploy to GitHub Pages" selesai di tab **Actions**. Situs aktif di `https://USERNAME.github.io/NAMA-REPO/`.

## Fitur Aplikasi

### 1. Peta Interaktif Situs Analog
- **14 situs analog** di 6 bioma (Volcanic, Desert, Polar, Impact Crater, Cave / Lava Tube, Hydrothermal), termasuk 2 situs Indonesia: Kawah Ijen dan Gunung Bromo / Lautan Pasir Tengger.
- **Pencarian cepat** berdasarkan nama, negara, atau bioma, dengan saran instan dan penanda *Top Finding*.
- **Filter target misi** (Semua, Bulan, Mars). Pin biru untuk Bulan, merah untuk Mars, dan pin belah biru-merah untuk analog ganda (Bulan dan Mars).
- **Katalog situs** (drawer) yang diurutkan mengikuti filter aktif, serta tombol riwayat kunjungan Sebelumnya / Berikutnya.
- Kontrol zoom, **legenda warna pin**, **bar skala**, dan koordinat dalam format DMS.
- **4 kombinasi tampilan**: gaya *Realistis* (citra satelit Esri) atau *Kartun Lo-Fi* (peta vektor dengan stiker bertema luar angkasa), masing-masing dalam tema **Gelap** atau **Terang**.
- Peta tetap aktif di latar belakang saat berpindah halaman, sehingga posisi zoom tidak hilang.
- Tampilan responsif untuk desktop dan mobile.

### 2. Panel Analisis Situs
Klik pin atau situs di katalog untuk menerbangkan peta ke lokasi tersebut dan membuka panel yang berisi:
- Identitas situs: negara, elevasi, bioma, dan **status validasi** (Resmi NASA/ESA, Jurnal Peer-Reviewed, atau Eksploratif Lokal).
- **Skor kemiripan Bulan dan Mars** (maksimum realistis 91,5%) beserta rincian 4 komponen: Geologi & Mineralogi, Terrain & Morfologi, Iklim & Suhu, serta Validasi & Heritage Misi.
- Profil suhu, pH permukaan, kekasaran medan, dan **jendela musim uji terbaik** beserta eksperimen yang disarankan.
- **Top 5 material** paling cocok untuk situs tersebut, lengkap dengan alasan teknis.
- Tautan ke sumber data, DOI ilmiah, dan NASA NTRS.

### 3. Info Material
- Basis pengetahuan **12 material dirgantara** (Orthofabric, Aluminized Kapton, Aerogel Silika, Ti-6Al-4V, Nitinol, CFRP-PEEK, Al 7075-T6, Hastelloy C-276, Vectran/Kevlar, Fluorosilicone, Keramik SiC, dan Safir lapis emas).
- Filter 4 kategori: Spacesuit & EVA, Transportasi & Rover, Peralatan & Sensor, Struktur & Habitat.
- Spesifikasi lengkap tiap material: densitas, rentang suhu kerja, ketahanan korosi, keterbatasan lapangan, dan rujukan ilmiah.
- **Simulator lokasi**: pilih situs untuk melihat skor kecocokan material dan justifikasi rekayasanya (skala 28% sampai 92%, ambang layak 65%).

### 4. Bandingkan Lokasi (A vs B)
- Pilih 2 pin langsung dari peta (panduan 0/2, 1/2, 2/2).
- Perbandingan selisih suhu rata-rata dan ayunan diurnal, pemenang tiap komponen skor, serta Top 5 material masing-masing lokasi.
- Filter kebutuhan misi dan sorotan **material bersama** yang layak di kedua lokasi.

### 5. Sumber Data
- Katalog **13 dataset resmi** dari NASA, ESA, JAXA, USGS, PGC ArcticDEM, BIG/PVMBG, dan Esri, lengkap dengan instrumen, resolusi, dan peran tiap dataset.
- Filter berdasarkan target (Bulan, Mars, Bumi) dan tautan ke dokumen analisis data (`public/docs/analisis-data.pdf`).

## Struktur Proyek

```
.
├── src/
│   ├── App.tsx, main.tsx, index.css
│   ├── components/     Peta, panel analisis, perbandingan, info material, sumber data
│   ├── data/           Data situs analog, material, sumber data, garis pantai
│   ├── types/          Token tema (gelap/terang, realistis/kartun)
│   └── utils/          Skoring situs, pencocokan material, filter, geoMath (+ unit test)
├── public/             Aset statis (logo, PDF analisis data, PDF pitch deck)
├── .github/workflows/  Otomatisasi deploy ke GitHub Pages (deploy.yml)
├── Proposal_Origami_CyberLife_BT.docx
├── Origami_Pitch_Deck_Updated.pptx
├── run.bat / run.sh    Script menjalankan aplikasi
└── package.json, vite.config.ts, tsconfig.json, index.html
```

## Catatan

Data dan skor di aplikasi adalah ringkasan untuk keperluan kompetisi dan demo. Verifikasi ke sumber resmi (NASA, ESA, USGS) sebelum dipakai sebagai rujukan ilmiah.
