import { ScoreComponentBreakdown, SiteFidelityInputs, computeSiteFidelityScores } from '../utils/siteScorer';

export type TargetBody = 'Moon' | 'Mars' | 'Moon & Mars';
export type TerrainBiome = 'Volcanic' | 'Desert' | 'Polar' | 'Impact Crater' | 'Cave / Lava Tube' | 'Hydrothermal';
export type ValidationStatus = 'Resmi NASA/ESA' | 'Jurnal Peer-Reviewed' | 'Eksploratif Lokal';

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

export interface ScientificReference {
  citation: string;
  url: string;
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
  validationStatus: ValidationStatus;
  fidelityInputs: SiteFidelityInputs;
  similarityScore: number; // Calibrated multi-factor index (<= 91.5%)
  moonSimilarityScore: number;
  marsSimilarityScore: number;
  scoreBreakdown: string;
  scoreComponents: ScoreComponentBreakdown[];
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
  scientificReferences: ScientificReference[];
  accentColor: string;
}

type RawAnalogSite = Omit<
  AnalogSite,
  'similarityScore' | 'moonSimilarityScore' | 'marsSimilarityScore' | 'scoreBreakdown' | 'scoreComponents'
>;

const RAW_ANALOG_SITES: RawAnalogSite[] = [
  {
    id: 'atacama-yungay',
    name: 'Atacama Desert (Yungay Core)',
    region: 'Antofagasta',
    country: 'Chile',
    lat: -24.0833,
    lon: -69.9167,
    elevationM: 980,
    targetBody: 'Mars',
    planetaryCounterpart: 'Jezero Crater, Gale Crater & Oxia Planum',
    biome: 'Desert',
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 5.0,
      lunarTerrainScore: 2.0,
      marsTerrainScore: 4.5,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 4,
    },
    isTopFinding: true,
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
      bestWindow: 'April – November (Musim Gugur hingga Awal Musim Panas Kering)',
      climateCondition: 'Curah hujan mendekati nol (<2 mm/tahun), suhu siang stabil 20–28°C, visibilitas cerah untuk kampanye rover.',
      recommendedTests: [
        'Kalibrasi bor otonom bawah permukaan (1–2 m) dan spektrometer deteksi biosignature (Raman/LIBS/GC-MS)',
        'Uji ketahanan segel Fluorosilicone (FVMQ), jendela optik Safir, dan tekstil Orthofabric terhadap paparan UV & tanah perklorat',
      ],
      avoidWindow: 'Januari – Maret (Dampak angin lokal & puncak musim hujan Altiplano di pegunungan timur sekitar).',
    },
    summary:
      'Standar emas NASA/ESA sebagai gurun non-polar terkering di Bumi dengan tanah kaya perklorat, nitrat, dan fluks radiasi UV ekstrem untuk uji deteksi kehidupan Mars.',
    geologicalRationale:
      'Curah hujan <2 mm/tahun serta konsentrasi garam perklorat dan sulfat permukaan membuat tanah Yungay hampir steril secara biologis, meniru kimia tanah permukaan Mars yang terukur oleh pendarat Phoenix dan rover Curiosity.',
    missionApplications: [
      'Kalibrasi instrumen spektroskopi Raman, LIBS, dan GC-MS untuk deteksi biosignature organik Mars',
      'Pengujian bor otonom bawah permukaan (kedalaman 1–2 m) untuk misi ExoMars/Rosalind Franklin & Mars Life Explorer',
      'Simulasi operasi rover otonom jarak jauh dengan latensi komunikasi Bumi–Mars',
    ],
    hazardsAndConstraints: [
      'Badai angin debu halus di siang hari dan fluktuasi suhu diurnal tajam',
      'Sifat oksidatif garam perklorat dan nitrat mempercepat degradasi polimer tertentu',
    ],
    comparativeMetrics: [
      {
        parameter: 'Indeks Hiper-Ariditas',
        earthValue: '< 2 mm/tahun (Inti Yungay)',
        planetaryBenchmark: '0 mm/tahun (Hesperian-Amazonian Mars)',
        matchNote: 'Kondisi preservasi mineral garam dan organik terbaik di Bumi (Science, 2003)',
      },
      {
        parameter: 'Kimia Garam Permukaan',
        earthValue: 'Perklorat, Nitrat, Gipsum, Halit',
        planetaryBenchmark: 'Perklorat (0.5–1 wt%), Sulfat Mg/Ca',
        matchNote: 'Analog kimia langsung untuk sampel tanah Phoenix & Gale Crater',
      },
    ],
    dataSourceIds: ['nasa-earthdata-modis', 'nasa-mro-hirise', 'nasa-mro-crism', 'usgs-astrogeology'],
    scientificReferences: [
      {
        citation: 'Navarro-González et al. (2003), Science 302(5647) — Mars-Like Soils in the Atacama Desert & Dry Limit of Life',
        url: 'https://doi.org/10.1126/science.1089143',
      },
    ],
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
    planetaryCounterpart: 'Mare Imbrium, Rima Hadley & Marius Hills',
    biome: 'Volcanic',
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 5.0,
      marsGeologyScore: 3.5,
      lunarTerrainScore: 5.0,
      marsTerrainScore: 4.0,
      aridity: 'Arid / Semi-Arid',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 4,
    },
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
      bestWindow: 'Juni – September (Musim Panas Kering Dataran Tinggi Idaho)',
      climateCondition: 'Bebas salju, permukaan aliran lava basalt kering sempurna, durasi siang panjang untuk uji kampanye FINESSE.',
      recommendedTests: [
        'Uji ketahanan ban superelastis Nitinol (NASA Glenn) & sasis Ti-6Al-4V pada sayatan lava aa yang sangat abrasif',
        'Pelatihan geologi lapangan astronot Artemis & pemetaan LiDAR/GPR skylight tabung lava',
      ],
      avoidWindow: 'Desember – Maret (Lapisan salju menutup fitur lava pahoehoe/aa dan akses taman nasional ditutup).',
    },
    summary:
      'Situs analog utama NASA SSERVI FINESSE dan pelatihan Apollo 14 dengan dataran lava basaltik muda (pahoehoe & aa), kerucut sinder, dan tabung lava utuh.',
    geologicalRationale:
      'Aliran lava Snake River Plain memiliki komposisi basalt kaya FeO dengan struktur vesikular, retakan tekanan, serta terowongan tabung lava yang mereplikasi fitur vulkanik Mare Imbrium dan rilles Bulan.',
    missionApplications: [
      'Pelatihan geologi lapangan astronot Artemis untuk identifikasi dan sampling batuan basaltik Mare',
      'Eksplorasi robotik berkaki/beroda memasuki skylight dan tabung lava (proyek NASA FINESSE)',
      'Pemetaan struktur bawah permukaan menggunakan Ground Penetrating Radar (GPR)',
    ],
    hazardsAndConstraints: [
      'Permukaan lava aa sangat tajam dan abrasif terhadap kain luar spacesuit maupun ban konvensional',
    ],
    comparativeMetrics: [
      {
        parameter: 'Morfologi Aliran Lava',
        earthValue: 'Basalt Pahoehoe & Aa, Rilles Keruntuhan',
        planetaryBenchmark: 'Sinuous Rilles (Rima Hadley) & Mare Flows',
        matchNote: 'Kesesuaian fitur aliran teridentifikasi pada citra LROC NAC & kampanye NASA FINESSE',
      },
      {
        parameter: 'Dimensi Tabung Lava',
        earthValue: 'Lebar 10–30 m, Atap Basalt 3–12 m',
        planetaryBenchmark: 'Skylight Marius Hills (Lebar >50 m, Gravitasi 1/6 g)',
        matchNote: 'Model geometri masuk skylight untuk rover tambat',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'usgs-astrogeology', 'nasa-srtm', 'jaxa-selene'],
    scientificReferences: [
      {
        citation: 'Hughes, Garry, Sehlke et al. (2020), Planetary & Space Science 193 — Basaltic fissure types on Earth: Analog terrains on Moon & Mars',
        url: 'https://doi.org/10.1016/j.pss.2020.105091',
      },
      {
        citation: 'Heldmann et al. (2016), NASA SSERVI FINESSE — Field Investigations at Craters of the Moon (NTRS 20160005857)',
        url: 'https://ntrs.nasa.gov/citations/20160005857',
      },
    ],
    accentColor: '#3b82f6',
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 3.5,
      marsGeologyScore: 4.2,
      lunarTerrainScore: 4.5,
      marsTerrainScore: 4.5,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 4,
    },
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
        'Medan berbatu dolomit bersudut tajam dengan tanah poligonal es-permafrost, menguji ketahanan rover, bor es, dan sol sepatu EVA.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juli – Agustus (Musim Panas Arktik Terang 24 Jam)',
      climateCondition: 'Suhu berada di kisaran 0°C hingga +8°C, lapisan aktif permafrost dapat dibor, akses penerbangan Twin Otter terbuka.',
      recommendedTests: [
        'Uji operasional Pressurized Rover berawak, baju EVA (Orthofabric & Aerogel), dan komunikasi tunda Bulan/Mars',
        'Pengujian Ground Penetrating Radar (GPR) dan bor permafrost pada breksi tumbukan',
      ],
      avoidWindow: 'Oktober – Mei (Kegelapan kutub total, suhu ekstrem -42°C, dan badai salju Arktik).',
    },
    summary:
      'Lokasi resmi NASA Haughton-Mars Project (HMP): kawah tumbukan berdiameter 23 km di gurun kutub Arktik dengan breksi tumbukan utuh dan permafrost poligonal.',
    geologicalRationale:
      'Terbentuk ~23–39 juta tahun lalu pada batuan karbonat di atas batuan dasar kristalin, Haughton mempertahankan ejecta blanket dan mineral sulfat pasca-tumbukan di gurun kutub tanpa vegetasi tinggi. Topografinya dipetakan dengan ArcticDEM (karena SRTM berhenti di 60°LU).',
    missionApplications: [
      'Operasi EVA bertekanan dan kendaraan jelajah berawak (Pressurized Rover)',
      'Pemetaan stratigrafi breksi tumbukan dan es bawah permukaan menggunakan GPR',
      'Pengujian protokol isolasi dan tele-operasi komunikasi tunda misi luar angkasa',
    ],
    hazardsAndConstraints: [
      'Jendela akses logistik musim panas Arktik sangat singkat (Juli–Agustus)',
      'Bongkah breksi tajam dan suhu malam di bawah nol menuntut pelindung dingin & abrasi',
    ],
    comparativeMetrics: [
      {
        parameter: 'Struktur Tumbukan',
        earthValue: 'Diameter 23 km, Breksi Polimik Karbonat-Kristalin',
        planetaryBenchmark: 'Kawah Kompleks Awal Mars & Basin Sekunder Lunar',
        matchNote: 'Morfologi puncak pusat dan teras dinding terawetkan baik (ArcticDEM & LOLA)',
      },
      {
        parameter: 'Pola Tanah Permafrost',
        earthValue: 'Jaringan Poligonal Es-Tanah (10–25 m)',
        planetaryBenchmark: 'Poligon Sublimasi Es Phoenix Landing Site',
        matchNote: 'Kesesuaian geometri fraktur termal berdasarkan HiRISE',
      },
    ],
    dataSourceIds: ['pgc-arcticdem', 'nasa-mro-hirise', 'nasa-lro-lola', 'usgs-astrogeology'],
    scientificReferences: [
      {
        citation: 'Parnell et al. (2012), Int. J. Astrobiology 11(2) — Surface Sulphates in Haughton Impact Structure as Mars Analog',
        url: 'https://doi.org/10.1017/S1473550411000395',
      },
    ],
    accentColor: '#8b5cf6',
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 3.8,
      marsGeologyScore: 2.5,
      lunarTerrainScore: 5.0,
      marsTerrainScore: 4.0,
      aridity: 'Arid / Semi-Arid',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 4,
    },
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
        'Uji keausan bahan sol EVA (Orthofabric) dan rangka Ti-6Al-4V terhadap batu pasir-dolomit kasar',
      ],
      avoidWindow: 'Juli – Agustus (Badai petir monsun sore & suhu >33°C) serta Desember – Januari (Salju tipis di rim).',
    },
    summary:
      'Kawah tumbukan sederhana berdiameter 1,2 km yang paling terawetkan di Bumi, lokasi pelatihan geologi astronot Apollo (Eugene Shoemaker) hingga Artemis.',
    geologicalRationale:
      'Mempertahankan lapisan ejecta terbalik (overturned flap), dinding berbatu curam, dan dasar kawah berbentuk mangkuk dengan rasio kedalaman-terhadap-diameter (~0.15) yang menjadi acuan klasik kawah sederhana Bulan.',
    missionApplications: [
      'Pelatihan traverse geologi permukaan dan dokumentasi lapangan astronot Artemis',
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
    scientificReferences: [
      {
        citation: 'Melosh & Collins (2005), Nature 434 — Planetary Science: Meteor Crater Formed by Low-Velocity Impact',
        url: 'https://doi.org/10.1038/434157a',
      },
    ],
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 4.0,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 4.5,
      marsTerrainScore: 4.5,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 4,
    },
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
      climateCondition: 'Cahaya matahari kutub 24 jam bersudut rendah (~10°–35°), suhu operasi lapangan -15°C hingga 0°C.',
      recommendedTests: [
        'Pengujian bor kriogenik es bawah permukaan (seperti kelas misi VIPER/Artemis) dan pelumas padat tahan dingin',
        'Validasi isolator Aerogel Silika & Aluminized Kapton MLI pada baterai sub-zero serta panel surya sudut rendah',
      ],
      avoidWindow: 'April – September (Malam kutub abadi, suhu hingga -55°C, angin katabatik >100 km/jam, akses pesawat terhenti).',
    },
    summary:
      'Lembah bebas es terdingin dan terkering di Antartika dengan es tersemen di bawah regolith kering, menjadi analog utama cadangan es Kutub Selatan Bulan dan dataran polar Mars.',
    geologicalRationale:
      'Angin katabatik kering menjaga permukaan bebas salju sementara lapisan permafrost es terawetkan beberapa sentimeter di bawah regolith basaltik-granitik, mereplikasi profil termal dan mekanik pengeboran es untuk misi Artemis dan Mars Polar.',
    missionApplications: [
      'Pengujian bor pencari es kriogenik dan spektrometer neutron/massa',
      'Validasi sistem tenaga surya sudut rendah dan manajemen termal baterai sub-zero (-40°C s/d -55°C)',
      'Studi batas astrobiologi kriptoendolitik pada batuan pasir kering dingin',
    ],
    hazardsAndConstraints: [
      'Angin katabatik berkecepatan tinggi dan larangan kontaminasi biologis ketat (Antarctic Treaty)',
      'Suhu <-50°C membuat elastomer biasa kaku sehingga membutuhkan Aerogel/MLI dan segel pegas logam',
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
        matchNote: 'Uji kegetasan isolator kriogenik dan pelumas padat',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'nasa-earthdata-modis', 'nasa-mro-hirise'],
    scientificReferences: [
      {
        citation: 'Salvatore & Levy (2021), Elsevier — The McMurdo Dry Valleys of Antarctica: Geological & Environmental Analog to Mars',
        url: 'https://doi.org/10.1016/B978-0-12-820245-6.00011-2',
      },
    ],
    accentColor: '#8b5cf6',
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 2.0,
      marsGeologyScore: 4.2,
      lunarTerrainScore: 3.0,
      marsTerrainScore: 4.5,
      aridity: 'Arid / Semi-Arid',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 3.5,
    },
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
      climateCondition: 'Suhu siang nyaman 18–26°C, angin kering stabil, aman bagi tim insinyur JPL untuk uji rover harian.',
      recommendedTests: [
        'Uji sistem pendarat LiDAR (Landing Vision System) & ketahanan roda Nitinol / Ti-6Al-4V pada bongkah batu tajam Mars Hill',
        'Khusus Juni–Agustus: Uji ekstrem pelepasan panas radiator Aluminium 7075-T6 & baterai >48°C secara otonom tanpa kru luar',
      ],
      avoidWindow: 'Juni – Agustus untuk uji kru lapangan EVA (Risiko heatstroke ekstrem >50°C).',
    },
    summary:
      'Kipas aluvial, dataran garam evaporit, dan kawah maar hidrovolkanik Ubehebe yang digunakan NASA JPL untuk menguji pendarat Mars dan mobilitas rover.',
    geologicalRationale:
      'Kawah Ubehebe menyajikan lapisan tufa basaltik berlapis dan lobus puing di dinding kawah, sementara Badwater Basin dan Mars Hill memiliki punggungan garam poligonal dan ladang batu terjal untuk uji penghindaran rintangan otonom.',
    missionApplications: [
      'Uji sistem pendaratan otonom LiDAR dan optik (Landing Vision System)',
      'Uji lintasan batuan tajam terhadap degradasi roda rover',
      'Studi kipas aluvial kering sebagai analog delta sungai purba Mars',
    ],
    hazardsAndConstraints: [
      'Temperatur permukaan musim panas >50°C menguji manajemen termal baterai dan avionik rover',
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
        matchNote: 'Stratigrafi surge base tephra terbuka jelas (Geomorphology, 2015)',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'nasa-themis', 'nasa-mro-hirise', 'usgs-astrogeology'],
    scientificReferences: [
      {
        citation: 'Eyles & Daurio (2015), Geomorphology 246 — Debris Lobes & Hollows in Ubehebe Crater as Mars Crater Analog',
        url: 'https://doi.org/10.1016/j.geomorph.2015.05.029',
      },
      {
        citation: 'Fierstein & Hildreth (2017), JVGR 335 — Eruptive History of the Ubehebe Crater Cluster',
        url: 'https://doi.org/10.1016/j.jvolgeores.2017.02.010',
      },
    ],
    accentColor: '#ef4444',
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 4.5,
      marsGeologyScore: 4.0,
      lunarTerrainScore: 5.0,
      marsTerrainScore: 4.5,
      aridity: 'Lembap / Basah',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 3,
    },
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
        'Rongga terowongan basalt tanpa cahaya matahari dan tanpa sinyal GPS dengan tepian batu tajam dan kelembapan lokal.',
    },
    seasonalRecommendation: {
      bestWindow: 'Mei – September (Musim Lebih Kering di Sisi Timur/Puna Hawaii)',
      climateCondition: 'Curah hujan angin pasat lebih rendah sehingga rembesan air dari atap basalt berkurang; suhu gua konstan ~19°C.',
      recommendedTests: [
        'Pengujian modul habitat tiup (inflatable habitat beranyaman Vectran & Kevlar) di dalam rongga basalt',
        'Pemetaan LiDAR SLAM otonom dan uji relai komunikasi RF/magnetik dari skylight ke dalam gua',
      ],
      avoidWindow: 'November – Maret (Puncak musim hujan sisi timur Hawaii menyebabkan genangan dan tetesan air tinggi di segmen gua rendah).',
    },
    summary:
      'Jaringan gua tabung lava basaltik terpanjang di Bumi (>65 km) untuk arsitektur habitat bawah tanah pelindung radiasi kosmik dan mikrometeorit.',
    geologicalRationale:
      'Terbentuk oleh aliran lava pahoehoe yang mengering di bawah kerak membeku, Kazumura memberikan geometri terowongan nyata dengan skylight runtuhan dan atap basalt tebal sebagai analog langsung Marius Hills Bulan dan Arsia Mons Mars.',
    missionApplications: [
      'Pemetaan LiDAR SLAM otonom di dalam terowongan gelap tanpa sinyal GPS',
      'Desain jaringan relay komunikasi RF/optik dan survei anomali magnetik dari permukaan ke dalam gua',
      'Pengujian modul habitat tiup Vectran/Kevlar di dalam rongga batuan basalt',
    ],
    hazardsAndConstraints: [
      'Runtuhan batuan langit-langit lokal dan kelembapan gua tropis yang tinggi',
    ],
    comparativeMetrics: [
      {
        parameter: 'Stabilitas Termal Gua',
        earthValue: 'Variasi < 2°C sepanjang tahun',
        planetaryBenchmark: 'Lunar Lava Tube ~ -20°C hingga +17°C konstan (vs ±150°C luar)',
        matchNote: 'Perlindungan radiasi kosmik galaktik dengan atap basalt >5 m (Earth-Science Reviews, 2020)',
      },
    ],
    dataSourceIds: ['nasa-lro-lola', 'jaxa-selene', 'nasa-mro-hirise'],
    scientificReferences: [
      {
        citation: 'Sauro et al. (2020), Earth-Science Reviews 209 — Lava Tubes on Earth, Moon and Mars',
        url: 'https://doi.org/10.1016/j.earscirev.2020.103288',
      },
      {
        citation: 'Bell et al. (2022), JGR: Planets 127 — Lava Tube Magnetic Anomalies as Lunar Prospecting Analog',
        url: 'https://doi.org/10.1029/2021JE007140',
      },
    ],
    accentColor: '#8b5cf6',
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 5.0,
      lunarTerrainScore: 1.5,
      marsTerrainScore: 3.5,
      aridity: 'Lembap / Basah',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 3.5,
    },
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
      climateCondition: 'Suhu moderat 18–26°C, endapan kerak sulfat terpapar jelas tanpa pengenceran banjir sungai musim dingin.',
      recommendedTests: [
        'Pengujian ketahanan korosi probe Hastelloy C-276, keramik SiC & segel FVMQ pada sedimen pH 1.5–2.5',
        'Kalibrasi instrumen deteksi jarosite & hematit (Mössbauer/Raman/XRD) untuk analog Meridiani Planum',
      ],
      avoidWindow: 'Juli – Agustus (Gelombang panas >38°C) & November – Januari (Hujan musiman mengencerkan kerak garam).',
    },
    summary:
      'Laboratorium astrobiologi NASA/ESA di sistem sungai hiper-asam kaya besi dan sulfat (jarosite, hematit) untuk mineralogi Hesperian Mars.',
    geologicalRationale:
      'Oksidasi pirit bawah permukaan oleh bakteri kemolitotrofik menghasilkan larutan pH 1.5–2.5 yang mengendapkan jarosite, goethite, dan hematit—mineral kunci yang ditemukan rover Opportunity di Meridiani Planum.',
    missionApplications: [
      'Kalibrasi instrumen Mössbauer, Raman, dan difraksi sinar-X (CheMin) untuk mineral besi-sulfat',
      'Pengujian ketahanan korosi sensor dan komponen rover pada endapan asam kering (proyek MARTE)',
    ],
    hazardsAndConstraints: [
      'Lingkungan asam korosif merusak aluminium tak terlapis dan memerlukan Hastelloy/keramik SiC pada ujung probe',
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
    scientificReferences: [
      {
        citation: 'Amils et al. (2007), Planetary & Space Science 55 — Extreme Environments as Mars Analogs: The Rio Tinto Case',
        url: 'https://doi.org/10.1016/j.pss.2006.02.006',
      },
      {
        citation: 'Amils, Fernández-Remolar & The IPBSL Team (2014), Life 4(3) — Río Tinto: Geochemical & Mineralogical Analogue of Mars',
        url: 'https://doi.org/10.3390/life4030511',
      },
    ],
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
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 2.0,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 3.0,
      marsTerrainScore: 4.0,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 3.5,
    },
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
      bestWindow: 'Juli – Agustus (Jendela Ekspedisi AMASE Svalbard)',
      climateCondition: 'Fiord terbuka dari es laut sehingga kapal riset dapat merapat, siang Arktik penuh, suhu +2°C s/d +7°C.',
      recommendedTests: [
        'Uji bor permafrost basalt keras (Ti-6Al-4V/SiC) & detektor biomarker karbonat untuk rover Mars (ExoMars/Perseverance)',
        'Evaluasi kegetasan pelapis dingin dan insulasi Aerogel/Orthofabric di lingkungan lembap-beku Arktik',
      ],
      avoidWindow: 'November – April (Malam kutub gelap penuh dan pembekuan akses laut fjord).',
    },
    summary:
      'Lokasi utama ekspedisi NASA/ESA AMASE: kompleks vulkanik kutub dengan globula karbonat unik dalam basalt yang identik dengan meteorit Mars ALH84001.',
    geologicalRationale:
      'Aktivitas mata air hangat di permafrost Arktik mengendapkan globula karbonat Mg-Fe terzonasi di dalam pori basalt, menjadikannya analog utama margin karbonat Kawah Jezero. Elevasinya menggunakan ArcticDEM (>79°LU).',
    missionApplications: [
      'Uji deteksi karbonat dan biomarker lipid/Raman untuk instrumen Perseverance & ExoMars',
      'Evaluasi kinerja pengeboran permafrost berbatu basalt',
    ],
    hazardsAndConstraints: [
      'Cuaca Arktik dinamis dan protokol keselamatan/lingkungan ketat di kawasan lindung Svalbard',
    ],
    comparativeMetrics: [
      {
        parameter: 'Mineral Karbonat Host',
        earthValue: 'Globula Karbonat Mg-Fe-Ca dalam Basalt',
        planetaryBenchmark: 'Karbonat Meteorit ALH84001 & Margin Kawah Jezero',
        matchNote: 'Tekstur mikro dan zonasi kimia hampir identik (EPSL 2002, MAPS 2007)',
      },
    ],
    dataSourceIds: ['pgc-arcticdem', 'nasa-mro-crism', 'esa-mars-express', 'nasa-earthdata-modis'],
    scientificReferences: [
      {
        citation: 'Treiman et al. (2002), Earth & Planet. Sci. Lett. 204 — Hydrothermal Origin for Carbonate Globules in ALH84001: Spitsbergen Analog',
        url: 'https://doi.org/10.1016/S0012-821X(02)00998-6',
      },
      {
        citation: 'Steele et al. (2007), Meteoritics & Planet. Sci. 42 — Comprehensive Imaging & Raman Spectroscopy of ALH84001 & Svalbard Carbonates',
        url: 'https://doi.org/10.1111/j.1945-5100.2007.tb00590.x',
      },
    ],
    accentColor: '#ef4444',
  },
  {
    id: 'mauna-kea',
    name: 'Mauna Kea & Puʻu Nēnē Tephra Cones',
    region: 'Hawaii',
    country: 'Amerika Serikat',
    lat: 19.8207,
    lon: -155.4681,
    elevationM: 4100,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Lunar Mare/Highlands ISRU & Bright Martian Dust (JSC Mars-1)',
    biome: 'Volcanic',
    validationStatus: 'Resmi NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 4.5,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 4.0,
      marsTerrainScore: 4.0,
      aridity: 'Arid / Semi-Arid',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 3.5,
    },
    temperatureProfile: {
      avgC: 4,
      minC: -6,
      maxC: 14,
      note: 'Ketinggian 4.100 m menjaga rata-rata 4°C dengan embun beku malam (-6°C) dan radiasi UV surya tinggi.',
    },
    terrainProfile: {
      surfaceType: 'Kerucut Sinder Basaltik Tinggi & Tephra Palagonitik (Puʻu Nēnē)',
      slopeRange: '12° – 32° (lereng kerucut vulkanik)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 6.5,
      description:
        'Tefra basaltik kaya Fe-Ti di ketinggian bertekanan udara tipis (~60% tekanan permukaan laut) serta abu palagonitik analog debu Mars.',
    },
    seasonalRecommendation: {
      bestWindow: 'Mei – Oktober (Musim Kemarau Pasifik Tengah)',
      climateCondition: 'Visibilitas cerah konstan di atas lapisan awan, angin puncak rendah, permukaan abu tephra kering.',
      recommendedTests: [
        'Demonstrasi sintering laser/mikrogelombang & ekstraksi oksigen regolith basaltik (uji lapangan NASA/PISCES ISRU)',
        'Uji operasi ekskavator & rover ringan CFRP-PEEK / Ti-6Al-4V di ketinggian atmosfer tipis dan radiasi UV tinggi',
      ],
      avoidWindow: 'Desember – Februari (Badai salju puncak & pembekuan jalan akses ketinggian >3.800 m).',
    },
    summary:
      'Lokasi uji ISRU Bulan (NASA/PISCES) di lereng basaltik 4.100 m sekaligus sumber resmi simulan tanah Mars NASA JSC Mars-1 dari kerucut Puʻu Nēnē.',
    geologicalRationale:
      'Koreksi penting simulan NASA: kerucut sinder Puʻu Nēnē di antara Mauna Kea–Mauna Loa adalah sumber tephra palagonitik simulan Mars JSC Mars-1 (sedangkan simulan Bulan JSC-1 berasal dari Merriam Crater, Arizona). Sementara itu, zona basaltik puncak Mauna Kea dipakai NASA/PISCES untuk uji ISRU pendaratan Bulan.',
    missionApplications: [
      'Demonstrasi penambangan regolith otonom dan sintering landasan pendaratan Bulan (ISRU / PISCES)',
      'Kalibrasi spektral debu teroksidasi Mars menggunakan referensi JSC Mars-1 (Puʻu Nēnē)',
    ],
    hazardsAndConstraints: [
      'Ketinggian 4.100 m membatasi durasi kerja tim peneliti tanpa aklimatisasi serta terdapat kawasan lindung budaya Hawaii',
    ],
    comparativeMetrics: [
      {
        parameter: 'Peran Simulan NASA Resmi',
        earthValue: 'Puʻu Nēnē Palagonitic Tephra (JSC Mars-1) & Mauna Kea Basalt',
        planetaryBenchmark: 'Bright Martian Dust (Mars) & Lunar Basalt ISRU (Moon)',
        matchNote: 'JSC Mars-1 (Allen et al., 1998); JSC-1 lunar berasal dari Arizona, bukan Hawaii',
      },
    ],
    dataSourceIds: ['usgs-astrogeology', 'nasa-lro-lola', 'nasa-mro-crism', 'nasa-srtm'],
    scientificReferences: [
      {
        citation: 'Allen et al. (1998), Eos Trans. AGU 79(34) / LPSC XXIX — Martian Soil Simulant JSC Mars-1 (Puʻu Nēnē, Mauna Kea)',
        url: 'https://doi.org/10.1029/98EO00309',
      },
      {
        citation: 'Frey et al. (1991), JGR 96 — The Evolution of Mauna Kea Volcano, Hawaii: Petrogenesis of Tholeiitic & Alkalic Basalts',
        url: 'https://doi.org/10.1029/91JB00940',
      },
    ],
    accentColor: '#8b5cf6',
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
    validationStatus: 'Jurnal Peer-Reviewed',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 2.5,
      marsTerrainScore: 4.5,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 2,
    },
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
        'Pengujian kendaraan udara/drone CFRP-PEEK berotor tinggi di udara tipis elevasi 2.800 m',
      ],
      avoidWindow: 'Maret – Mei (Puncak badai debu Gobi–Qaidam) & Desember – Februari (Suhu beku hingga -24°C).',
    },
    summary:
      'Cekungan gurun dataran tinggi dingin berisi ribuan yardang pahatan angin dan playa magnesium-sulfat sebagai analog Mars utama di Asia.',
    geologicalRationale:
      'Erosi aeolian berkepanjangan pada sedimen lakustrin kaya garam menghasilkan ribuan yardang sejajar arah angin serta endapan gipsum dan kieserite yang paralel dengan bentang alam Aeolis Dorsa di Mars.',
    missionApplications: [
      'Studi rekonstruksi arah angin purba dan laju erosi aeolian pada sedimen danau Mars',
      'Uji navigasi rover melintasi koridor yardang dan dataran playa lunak',
    ],
    hazardsAndConstraints: [
      'Badai debu musiman musim semi dan kerak garam lunak di tepi playa yang menjebak roda',
    ],
    comparativeMetrics: [
      {
        parameter: 'Densitas & Geometri Yardang',
        earthValue: 'Panjang 50–400 m, Rasio Aspek 4:1',
        planetaryBenchmark: 'Yardang Medusae Fossae & Aeolis Planum',
        matchNote: 'Analisis tekstur morfologi menggunakan SRTM vs HiRISE (Earth-Science Reviews, 2017)',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'nasa-mro-hirise', 'nasa-themis'],
    scientificReferences: [
      {
        citation: 'Xiao et al. (2017), Earth-Science Reviews 164 — A New Terrestrial Analogue Site for Mars: The Qaidam Basin',
        url: 'https://doi.org/10.1016/j.earscirev.2016.11.003',
      },
    ],
    accentColor: '#ef4444',
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
    validationStatus: 'Jurnal Peer-Reviewed',
    fidelityInputs: {
      lunarGeologyScore: 1.0,
      marsGeologyScore: 4.2,
      lunarTerrainScore: 1.5,
      marsTerrainScore: 4.0,
      aridity: 'Hiper-Arid / Beku',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 2,
    },
    temperatureProfile: {
      avgC: 34.6,
      minC: 24.6,
      maxC: 49,
      note: 'Iklim gurun panas hiper-arid (Köppen BWh) dengan suhu rata-rata tahunan 34,6°C (Met Office 1960–1966; 34,5°C menurut Pedgley 1967), rata-rata maks harian 41,2°C, rata-rata min harian 28,2°C (terendah bulanan 24,6°C), rekor tertinggi 49°C (48,9°C), serta kolam hidrotermal >90°C.',
    },
    terrainProfile: {
      surfaceType: 'Dataran Evaporit Garam Laut Purba, Kerak Halit Rapuh & Kolam Brine Asam',
      slopeRange: '0° – 10° (dataran garam & gundukan hidrotermal)',
      roughness: 'Sedang (Berbatu)',
      acidityPh: 0.6,
      description:
        'Dataran evaporit garam hasil penguapan laut purba dengan kerak halit rapuh di atas larutan brine asam sulfat/klorida panas mendidih (pH ≤0–1,5).',
    },
    seasonalRecommendation: {
      bestWindow: 'November – Februari (Musim Sejuk Depresi Afar)',
      climateCondition: 'Suhu udara turun ke kisaran 25–37°C (rata-rata harian ~30–32°C) dengan hari hujan sangat jarang, sehingga lebih aman untuk operasi tim dan manajemen termal avionik.',
      recommendedTests: [
        'Uji ketahanan ekstrem superalloy Hastelloy C-276, keramik SiC & segel FVMQ pada brine asam panas pH < 1',
        'Kalibrasi sensor SWIR & detektor kehidupan batas abiotik di lingkungan hiper-salin',
      ],
      avoidWindow: 'Mei – September (Panas ekstrem dengan rata-rata maks harian 44–46,7°C dan rekor puncak 49°C membahayakan kru serta menuntut manajemen termal baterai ketat).',
    },
    summary:
      'Dataran garam evaporit hidrotermal beriklim hiper-arid (Köppen BWh) dengan kolam asam panas hiper-salin untuk studi batas fisikokimia kehidupan dan mata air panas purba Mars.',
    geologicalRationale:
      'Terletak di zona hiper-arid Depresi Danakil (curah hujan <200 mm/tahun; literatur gurun menyebut <25 mm/tahun) di atas endapan evaporit laut purba. Kombinasi pH ≤0–1,5, salinitas >30–40% (MgCl₂/FeSO₄), dan suhu kolam hingga ~110°C mendefinisikan batas poli-ekstremofil kehidupan yang paralel dengan endapan hidrotermal Home Plate di Kawah Gusev.',
    missionApplications: [
      'Penentuan batas deteksi kehidupan dan false-positive abiotik pada instrumen astrobiologi Mars',
      'Studi mineralogi garam kompleks dan silika hidrotermal lewat penginderaan jauh SWIR',
    ],
    hazardsAndConstraints: [
      'Panas lingkungan ekstrem (rata-rata maks tahunan 41,2°C, rekor 49°C), kerak garam rapuh di atas kolam mendidih, dan gas beracun',
    ],
    comparativeMetrics: [
      {
        parameter: 'Salinitas & Keasaman',
        earthValue: 'pH ≤ 0 – 1,5, Salinitas >30–40% (Mg/Fe Brines)',
        planetaryBenchmark: 'Larutan Garam Hidrotermal Noachian-Hesperian',
        matchNote: 'Menjelaskan koeksistensi silika amorf dan sulfat besi (Belilla et al., 2019; López-García et al., 2020)',
      },
      {
        parameter: 'Iklim Hiper-Arid & Evaporit',
        earthValue: 'Köppen BWh · Rata-Rata 34,6°C (34,5°C Pedgley 1967) · Hujan <200 mm/thn',
        planetaryBenchmark: 'Cekungan Evaporit Kering & Garam Klorida/Sulfat Mars',
        matchNote: 'Catatan curah hujan bervariasi antar-sumber (<25 mm/thn di teks Stoppato & Bini 2003 vs tabel 84 mm/thn atau batas regional <200 mm/thn)',
      },
    ],
    dataSourceIds: ['esa-sentinel2', 'nasa-mro-crism', 'esa-mars-express'],
    scientificReferences: [
      {
        citation: 'Belilla et al. (2019), Nature Ecology & Evolution 3 — Hyperdiverse Archaea Near Life Limits at Dallol',
        url: 'https://doi.org/10.1038/s41559-019-1005-0',
      },
      {
        citation: 'López-García et al. (2020), Frontiers in Earth Science 7:351 — Origin and Evolution of the Halo-Volcanic Complex of Dallol (mengutip iklim hiper-arid <200 mm/thn & rekor 34,5°C Pedgley 1967)',
        url: 'https://doi.org/10.3389/feart.2019.00351',
      },
      {
        citation: 'Cavalazzi et al. (2019), Astrobiology 19(4) — The Dallol Geothermal Area, Northern Afar (Ethiopia): An Exceptional Planetary Field Analog on Earth',
        url: 'https://doi.org/10.1089/ast.2018.1926',
      },
    ],
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
    validationStatus: 'Jurnal Peer-Reviewed',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 4.3,
      lunarTerrainScore: 2.0,
      marsTerrainScore: 3.5,
      aridity: 'Lembap / Basah',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 1.5,
    },
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
      bestWindow: 'Juni – Oktober (Musim Kemarau Jawa Timur)',
      climateCondition: 'Curah hujan minimal, arah angin pasat tenggara relatif stabil, dan minim limpasan air hujan di jalur rim kawah.',
      recommendedTests: [
        'Pengujian material pelindung korosi asam pekat (Hastelloy C-276, Keramik SiC & Orthofabric PTFE) pada probe/sensor tepi kawah',
        'Kalibrasi citra SWIR mineralogi alunit, jarosite, dan silika opalin (Opal-A) analog danau asam purba Mars',
      ],
      avoidWindow: 'Desember – Maret (Puncak musim hujan memicu erosi dinding kaldera curam, kabut tebal, dan perubahan arah gas beracun).',
    },
    summary:
      'Danau kawah hiper-asam vulkanik terbesar di dunia yang diakui luas dalam jurnal internasional sebagai analog alterasi asam-sulfat Mars.',
    geologicalRationale:
      'Interaksi gas magmatik dengan air meteorik di Kawah Ijen menciptakan alterasi asam-sulfat intensif (kaolinit, alunit, jarosite, silika Opal-A) pada dinding kaldera basaltik-andesitik—model geokimia utama cekungan danau asam purba Mars.',
    missionApplications: [
      'Kalibrasi deteksi spektral mineral alterasi asam (alunit/jarosite/Opal-A) dari citra orbit',
      'Pengujian sensor dan material tahan pH <0.5 di tepi danau hiper-asam',
    ],
    hazardsAndConstraints: [
      'Gas SO₂/HCl pekat dan pH danau <0.5 membatasi sampling ke zona rim dengan masker gas penuh',
    ],
    comparativeMetrics: [
      {
        parameter: 'Assemblage Mineral Alterasi',
        earthValue: 'Silika Opal-A, Alunit, Jarosite, Sulfur Natif',
        planetaryBenchmark: 'Silika & Sulfat Columbia Hills / Cross Crater',
        matchNote: 'Terverifikasi oleh studi geokimia Delmelle & Bernard (1994) serta citra SWIR',
      },
    ],
    dataSourceIds: ['esa-sentinel2', 'pvmbg-demnas', 'nasa-mro-crism'],
    scientificReferences: [
      {
        citation: 'Delmelle & Bernard (1994), Geochim. Cosmochim. Acta 58 — Geochemistry, Mineralogy & Chemical Modeling of Kawah Ijen Acid Lake',
        url: 'https://doi.org/10.1016/0016-7037(94)90023-X',
      },
      {
        citation: 'Löhr et al. (2004), Environ. Sci. Pollut. Res. 12 — Natural Pollution Caused by the Extremely Acid Crater Lake Kawah Ijen',
        url: 'https://doi.org/10.1065/espr2004.09.118',
      },
    ],
    accentColor: '#ef4444',
  },
  {
    id: 'gunung-bromo',
    name: 'Gunung Bromo & Lautan Pasir Tengger',
    region: 'Jawa Timur',
    country: 'Indonesia',
    lat: -7.9425,
    lon: 112.953,
    elevationM: 2329,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Kaldera & Medan Pasir Basaltik (Mare Lunar / Bagnold Dunes Mars)',
    biome: 'Volcanic',
    validationStatus: 'Eksploratif Lokal',
    fidelityInputs: {
      lunarGeologyScore: 3.3,
      marsGeologyScore: 3.5,
      lunarTerrainScore: 3.8,
      marsTerrainScore: 3.8,
      aridity: 'Lembap / Basah',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 0.5,
    },
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
        'Lautan pasir vulkanik gembur di dasar kaldera dengan butiran tephra basaltik-andesitik (60–280 µm), namun memiliki kelembapan atmosfer tropis.',
    },
    seasonalRecommendation: {
      bestWindow: 'Juni – Oktober (Musim Kemarau Jawa Timur)',
      climateCondition: 'Curah hujan minimal, langit cerah, angin kering tenggara, kelembapan relatif lebih rendah dibanding musim penghujan.',
      recommendedTests: [
        'Uji eksploratif lokal traksi roda rover (Nitinol/Ti-6Al-4V) dan navigasi optik/LiDAR pada lautan pasir basaltik-andesitik',
        'Pengujian ketahanan segel debu Fluorosilicone (FVMQ) & kain Orthofabric terhadap abrasi abu tephra kering musiman',
      ],
      avoidWindow: 'Desember – Maret (Puncak musim hujan membuat pasir basah memadat dan kabut tebal menghambat sensor optik).',
    },
    summary:
      'Kandidat analog eksploratif Indonesia: kaldera vulkanik berdiameter 10 km dengan lautan pasir basaltik-andesitik untuk uji lapangan lokal, meski belum masuk situs uji resmi NASA.',
    geologicalRationale:
      'Kaldera Tengger–Bromo belum menjadi bagian dari katalog uji lapangan resmi NASA (berbeda dari Atacama, Mauna Kea, atau Haughton). Namun secara eksploratif berdasarkan data Sentinel-2 SWIR, DEMNAS BIG, dan studi petrologi lokal, lautan pasir basaltik-andesitiknya menawarkan akses riset regional untuk uji mobilitas rover dan morfometri kaldera.',
    missionApplications: [
      'Uji coba prototipe rover kampus/riset regional pada pasir tephra gembur (slippage test)',
      'Validasi algoritma Terrain Relative Navigation (TRN) di medan dinding kaldera curam',
      'Evaluasi awal pelapis segel mekanis terhadap debu vulkanik tropis',
    ],
    hazardsAndConstraints: [
      'Iklim tropis lembap & curah hujan musiman memengaruhi kohesi pasir (berbeda dari vakum kering Bulan dan hiper-arid Mars)',
      'Emisi gas SO₂ dan aktivitas vulkanik memerlukan pemantauan PVMBG real-time',
    ],
    comparativeMetrics: [
      {
        parameter: 'Komposisi Mineralogi (Eksploratif)',
        earthValue: 'Basalt-Andesit (52–56% SiO₂, Plagioklas, Piroksen)',
        planetaryBenchmark: 'Mare Basalt & Basaltik Mars (48–52% SiO₂)',
        matchNote: 'Kesesuaian litologi parsial; kandungan silika sedikit lebih tinggi (andesitik) dibanding mare basalt murni',
      },
      {
        parameter: 'Gradien Lereng Kawah',
        earthValue: '18° – 34° (Dinding Kaldera & Kerucut Bromo)',
        planetaryBenchmark: '20° – 35° (Kawah Sekunder Lunar & Mars)',
        matchNote: 'Morfometri komparatif diukur via DEMNAS/SRTM vs LRO LOLA',
      },
    ],
    dataSourceIds: ['nasa-srtm', 'esa-sentinel2', 'nasa-lro-lola', 'nasa-mro-crism', 'pvmbg-demnas'],
    scientificReferences: [
      {
        citation: 'Hilyah et al. (2026), Annals of Geophysics — Gravity & Structural Boundary Mapping of the Tengger Caldera',
        url: 'https://doi.org/10.4401/ag-9559',
      },
      {
        citation: 'Warnana et al. (2025), IJDNE — Whole-Rock Geochemistry & Volcanic Suites of Bromo-Tengger Complex',
        url: 'https://doi.org/10.18280/ijdne.200814',
      },
    ],
    accentColor: '#8b5cf6',
  },
];

export const ANALOG_SITES: AnalogSite[] = RAW_ANALOG_SITES.map((raw) => {
  const scores = computeSiteFidelityScores(raw);
  return {
    ...raw,
    moonSimilarityScore: scores.moonSimilarityScore,
    marsSimilarityScore: scores.marsSimilarityScore,
    similarityScore: scores.similarityScore,
    scoreBreakdown: scores.breakdownNote,
    scoreComponents: scores.scoreComponents,
  };
}).sort((a, b) => b.similarityScore - a.similarityScore);

