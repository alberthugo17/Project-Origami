export type DataBodyFilter = 'Semua' | 'Bumi' | 'Bulan' | 'Mars';

export interface DataSourceItem {
  id: string;
  agency: string;
  missionOrPlatform: string;
  instrument: string;
  targetBody: 'Bumi' | 'Bulan' | 'Mars';
  resolution: string;
  variablesExtracted: string;
  roleInAnalysis: string;
  datasetIdentifier: string;
  accessUrl: string;
}

export const DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'nasa-lro-lola',
    agency: 'NASA',
    missionOrPlatform: 'Lunar Reconnaissance Orbiter (LRO)',
    instrument: 'LOLA (Lunar Orbiter Laser Altimeter) & LROC NAC',
    targetBody: 'Bulan',
    resolution: '0.5 m – 5 m/px (LROC) · 5 m DEM (LOLA)',
    variablesExtracted: 'Elevasi absolut, kemiringan lereng (slope), kekasaran permukaan, zona bayangan permanen (PSR)',
    roleInAnalysis:
      'Menjadi acuan morfometri kawah sederhana dan tepi mare (Mare Tranquillitatis, Shackleton Rim) untuk mencocokkan gradien lereng Gunung Bromo, Barringer Crater, dan Haughton Crater.',
    datasetIdentifier: 'LRO-L-LOLA-4-GDR-V1.0 / LROC-NAC-CDR',
    accessUrl: 'https://imbrium.mit.edu/ / https://wms.lroc.asu.edu/',
  },
  {
    id: 'nasa-mro-hirise',
    agency: 'NASA / JPL / Univ. of Arizona',
    missionOrPlatform: 'Mars Reconnaissance Orbiter (MRO)',
    instrument: 'HiRISE (High Resolution Imaging Science Experiment)',
    targetBody: 'Mars',
    resolution: '0.25 – 0.50 m/px (Stereoscopic DTM ~1 m)',
    variablesExtracted: 'Densitas bongkah batu (boulder hazard), panjang gelombang bukit pasir, fraktur poligonal permafrost',
    roleInAnalysis:
      'Membandingkan distribusi ukuran bongkah dan pola poligon permafrost dengan Ubehebe/Death Valley, Atacama, dan Haughton Impact Crater untuk kelayakan pendaratan rover.',
    datasetIdentifier: 'MRO-M-HIRISE-3-RDR-V1.1',
    accessUrl: 'https://www.uahirise.org/catalog/',
  },
  {
    id: 'nasa-mro-crism',
    agency: 'NASA / JHU-APL',
    missionOrPlatform: 'Mars Reconnaissance Orbiter (MRO)',
    instrument: 'CRISM (Compact Reconnaissance Imaging Spectrometer for Mars)',
    targetBody: 'Mars',
    resolution: '18 m/px (Targeted SWIR/VNIR 0.36–3.92 µm)',
    variablesExtracted: 'Pita serapan mineral (piroksen, plagioklas, jarosite, alunit, karbonat, perklorat)',
    roleInAnalysis:
      'Mencocokkan sidik jari spektral mineral basaltik-andesitik Gunung Bromo, mineral alterasi asam Kawah Ijen/Río Tinto, dan karbonat Svalbard dengan Kawah Jezero dan Gale.',
    datasetIdentifier: 'MRO-M-CRISM-3-TRDR-V1.0',
    accessUrl: 'https://ode.rsl.wustl.edu/mars/',
  },
  {
    id: 'nasa-themis',
    agency: 'NASA / ASU',
    missionOrPlatform: '2001 Mars Odyssey',
    instrument: 'THEMIS (Thermal Emission Imaging System)',
    targetBody: 'Mars',
    resolution: '100 m/px (Thermal IR) · 18 m/px (VIS)',
    variablesExtracted: 'Inersia termal permukaan (TIU), komposisi batuan silikat-basaltik, suhu diurnal regolith',
    roleInAnalysis:
      'Mengkalibrasi ukuran butiran efektif dan kepadatan pasir/tefra gembur di Gunung Bromo, Death Valley, dan Qaidam Basin terhadap zona pendaratan Mars.',
    datasetIdentifier: 'ODY-M-THM-3-IRRDR-V2.0',
    accessUrl: 'https://themis.asu.edu/',
  },
  {
    id: 'nasa-srtm',
    agency: 'NASA / NGA / USGS',
    missionOrPlatform: 'Shuttle Radar Topography Mission (SRTM) & ASTER GDEM',
    instrument: 'C-Band Interferometric SAR & ASTER VNIR Stereo',
    targetBody: 'Bumi',
    resolution: '30 m (1 arc-second Global DEM)',
    variablesExtracted: 'Topografi digital global, kemiringan (slope), aspek lereng, dan Terrain Ruggedness Index (TRI)',
    roleInAnalysis:
      'Menghitung metrik kekasaran topografi dan gradien dinding kaldera pada seluruh 14 situs analog Bumi agar sebanding langsung dengan data LOLA dan HiRISE DTM.',
    datasetIdentifier: 'SRTMGL1 v003 / ASTGTM v003',
    accessUrl: 'https://earthdata.nasa.gov/',
  },
  {
    id: 'nasa-earthdata-modis',
    agency: 'NASA EOSDIS',
    missionOrPlatform: 'Terra & Aqua Satellites',
    instrument: 'MODIS (MOD11A2 LST & MCD43A3 Albedo)',
    targetBody: 'Bumi',
    resolution: '500 m – 1 km (Multi-year Climatology)',
    variablesExtracted: 'Albedo permukaan broadband (shortwave), suhu permukaan tanah (LST), indeks ariditas dan tutupan vegetasi NDVI',
    roleInAnalysis:
      'Mengidentifikasi zona tanpa vegetasi (NDVI < 0.08) beralbedo rendah seperti Lautan Pasir Bromo maupun daerah hiper-arid dingin seperti McMurdo Dry Valleys.',
    datasetIdentifier: 'MOD11A2.061 / MCD43A3.061',
    accessUrl: 'https://lpdaac.usgs.gov/',
  },
  {
    id: 'esa-sentinel2',
    agency: 'ESA (European Space Agency)',
    missionOrPlatform: 'Copernicus Sentinel-2A / 2B',
    instrument: 'MSI (Multispectral Instrument — 13 Bands VNIR/SWIR)',
    targetBody: 'Bumi',
    resolution: '10 m – 20 m/px',
    variablesExtracted: 'Reflektansi SWIR (Band 11 & 12), rasio oksida besi (B4/B2), indeks mineral lempung dan sulfat',
    roleInAnalysis:
      'Memetakan batas mineralogi tephra basaltik segar di Gunung Bromo serta zona alterasi sulfat di Kawah Ijen, Dallol, dan Río Tinto.',
    datasetIdentifier: 'COPERNICUS/S2_SR_HARMONIZED',
    accessUrl: 'https://dataspace.copernicus.eu/',
  },
  {
    id: 'esa-mars-express',
    agency: 'ESA',
    missionOrPlatform: 'Mars Express (MEX)',
    instrument: 'HRSC (High Resolution Stereo Camera) & OMEGA',
    targetBody: 'Mars',
    resolution: '12.5 m/px (HRSC) · 300 m–4 km (OMEGA)',
    variablesExtracted: 'Model elevasi regional Mars, mineralogi terhidrasi (filosilikat & sulfat)',
    roleInAnalysis:
      'Menyediakan konteks geologi cekungan Eridania, Meridiani Planum, dan Nili Fossae dalam analisis analog hidrotermal.',
    datasetIdentifier: 'MEX-M-HRSC-5-REFDR-DTM-V1.0',
    accessUrl: 'https://archives.esac.esa.int/psa/',
  },
  {
    id: 'usgs-astrogeology',
    agency: 'USGS Astrogeology Science Center',
    missionOrPlatform: 'Planetary Geologic Mapping & Lunar Simulant Reference',
    instrument: 'Apollo Sample Catalog, JSC-1A / LMS-1 / MMS Benchmarks',
    targetBody: 'Bulan',
    resolution: 'Sampel Laboratorium & Peta Geologi 1:500.000',
    variablesExtracted: 'Komposisi geokimia mayor (SiO₂, FeO, TiO₂, Al₂O₃), distribusi ukuran partikel, sudut geser internal',
    roleInAnalysis:
      'Mengukur kesesuaian geokimia batuan basaltik Mauna Kea, Craters of the Moon, dan pasir vulkanik Tengger Bromo terhadap simulan regolith Bulan.',
    datasetIdentifier: 'USGS-SIM-2023 / APOLLO-LS-COMP',
    accessUrl: 'https://astrogeology.usgs.gov/',
  },
  {
    id: 'jaxa-selene',
    agency: 'JAXA (Japan Aerospace Exploration Agency)',
    missionOrPlatform: 'SELENE (Kaguya)',
    instrument: 'Terrain Camera (TC) & Multiband Imager (MI)',
    targetBody: 'Bulan',
    resolution: '10 m/px (TC Stereo) · 20 m/px (MI)',
    variablesExtracted: 'Peta kelimpahan FeO dan TiO₂ global Bulan, profil skylight dan lubang lava vulkanik',
    roleInAnalysis:
      'Menjadi pembanding langsung dimensi lubang skylight Marius Hills terhadap tabung lava Kazumura serta morfologi kawah mare basaltik.',
    datasetIdentifier: 'SELENE-L-MI-5-MAP-V1.0',
    accessUrl: 'https://darts.isas.jaxa.jp/planet/pdap/selene/',
  },
  {
    id: 'pvmbg-demnas',
    agency: 'Badan Geologi (PVMBG) & BIG Indonesia',
    missionOrPlatform: 'DEMNAS Nasional & Pemantauan Kaldera Jawa Timur',
    instrument: 'IFSAR / Stereo DEM & Analisis Petrografi Tephra Lapangan',
    targetBody: 'Bumi',
    resolution: '8.25 m (0.27 arc-second DEMNAS)',
    variablesExtracted: 'Elevasi detail Kaldera Tengger–Bromo, stratigrafi abu vulkanik, batas zona bahaya SO₂',
    roleInAnalysis:
      'Memungkinkan karakterisasi resolusi sangat tinggi atas Lautan Pasir Tengger sebagai kandidat temuan teratas situs analog regolith basaltik di kawasan ekuator.',
    datasetIdentifier: 'BIG-DEMNAS-1607-BROMO / PVMBG-TGR-2024',
    accessUrl: 'https://tanahair.indonesia.go.id/demnas/',
  },
  {
    id: 'leaflet-openstreetmap-esri',
    agency: 'Esri & OpenStreetMap Contributors',
    missionOrPlatform: 'World Imagery & World Boundaries Reference',
    instrument: 'High-Resolution Orbital & Aerial Mosaic via Leaflet',
    targetBody: 'Bumi',
    resolution: 'Sub-meter hingga 15 m (Global Mosaic)',
    variablesExtracted: 'Citra satelit global terkalibrasi, batas negara, nama kota, dan topografi permukaan Bumi',
    roleInAnalysis:
      'Menyediakan peta dasar satelit interaktif resolusi tinggi serta konteks wilayah administratif untuk penempatan pin analog dan navigasi kaldera.',
    datasetIdentifier: 'ESRI-WORLD-IMAGERY / BOUNDARIES',
    accessUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
  },
];
