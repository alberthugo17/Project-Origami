export type TargetBody = 'Moon' | 'Mars' | 'Moon & Mars';
export type TerrainBiome = 'Volcanic' | 'Desert' | 'Polar' | 'Impact Crater' | 'Cave / Lava Tube' | 'Hydrothermal';

export interface ComparativeMetric {
  parameter: string;
  earthValue: string;
  planetaryBenchmark: string;
  matchNote: string;
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
    accentColor: '#f59e0b',
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
    accentColor: '#38bdf8',
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
    accentColor: '#60a5fa',
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
    accentColor: '#38bdf8',
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
    accentColor: '#60a5fa',
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
    accentColor: '#a78bfa',
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
    accentColor: '#f59e0b',
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
    accentColor: '#38bdf8',
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
    accentColor: '#60a5fa',
  },
];
