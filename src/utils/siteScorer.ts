import type {
  TerrainBiome,
  TemperatureProfile,
  TerrainProfile,
  ValidationStatus,
} from '../data/analogSites';

export type AridityClass = 'Hyper-Arid / Frozen' | 'Arid / Semi-Arid' | 'Humid / Wet';

export interface SiteFidelityInputs {
  /** Kecocokan litologi & mineral terhadap Bulan (anortosit/mare basalt FeO-TiO2, breksi tumbukan): 1–5 */
  lunarGeologyScore: number;
  /** Kecocokan litologi & mineral terhadap Mars (perklorat, sulfat, jarosite, karbonat, basalt): 1–5 */
  marsGeologyScore: number;
  /** Kecocokan morfologi terrain Bulan (kawah sederhana, rilles, tabung lava, permafrost kutub): 1–5 */
  lunarTerrainScore: number;
  /** Kecocokan morfologi terrain Mars (yardang, kipas aluvial, kawah, tabung lava, poligon es): 1–5 */
  marsTerrainScore: number;
  aridity: AridityClass;
  hasActiveLiquidWaterOrRain: boolean;
  hasPermafrostIce: boolean;
  /** Bonus uji lapangan Apollo / Artemis / FINESSE / HMP / AMASE / JPL nyata (0–4) */
  missionHeritageBonus: number;
}

export interface ScoreComponentBreakdown {
  id: 'geology' | 'terrain' | 'climate' | 'validation';
  label: string;
  shortLabel: string;
  moonPts: number;
  marsPts: number;
  maxPts: number;
}

export interface SiteFidelityScoreResult {
  moonSimilarityScore: number;
  marsSimilarityScore: number;
  similarityScore: number;
  breakdownNote: string;
  scoreComponents: ScoreComponentBreakdown[];
}

export interface ScorableSiteFields {
  elevationM: number;
  targetBody: 'Moon' | 'Mars' | 'Moon & Mars';
  biome: TerrainBiome;
  validationStatus: ValidationStatus;
  temperatureProfile: TemperatureProfile;
  terrainProfile: TerrainProfile;
  fidelityInputs: SiteFidelityInputs;
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

function clampScore(val: number): number {
  // Real Earth sites cannot reach 95–100% because Earth cannot replicate 1/6g or 0.38g gravity, hard vacuum, or 6 mbar CO2.
  return round1(Math.max(25, Math.min(91.5, val)));
}

/**
 * Computes calibrated, multi-factor planetary analog similarity scores for Earth sites
 * against Moon and Mars benchmarks (capped realistically at <= 91.5%):
 *  1) Geology & Mineralogy (up to 34 pts)
 *  2) Geomorphology, Subsurface Ice/Cave & Elevation (up to 26 pts)
 *  3) Climate Aridity, Liquid Water Penalty & Thermal Fit (up to 24 pts)
 *  4) Scientific Validation & Field Mission Heritage (up to 16 pts)
 */
export function computeSiteFidelityScores(site: ScorableSiteFields): SiteFidelityScoreResult {
  const f = site.fidelityInputs;
  const { avgC, minC, maxC } = site.temperatureProfile;
  const diurnalSwing = maxC - minC;

  // 1. Geology & Mineralogy (1..5 -> up to 34 pts)
  const lunarGeoPts = f.lunarGeologyScore * 6.8;
  const marsGeoPts = f.marsGeologyScore * 6.8;

  // 2. Geomorphology & Physical Context (up to 26 pts)
  let lunarTerrainPts = f.lunarTerrainScore * 4.2;
  let marsTerrainPts = f.marsTerrainScore * 4.2;

  if (f.hasPermafrostIce) {
    lunarTerrainPts += 3.0; // Polar ice analog (Shackleton / VIPER)
    marsTerrainPts += 2.5; // Phoenix / polar layered deposits
  }
  if (site.biome === 'Cave / Lava Tube') {
    lunarTerrainPts += 3.0;
    marsTerrainPts += 2.0;
  }
  if (site.elevationM >= 2000) {
    lunarTerrainPts += 1.5;
    marsTerrainPts += 2.2; // Thin air / high UV flux
  }

  // 3. Climate Aridity, Moisture Penalty & Thermal Fit (up to 24 pts)
  let lunarClimatePts = 0;
  let marsClimatePts = 0;

  if (f.aridity === 'Hyper-Arid / Frozen') {
    lunarClimatePts += 14;
    marsClimatePts += 14;
  } else if (f.aridity === 'Arid / Semi-Arid') {
    lunarClimatePts += 9;
    marsClimatePts += 10.5;
  } else {
    // Humid / tropical / wet basins diverge from dry Moon vacuum & arid Mars
    lunarClimatePts += 2;
    marsClimatePts += 3.5;
  }

  if (f.hasActiveLiquidWaterOrRain) {
    lunarClimatePts -= 6.5;
    marsClimatePts -= 4.0; // Modern Mars is dry, even if chemistry mimics ancient Noachian lakes
  }

  // Thermal regime vs Lunar extremes & Mars -63C mean
  if (avgC <= 0) {
    lunarClimatePts += 7.5;
    marsClimatePts += 8.0;
  } else if (avgC <= 18 && minC <= 0) {
    lunarClimatePts += 4.5;
    marsClimatePts += 6.0;
    if (diurnalSwing >= 30) {
      marsClimatePts += 2.0; // Strong diurnal swing parallels equatorial/mid-lat Mars
    }
  } else if (avgC <= 20) {
    lunarClimatePts += 3.0;
    marsClimatePts += 4.0;
  } else {
    // Hot deserts (>20C avg or >45C peak) diverge thermally from Mars ambient cold
    lunarClimatePts += 1.0;
    marsClimatePts += 2.0;
  }

  // Clamp climate score to [0, 24] so humid liquid-water penalties never produce negative component scores
  lunarClimatePts = Math.max(0, lunarClimatePts);
  marsClimatePts = Math.max(0, marsClimatePts);

  // 4. Scientific Validation & Mission Heritage (up to 16 pts)
  const validationPts =
    site.validationStatus === 'Official NASA/ESA'
      ? 12
      : site.validationStatus === 'Peer-Reviewed Journal'
        ? 8.5
        : 4.5;

  const heritagePts = Math.min(4, Math.max(0, f.missionHeritageBonus));
  const totalValidationPts = validationPts + heritagePts;

  const moonSimilarityScore = clampScore(
    lunarGeoPts + lunarTerrainPts + lunarClimatePts + totalValidationPts
  );
  const marsSimilarityScore = clampScore(
    marsGeoPts + marsTerrainPts + marsClimatePts + totalValidationPts
  );

  // Composite index aligns cleanly with declared mission target
  let similarityScore: number;
  if (site.targetBody === 'Moon') {
    similarityScore = moonSimilarityScore;
  } else if (site.targetBody === 'Mars') {
    similarityScore = marsSimilarityScore;
  } else {
    similarityScore = round1((moonSimilarityScore + marsSimilarityScore) / 2);
  }

  const breakdownNote = `Calibrated score (max 91.5% on Earth): Geology ${
    site.targetBody === 'Moon'
      ? `${f.lunarGeologyScore}/5`
      : site.targetBody === 'Mars'
        ? `${f.marsGeologyScore}/5`
        : `Moon ${f.lunarGeologyScore}/5 · Mars ${f.marsGeologyScore}/5`
  }, Climate ${f.aridity}${f.hasActiveLiquidWaterOrRain ? ' (active water/rain penalty)' : ''}, Status ${site.validationStatus}.`;

  const scoreComponents: ScoreComponentBreakdown[] = [
    {
      id: 'geology',
      label: 'Geology & Mineralogy',
      shortLabel: 'Geology',
      moonPts: round1(lunarGeoPts),
      marsPts: round1(marsGeoPts),
      maxPts: 34,
    },
    {
      id: 'terrain',
      label: 'Terrain & Morphology',
      shortLabel: 'Terrain',
      moonPts: round1(lunarTerrainPts),
      marsPts: round1(marsTerrainPts),
      maxPts: 26,
    },
    {
      id: 'climate',
      label: 'Climate, Aridity & Temperature',
      shortLabel: 'Climate/Temp',
      moonPts: round1(lunarClimatePts),
      marsPts: round1(marsClimatePts),
      maxPts: 24,
    },
    {
      id: 'validation',
      label: 'Validation & Mission Heritage',
      shortLabel: 'Validation',
      moonPts: round1(totalValidationPts),
      marsPts: round1(totalValidationPts),
      maxPts: 16,
    },
  ];

  return {
    moonSimilarityScore,
    marsSimilarityScore,
    similarityScore,
    breakdownNote,
    scoreComponents,
  };
}
