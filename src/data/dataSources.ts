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
  scientificReference: string;
  referenceUrl: string;
}

export const DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'nasa-lro-lola',
    agency: 'NASA',
    missionOrPlatform: 'Lunar Reconnaissance Orbiter (LRO)',
    instrument: 'LOLA (Lunar Orbiter Laser Altimeter) & LROC NAC',
    targetBody: 'Bulan',
    resolution: '0.5 m – 2 m/px (LROC NAC) · 5 m – 60 m DEM (LOLA)',
    variablesExtracted: 'Elevasi absolut, kemiringan lereng (slope), kekasaran permukaan, zona bayangan permanen (PSR)',
    roleInAnalysis:
      'Menjadi acuan morfometri kawah sederhana dan tepi mare (Mare Tranquillitatis, Shackleton Rim, Linné Crater) untuk mencocokkan gradien lereng Barringer Crater, Haughton Crater, Craters of the Moon, dan Kaldera Tengger.',
    datasetIdentifier: 'LRO-L-LOLA-4-GDR-V1.0 / LRO-L-LROC-2-EDR-V1.0',
    accessUrl: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm',
    scientificReference: 'Smith et al. (2010), Geophysical Research Letters — LRO LOLA Initial Results',
    referenceUrl: 'https://doi.org/10.1029/2010GL043751',
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
      'Membandingkan distribusi ukuran bongkah dan pola poligon permafrost dengan Ubehebe/Death Valley, Atacama, McMurdo Dry Valleys, Qaidam Basin, dan Haughton Impact Crater.',
    datasetIdentifier: 'MRO-M-HIRISE-3-RDR-V1.1',
    accessUrl: 'https://www.uahirise.org/catalog/',
    scientificReference: 'McEwen et al. (2007), Journal of Geophysical Research: Planets — MRO HiRISE Investigation',
    referenceUrl: 'https://doi.org/10.1029/2005JE002605',
  },
  {
    id: 'nasa-mro-crism',
    agency: 'NASA / JHU-APL',
    missionOrPlatform: 'Mars Reconnaissance Orbiter (MRO)',
    instrument: 'CRISM Spectrometer',
    targetBody: 'Mars',
    resolution: '18 m/px (Targeted VNIR/SWIR 0.36–3.92 µm)',
    variablesExtracted: 'Pita serapan mineral (piroksen, plagioklas, jarosite, alunit, silika terhidrasi, karbonat, perklorat)',
    roleInAnalysis:
      'Mencocokkan sidik jari spektral mineral alterasi asam Río Tinto, Kawah Ijen, dan Dallol serta karbonat Svalbard terhadap Kawah Jezero, Meridiani Planum, dan Gale.',
    datasetIdentifier: 'MRO-M-CRISM-3-TRDR-V1.0',
    accessUrl: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
    scientificReference: 'Murchie et al. (2007), Journal of Geophysical Research: Planets — CRISM on MRO',
    referenceUrl: 'https://doi.org/10.1029/2006JE002682',
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
      'Mengkalibrasi ukuran butiran efektif dan inersia termal pasir/kipas aluvial Death Valley, Qaidam Basin, dan tefra vulkanik terhadap elips pendaratan Mars.',
    datasetIdentifier: 'ODY-M-THM-3-IRRDR-V2.0',
    accessUrl: 'https://themis.asu.edu/',
    scientificReference: 'Christensen et al. (2004), Space Science Reviews — The Thermal Emission Imaging System (THEMIS)',
    referenceUrl: 'https://doi.org/10.1023/B:SPAC.0000021008.16305.94',
  },
  {
    id: 'nasa-srtm',
    agency: 'NASA / NGA / USGS / METI',
    missionOrPlatform: 'SRTM & ASTER GDEM v3',
    instrument: 'C-Band SAR & ASTER VNIR Stereo',
    targetBody: 'Bumi',
    resolution: '30 m (1 arc-second Global DEM)',
    variablesExtracted: 'Topografi digital, kemiringan (slope), aspek lereng, dan Terrain Ruggedness Index (TRI)',
    roleInAnalysis:
      'Menghitung metrik kekasaran topografi dan gradien dinding kaldera/kawah untuk situs di antara 60°LU–56°LS (SRTM) hingga lintang sub-kutub (ASTER GDEM). Untuk Arktik >70°LU digunakan ArcticDEM.',
    datasetIdentifier: 'SRTMGL1 v003 / ASTGTM v003',
    accessUrl: 'https://asterweb.jpl.nasa.gov/gdem.asp',
    scientificReference: 'Farr et al. (2007), Reviews of Geophysics — The Shuttle Radar Topography Mission',
    referenceUrl: 'https://doi.org/10.1029/2005RG000183',
  },
  {
    id: 'pgc-arcticdem',
    agency: 'NSF / NGA / Polar Geospatial Center',
    missionOrPlatform: 'ArcticDEM (Digital Surface Model Kutub Utara >60°LU)',
    instrument: 'Maxar WorldView-1/2/3 & GeoEye-1 Optical Stereo',
    targetBody: 'Bumi',
    resolution: '2 m/px (Strip & Mosaic DEM Arktik)',
    variablesExtracted: 'Morfometri detail kawah tumbukan Arktik, teras permafrost poligonal, dan lereng fjord Svalbard',
    roleInAnalysis:
      'Menggantikan SRTM (yang berhenti di 60°LU) untuk pemodelan topografi presisi di Haughton Impact Crater (75.38°LU) dan Kompleks Bockfjorden Svalbard (79.43°LU).',
    datasetIdentifier: 'PGC-ARCTICDEM-MOSAIC-V4.1',
    accessUrl: 'https://www.pgc.umn.edu/data/arcticdem/',
    scientificReference: 'Porter et al. (2018), Polar Geospatial Center — ArcticDEM High-Resolution Digital Surface Model',
    referenceUrl: 'https://doi.org/10.7910/DVN/OHHUKH',
  },
  {
    id: 'nasa-earthdata-modis',
    agency: 'NASA LP DAAC / EOSDIS',
    missionOrPlatform: 'Terra & Aqua Satellites',
    instrument: 'MODIS (MOD11A2 LST & MCD43A3 Albedo)',
    targetBody: 'Bumi',
    resolution: '500 m – 1 km (Multi-year Climatology)',
    variablesExtracted: 'Albedo permukaan broadband, suhu permukaan tanah (LST), indeks ariditas dan tutupan vegetasi NDVI',
    roleInAnalysis:
      'Memverifikasi zona kering tanpa vegetasi (NDVI rendah) di Atacama, McMurdo Dry Valleys, Bockfjorden Svalbard, serta profil suhu permukaan.',
    datasetIdentifier: 'MOD11A2.061 / MCD43A3.061',
    accessUrl: 'https://lpdaac.usgs.gov/',
    scientificReference: 'Schaaf et al. (2002), Remote Sensing of Environment — MODIS BRDF/Albedo Product (MCD43)',
    referenceUrl: 'https://doi.org/10.1016/S0034-4257(02)00091-3',
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
      'Memetakan batas mineralogi tephra basaltik-andesitik di Gunung Bromo serta zona alterasi asam-sulfat di Kawah Ijen, Dallol, dan Río Tinto.',
    datasetIdentifier: 'COPERNICUS/S2_SR_HARMONIZED',
    accessUrl: 'https://dataspace.copernicus.eu/',
    scientificReference: 'Drusch et al. (2012), Remote Sensing of Environment — Sentinel-2: ESA Optical High-Resolution Mission',
    referenceUrl: 'https://doi.org/10.1016/j.rse.2011.11.026',
  },
  {
    id: 'esa-mars-express',
    agency: 'ESA (European Space Agency)',
    missionOrPlatform: 'Mars Express (MEX)',
    instrument: 'HRSC (High Resolution Stereo Camera) & OMEGA',
    targetBody: 'Mars',
    resolution: '12.5 m/px (HRSC) · 300 m–4 km (OMEGA)',
    variablesExtracted: 'Model elevasi regional Mars, mineralogi terhidrasi (filosilikat, sulfat & karbonat)',
    roleInAnalysis:
      'Menyediakan konteks geologi cekungan Eridania, Meridiani Planum, dan Nili Fossae dalam analisis analog hidrotermal Río Tinto, Dallol, dan Svalbard.',
    datasetIdentifier: 'MEX-M-HRSC-5-REFDR-DTM-V1.0',
    accessUrl: 'https://archives.esac.esa.int/psa/',
    scientificReference: 'Jaumann et al. (2007), Planetary and Space Science — The High Resolution Stereo Camera (HRSC) on Mars Express',
    referenceUrl: 'https://doi.org/10.1016/j.pss.2006.12.003',
  },
  {
    id: 'usgs-astrogeology',
    agency: 'USGS Astrogeology & NASA JSC',
    missionOrPlatform: 'Planetary Geologic Mapping & Regolith Simulant Catalog',
    instrument: 'JSC-1 / JSC-1A (Arizona) & JSC Mars-1 (Hawaii) + Apollo Benchmarks',
    targetBody: 'Bulan',
    resolution: 'Sampel Laboratorium & Peta Geologi 1:500.000',
    variablesExtracted: 'Komposisi geokimia mayor (SiO₂, FeO, TiO₂, Al₂O₃), distribusi ukuran partikel, sudut geser internal',
    roleInAnalysis:
      'Acuan simulan resmi NASA/USGS: JSC-1/1A dari Merriam Crater (Arizona) untuk regolith mare Bulan dan JSC Mars-1 dari Puʻu Nēnē, Mauna Kea (Hawaii) untuk debu palagonitik Mars.',
    datasetIdentifier: 'NASA/USGS Planetary Simulant & Apollo Sample Archive',
    accessUrl: 'https://astrogeology.usgs.gov/',
    scientificReference: 'Allen et al. (1998), Eos Trans. AGU 79(34) — Martian Soil Simulant JSC Mars-1 (Puʻu Nēnē) & Lunar Simulant JSC-1',
    referenceUrl: 'https://doi.org/10.1029/98EO00309',
  },
  {
    id: 'jaxa-selene',
    agency: 'JAXA (Japan Aerospace Exploration Agency)',
    missionOrPlatform: 'SELENE (Kaguya)',
    instrument: 'Terrain Camera (TC), Multiband Imager (MI) & LRS',
    targetBody: 'Bulan',
    resolution: '10 m/px (TC Stereo) · 20 m/px (MI)',
    variablesExtracted: 'Peta kelimpahan FeO dan TiO₂ global Bulan, profil skylight dan rongga tabung lava bawah permukaan',
    roleInAnalysis:
      'Menjadi pembanding langsung dimensi lubang skylight Marius Hills terhadap tabung lava Kazumura/Kīlauea serta morfologi kawah mare basaltik.',
    datasetIdentifier: 'SELENE-L-MI-5-MAP-V1.0',
    accessUrl: 'https://darts.isas.jaxa.jp/planet/pdap/selene/',
    scientificReference: 'Kaku et al. (2017), Geophysical Research Letters — Detection of Intact Lava Tubes at Marius Hills by Kaguya LRS',
    referenceUrl: 'https://doi.org/10.1002/2017GL074998',
  },
  {
    id: 'pvmbg-demnas',
    agency: 'Badan Geologi (PVMBG) & BIG Indonesia',
    missionOrPlatform: 'DEMNAS Nasional & Pemantauan Gunungapi Indonesia',
    instrument: 'IFSAR / Stereo DEM Nasional (0.27 arc-sec) & Petrografi Lapangan',
    targetBody: 'Bumi',
    resolution: '8.25 m (0.27 arc-second DEMNAS)',
    variablesExtracted: 'Elevasi detail Kaldera Tengger–Bromo & Kawah Ijen, litologi tefra, kimia danau asam & zona bahaya SO₂',
    roleInAnalysis:
      'Mendukung pemodelan topografi resolusi tinggi di Kawah Ijen (analog danau asam Mars tervalidasi jurnal) dan karakterisasi eksploratif Kaldera Tengger–Bromo. DEMNAS diunduh gratis lewat Ina-Geoportal BIG (menu Unduh Data > DEMNAS; perlu akun).',
    datasetIdentifier: 'DEMNAS BIG (0.27 arc-sec) & Peta Geologi Gunungapi PVMBG',
    accessUrl: 'https://tanahair.indonesia.go.id/portal-web/',
    scientificReference: 'Delmelle & Bernard (1994), Geochim. Cosmochim. Acta 58 (Ijen) & Hilyah et al. (2026), Annals of Geophysics (Tengger Caldera)',
    referenceUrl: 'https://doi.org/10.1016/0016-7037(94)90023-X',
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
      'Menyediakan peta dasar satelit interaktif resolusi tinggi serta konteks wilayah administratif untuk penempatan pin analog dan navigasi lokasi.',
    datasetIdentifier: 'ESRI-WORLD-IMAGERY / BOUNDARIES',
    accessUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    scientificReference: 'Esri World Imagery Basemap Metadata & Earthstar Geographics Catalog',
    referenceUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
  },
];
