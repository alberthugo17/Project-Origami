export type TargetBody = 'Moon' | 'Mars' | 'Moon & Mars';
export type TerrainBiome = 'Volcanic' | 'Desert' | 'Polar' | 'Impact Crater' | 'Cave / Lava Tube' | 'Hydrothermal';

export interface ComparativeMetric {
  parameter: string;
  earthValue: string;
  planetaryBenchmark: string;
  matchNote: string;
}

export interface TemperatureProfile {
  avgC: number;
  minC: number;
  maxC: number;
  note: string;
}

export interface TerrainProfile {
  surfaceType: string;
  slopeRange: string;
  roughness: 'Rendah (Halus)' | 'Sedang (Berbatu)' | 'Tinggi (Curam & Kasar)';
  acidityPh: number;
  description: string;
}

export interface SeasonalRecommendation {
  bestWindow: string;
  climateCondition: string;
  recommendedTests: string[];
  avoidWindow: string;
}

export interface AnalogSite {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  elevationM: number;
  targetBody: TargetBody;
  planetaryCounterpart: string;
  biome: TerrainBiome;
  similarityScore: number; // 0-100 calibrated composite index
  isTopFinding?: boolean;
  temperatureProfile: TemperatureProfile;
  terrainProfile: TerrainProfile;
  seasonalRecommendation: SeasonalRecommendation;
  summary: string;
  geologicalRationale: string;
  missionApplications: string[];
  hazardsAndConstraints: string[];
  comparativeMetrics: ComparativeMetric[];
  dataSourceIds: string[];
  accentColor: string;
}

export const ANALOG_SITES: AnalogSite[] = [
  {
    id: 'gunung-bromo',
    name: 'Gunung Bromo & Lautan Pasir Tengger',
    region: 'Jawa Timur',
    country: 'Indonesia',
    lat: -7.9425,
    lon: 112.953,
    elevationM: 2329,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Lunar Mare Tranquillitatis / Gale Crater Bagnold Dunes',
    biome: 'Volcanic',
    similarityScore: 95.4,
    isTopFinding: true,
    temperatureProfile: {
      avgC: 14,
      minC: 3,
      maxC: 24,
      note: 'Rata-rata deteksi MODIS kaldera 14°C; suhu malam kemarau dapat turun hingga 3°C.',
    },
    terrainProfile: {
      surfaceType: 'Kaldera Tephra & Lautan Pasir Basaltik-Andesitik',
      slopeRange: '18° – 34° (dinding kaldera) · 2° – 8° (lautan pasir)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 6.2,
      description:
        'Lautan pasir vulkanik gembur bebas vegetasi dengan butiran tephra tajam (60–280 µm), mudah menimbulkan selip roda dan debu elektrostatik.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juni – Desember (Musim Kemarau / Panas Kering)',
      climateCondition: 'Curah hujan minimal, langit cerah, angin kering tenggara, kelembapan relatif rendah.',
      recommendedTests: [
        'Pengujian ketahanan bahan material roket & pelapis segel spacesuit EVA terhadap abrasi debu tephra kering',
        'Uji traksi roda rover dan validasi navigasi optik/LiDAR pendarat pada pasir basaltik kering',
      ],
      avoidWindow: 'Januari – Maret (Puncak musim hujan membuat pasir memadat dan kabut tebal menghambat sensor optik).',
    },
    summary:
      'Kaldera vulkanik aktif berdiameter 10 km dengan lautan pasir basaltik-andesitik bebas vegetasi yang mereplikasi regolith lunar dan bukit pasir gelap Mars secara presisi.',
    geologicalRationale:
      'Data multispektral Sentinel-2 SWIR dan DEMNAS BIG menunjukkan bahwa Lautan Pasir Tengger memiliki distribusi butiran tephra basaltik-andesitik bervesikular halus (50–300 µm), albedo rendah (0.11–0.16), serta kemiringan lereng kawah 18°–34° yang sangat mirip dengan morfologi tepi kawah mikro di Mare Lunar dan medan gelap Aeolian di Kawah Gale, Mars.',
    missionApplications: [
      'Uji traksi roda rover pada regolith basaltik gembur dan berdebu tinggi (slippage test)',
      'Validasi algoritma Terrain Relative Navigation (TRN) pendaratan presisi di bibir kaldera',
      'Pengujian mitigasi debu abrasif pada segel baju antariksa EVA dan engsel mekanis',
      'Ekstraksi oksigen dan sintering termal regolith kaya besi-silikat (ISRU)',
    ],
    hazardsAndConstraints: [
      'Emisi gas SO₂ dan uap hidrotermal aktif memerlukan pemantauan PVMBG real-time',
      'Kelembapan musiman tropis mempengaruhi kohesi pasir dibanding kondisi vakum Bulan',
    ],
    comparativeMetrics: [
      {
        parameter: 'Komposisi Mineralogi',
        earthValue: 'Basalt-Andesit (52–56% SiO₂, Plagioklas, Piroksen)',
        planetaryBenchmark: 'Mare Basalt & Basaltik Mars (48–52% SiO₂)',
        matchNote: 'Kesesuaian spektral tinggi pada pita 1 µm & 2 µm',
      },
      {
        parameter: 'Albedo Permukaan',
        earthValue: '0.11 – 0.16 (Pasir Vulkanik Kering)',
        planetaryBenchmark: '0.07 – 0.14 (Lunar Mare & Bagnold Dunes)',
        matchNote: 'Reflektansi rendah ideal untuk kalibrasi LiDAR pendarat',
      },
      {
        parameter: 'Gradien Lereng Kawah',
        earthValue: '18° – 34° (Dinding Kaldera & Kerucut Bromo)',
        planetaryBenchmark: '20° – 35° (Kawah Sekunder Lunar & Mars)',
        matchNote: 'Morfometri diukur via SRTM 30m vs LRO LOLA',
      },
      {
        parameter: 'Ukuran Butiran Dominan',
        earthValue: '60 – 280 µm (Tephra Halus hingga Kasar)',
        planetaryBenchmark: '40 – 250 µm (Regolith Lunar Atas & Pasir Aeolian)',
        matchNote: 'Sudut geser internal 31°–37° sebanding dengan simulan JSC-1A',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'esa-sentinel2', 'nasa-lro-lola', 'nasa-mro-crism', 'pvmbg-demnas'],
    accentColor: '#f97316',
  },
  {
    id: 'atacama-yungay',
    name: 'Atacama Desert (Yungay Core)',
    region: 'Antofagasta',
    country: 'Chile',
    lat: -24.0833,
    lon: -69.9167,
    elevationM: 980,
    targetBody: 'Mars',
    planetaryCounterpart: 'Jezero Crater & Oxia Planum',
    biome: 'Desert',
    similarityScore: 94.8,
    temperatureProfile: {
      avgC: 17,
      minC: -2,
      maxC: 36,
      note: 'Ayunan suhu diurnal tajam antara malam dingin di bawah nol (-2°C) dan siang terik (36°C).',
    },
    terrainProfile: {
      surfaceType: 'Kerak Evaporit Garam, Nitrat & Gurun Kerikil Perklorat',
      slopeRange: '2° – 12° (dataran aluvial)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 7.4,
      description:
        'Permukaan keras berkerak gipsum-halit yang menutupi lapisan tanah hiper-arid halus kaya perklorat dan radiasi UV sangat tinggi.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – Oktober (Musim Gugur hingga Awal Musim Semi)',
      climateCondition: 'Suhu siang lebih stabil (20–26°C), curah hujan mendekati nol, angin siang terprediksi.',
      recommendedTests: [
        'Kalibrasi bor otonom bawah permukaan dan spektrometer deteksi kehidupan (Raman/LIBS)',
        'Uji degradasi UV dan perklorat pada material tekstil spacesuit dan segel kamera rover',
      ],
      avoidWindow: 'Januari – Februari (Potensi efek "Altiplanic Winter" dengan angin kencang dan badai debu lokal).',
    },
    summary:
      'Gurun non-polar terkering di Bumi dengan kerak perklorat, nitrat, dan fluks radiasi UV ekstrem yang menjadi standar emas uji deteksi kehidupan Mars.',
    geologicalRationale:
      'Curah hujan rata-rata di bawah 2 mm/tahun serta konsentrasi garam perklorat dan sulfat permukaan membuat tanah Yungay hampir steril secara biologis, meniru kimia tanah permukaan Mars yang terukur oleh pendarat Phoenix dan rover Curiosity.',
    missionApplications: [
      'Kalibrasi instrumen spektroskopi Raman dan GC-MS untuk deteksi biosignature organik',
      'Pengujian bor otonom bawah permukaan (kedalaman 1–2 meter) pada kerak evaporit keras',
      'Simulasi operasi rover otonom jarak jauh dengan latensi komunikasi Bumi–Mars',
    ],
    hazardsAndConstraints: [
      'Badai angin debu halus di siang hari dan fluktuasi suhu diurnal tajam',
    ],
    comparativeMetrics: [
      {
        parameter: 'Indeks Hiper-Ariditas',
        earthValue: '< 2 mm/tahun (Inti Yungay)',
        planetaryBenchmark: '0 mm/tahun (Hesperian-Amazonian Mars)',
        matchNote: 'Kondisi preservasi mineral lempung dan garam terbaik di Bumi',
      },
      {
        parameter: 'Kimia Garam Permukaan',
        earthValue: 'Perklorat, Nitrat, Gipsum, Halit',
        planetaryBenchmark: 'Perklorat (0.5–1 wt%), Sulfat Mg/Ca',
        matchNote: 'Analog kimia langsung untuk sampel tanah Phoenix & Gale Crater',
      },
    ],
    dataSourceIds: ['nasa-earthdata-modis', 'nasa-mro-hirise', 'nasa-mro-crism', 'usgs-astrogeology'],
    accentColor: '#ef4444',
  },
  {
    id: 'haughton-crater',
    name: 'Haughton Impact Crater',
    region: 'Devon Island, Nunavut',
    country: 'Kanada',
    lat: 75.3833,
    lon: -89.6833,
    elevationM: 215,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Shackleton Crater Rim & Noachian Impact Basins',
    biome: 'Impact Crater',
    similarityScore: 93.2,
    temperatureProfile: {
      avgC: -16,
      minC: -42,
      maxC: 8,
      note: 'Suhu rata-rata Arktik -16°C; musim panas Juli mencapai +8°C dan musim dingin turun hingga -42°C.',
    },
    terrainProfile: {
      surfaceType: 'Breksi Tumbukan Karbonat, Ejecta Berbatu & Poligon Permafrost',
      slopeRange: '5° – 26° (dinding teras kawah)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 7.8,
      description:
        'Medan berbatu dolomit bersudut tajam dengan tanah poligonal es-permafrost, sangat menantang bagi roda rover dan sol sepatu EVA.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juli – Agustus (Musim Panas Arktik Terang 24 Jam)',
      climateCondition: 'Suhu berada di kisaran 0°C hingga +8°C, tanah aktif mencair dangkal, akses helikopter terbuka.',
      recommendedTests: [
        'Uji operasional Pressurized Rover berawak, baju EVA, dan komunikasi tunda misi Bulan/Mars',
        'Pengujian Ground Penetrating Radar (GPR) untuk pemetaan es permafrost dan breksi tumbukan',
      ],
      avoidWindow: 'Oktober – Mei (Kegelapan kutub total, suhu ekstrem -40°C, dan badai salju Arktik).',
    },
    summary:
      'Kawah tumbukan berdiameter 23 km di gurun kutub Arktik dengan breksi tumbukan utuh, permafrost berpola poligonal, dan siklus siang-malam ekstrem.',
    geologicalRationale:
      'Terbentuk sekitar 23 juta tahun lalu pada batuan karbonat di atas batuan dasar kristalin, Haughton mempertahankan ejecta blanket dan sistem hidrotermal pasca-tumbukan di lingkungan gurun dingin tanpa tutupan vegetasi tinggi.',
    missionApplications: [
      'Operasi EVA bertekanan dan kendaraan jelajah berawak (Pressurized Rover)',
      'Pemetaan stratigrafi breksi tumbukan dan es bawah permukaan menggunakan GPR',
      'Pengujian protokol isolasi dan komunikasi tunda misi luar angkasa',
    ],
    hazardsAndConstraints: [
      'Jendela akses logistik musim panas Arktik terbatas (Juli–Agustus)',
    ],
    comparativeMetrics: [
      {
        parameter: 'Struktur Tumbukan',
        earthValue: 'Diameter 23 km, Breksi Polimik Karbonat-Kristalin',
        planetaryBenchmark: 'Kawah Kompleks Awal Mars & Basin Sekunder Lunar',
        matchNote: 'Morfologi puncak pusat dan teras dinding terawetkan baik',
      },
      {
        parameter: 'Pola Tanah Permafrost',
        earthValue: 'Jaringan Poligonal Es-Tanah (10–25 m)',
        planetaryBenchmark: 'Poligon Sublimasi Es Phoenix Landing Site',
        matchNote: 'Kesesuaian geometri fraktur termal berdasarkan HiRISE',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'nasa-mro-hirise', 'nasa-lro-lola', 'usgs-astrogeology'],
    accentColor: '#f97316',
  },
  {
    id: 'death-valley',
    name: 'Death Valley (Ubehebe Crater & Mars Hill)',
    region: 'California',
    country: 'Amerika Serikat',
    lat: 36.5054,
    lon: -117.0794,
    elevationM: -85,
    targetBody: 'Mars',
    planetaryCounterpart: 'Vastitas Borealis & Gale Crater Alluvial Fans',
    biome: 'Desert',
    similarityScore: 91.6,
    temperatureProfile: {
      avgC: 25,
      minC: 4,
      maxC: 51,
      note: 'Suhu permukaan tanah musim panas menembus >50°C dengan rata-rata tahunan hangat 25°C.',
    },
    terrainProfile: {
      surfaceType: 'Kipas Aluvial Kerikil Tajam, Tufa Basaltik & Kerak Garam',
      slopeRange: '4° – 30° (dinding maar Ubehebe)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 7.9,
      description:
        'Kombinasi bongkah batu vulkanik bersudut runcing di Mars Hill, kerak garam keras Badwater, dan lereng abu maar Ubehebe.',
    },
    seasonalRecommendation: {
      bestWindow: 'November – Maret (Musim Dingin – Awal Semi Gurun Mojave)',
      climateCondition: 'Suhu siang nyaman 18–26°C, angin kering stabil, aman bagi kru manusia untuk uji rover harian.',
      recommendedTests: [
        'Uji sistem pendarat LiDAR (Landing Vision System) & ketahanan roda rover pada bongkah batu tajam',
        'Khusus Juni–Agustus: Uji ekstrem manajemen termal baterai & radiator panas >48°C tanpa kru luar',
      ],
      avoidWindow: 'Juli – Agustus untuk uji EVA berawak (Risiko heatstroke ekstrem >50°C).',
    },
    summary:
      'Kipas aluvial, dataran garam evaporit, dan kawah maar hidrovolkanik Ubehebe yang digunakan NASA JPL untuk menguji pendarat Mars dan mobilitas rover.',
    geologicalRationale:
      'Kawah Ubehebe menyajikan lapisan tufa basaltik berlapis dan kemiringan lereng berkerikil, sementara Badwater Basin dan Mars Hill memiliki punggungan garam poligonal dan ladang batu terjal untuk uji penghindaran rintangan otonom.',
    missionApplications: [
      'Uji sistem pendaratan otonom LIDAR dan optik (Landing Vision System)',
      'Uji lintasan batuan tajam terhadap degradasi roda aluminium rover',
      'Studi kipas aluvial kering sebagai analog delta sungai purba Mars',
    ],
    hazardsAndConstraints: [
      'Temperatur permukaan musim panas >50°C menguji manajemen termal baterai rover',
    ],
    comparativeMetrics: [
      {
        parameter: 'Inersia Termal Permukaan',
        earthValue: '240 – 480 TIU (Kipas Aluvial & Batuan)',
        planetaryBenchmark: '220 – 450 TIU (Mars Odyssey THEMIS Landing Ellipses)',
        matchNote: 'Distribusi ukuran bongkah batuan diukur via HiRISE boulder count',
      },
      {
        parameter: 'Morfologi Kawah Maar',
        earthValue: 'Diameter 800 m, Kedalaman 235 m',
        planetaryBenchmark: 'Kawah Pitting & Hidrovulkanik Lokal Mars',
        matchNote: 'Stratigrafi surge base tephra terbuka jelas',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'nasa-themis', 'nasa-mro-hirise', 'usgs-astrogeology'],
    accentColor: '#ef4444',
  },
  {
    id: 'craters-of-the-moon',
    name: 'Craters of the Moon Lava Field',
    region: 'Idaho',
    country: 'Amerika Serikat',
    lat: 43.4167,
    lon: -113.5167,
    elevationM: 1800,
    targetBody: 'Moon',
    planetaryCounterpart: 'Mare Imbrium & Marius Hills Volcanic Domes',
    biome: 'Volcanic',
    similarityScore: 92.9,
    temperatureProfile: {
      avgC: 6,
      minC: -18,
      maxC: 31,
      note: 'Musim dingin bersalju hingga -18°C, musim panas kering dan cerah hingga 31°C.',
    },
    terrainProfile: {
      surfaceType: 'Aliran Lava Basaltik Pahoehoe & Aa Tajam, Kerucut Sinder',
      slopeRange: '6° – 28° (kerucut sinder & rilles)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 6.7,
      description:
        'Permukaan kaca vulkanik berlubang-lubang tajam (lava aa) dan punggungan tekanan basalt yang menguji keausan sol EVA serta ban rover.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juni – September (Musim Panas Kering dataran tinggi Idaho)',
      climateCondition: 'Bebas salju, permukaan aliran lava basalt kering sempurna, durasi siang panjang.',
      recommendedTests: [
        'Uji ketahanan ban superelastis Nitinol & sol Orthofabric terhadap sayatan lava aa yang sangat tajam',
        'Pelatihan geologi lapangan astronot Artemis & uji masuk skylight tabung lava dengan robot berkaki',
      ],
      avoidWindow: 'Desember – Maret (Lapisan salju menutup fitur lava pahoehoe/aa dan menutup akses jalan taman).',
    },
    summary:
      'Dataran aliran lava basaltik muda (pahoehoe & aa), kerucut sinder, dan tabung lava utuh tempat astronot Apollo 14 berlatih identifikasi batuan lunar.',
    geologicalRationale:
      'Aliran lava Snake River Plain memiliki kandungan FeO tinggi dan struktur vesikular, keretakan tekanan (pressure ridges), serta skylight tabung lava yang menjadi kandidat kuat lokasi pangkalan bawah permukaan Bulan.',
    missionApplications: [
      'Pelatihan geologi lapangan astronot Artemis untuk sampling batuan basaltik Mare',
      'Eksplorasi robotik berkaki/beroda memasuki skylight dan tabung lava',
      'Pemetaan struktur bawah permukaan dengan radar penetrasi tanah (GPR)',
    ],
    hazardsAndConstraints: [
      'Permukaan lava aa sangat tajam dan abrasif terhadap sol sepatu EVA maupun ban rover',
    ],
    comparativeMetrics: [
      {
        parameter: 'Morfologi Aliran Lava',
        earthValue: 'Basalt Pahoehoe & Aa, Rilles Keruntuhan',
        planetaryBenchmark: 'Sinuous Rilles (Rima Hadley) & Mare Flows',
        matchNote: 'Kesesuaian fitur aliran teridentifikasi pada citra LROC NAC',
      },
      {
        parameter: 'Dimensi Tabung Lava',
        earthValue: 'Lebar 10–30 m, Atap Basalt 3–12 m',
        planetaryBenchmark: 'Skylight Marius Hills (Lebar >50 m, Gravitasi 1/6 g)',
        matchNote: 'Model geometri masuk skylight untuk rover tambat',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'usgs-astrogeology', 'nasa-srtm', 'jaxa-selene'],
    accentColor: '#3b82f6',
  },
  {
    id: 'mcmurdo-dry-valleys',
    name: 'McMurdo Dry Valleys',
    region: 'Victoria Land',
    country: 'Antartika',
    lat: -77.4667,
    lon: 162.5167,
    elevationM: 1100,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Lunar South Pole (Shackleton) & Mars Northern Plains',
    biome: 'Polar',
    similarityScore: 93.7,
    temperatureProfile: {
      avgC: -20,
      minC: -55,
      maxC: 2,
      note: 'Rata-rata tahunan -20°C; musim dingin turun hingga -55°C (deteksi MODIS & stasiun LTER).',
    },
    terrainProfile: {
      surfaceType: 'Regolith Kering Beku di Atas Lapisan Es Permafrost Tersemen',
      slopeRange: '3° – 22° (lembah glasial bebas salju)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 7.5,
      description:
        'Tanah berpasir dan kerikil granit-basalt sangat kering yang membeku keras sekeras beton beberapa sentimeter di bawah permukaan.',
    },
    seasonalRecommendation: {
      bestWindow: 'November – Januari (Musim Panas Austral Antartika)',
      climateCondition: 'Cahaya matahari kutub 24 jam bersudut rendah (~10°–35°), suhu operasi -15°C hingga 0°C.',
      recommendedTests: [
        'Pengujian bor kriogenik es bawah permukaan (seperti misi VIPER Bulan) dan pelumas padat tahan dingin',
        'Validasi isolator aerogel/MLI pada spacesuit kutub dan panel surya sudut rendah Kutub Selatan Bulan',
      ],
      avoidWindow: 'April – September (Malam kutub abadi, angin katabatik >100 km/jam, akses pesawat terhenti).',
    },
    summary:
      'Lembah bebas es terdingin dan terkering di Antartika dengan es tersemen di bawah regolith kering, menjadi analog utama cadangan es Kutub Selatan Bulan.',
    geologicalRationale:
      'Angin katabatik kering menjaga permukaan bebas salju sementara lapisan permafrost es terawetkan beberapa sentimeter di bawah regolith basaltik-granitik, mereplikasi profil termal dan mekanik pengeboran es untuk misi Artemis/VIPER dan Mars Polar.',
    missionApplications: [
      'Pengujian bor pencari es kriogenik dan spektrometer neutron/massa',
      'Validasi sistem tenaga surya sudut rendah dan manajemen termal baterai sub-zero (-40°C)',
      'Studi ekosistem kriptoendolitik pada batuan pasir dingin',
    ],
    hazardsAndConstraints: [
      'Angin katabatik berkecepatan tinggi dan larangan kontaminasi biologis ketat (Antarctic Treaty)',
    ],
    comparativeMetrics: [
      {
        parameter: 'Kedalaman Es Bawah Permukaan',
        earthValue: '10 – 45 cm di bawah regolith kering',
        planetaryBenchmark: '5 – 50 cm (PSR Lunar South Pole & Phoenix Mars)',
        matchNote: 'Kekuatan tekan regolith tersemen es 15–40 MPa',
      },
      {
        parameter: 'Suhu Tahunan Rata-Rata',
        earthValue: '-20°C hingga -55°C',
        planetaryBenchmark: '-60°C hingga -170°C (Zona Tepi Kawah Kutub)',
        matchNote: 'Uji kegetasan segel kriogenik dan pelumas padat',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'nasa-earthdata-modis', 'nasa-mro-hirise'],
    accentColor: '#f97316',
  },
  {
    id: 'rio-tinto',
    name: 'Río Tinto Acidic Basin',
    region: 'Andalusia',
    country: 'Spanyol',
    lat: 37.7056,
    lon: -6.5514,
    elevationM: 310,
    targetBody: 'Mars',
    planetaryCounterpart: 'Meridiani Planum & Mawrth Vallis',
    biome: 'Hydrothermal',
    similarityScore: 90.4,
    temperatureProfile: {
      avgC: 18,
      minC: 4,
      maxC: 37,
      note: 'Iklim Mediterania hangat; musim panas Andalusia dapat melampaui 37°C dan musim dingin sejuk 4–12°C.',
    },
    terrainProfile: {
      surfaceType: 'Endapan Tepi Sungai Hiper-Asam, Teras Hematit & Kerak Jarosite',
      slopeRange: '2° – 16° (teras sungai & tambang purba)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 1.8,
      description:
        'Sedimen besi-sulfat basah hingga kerak garam asam kering yang sangat korosif terhadap logam konvensional tanpa lapisan anti-asam.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – Juni & September – Oktober (Musim Semi & Gugur Kering)',
      climateCondition: 'Suhu moderat 18–26°C, endapan kerak sulfat terpapar jelas tanpa banjir sungai musim dingin.',
      recommendedTests: [
        'Pengujian ketahanan korosi probe bor, sensor spektrometer Mössbauer, dan segel rover pada pH 1.5–2.5',
        'Kalibrasi instrumen deteksi jarosite & hematit untuk analog Meridiani Planum',
      ],
      avoidWindow: 'Juli – Agustus (Gelombang panas >38°C) & November – Januari (Hujan musiman mengencerkan kerak garam).',
    },
    summary:
      'Sistem sungai hiper-asam kaya besi dan sulfat (jarosite, hematit) yang menjadi laboratorium astrobiologi Mars untuk mineralogi Hesperian.',
    geologicalRationale:
      'Oksidasi pirit bawah permukaan oleh bakteri kemolitotrofik menghasilkan larutan pH 1.5–2.5 yang mengendapkan jarosite, goethite, dan hematit—mineral kunci yang ditemukan rover Opportunity di Meridiani Planum.',
    missionApplications: [
      'Kalibrasi instrumen Mössbauer dan difraksi sinar-X (CheMin) untuk mineral besi-sulfat',
      'Pengujian ketahanan korosi sensor dan komponen rover pada endapan asam kering',
    ],
    hazardsAndConstraints: [
      'Lingkungan asam korosif memerlukan material pelindung khusus pada probe pengeboran',
    ],
    comparativeMetrics: [
      {
        parameter: 'Mineral Penciri',
        earthValue: 'Jarosite, Hematit, Goethite, Kopiapit',
        planetaryBenchmark: 'Jarosite & Hematit Sferul (Meridiani Planum)',
        matchNote: 'Spektrum CRISM & OMEGA menunjukkan pita serapan Fe³⁺ identik',
      },
    ],
    dataSourceIds: ['nasa-mro-crism', 'esa-mars-express', 'esa-sentinel2'],
    accentColor: '#ef4444',
  },
  {
    id: 'mauna-kea',
    name: 'Mauna Kea Volcanic Tephra Cone',
    region: 'Hawaii',
    country: 'Amerika Serikat',
    lat: 19.8207,
    lon: -155.4681,
    elevationM: 4100,
    targetBody: 'Moon',
    planetaryCounterpart: 'Lunar Highlands & Apollo 17 Taurus-Littrow',
    biome: 'Volcanic',
    similarityScore: 92.1,
    temperatureProfile: {
      avgC: 4,
      minC: -6,
      maxC: 14,
      note: 'Ketinggian 4.100 m menjaga rata-rata 4°C dengan embun beku malam (-6°C) dan radiasi UV surya tinggi.',
    },
    terrainProfile: {
      surfaceType: 'Kerucut Sinder Tephra Basaltik Tinggi & Abu Palagonitik',
      slopeRange: '12° – 32° (lereng kerucut vulkanik)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 6.5,
      description:
        'Material tefra gembur kaya oksida besi-titanium bertekanan udara tipis (~60% tekanan permukaan laut), ideal untuk uji ISRU.',
    },
    seasonalRecommendation: {
      bestWindow: 'Mei – Oktober (Musim Kemarau Pasifik Tengah)',
      climateCondition: 'Visibilitas cerah konstan di atas lapisan awan, angin puncak rendah, permukaan abu kering.',
      recommendedTests: [
        'Demonstrasi sintering laser/mikrogelombang bahan regolith untuk landasan pendaratan Bulan (ISRU)',
        'Uji operasi ekskavator & rover bertenaga surya di tekanan udara tipis dan radiasi UV tinggi',
      ],
      avoidWindow: 'Desember – Februari (Badai salju puncak & pembekuan jalan akses ketinggian >3.800 m).',
    },
    summary:
      'Lereng tefra basaltik ketinggian 4.100 m dengan tekanan atmosfer rendah dan sumber bahan baku simulan regolith lunar standar NASA.',
    geologicalRationale:
      'Abu vulkanik palagonitik Mauna Kea (sumber simulan JSC-1) di ketinggian ekstrem memiliki kelembapan udara rendah, radiasi surya tinggi, dan variasi lereng curam untuk menguji ekstraksi oksigen (ISRU) dan konstruksi landasan pendaratan.',
    missionApplications: [
      'Demonstrasi penambangan regolith otonom dan sintering laser/mikrogelombang untuk landing pad',
      'Uji operasi rovers surya di ketinggian dengan atmosfer tipis',
    ],
    hazardsAndConstraints: [
      'Ketinggian 4.100 m membatasi durasi kerja tim peneliti tanpa aklimatisasi',
    ],
    comparativeMetrics: [
      {
        parameter: 'Kandungan Oksida Besi & Titanium',
        earthValue: 'FeO ~11%, TiO₂ ~2.8% (Basalt Alkali)',
        planetaryBenchmark: 'Mare Basalt Tengah-Tinggi TiO₂ (6–14%)',
        matchNote: 'Bahan referensi simulan regolith NASA/PISCES',
      },
    ],
    dataSourceIds: ['usgs-astrogeology', 'nasa-lro-lola', 'nasa-srtm'],
    accentColor: '#3b82f6',
  },
  {
    id: 'kazumura-lava-tubes',
    name: 'Kazumura & Kīlauea Lava Tubes',
    region: 'Hawaii Island',
    country: 'Amerika Serikat',
    lat: 19.528,
    lon: -155.025,
    elevationM: 650,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Marius Hills Skylight & Arsia Mons Pit Craters',
    biome: 'Cave / Lava Tube',
    similarityScore: 91.2,
    temperatureProfile: {
      avgC: 19,
      minC: 16,
      maxC: 22,
      note: 'Suhu internal gua tabung lava stabil sepanjang tahun (16°C–22°C, variasi harian <2°C).',
    },
    terrainProfile: {
      surfaceType: 'Terowongan Basalt Gelap, Dinding Lava Kaca & Lantai Runtuhan',
      slopeRange: '1° – 18° (lantai terowongan) · 85° (dinding skylight)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 6.8,
      description:
        'Rongga terowongan basalt tanpa cahaya matahari dan tanpa sinyal GPS dengan tepian batu tajam dan tetesan kelembapan lokal.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – Oktober (Musim Lebih Kering di Sisi Timur Hawaii)',
      climateCondition: 'Aliran rembesan air hujan dari atap basalt jauh berkurang; suhu internal konstan ~19°C.',
      recommendedTests: [
        'Pengujian modul habitat tiup (inflatable habitat beranyaman Vectran/Kevlar) di dalam gua basalt',
        'Pemetaan LiDAR SLAM otonom dan uji relai komunikasi RF dari mulut skylight ke dalam gua',
      ],
      avoidWindow: 'November – Januari (Curah hujan tropis tinggi menyebabkan genangan air di segmen gua rendah).',
    },
    summary:
      'Jaringan gua tabung lava basaltik terpanjang di Bumi (>65 km) untuk arsitektur habitat bawah tanah pelindung radiasi kosmik dan mikrometeorit.',
    geologicalRationale:
      'Terbentuk oleh aliran lava pahoehoe yang mengering di bawah kerak membeku, Kazumura memberikan geometri terowongan nyata dengan langit-langit runtuh (skylights) dan suhu internal stabil untuk riset pangkalan permanen Bulan dan Mars.',
    missionApplications: [
      'Pemetaan LiDAR SLAM otonom di dalam terowongan gelap tanpa sinyal GPS',
      'Desain jaringan relay komunikasi RF/optik multi-hop dari permukaan ke dalam gua',
      'Pengujian modul habitat tiup (inflatable habitat) di dalam rongga batuan basalt',
    ],
    hazardsAndConstraints: [
      'Runtuhan batuan langit-langit lokal dan kelembapan gua tropis tinggi',
    ],
    comparativeMetrics: [
      {
        parameter: 'Stabilitas Termal Gua',
        earthValue: 'Variasi < 2°C sepanjang tahun',
        planetaryBenchmark: 'Lunar Lava Tube ~ -20°C hingga +17°C konstan (vs ±150°C luar)',
        matchNote: 'Perlindungan radiasi kosmik galaktik dengan atap basalt >5 m',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'jaxa-selene', 'nasa-mro-hirise'],
    accentColor: '#f97316',
  },
  {
    id: 'dallol-danakil',
    name: 'Dallol Hydrothermal Salt Flats',
    region: 'Depresi Danakil, Afar',
    country: 'Ethiopia',
    lat: 14.2417,
    lon: 40.3,
    elevationM: -125,
    targetBody: 'Mars',
    planetaryCounterpart: 'Columbia Hills (Gusev Crater) & Eridania Basin',
    biome: 'Hydrothermal',
    similarityScore: 89.8,
    temperatureProfile: {
      avgC: 35,
      minC: 24,
      maxC: 48,
      note: 'Salah satu kawasan terpanas di Bumi (rata-rata 35°C, udara >48°C, kolam hidrotermal >90°C).',
    },
    terrainProfile: {
      surfaceType: 'Kerak Garam Halit Rapuh, Kolam Brine Asam & Teras Belerang',
      slopeRange: '0° – 10° (dataran garam & gundukan hidrotermal)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 0.6,
      description:
        'Permukaan garam jenuh sangat korosif dengan kerak tipis di atas larutan asam sulfat/klorida panas mendidih (pH 0.1–1.5).',
    },
    seasonalRecommendation: {
      bestWindow: 'November – Februari (Musim Sejuk Depresi Afar)',
      climateCondition: 'Suhu udara turun ke kisaran 26–34°C sehingga lebih aman untuk operasi tim dan avionik rover.',
      recommendedTests: [
        'Uji ketahanan ekstrem superalloy Hastelloy C-276, keramik SiC & PTFE pada brine asam panas pH < 1',
        'Kalibrasi sensor SWIR & detektor kehidupan batas abiotik di lingkungan hiper-salin',
      ],
      avoidWindow: 'Mei – September (Panas ekstrem >48°C merusak baterai konvensional dan membahayakan peneliti).',
    },
    summary:
      'Dataran garam hidrotermal paling ekstrem di Bumi dengan kolam asam panas hiper-salin yang memodelkan mata air panas purba Mars.',
    geologicalRationale:
      'Kombinasi pH < 1, salinitas jenuh MgCl₂/FeSO₄, dan suhu >90°C menentukan batas fisikokimia kehidupan (polyextremophiles) serta menghasilkan struktur mineral silika-besi-garam yang mirip dengan endapan Home Plate di Kawah Gusev.',
    missionApplications: [
      'Penentuan batas deteksi kehidupan dan false-positive abiotik pada instrumen astrobiologi',
      'Studi mineralogi garam kompleks dan silika hidrotermal lewat penginderaan jauh SWIR',
    ],
    hazardsAndConstraints: [
      'Suhu lingkungan >45°C dan gas beracun memerlukan peralatan keselamatan penuh',
    ],
    comparativeMetrics: [
      {
        parameter: 'Salinitas & Keasaman',
        earthValue: 'pH 0.1 – 1.5, Salinitas >40% (Mg/Fe Brines)',
        planetaryBenchmark: 'Larutan Garam Hidrotermal Noachian-Hesperian',
        matchNote: 'Menjelaskan koeksistensi silika amorf dan sulfat besi',
      },
    ],
    dataSourceIds: ['esa-sentinel2', 'nasa-mro-crism', 'esa-mars-express'],
    accentColor: '#ef4444',
  },
  {
    id: 'kawah-ijen',
    name: 'Kawah Ijen Acidic Caldera',
    region: 'Jawa Timur',
    country: 'Indonesia',
    lat: -8.0583,
    lon: 114.2417,
    elevationM: 2386,
    targetBody: 'Mars',
    planetaryCounterpart: 'Eridania Basin & Noachian Acidic Crater Lakes',
    biome: 'Hydrothermal',
    similarityScore: 88.9,
    temperatureProfile: {
      avgC: 15,
      minC: 6,
      maxC: 24,
      note: 'Suhu udara tepi kawah sejuk (rata-rata 15°C), namun fumarol & tepi danau asam mencapai 45–200°C.',
    },
    terrainProfile: {
      surfaceType: 'Dinding Kaldera Alterasi Silika-Alunit & Sedimen Danau Hiper-Asam',
      slopeRange: '22° – 42° (dinding kaldera curam)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 0.4,
      description:
        'Batuan teralterasi sulfat licin dengan uap HCl/SO₂ pekat serta danau asam sulfat terasam di dunia (pH < 0.5).',
    },
    seasonalRecommendation: {
      bestWindow: 'Mei – Oktober (Musim Kemarau Jawa Timur)',
      climateCondition: 'Arah angin pasat tenggara relatif stabil dan minim limpasan air hujan di jalur rim kawah.',
      recommendedTests: [
        'Pengujian material pelindung korosi asam pekat (PTFE, Hastelloy, Keramik SiC) pada drone/sensor tepi kawah',
        'Kalibrasi citra SWIR mineralogi alunit, jarosite, dan silika opalin analog danau asam purba Mars',
      ],
      avoidWindow: 'Desember – Maret (Hujan deras memicu erosi dinding kaldera curam dan arah angin gas beracun tak menentu).',
    },
    summary:
      'Danau kawah hiper-asam vulkanik terbesar di dunia dengan alterasi hidrotermal silika-alunit-jarosit yang memodelkan danau kawah purba Mars.',
    geologicalRationale:
      'Interaksi gas magmatik dengan air meteorik di Kawah Ijen menciptakan alterasi asam-sulfat intensif (kaolinit, alunit, jarosite, silika opalin) pada dinding kaldera basaltik-andesitik, analog langsung cekungan danau asam purba Mars.',
    missionApplications: [
      'Kalibrasi deteksi spektral mineral alterasi asam (alunit/jarosite) dari citra orbit',
      'Studi sedimentasi delta di lingkungan kawah asam aktif',
    ],
    hazardsAndConstraints: [
      'Gas belerang pekat dan pH danau <0.5 membatasi sampling ke tepi rim',
    ],
    comparativeMetrics: [
      {
        parameter: 'Assemblage Mineral Alterasi',
        earthValue: 'Silika Opalin, Alunit, Jarosite, Sulfur Natif',
        planetaryBenchmark: 'Silika & Sulfat Columbia Hills / Cross Crater',
        matchNote: 'Terverifikasi via analisis SWIR Sentinel-2 vs MRO CRISM',
      },
    ],
    dataSourceIds: ['esa-sentinel2', 'pvmbg-demnas', 'nasa-mro-crism'],
    accentColor: '#ef4444',
  },
  {
    id: 'svalbard-bockfjorden',
    name: 'Bockfjorden Volcanic Complex',
    region: 'Spitsbergen, Svalbard',
    country: 'Norwegia',
    lat: 79.4333,
    lon: 13.4333,
    elevationM: 480,
    targetBody: 'Mars',
    planetaryCounterpart: 'Jezero Crater Carbonate Margin & Nili Fossae',
    biome: 'Polar',
    similarityScore: 90.9,
    temperatureProfile: {
      avgC: -5,
      minC: -28,
      maxC: 7,
      note: 'Lingkungan kutub Arktik tinggi; suhu musim dingin -28°C dan musim panas singkat sekitar +3°C hingga +7°C.',
    },
    terrainProfile: {
      surfaceType: 'Batuan Basalt Permafrost dengan Endapan Mata Air Karbonat',
      slopeRange: '8° – 28° (lereng kerucut gunung api Arktik)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 7.6,
      description:
        'Lereng basalt keras beku yang mengandung globula karbonat mikrometer, membutuhkan bor bertorsi tinggi dan insulasi dingin.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juli – Agustus (Ekspedisi Musim Panas AMASE Svalbard)',
      climateCondition: 'Fiord terbuka dari es laut sehingga kapal riset dapat merapat, siang Arktik penuh, suhu +2°C s/d +7°C.',
      recommendedTests: [
        'Uji bor permafrost basalt keras dan detektor biomarker organik/karbonat untuk rover Mars (ExoMars/Perseverance)',
        'Evaluasi kegetasan bahan sambungan mekanis dan baju pelindung dingin Arktik',
      ],
      avoidWindow: 'November – April (Malam kutub gelap penuh dan pembekuan akses laut fjord).',
    },
    summary:
      'Kompleks vulkanik kutub dengan globula karbonat unik di dalam batuan basal yang identik dengan meteorit Mars ALH84001.',
    geologicalRationale:
      'Aktivitas mata air hangat di lingkungan permafrost Arktik mengendapkan globula karbonat magnesium-besi terzonasi di dalam pori batuan basal, menjadikannya lokasi uji utama ekspedisi AMASE untuk instrumen rover Mars.',
    missionApplications: [
      'Uji deteksi karbonat dan biomarker lipid di lingkungan kriogenik',
      'Evaluasi kinerja pengeboran permafrost berbatu basalt',
    ],
    hazardsAndConstraints: [
      'Cuaca Arktik dinamis dan kebutuhan perlindungan satwa kutub',
    ],
    comparativeMetrics: [
      {
        parameter: 'Mineral Karbonat Host',
        earthValue: 'Globula Karbonat Mg-Fe-Ca dalam Basalt',
        planetaryBenchmark: 'Karbonat Meteorit ALH84001 & Margin Kawah Jezero',
        matchNote: 'Tekstur mikro dan zonasi kimia hampir identik',
      },
    ],
    dataSourceIds: ['nasa-mro-crism', 'esa-mars-express', 'nasa-earthdata-modis'],
    accentColor: '#ef4444',
  },
  {
    id: 'qaidam-basin',
    name: 'Qaidam Basin Yardangs & Playas',
    region: 'Qinghai',
    country: 'Tiongkok',
    lat: 38.25,
    lon: 92.85,
    elevationM: 2800,
    targetBody: 'Mars',
    planetaryCounterpart: 'Aeolis Dorsa & Gale Crater Murray Formation',
    biome: 'Desert',
    similarityScore: 90.1,
    temperatureProfile: {
      avgC: 3,
      minC: -24,
      maxC: 27,
      note: 'Dataran tinggi dingin-kering; musim dingin mencapai -24°C sedangkan siang musim panas rata-rata 20–27°C.',
    },
    terrainProfile: {
      surfaceType: 'Punggungan Yardang Sedimen Garam & Dataran Playa Sulfat',
      slopeRange: '2° – 25° (tebing yardang sejajar angin)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 8.1,
      description:
        'Koridor bukit sedimen pahatan angin bercampur lempung garam lunak yang rawan membuat roda rover terbenam.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juli – Oktober (Akhir Musim Panas hingga Gugur Kering)',
      climateCondition: 'Badai pasir musim semi telah mereda, suhu siang nyaman (15–25°C), visibilitas satelit jelas.',
      recommendedTests: [
        'Uji navigasi rover otonom melintasi koridor yardang & sensor penekan risiko roda terbenam di playa garam',
        'Pengujian kendaraan udara/drone rotor tinggi di udara tipis elevasi 2.800 m',
      ],
      avoidWindow: 'Maret – Mei (Puncak badai debu Gobi-Qaidam) & Desember – Februari (Beku -24°C).',
    },
    summary:
      'Cekungan gurun dataran tinggi berisi punggungan yardang pahatan angin, playa magnesium-sulfat, dan bukit pasir aktif bertekanan udara rendah.',
    geologicalRationale:
      'Erosi aeolian berkepanjangan pada sedimen lakustrin kaya garam menghasilkan ribuan yardang sejajar arah angin serta endapan gipsum dan kieserite yang paralel dengan bentang alam Aeolis Dorsa di Mars.',
    missionApplications: [
      'Studi rekonstruksi arah angin purba dan laju erosi aeolian pada sedimen danau',
      'Uji navigasi rover melintasi koridor yardang dan dataran playa lunak',
    ],
    hazardsAndConstraints: [
      'Badai debu musiman musim semi dan dataran garam lunak di tepi playa',
    ],
    comparativeMetrics: [
      {
        parameter: 'Densitas & Geometri Yardang',
        earthValue: 'Panjang 50–400 m, Rasio Aspek 4:1',
        planetaryBenchmark: 'Yardang Medusae Fossae & Aeolis Planum',
        matchNote: 'Analisis tekstur morfologi menggunakan SRTM vs HiRISE',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'nasa-mro-hirise', 'nasa-themis'],
    accentColor: '#ef4444',
  },
  {
    id: 'barringer-crater',
    name: 'Barringer (Meteor) Impact Crater',
    region: 'Arizona',
    country: 'Amerika Serikat',
    lat: 35.0275,
    lon: -111.0225,
    elevationM: 1710,
    targetBody: 'Moon',
    planetaryCounterpart: 'Lunar Simple Bowl Craters (Linné Crater)',
    biome: 'Impact Crater',
    similarityScore: 91.5,
    temperatureProfile: {
      avgC: 13,
      minC: -8,
      maxC: 33,
      note: 'Dataran tinggi Colorado Plateau; siang musim panas 30–33°C, malam musim dingin -8°C.',
    },
    terrainProfile: {
      surfaceType: 'Dinding Kawah Talus Berbatu Batu Pasir-Dolomit & Breksi',
      slopeRange: '20° – 38° (lereng dalam kawah mangkuk)',
      roughness: 'Tinggi (Curam & Kasar)',
      acidityPh: 7.7,
      description:
        'Lereng batu lepas (talus) curam di dinding kawah dengan lantai berdebu silikat halus yang menguji tambatan rover lereng.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – Juni & September – November (Musim Semi & Gugur Arizona)',
      climateCondition: 'Suhu siang 18–26°C, angin lembah relatif tenang sebelum badai monsun atau panas puncak.',
      recommendedTests: [
        'Pelatihan traverse dinding kawah astronot Artemis & uji tali tambat/winch rover lereng curam >25°',
        'Uji keausan bahan sol EVA dan pelapis sarung tangan terhadap batu pasir-dolomit kasar',
      ],
      avoidWindow: 'Juli – Agustus (Badai petir monsun sore & suhu >33°C) serta Januari (Salju tipis di rim).',
    },
    summary:
      'Kawah tumbukan sederhana berdiameter 1,2 km yang paling terawetkan di Bumi, lokasi pelatihan geologi astronot Apollo hingga Artemis.',
    geologicalRationale:
      'Mempertahankan lapisan ejecta terbalik (overturned flap), dinding berbatu curam, dan dasar kawah berbentuk mangkuk dengan rasio kedalaman-terhadap-diameter (~0.15) yang menjadi acuan klasik kawah sederhana Bulan.',
    missionApplications: [
      'Pelatihan traverse geologi permukaan dan dokumentasi foto astronot Artemis',
      'Pengujian sistem penambatan dan pengangkutan sampel pada lereng kawah curam',
    ],
    hazardsAndConstraints: [
      'Lereng talus bagian dalam kawah rentan longsoran batu lepas saat dilalui',
    ],
    comparativeMetrics: [
      {
        parameter: 'Rasio Kedalaman / Diameter',
        earthValue: 'd/D ≈ 0.15 (Kedalaman 170 m, Diameter 1.186 m)',
        planetaryBenchmark: 'd/D ≈ 0.18 – 0.21 (Kawah Sederhana Lunar <15 km)',
        matchNote: 'Kesesuaian profil elevasi langsung dengan LRO LOLA',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'usgs-astrogeology', 'nasa-srtm'],
    accentColor: '#3b82f6',
  },
];
