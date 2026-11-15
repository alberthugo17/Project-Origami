import { ScoreComponentBreakdown, SiteFidelityInputs, computeSiteFidelityScores } from '../utils/siteScorer';

export type TargetBody = 'Moon' | 'Mars' | 'Moon & Mars';
export type TerrainBiome = 'Volcanic' | 'Desert' | 'Polar' | 'Impact Crater' | 'Cave / Lava Tube' | 'Hydrothermal';
export type ValidationStatus = 'Official NASA/ESA' | 'Peer-Reviewed Journal' | 'Local Exploratory';

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
  roughness: 'Low (Smooth)' | 'Moderate (Rocky)' | 'High (Steep & Rough)';
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
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 5.0,
      lunarTerrainScore: 2.0,
      marsTerrainScore: 4.5,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 4,
    },
    isTopFinding: true,
    temperatureProfile: {
      avgC: 17,
      minC: -2,
      maxC: 36,
      note: 'Sharp diurnal temperature swing between freezing nights below zero (-2°C) and scorching days (36°C).',
    },
    terrainProfile: {
      surfaceType: 'Salt Evaporite Crust, Nitrates & Perchlorate Gravel Desert',
      slopeRange: '2° – 12° (alluvial plain)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 7.4,
      description:
        'Hard gypsum-halite crusted surface covering a fine hyper-arid soil layer rich in perchlorate and exposed to very high UV radiation.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – November (Autumn to Early Dry Summer)',
      climateCondition: 'Rainfall near zero (<2 mm/year), stable daytime temperatures of 20–28°C, clear visibility for rover campaigns.',
      recommendedTests: [
        'Calibration of autonomous subsurface drills (1–2 m) and biosignature detection spectrometers (Raman/LIBS/GC-MS)',
        'Durability testing of Fluorosilicone (FVMQ) seals, Sapphire optical windows, and Orthofabric textiles against UV exposure & perchlorate soil',
      ],
      avoidWindow: 'January – March (Local wind impacts & peak Altiplano rainy season in the surrounding eastern mountains).',
    },
    summary:
      'NASA/ESA gold standard as the driest non-polar desert on Earth, with soil rich in perchlorate, nitrate, and extreme UV radiation flux for Mars life-detection tests.',
    geologicalRationale:
      'Rainfall of <2 mm/year and surface concentrations of perchlorate and sulfate salts leave Yungay soil almost biologically sterile, mimicking the Martian surface soil chemistry measured by the Phoenix lander and Curiosity rover.',
    missionApplications: [
      'Calibration of Raman, LIBS, and GC-MS spectroscopy instruments for detecting Martian organic biosignatures',
      'Testing of autonomous subsurface drills (1–2 m depth) for the ExoMars/Rosalind Franklin & Mars Life Explorer missions',
      'Simulation of long-range autonomous rover operations with Earth–Mars communication latency',
    ],
    hazardsAndConstraints: [
      'Fine dust wind storms during the day and sharp diurnal temperature fluctuations',
      'The oxidative nature of perchlorate and nitrate salts accelerates degradation of certain polymers',
    ],
    comparativeMetrics: [
      {
        parameter: 'Hyper-Aridity Index',
        earthValue: '< 2 mm/year (Yungay Core)',
        planetaryBenchmark: '0 mm/year (Hesperian-Amazonian Mars)',
        matchNote: 'Best preservation conditions for salt minerals and organics on Earth (Science, 2003)',
      },
      {
        parameter: 'Surface Salt Chemistry',
        earthValue: 'Perchlorate, Nitrate, Gypsum, Halite',
        planetaryBenchmark: 'Perchlorate (0.5–1 wt%), Mg/Ca Sulfate',
        matchNote: 'Direct chemical analog for Phoenix & Gale Crater soil samples',
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
    country: 'United States',
    lat: 43.4167,
    lon: -113.5167,
    elevationM: 1800,
    targetBody: 'Moon',
    planetaryCounterpart: 'Mare Imbrium, Rima Hadley & Marius Hills',
    biome: 'Volcanic',
    validationStatus: 'Official NASA/ESA',
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
      note: 'Snowy winters down to -18°C, dry and sunny summers up to 31°C.',
    },
    terrainProfile: {
      surfaceType: 'Basaltic Pahoehoe & Sharp Aa Lava Flows, Cinder Cones',
      slopeRange: '6° – 28° (cinder cones & rilles)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 6.7,
      description:
        'Sharply pitted volcanic glass surface (aa lava) and basalt pressure ridges that test EVA boot sole wear and rover tires.',
    },
    seasonalRecommendation: {
      bestWindow: 'June – September (Dry Summer of the Idaho Highlands)',
      climateCondition: 'Snow-free, perfectly dry basalt lava flow surfaces, long daylight hours for FINESSE campaign tests.',
      recommendedTests: [
        'Durability testing of Nitinol superelastic tires (NASA Glenn) & Ti-6Al-4V chassis on highly abrasive aa lava cuts',
        'Artemis astronaut field geology training & LiDAR/GPR mapping of lava tube skylights',
      ],
      avoidWindow: 'December – March (Snow cover hides pahoehoe/aa lava features and national park access is closed).',
    },
    summary:
      'Primary NASA SSERVI FINESSE analog site and Apollo 14 training ground with young basaltic lava plains (pahoehoe & aa), cinder cones, and intact lava tubes.',
    geologicalRationale:
      'The Snake River Plain lava flows have a FeO-rich basalt composition with vesicular structures, pressure fractures, and lava tube tunnels that replicate the volcanic features of Mare Imbrium and lunar rilles.',
    missionApplications: [
      'Artemis astronaut field geology training for identifying and sampling Mare basaltic rocks',
      'Legged/wheeled robotic exploration entering skylights and lava tubes (NASA FINESSE project)',
      'Subsurface structure mapping using Ground Penetrating Radar (GPR)',
    ],
    hazardsAndConstraints: [
      'Aa lava surfaces are extremely sharp and abrasive to spacesuit outer fabric and conventional tires',
    ],
    comparativeMetrics: [
      {
        parameter: 'Lava Flow Morphology',
        earthValue: 'Pahoehoe & Aa Basalt, Collapse Rilles',
        planetaryBenchmark: 'Sinuous Rilles (Rima Hadley) & Mare Flows',
        matchNote: 'Flow feature match identified in LROC NAC imagery & NASA FINESSE campaigns',
      },
      {
        parameter: 'Lava Tube Dimensions',
        earthValue: 'Width 10–30 m, Basalt Roof 3–12 m',
        planetaryBenchmark: 'Marius Hills Skylight (Width >50 m, 1/6 g Gravity)',
        matchNote: 'Skylight entry geometry model for tethered rovers',
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
    country: 'Canada',
    lat: 75.3833,
    lon: -89.6833,
    elevationM: 215,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Shackleton Crater Rim & Noachian Impact Basins',
    biome: 'Impact Crater',
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 3.5,
      marsGeologyScore: 4.2,
      lunarTerrainScore: 4.5,
      marsTerrainScore: 4.5,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 4,
    },
    temperatureProfile: {
      avgC: -16,
      minC: -42,
      maxC: 8,
      note: 'Average Arctic temperature of -16°C; July summers reach +8°C and winters drop to -42°C.',
    },
    terrainProfile: {
      surfaceType: 'Carbonate Impact Breccia, Rocky Ejecta & Permafrost Polygons',
      slopeRange: '5° – 26° (crater terrace walls)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 7.8,
      description:
        'Sharp-angled dolomite rocky terrain with polygonal ice-permafrost soil, testing rover durability, ice drills, and EVA boot soles.',
    },
    seasonalRecommendation: {
      bestWindow: 'July – August (Bright 24-Hour Arctic Summer)',
      climateCondition: 'Temperatures range from 0°C to +8°C, the permafrost active layer can be drilled, Twin Otter flight access is open.',
      recommendedTests: [
        'Operational testing of crewed Pressurized Rovers, EVA suits (Orthofabric & Aerogel), and delayed Moon/Mars communications',
        'Ground Penetrating Radar (GPR) and permafrost drilling tests on impact breccia',
      ],
      avoidWindow: 'October – May (Total polar darkness, extreme temperatures of -42°C, and Arctic blizzards).',
    },
    summary:
      'Official NASA Haughton-Mars Project (HMP) site: a 23 km diameter impact crater in the Arctic polar desert with intact impact breccia and polygonal permafrost.',
    geologicalRationale:
      'Formed ~23–39 million years ago in carbonate rock above crystalline bedrock, Haughton preserves its ejecta blanket and post-impact sulfate minerals in a polar desert with little vegetation. Its topography is mapped with ArcticDEM (since SRTM stops at 60°N).',
    missionApplications: [
      'Pressurized EVA operations and crewed rover vehicles (Pressurized Rover)',
      'Mapping of impact breccia stratigraphy and subsurface ice using GPR',
      'Testing of isolation protocols and tele-operation with delayed communications for space missions',
    ],
    hazardsAndConstraints: [
      'The summer logistics access window in the Arctic is very short (July–August)',
      'Sharp breccia blocks and sub-zero night temperatures demand cold & abrasion protection',
    ],
    comparativeMetrics: [
      {
        parameter: 'Impact Structure',
        earthValue: 'Diameter 23 km, Carbonate-Crystalline Polymict Breccia',
        planetaryBenchmark: 'Early Mars Complex Craters & Lunar Secondary Basins',
        matchNote: 'Central peak and wall terrace morphology are well preserved (ArcticDEM & LOLA)',
      },
      {
        parameter: 'Permafrost Soil Patterns',
        earthValue: 'Polygonal Ice-Soil Network (10–25 m)',
        planetaryBenchmark: 'Ice Sublimation Polygons at the Phoenix Landing Site',
        matchNote: 'Thermal fracture geometry match based on HiRISE',
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
    country: 'United States',
    lat: 35.0275,
    lon: -111.0225,
    elevationM: 1710,
    targetBody: 'Moon',
    planetaryCounterpart: 'Lunar Simple Bowl Craters (Linné Crater)',
    biome: 'Impact Crater',
    validationStatus: 'Official NASA/ESA',
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
      note: 'Colorado Plateau highlands; summer days 30–33°C, winter nights -8°C.',
    },
    terrainProfile: {
      surfaceType: 'Rocky Talus Crater Wall of Sandstone-Dolomite & Breccia',
      slopeRange: '20° – 38° (inner bowl crater slopes)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 7.7,
      description:
        'Steep loose-rock (talus) slopes on the crater walls with a floor of fine silicate dust that tests slope rover tethering.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – June & September – November (Arizona Spring & Autumn)',
      climateCondition: 'Daytime temperatures of 18–26°C, relatively calm valley winds before monsoon storms or peak heat.',
      recommendedTests: [
        'Artemis astronaut crater wall traverse training & tether/winch tests for steep-slope rovers >25°',
        'Wear tests of EVA sole materials (Orthofabric) and Ti-6Al-4V frames against coarse sandstone-dolomite',
      ],
      avoidWindow: 'July – August (Afternoon monsoon thunderstorms & temperatures >33°C) and December – January (Light snow on the rim).',
    },
    summary:
      'The best-preserved simple impact crater on Earth, 1.2 km in diameter, a geology training site for Apollo astronauts (Eugene Shoemaker) through Artemis.',
    geologicalRationale:
      'Preserves an overturned ejecta flap, steep rocky walls, and a bowl-shaped crater floor with a depth-to-diameter ratio (~0.15) that is the classic reference for simple lunar craters.',
    missionApplications: [
      'Surface geology traverse training and field documentation for Artemis astronauts',
      'Testing of tethering and sample transport systems on steep crater slopes',
    ],
    hazardsAndConstraints: [
      'Talus slopes inside the crater are prone to loose-rock avalanches when traversed',
    ],
    comparativeMetrics: [
      {
        parameter: 'Depth / Diameter Ratio',
        earthValue: 'd/D ≈ 0.15 (Depth 170 m, Diameter 1,186 m)',
        planetaryBenchmark: 'd/D ≈ 0.18 – 0.21 (Lunar Simple Craters <15 km)',
        matchNote: 'Elevation profile matches directly with LRO LOLA',
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
    country: 'Antarctica',
    lat: -77.4667,
    lon: 162.5167,
    elevationM: 1100,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Lunar South Pole (Shackleton) & Mars Northern Plains',
    biome: 'Polar',
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 4.0,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 4.5,
      marsTerrainScore: 4.5,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 4,
    },
    temperatureProfile: {
      avgC: -20,
      minC: -55,
      maxC: 2,
      note: 'Annual average -20°C; winters drop to -55°C (MODIS & LTER station detections).',
    },
    terrainProfile: {
      surfaceType: 'Dry Frozen Regolith Over Cemented Permafrost Ice Layer',
      slopeRange: '3° – 22° (snow-free glacial valleys)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 7.5,
      description:
        'Very dry sandy soil and granite-basalt gravel that freezes as hard as concrete a few centimeters below the surface.',
    },
    seasonalRecommendation: {
      bestWindow: 'November – January (Antarctic Austral Summer)',
      climateCondition: 'Low-angle 24-hour polar sunlight (~10°–35°), field operating temperatures of -15°C to 0°C.',
      recommendedTests: [
        'Testing of cryogenic subsurface ice drills (like VIPER/Artemis mission class) and cold-resistant solid lubricants',
        'Validation of Silica Aerogel & Aluminized Kapton MLI insulators on sub-zero batteries and low-angle solar panels',
      ],
      avoidWindow: 'April – September (Perpetual polar night, temperatures down to -55°C, katabatic winds >100 km/h, aircraft access halted).',
    },
    summary:
      'The coldest and driest ice-free valleys in Antarctica, with cemented ice beneath dry regolith, serving as the primary analog for the Moon\'s South Pole ice reserves and Mars polar plains.',
    geologicalRationale:
      'Dry katabatic winds keep the surface snow-free while the ice permafrost layer is preserved a few centimeters beneath the basaltic-granitic regolith, replicating the thermal and mechanical profile of ice drilling for Artemis and Mars Polar missions.',
    missionApplications: [
      'Testing of cryogenic ice-prospecting drills and neutron/mass spectrometers',
      'Validation of low-angle solar power systems and sub-zero battery thermal management (-40°C to -55°C)',
      'Studies of the cryptoendolithic astrobiology limit in cold dry sandstone',
    ],
    hazardsAndConstraints: [
      'High-speed katabatic winds and strict biological contamination restrictions (Antarctic Treaty)',
      'Temperatures <-50°C make ordinary elastomers brittle, requiring Aerogel/MLI and metal spring seals',
    ],
    comparativeMetrics: [
      {
        parameter: 'Subsurface Ice Depth',
        earthValue: '10 – 45 cm below dry regolith',
        planetaryBenchmark: '5 – 50 cm (Lunar South Pole PSR & Phoenix Mars)',
        matchNote: 'Compressive strength of ice-cemented regolith 15–40 MPa',
      },
      {
        parameter: 'Average Annual Temperature',
        earthValue: '-20°C to -55°C',
        planetaryBenchmark: '-60°C to -170°C (Polar Crater Rim Zone)',
        matchNote: 'Brittleness tests of cryogenic insulators and solid lubricants',
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
    country: 'United States',
    lat: 36.5054,
    lon: -117.0794,
    elevationM: -85,
    targetBody: 'Mars',
    planetaryCounterpart: 'Vastitas Borealis & Gale Crater Alluvial Fans',
    biome: 'Desert',
    validationStatus: 'Official NASA/ESA',
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
      note: 'Summer ground surface temperatures exceed >50°C with a warm annual average of 25°C.',
    },
    terrainProfile: {
      surfaceType: 'Sharp Gravel Alluvial Fans, Basaltic Tuff & Salt Crust',
      slopeRange: '4° – 30° (Ubehebe maar walls)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 7.9,
      description:
        'A combination of sharp-angled volcanic boulders on Mars Hill, the hard salt crust of Badwater, and the ash slopes of the Ubehebe maar.',
    },
    seasonalRecommendation: {
      bestWindow: 'November – March (Winter – Early Spring in the Mojave Desert)',
      climateCondition: 'Comfortable daytime temperatures of 18–26°C, steady dry winds, safe for JPL engineering teams running daily rover tests.',
      recommendedTests: [
        'Landing system tests with LiDAR (Landing Vision System) & durability of Nitinol / Ti-6Al-4V wheels on sharp Mars Hill boulders',
        'June–August only: Extreme tests of Aluminum 7075-T6 radiator heat rejection & batteries >48°C autonomously without outdoor crew',
      ],
      avoidWindow: 'June – August for EVA field crew tests (Extreme heatstroke risk >50°C).',
    },
    summary:
      'Alluvial fans, evaporite salt flats, and the Ubehebe hydrovolcanic maar crater used by NASA JPL to test Mars landers and rover mobility.',
    geologicalRationale:
      'Ubehebe Crater presents layered basaltic tuff and debris lobes on the crater walls, while Badwater Basin and Mars Hill have polygonal salt ridges and steep boulder fields for autonomous obstacle avoidance tests.',
    missionApplications: [
      'Tests of autonomous LiDAR and optical landing systems (Landing Vision System)',
      'Sharp rock traverse tests for rover wheel degradation',
      'Studies of dry alluvial fans as analogs of ancient Martian river deltas',
    ],
    hazardsAndConstraints: [
      'Summer surface temperatures >50°C test thermal management of rover batteries and avionics',
    ],
    comparativeMetrics: [
      {
        parameter: 'Surface Thermal Inertia',
        earthValue: '240 – 480 TIU (Alluvial Fans & Rock)',
        planetaryBenchmark: '220 – 450 TIU (Mars Odyssey THEMIS Landing Ellipses)',
        matchNote: 'Boulder size distribution measured via HiRISE boulder count',
      },
      {
        parameter: 'Maar Crater Morphology',
        earthValue: 'Diameter 800 m, Depth 235 m',
        planetaryBenchmark: 'Local Pitting & Hydrovolcanic Craters on Mars',
        matchNote: 'Surge base tephra stratigraphy is clearly exposed (Geomorphology, 2015)',
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
    country: 'United States',
    lat: 19.528,
    lon: -155.025,
    elevationM: 650,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Marius Hills Skylight & Arsia Mons Pit Craters',
    biome: 'Cave / Lava Tube',
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 4.5,
      marsGeologyScore: 4.0,
      lunarTerrainScore: 5.0,
      marsTerrainScore: 4.5,
      aridity: 'Humid / Wet',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 3,
    },
    temperatureProfile: {
      avgC: 19,
      minC: 16,
      maxC: 22,
      note: 'The internal temperature of the lava tube cave is stable year-round (16°C–22°C, daily variation <2°C).',
    },
    terrainProfile: {
      surfaceType: 'Dark Basalt Tunnels, Glassy Lava Walls & Collapse Floors',
      slopeRange: '1° – 18° (tunnel floor) · 85° (skylight walls)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 6.8,
      description:
        'Basalt tunnel cavities without sunlight or GPS signal, with sharp rock edges and local humidity.',
    },
    seasonalRecommendation: {
      bestWindow: 'May – September (Drier Season on the Eastern/Puna Side of Hawaii)',
      climateCondition: 'Lower trade-wind rainfall reduces water seepage from the basalt roof; cave temperature constant at ~19°C.',
      recommendedTests: [
        'Testing of inflatable habitat modules (Vectran & Kevlar woven inflatable habitat) inside basalt cavities',
        'Autonomous LiDAR SLAM mapping and RF/magnetic communication relay tests from the skylight into the cave',
      ],
      avoidWindow: 'November – March (Peak rainy season on the eastern side of Hawaii causes high pooling and dripping water in low cave segments).',
    },
    summary:
      'The longest basaltic lava tube cave network on Earth (>65 km) for underground habitat architecture shielded from cosmic radiation and micrometeorites.',
    geologicalRationale:
      'Formed by pahoehoe lava flows that drained beneath a solidified crust, Kazumura provides real tunnel geometry with collapse skylights and a thick basalt roof as a direct analog of Marius Hills on the Moon and Arsia Mons on Mars.',
    missionApplications: [
      'Autonomous LiDAR SLAM mapping inside dark tunnels without GPS signal',
      'Design of RF/optical communication relay networks and magnetic anomaly surveys from the surface into the cave',
      'Testing of Vectran/Kevlar inflatable habitat modules inside basalt rock cavities',
    ],
    hazardsAndConstraints: [
      'Local ceiling rockfalls and high tropical cave humidity',
    ],
    comparativeMetrics: [
      {
        parameter: 'Cave Thermal Stability',
        earthValue: 'Variation < 2°C year-round',
        planetaryBenchmark: 'Lunar Lava Tube ~ -20°C to +17°C constant (vs ±150°C outside)',
        matchNote: 'Galactic cosmic radiation shielding with a basalt roof >5 m (Earth-Science Reviews, 2020)',
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
    country: 'Spain',
    lat: 37.7056,
    lon: -6.5514,
    elevationM: 310,
    targetBody: 'Mars',
    planetaryCounterpart: 'Meridiani Planum & Mawrth Vallis',
    biome: 'Hydrothermal',
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 5.0,
      lunarTerrainScore: 1.5,
      marsTerrainScore: 3.5,
      aridity: 'Humid / Wet',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 3.5,
    },
    temperatureProfile: {
      avgC: 18,
      minC: 4,
      maxC: 37,
      note: 'Warm Mediterranean climate; Andalusian summers can exceed 37°C and winters are mild at 4–12°C.',
    },
    terrainProfile: {
      surfaceType: 'Hyper-Acidic Riverbank Deposits, Hematite Terraces & Jarosite Crust',
      slopeRange: '2° – 16° (river terraces & ancient mines)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 1.8,
      description:
        'Wet iron-sulfate sediments to dry acidic salt crusts that are highly corrosive to conventional metals without an anti-acid coating.',
    },
    seasonalRecommendation: {
      bestWindow: 'April – June & September – October (Dry Spring & Autumn)',
      climateCondition: 'Moderate temperatures of 18–26°C, sulfate crust deposits clearly exposed without dilution from winter river floods.',
      recommendedTests: [
        'Corrosion resistance testing of Hastelloy C-276 probes, SiC ceramics & FVMQ seals on sediments of pH 1.5–2.5',
        'Calibration of jarosite & hematite detection instruments (Mössbauer/Raman/XRD) for the Meridiani Planum analog',
      ],
      avoidWindow: 'July – August (Heat waves >38°C) & November – January (Seasonal rain dilutes the salt crust).',
    },
    summary:
      'NASA/ESA astrobiology laboratory in a hyper-acidic river system rich in iron and sulfate (jarosite, hematite) for Hesperian Mars mineralogy.',
    geologicalRationale:
      'Oxidation of subsurface pyrite by chemolithotrophic bacteria produces pH 1.5–2.5 solutions that precipitate jarosite, goethite, and hematite—the key minerals found by the Opportunity rover at Meridiani Planum.',
    missionApplications: [
      'Calibration of Mössbauer, Raman, and X-ray diffraction (CheMin) instruments for iron-sulfate minerals',
      'Corrosion resistance testing of rover sensors and components on dry acidic deposits (MARTE project)',
    ],
    hazardsAndConstraints: [
      'The corrosive acidic environment damages uncoated aluminum and requires Hastelloy/SiC ceramics on probe tips',
    ],
    comparativeMetrics: [
      {
        parameter: 'Diagnostic Minerals',
        earthValue: 'Jarosite, Hematite, Goethite, Copiapite',
        planetaryBenchmark: 'Jarosite & Hematite Spherules (Meridiani Planum)',
        matchNote: 'CRISM & OMEGA spectra show identical Fe³⁺ absorption bands',
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
    country: 'Norway',
    lat: 79.4333,
    lon: 13.4333,
    elevationM: 480,
    targetBody: 'Mars',
    planetaryCounterpart: 'Jezero Crater Carbonate Margin & Nili Fossae',
    biome: 'Polar',
    validationStatus: 'Official NASA/ESA',
    fidelityInputs: {
      lunarGeologyScore: 2.0,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 3.0,
      marsTerrainScore: 4.0,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: true,
      missionHeritageBonus: 3.5,
    },
    temperatureProfile: {
      avgC: -5,
      minC: -28,
      maxC: 7,
      note: 'High Arctic polar environment; winter temperatures of -28°C and short summers of around +3°C to +7°C.',
    },
    terrainProfile: {
      surfaceType: 'Permafrost Basalt Rock with Carbonate Spring Deposits',
      slopeRange: '8° – 28° (Arctic volcanic cone slopes)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 7.6,
      description:
        'Hard frozen basalt slopes containing micrometer-scale carbonate globules, requiring high-torque drills and cold insulation.',
    },
    seasonalRecommendation: {
      bestWindow: 'July – August (Svalbard AMASE Expedition Window)',
      climateCondition: 'Fjords open from sea ice so research vessels can dock, full Arctic daylight, temperatures of +2°C to +7°C.',
      recommendedTests: [
        'Tests of hard basalt permafrost drills (Ti-6Al-4V/SiC) & carbonate biomarker detectors for Mars rovers (ExoMars/Perseverance)',
        'Evaluation of cold coating brittleness and Aerogel/Orthofabric insulation in the humid-freezing Arctic environment',
      ],
      avoidWindow: 'November – April (Full dark polar night and freezing of fjord sea access).',
    },
    summary:
      'Primary NASA/ESA AMASE expedition site: a polar volcanic complex with unique carbonate globules in basalt identical to the Mars meteorite ALH84001.',
    geologicalRationale:
      'Warm spring activity in the Arctic permafrost deposits zoned Mg-Fe carbonate globules inside basalt pores, making it a primary analog for the carbonate margin of Jezero Crater. Elevation data uses ArcticDEM (>79°N).',
    missionApplications: [
      'Tests of carbonate and lipid/Raman biomarker detection for Perseverance & ExoMars instruments',
      'Performance evaluation of drilling into rocky basalt permafrost',
    ],
    hazardsAndConstraints: [
      'Dynamic Arctic weather and strict safety/environmental protocols in the Svalbard protected area',
    ],
    comparativeMetrics: [
      {
        parameter: 'Carbonate Host Minerals',
        earthValue: 'Mg-Fe-Ca Carbonate Globules in Basalt',
        planetaryBenchmark: 'ALH84001 Meteorite Carbonates & Jezero Crater Margin',
        matchNote: 'Micro-texture and chemical zonation are nearly identical (EPSL 2002, MAPS 2007)',
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
    country: 'United States',
    lat: 19.8207,
    lon: -155.4681,
    elevationM: 4100,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Lunar Mare/Highlands ISRU & Bright Martian Dust (JSC Mars-1)',
    biome: 'Volcanic',
    validationStatus: 'Official NASA/ESA',
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
      note: 'The 4,100 m elevation keeps the average at 4°C with night frosts (-6°C) and high solar UV radiation.',
    },
    terrainProfile: {
      surfaceType: 'Tall Basaltic Cinder Cones & Palagonitic Tephra (Puʻu Nēnē)',
      slopeRange: '12° – 32° (volcanic cone slopes)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 6.5,
      description:
        'Fe-Ti-rich basaltic tephra at an elevation with thin air pressure (~60% of sea-level pressure) and palagonitic ash analogous to Martian dust.',
    },
    seasonalRecommendation: {
      bestWindow: 'May – October (Central Pacific Dry Season)',
      climateCondition: 'Constantly clear visibility above the cloud layer, low summit winds, dry tephra ash surfaces.',
      recommendedTests: [
        'Demonstrations of laser/microwave sintering & oxygen extraction from basaltic regolith (NASA/PISCES ISRU field tests)',
        'Operational tests of excavators & light rovers in CFRP-PEEK / Ti-6Al-4V at thin-atmosphere elevation and high UV radiation',
      ],
      avoidWindow: 'December – February (Peak snowstorms & freezing of access roads above 3,800 m).',
    },
    summary:
      'Lunar ISRU test site (NASA/PISCES) on 4,100 m basaltic slopes and also the official source of the NASA JSC Mars-1 Martian soil simulant from the Puʻu Nēnē cone.',
    geologicalRationale:
      'Important correction on NASA simulants: the Puʻu Nēnē cinder cone between Mauna Kea–Mauna Loa is the source of the palagonitic tephra for the JSC Mars-1 Mars simulant (while the JSC-1 lunar simulant comes from Merriam Crater, Arizona). Meanwhile, the basaltic zone at the Mauna Kea summit is used by NASA/PISCES for lunar landing ISRU tests.',
    missionApplications: [
      'Demonstrations of autonomous regolith mining and sintering of lunar landing pads (ISRU / PISCES)',
      'Spectral calibration of oxidized Martian dust using the JSC Mars-1 reference (Puʻu Nēnē)',
    ],
    hazardsAndConstraints: [
      'The 4,100 m elevation limits research team working duration without acclimatization, and there are protected Hawaiian cultural areas',
    ],
    comparativeMetrics: [
      {
        parameter: 'Official NASA Simulant Role',
        earthValue: 'Puʻu Nēnē Palagonitic Tephra (JSC Mars-1) & Mauna Kea Basalt',
        planetaryBenchmark: 'Bright Martian Dust (Mars) & Lunar Basalt ISRU (Moon)',
        matchNote: 'JSC Mars-1 (Allen et al., 1998); the JSC-1 lunar simulant comes from Arizona, not Hawaii',
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
    country: 'China',
    lat: 38.25,
    lon: 92.85,
    elevationM: 2800,
    targetBody: 'Mars',
    planetaryCounterpart: 'Aeolis Dorsa & Gale Crater Murray Formation',
    biome: 'Desert',
    validationStatus: 'Peer-Reviewed Journal',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 4.5,
      lunarTerrainScore: 2.5,
      marsTerrainScore: 4.5,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 2,
    },
    temperatureProfile: {
      avgC: 3,
      minC: -24,
      maxC: 27,
      note: 'Cold-dry highland; winters reach -24°C while summer daytime temperatures average 20–27°C.',
    },
    terrainProfile: {
      surfaceType: 'Salt Sediment Yardang Ridges & Sulfate Playa Plains',
      slopeRange: '2° – 25° (wind-aligned yardang cliffs)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 8.1,
      description:
        'Corridors of wind-sculpted sediment hills mixed with soft salt clay that is prone to trapping rover wheels.',
    },
    seasonalRecommendation: {
      bestWindow: 'July – October (Late Summer to Dry Autumn)',
      climateCondition: 'Spring sandstorms have subsided, comfortable daytime temperatures (15–25°C), clear satellite visibility.',
      recommendedTests: [
        'Autonomous rover navigation tests across yardang corridors & wheel-sinkage risk suppression sensors on salt playa',
        'Tests of high-rotor CFRP-PEEK aerial vehicles/drones in the thin air at 2,800 m elevation',
      ],
      avoidWindow: 'March – May (Peak Gobi–Qaidam dust storms) & December – February (Freezing temperatures down to -24°C).',
    },
    summary:
      'A cold highland desert basin containing thousands of wind-sculpted yardangs and magnesium-sulfate playas as the primary Mars analog in Asia.',
    geologicalRationale:
      'Prolonged aeolian erosion of salt-rich lacustrine sediments produces thousands of wind-aligned yardangs along with gypsum and kieserite deposits that parallel the Aeolis Dorsa landscape on Mars.',
    missionApplications: [
      'Studies reconstructing ancient wind directions and aeolian erosion rates in Martian lake sediments',
      'Rover navigation tests across yardang corridors and soft playa plains',
    ],
    hazardsAndConstraints: [
      'Seasonal spring dust storms and soft salt crust at the playa edge that traps wheels',
    ],
    comparativeMetrics: [
      {
        parameter: 'Yardang Density & Geometry',
        earthValue: 'Length 50–400 m, Aspect Ratio 4:1',
        planetaryBenchmark: 'Medusae Fossae & Aeolis Planum Yardangs',
        matchNote: 'Morphological texture analysis using SRTM vs HiRISE (Earth-Science Reviews, 2017)',
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
    region: 'Danakil Depression, Afar',
    country: 'Ethiopia',
    lat: 14.2417,
    lon: 40.3,
    elevationM: -125,
    targetBody: 'Mars',
    planetaryCounterpart: 'Columbia Hills (Gusev Crater) & Eridania Basin',
    biome: 'Hydrothermal',
    validationStatus: 'Peer-Reviewed Journal',
    fidelityInputs: {
      lunarGeologyScore: 1.0,
      marsGeologyScore: 4.2,
      lunarTerrainScore: 1.5,
      marsTerrainScore: 4.0,
      aridity: 'Hyper-Arid / Frozen',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 2,
    },
    temperatureProfile: {
      avgC: 34.6,
      minC: 24.6,
      maxC: 49,
      note: 'Hyper-arid hot desert climate (Köppen BWh) with an annual average temperature of 34.6°C (Met Office 1960–1966; 34.5°C per Pedgley 1967), average daily max of 41.2°C, average daily min of 28.2°C (monthly low of 24.6°C), record high of 49°C (48.9°C), and hydrothermal pools >90°C.',
    },
    terrainProfile: {
      surfaceType: 'Ancient Sea Salt Evaporite Plains, Brittle Halite Crust & Acidic Brine Pools',
      slopeRange: '0° – 10° (salt plains & hydrothermal mounds)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 0.6,
      description:
        'Salt evaporite plains formed by the evaporation of an ancient sea, with a brittle halite crust above boiling hot sulfuric/chloride acid brine solutions (pH ≤0–1.5).',
    },
    seasonalRecommendation: {
      bestWindow: 'November – February (Cool Season of the Afar Depression)',
      climateCondition: 'Air temperatures drop to the 25–37°C range (daily average ~30–32°C) with very rare rainy days, making team operations and avionics thermal management safer.',
      recommendedTests: [
        'Extreme durability tests of Hastelloy C-276 superalloy, SiC ceramics & FVMQ seals in hot acidic brine at pH < 1',
        'Calibration of SWIR sensors & abiotic-limit life detectors in a hyper-saline environment',
      ],
      avoidWindow: 'May – September (Extreme heat with daily max averages of 44–46.7°C and a record peak of 49°C endangers crews and demands strict battery thermal management).',
    },
    summary:
      'A hydrothermal evaporite salt plain with a hyper-arid climate (Köppen BWh) and hot hyper-saline acid pools for studying the physicochemical limits of life and ancient Martian hot springs.',
    geologicalRationale:
      'Located in the hyper-arid zone of the Danakil Depression (rainfall <200 mm/year; desert literature cites <25 mm/year) above ancient marine evaporite deposits. The combination of pH ≤0–1.5, salinity >30–40% (MgCl₂/FeSO₄), and pool temperatures up to ~110°C defines the polyextremophile limit of life, paralleling the Home Plate hydrothermal deposits in Gusev Crater.',
    missionApplications: [
      'Determining life-detection limits and abiotic false positives in Mars astrobiology instruments',
      'Studies of complex salt mineralogy and hydrothermal silica through SWIR remote sensing',
    ],
    hazardsAndConstraints: [
      'Extreme ambient heat (annual max average 41.2°C, record 49°C), brittle salt crust above boiling pools, and toxic gases',
    ],
    comparativeMetrics: [
      {
        parameter: 'Salinity & Acidity',
        earthValue: 'pH ≤ 0 – 1.5, Salinity >30–40% (Mg/Fe Brines)',
        planetaryBenchmark: 'Noachian-Hesperian Hydrothermal Brines',
        matchNote: 'Explains the coexistence of amorphous silica and iron sulfates (Belilla et al., 2019; López-García et al., 2020)',
      },
      {
        parameter: 'Hyper-Arid & Evaporite Climate',
        earthValue: 'Köppen BWh · Average 34.6°C (34.5°C Pedgley 1967) · Rain <200 mm/yr',
        planetaryBenchmark: 'Dry Evaporite Basins & Chloride/Sulfate Salts on Mars',
        matchNote: 'Rainfall figures vary between sources (<25 mm/yr in the text of Stoppato & Bini 2003 vs 84 mm/yr in the table or a regional limit of <200 mm/yr)',
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
    name: 'Ijen Crater Acidic Caldera',
    region: 'East Java',
    country: 'Indonesia',
    lat: -8.0583,
    lon: 114.2417,
    elevationM: 2386,
    targetBody: 'Mars',
    planetaryCounterpart: 'Eridania Basin & Noachian Acidic Crater Lakes',
    biome: 'Hydrothermal',
    validationStatus: 'Peer-Reviewed Journal',
    fidelityInputs: {
      lunarGeologyScore: 1.5,
      marsGeologyScore: 4.3,
      lunarTerrainScore: 2.0,
      marsTerrainScore: 3.5,
      aridity: 'Humid / Wet',
      hasActiveLiquidWaterOrRain: true,
      hasPermafrostIce: false,
      missionHeritageBonus: 1.5,
    },
    temperatureProfile: {
      avgC: 15,
      minC: 6,
      maxC: 24,
      note: 'Crater rim air temperatures are cool (average 15°C), but fumaroles & acidic lake edges reach 45–200°C.',
    },
    terrainProfile: {
      surfaceType: 'Silica-Alunite Altered Caldera Walls & Hyper-Acidic Lake Sediments',
      slopeRange: '22° – 42° (steep caldera walls)',
      roughness: 'High (Steep & Rough)',
      acidityPh: 0.4,
      description:
        'Slippery sulfate-altered rock with concentrated HCl/SO₂ vapor and the most acidic sulfuric acid lake in the world (pH < 0.5).',
    },
    seasonalRecommendation: {
      bestWindow: 'June – October (East Java Dry Season)',
      climateCondition: 'Minimal rainfall, a relatively stable southeast trade wind direction, and little rainwater runoff on the crater rim paths.',
      recommendedTests: [
        'Testing of concentrated acid corrosion protection materials (Hastelloy C-276, SiC Ceramics & PTFE Orthofabric) on crater rim probes/sensors',
        'Calibration of SWIR imagery for the mineralogy of alunite, jarosite, and opaline silica (Opal-A) as analogs of ancient Martian acid lakes',
      ],
      avoidWindow: 'December – March (Peak rainy season triggers erosion of steep caldera walls, thick fog, and shifts in toxic gas direction).',
    },
    summary:
      'The largest volcanic hyper-acidic crater lake in the world, widely recognized in international journals as an analog for acid-sulfate alteration on Mars.',
    geologicalRationale:
      'The interaction of magmatic gas with meteoric water at Ijen Crater creates intense acid-sulfate alteration (kaolinite, alunite, jarosite, Opal-A silica) in the basaltic-andesitic caldera walls—the primary geochemical model of ancient Martian acid lake basins.',
    missionApplications: [
      'Calibration of spectral detection of acid alteration minerals (alunite/jarosite/Opal-A) from orbital imagery',
      'Testing of sensors and materials resistant to pH <0.5 at the edge of a hyper-acidic lake',
    ],
    hazardsAndConstraints: [
      'Concentrated SO₂/HCl gas and lake pH <0.5 limit sampling to the rim zone with full gas masks',
    ],
    comparativeMetrics: [
      {
        parameter: 'Alteration Mineral Assemblage',
        earthValue: 'Opal-A Silica, Alunite, Jarosite, Native Sulfur',
        planetaryBenchmark: 'Columbia Hills / Cross Crater Silica & Sulfates',
        matchNote: 'Verified by the geochemical study of Delmelle & Bernard (1994) and SWIR imagery',
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
    name: 'Mount Bromo & Tengger Sand Sea',
    region: 'East Java',
    country: 'Indonesia',
    lat: -7.9425,
    lon: 112.953,
    elevationM: 2329,
    targetBody: 'Moon & Mars',
    planetaryCounterpart: 'Calderas & Basaltic Sand Fields (Lunar Mare / Bagnold Dunes Mars)',
    biome: 'Volcanic',
    validationStatus: 'Local Exploratory',
    fidelityInputs: {
      lunarGeologyScore: 3.3,
      marsGeologyScore: 3.5,
      lunarTerrainScore: 3.8,
      marsTerrainScore: 3.8,
      aridity: 'Humid / Wet',
      hasActiveLiquidWaterOrRain: false,
      hasPermafrostIce: false,
      missionHeritageBonus: 0.5,
    },
    temperatureProfile: {
      avgC: 14,
      minC: 3,
      maxC: 24,
      note: 'Average MODIS detection in the caldera of 14°C; dry-season night temperatures can drop to 3°C.',
    },
    terrainProfile: {
      surfaceType: 'Tephra Caldera & Basaltic-Andesitic Sand Sea',
      slopeRange: '18° – 34° (caldera walls) · 2° – 8° (sand sea)',
      roughness: 'Moderate (Rocky)',
      acidityPh: 6.2,
      description:
        'A loose volcanic sand sea on the caldera floor with basaltic-andesitic tephra grains (60–280 µm), but with tropical atmospheric humidity.',
    },
    seasonalRecommendation: {
      bestWindow: 'June – October (East Java Dry Season)',
      climateCondition: 'Minimal rainfall, clear skies, dry southeast winds, relative humidity lower than in the rainy season.',
      recommendedTests: [
        'Local exploratory tests of rover wheel traction (Nitinol/Ti-6Al-4V) and optical/LiDAR navigation on a basaltic-andesitic sand sea',
        'Durability testing of Fluorosilicone (FVMQ) dust seals & Orthofabric fabric against seasonal dry tephra ash abrasion',
      ],
      avoidWindow: 'December – March (Peak rainy season makes wet sand compact and thick fog hinders optical sensors).',
    },
    summary:
      'Indonesian exploratory analog candidate: a 10 km diameter volcanic caldera with a basaltic-andesitic sand sea for local field tests, although it is not yet an official NASA test site.',
    geologicalRationale:
      'The Tengger–Bromo caldera is not yet part of the official NASA field test catalog (unlike Atacama, Mauna Kea, or Haughton). However, exploratively, based on Sentinel-2 SWIR data, DEMNAS BIG, and local petrological studies, its basaltic-andesitic sand sea offers regional research access for rover mobility tests and caldera morphometry.',
    missionApplications: [
      'Trials of campus/regional research rover prototypes on loose tephra sand (slippage test)',
      'Validation of Terrain Relative Navigation (TRN) algorithms on steep caldera wall terrain',
      'Early evaluation of mechanical seal coatings against tropical volcanic dust',
    ],
    hazardsAndConstraints: [
      'Tropical humid climate & seasonal rainfall affect sand cohesion (unlike the dry vacuum of the Moon and the hyper-arid Mars)',
      'SO₂ gas emissions and volcanic activity require real-time PVMBG monitoring',
    ],
    comparativeMetrics: [
      {
        parameter: 'Mineralogical Composition (Exploratory)',
        earthValue: 'Basalt-Andesite (52–56% SiO₂, Plagioclase, Pyroxene)',
        planetaryBenchmark: 'Mare Basalt & Martian Basaltic (48–52% SiO₂)',
        matchNote: 'Partial lithological match; silica content is slightly higher (andesitic) than pure mare basalt',
      },
      {
        parameter: 'Crater Slope Gradient',
        earthValue: '18° – 34° (Caldera Walls & Bromo Cone)',
        planetaryBenchmark: '20° – 35° (Lunar & Martian Secondary Craters)',
        matchNote: 'Comparative morphometry measured via DEMNAS/SRTM vs LRO LOLA',
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

