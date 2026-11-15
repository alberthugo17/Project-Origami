export type DataBodyFilter = 'All' | 'Earth' | 'Moon' | 'Mars';

export interface DataSourceItem {
  id: string;
  agency: string;
  missionOrPlatform: string;
  instrument: string;
  targetBody: 'Earth' | 'Moon' | 'Mars';
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
    targetBody: 'Moon',
    resolution: '0.5 m – 2 m/px (LROC NAC) · 5 m – 60 m DEM (LOLA)',
    variablesExtracted: 'Absolute elevation, slope gradient, surface roughness, permanently shadowed regions (PSR)',
    roleInAnalysis:
      'Serves as the reference for simple crater and mare edge morphometry (Mare Tranquillitatis, Shackleton Rim, Linné Crater) to match the slope gradients of Barringer Crater, Haughton Crater, Craters of the Moon, and the Tengger Caldera.',
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
    variablesExtracted: 'Boulder density (boulder hazard), dune wavelength, polygonal permafrost fractures',
    roleInAnalysis:
      'Compares boulder size distribution and permafrost polygon patterns with Ubehebe/Death Valley, Atacama, McMurdo Dry Valleys, Qaidam Basin, and Haughton Impact Crater.',
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
    variablesExtracted: 'Mineral absorption bands (pyroxene, plagioclase, jarosite, alunite, hydrated silica, carbonate, perchlorate)',
    roleInAnalysis:
      'Matches the spectral fingerprints of acid alteration minerals at Río Tinto, Ijen Crater, and Dallol, and of Svalbard carbonates, against Jezero Crater, Meridiani Planum, and Gale.',
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
    variablesExtracted: 'Surface thermal inertia (TIU), silicate-basaltic rock composition, diurnal regolith temperature',
    roleInAnalysis:
      'Calibrates the effective grain size and thermal inertia of Death Valley sand/alluvial fans, Qaidam Basin, and volcanic tephra against Mars landing ellipses.',
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
    targetBody: 'Earth',
    resolution: '30 m (1 arc-second Global DEM)',
    variablesExtracted: 'Digital topography, slope, slope aspect, and Terrain Ruggedness Index (TRI)',
    roleInAnalysis:
      'Computes topographic roughness metrics and caldera/crater wall gradients for sites between 60°N–56°S (SRTM) up to sub-polar latitudes (ASTER GDEM). ArcticDEM is used for the Arctic >70°N.',
    datasetIdentifier: 'SRTMGL1 v003 / ASTGTM v003',
    accessUrl: 'https://asterweb.jpl.nasa.gov/gdem.asp',
    scientificReference: 'Farr et al. (2007), Reviews of Geophysics — The Shuttle Radar Topography Mission',
    referenceUrl: 'https://doi.org/10.1029/2005RG000183',
  },
  {
    id: 'pgc-arcticdem',
    agency: 'NSF / NGA / Polar Geospatial Center',
    missionOrPlatform: 'ArcticDEM (Arctic Digital Surface Model >60°N)',
    instrument: 'Maxar WorldView-1/2/3 & GeoEye-1 Optical Stereo',
    targetBody: 'Earth',
    resolution: '2 m/px (Strip & Mosaic DEM Arktik)',
    variablesExtracted: 'Detailed morphometry of Arctic impact craters, polygonal permafrost terraces, and Svalbard fjord slopes',
    roleInAnalysis:
      'Replaces SRTM (which stops at 60°N) for precision topographic modeling at the Haughton Impact Crater (75.38°N) and the Bockfjorden Complex, Svalbard (79.43°N).',
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
    targetBody: 'Earth',
    resolution: '500 m – 1 km (Multi-year Climatology)',
    variablesExtracted: 'Broadband surface albedo, land surface temperature (LST), aridity index and NDVI vegetation cover',
    roleInAnalysis:
      'Verifies dry, vegetation-free zones (low NDVI) in the Atacama, McMurdo Dry Valleys, and Bockfjorden Svalbard, as well as surface temperature profiles.',
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
    targetBody: 'Earth',
    resolution: '10 m – 20 m/px',
    variablesExtracted: 'SWIR reflectance (Bands 11 & 12), iron oxide ratio (B4/B2), clay and sulfate mineral indices',
    roleInAnalysis:
      'Maps the mineralogical boundaries of basaltic-andesitic tephra at Mount Bromo and the acid-sulfate alteration zones at Ijen Crater, Dallol, and Río Tinto.',
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
    variablesExtracted: 'Regional Mars elevation model, hydrated mineralogy (phyllosilicates, sulfates & carbonates)',
    roleInAnalysis:
      'Provides the geological context of the Eridania basin, Meridiani Planum, and Nili Fossae in the analysis of the Río Tinto, Dallol, and Svalbard hydrothermal analogs.',
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
    targetBody: 'Moon',
    resolution: 'Laboratory Samples & 1:500,000 Geological Maps',
    variablesExtracted: 'Major geochemical composition (SiO₂, FeO, TiO₂, Al₂O₃), particle size distribution, internal friction angle',
    roleInAnalysis:
      'Official NASA/USGS simulant reference: JSC-1/1A from Merriam Crater (Arizona) for lunar mare regolith and JSC Mars-1 from Puʻu Nēnē, Mauna Kea (Hawaii) for Martian palagonitic dust.',
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
    targetBody: 'Moon',
    resolution: '10 m/px (TC Stereo) · 20 m/px (MI)',
    variablesExtracted: 'Global lunar FeO and TiO₂ abundance maps, skylight profiles and subsurface lava tube cavities',
    roleInAnalysis:
      'Serves as a direct comparison of Marius Hills skylight hole dimensions against the Kazumura/Kīlauea lava tube and basaltic mare crater morphology.',
    datasetIdentifier: 'SELENE-L-MI-5-MAP-V1.0',
    accessUrl: 'https://darts.isas.jaxa.jp/planet/pdap/selene/',
    scientificReference: 'Kaku et al. (2017), Geophysical Research Letters — Detection of Intact Lava Tubes at Marius Hills by Kaguya LRS',
    referenceUrl: 'https://doi.org/10.1002/2017GL074998',
  },
  {
    id: 'pvmbg-demnas',
    agency: 'Badan Geologi (PVMBG) & BIG Indonesia',
    missionOrPlatform: 'National DEMNAS & Indonesian Volcano Monitoring',
    instrument: 'National IFSAR / Stereo DEM (0.27 arc-sec) & Field Petrography',
    targetBody: 'Earth',
    resolution: '8.25 m (0.27 arc-second DEMNAS)',
    variablesExtracted: 'Detailed elevation of the Tengger–Bromo Caldera & Ijen Crater, tephra lithology, acid lake chemistry & SO₂ hazard zones',
    roleInAnalysis:
      'Supports high-resolution topographic modeling at Ijen Crater (a journal-validated Mars acid lake analog) and exploratory characterization of the Tengger–Bromo Caldera. DEMNAS can be downloaded for free via Ina-Geoportal BIG (Download Data > DEMNAS menu; an account is required).',
    datasetIdentifier: 'DEMNAS BIG (0.27 arc-sec) & PVMBG Volcano Geological Map',
    accessUrl: 'https://tanahair.indonesia.go.id/portal-web/',
    scientificReference: 'Delmelle & Bernard (1994), Geochim. Cosmochim. Acta 58 (Ijen) & Hilyah et al. (2026), Annals of Geophysics (Tengger Caldera)',
    referenceUrl: 'https://doi.org/10.1016/0016-7037(94)90023-X',
  },
  {
    id: 'leaflet-openstreetmap-esri',
    agency: 'Esri & OpenStreetMap Contributors',
    missionOrPlatform: 'World Imagery & World Boundaries Reference',
    instrument: 'High-Resolution Orbital & Aerial Mosaic via Leaflet',
    targetBody: 'Earth',
    resolution: 'Sub-meter to 15 m (Global Mosaic)',
    variablesExtracted: 'Calibrated global satellite imagery, country borders, city names, and Earth surface topography',
    roleInAnalysis:
      'Provides an interactive high-resolution satellite base map and administrative region context for placing analog pins and navigating locations.',
    datasetIdentifier: 'ESRI-WORLD-IMAGERY / BOUNDARIES',
    accessUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    scientificReference: 'Esri World Imagery Basemap Metadata & Earthstar Geographics Catalog',
    referenceUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
  },
];
