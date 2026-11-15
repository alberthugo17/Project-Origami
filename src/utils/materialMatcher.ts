import { AnalogSite } from '../data/analogSites';
import { AEROSPACE_MATERIALS, AerospaceMaterial, MaterialCategory } from '../data/materials';

export type ComparisonNeed = 'all' | MaterialCategory;

export interface MaterialRecommendation {
  material: AerospaceMaterial;
  rank: number;
  score: number;
  recommendedRole: string;
  fitReason: string;
}

export const SUITABLE_MATERIAL_THRESHOLD = 65;

export interface MaterialScoreBand {
  label: 'Optimal' | 'Layak' | 'Terbatas' | 'Tidak Disarankan';
  textClass: string;
}

export function getMaterialScoreBand(score: number): MaterialScoreBand {
  if (score >= 80) {
    return { label: 'Optimal', textClass: 'text-emerald-600 dark:text-emerald-400' };
  }
  if (score >= SUITABLE_MATERIAL_THRESHOLD) {
    return { label: 'Layak', textClass: 'text-sky-600 dark:text-sky-400' };
  }
  if (score >= 50) {
    return { label: 'Terbatas', textClass: 'text-amber-600 dark:text-amber-400' };
  }
  return { label: 'Tidak Disarankan', textClass: 'text-rose-600 dark:text-rose-400' };
}

export interface SiteComparisonResult {
  siteA: AnalogSite;
  siteB: AnalogSite;
  need: ComparisonNeed;
  tempDeltaAvgC: number;
  tempDeltaMaxSwingC: number;
  topMaterialsA: MaterialRecommendation[];
  topMaterialsB: MaterialRecommendation[];
  sharedMaterialIds: string[];
  sharedMaterials: AerospaceMaterial[];
  summaryVerdict: string;
}

function getRoleForSite(site: AnalogSite, material: AerospaceMaterial): string {
  if (material.category === 'Spacesuit & EVA') {
    if (material.exposureRole === 'Komponen Terlindung / Internal') {
      return 'Lapisan Insulasi Internal Spacesuit / Rover';
    }
    return site.biome === 'Hydrothermal'
      ? 'Pelindung Luar Baju & Segel Anti-Asam'
      : 'Lapisan Luar Spacesuit EVA (TMG)';
  }
  if (material.category === 'Transportasi & Rover') {
    return site.biome === 'Volcanic' || site.biome === 'Impact Crater'
      ? 'Sasis, Suspensi & Roda Medan Ekstrem'
      : 'Struktur Transportasi & Mobilitas';
  }
  if (material.category === 'Peralatan & Sensor') {
    if (material.exposureRole === 'Optik & Sensor Kritis') {
      return 'Jendela Optik Kamera & Pelindung Visor';
    }
    return site.biome === 'Hydrothermal'
      ? 'Probe Sampling & Sensor Tahan Korosi'
      : 'Peralatan Bor, Segel & Komponen Instrumen';
  }
  return material.exposureRole === 'Komponen Terlindung / Internal'
    ? 'Lapisan Tekanan Habitat (Terlindung Luar)'
    : 'Struktur Utama & Pelindung Habitat';
}

/**
 * Evaluates aerospace material suitability for a given analog site using a
 * multi-factor engineering trade-study model (0–92% realistic scale):
 *  1) Thermal envelope & safety margin
 *  2) Exterior durability: dust abrasion & mechanical impact toughness
 *  3) Chemical safety: acid corrosion, chloride/salt pitting, & UV/perchlorate oxidation
 *  4) Operational usefulness: exposure role readiness, mass efficiency, & biome mechanics
 */
export function scoreMaterialForSite(
  site: AnalogSite,
  material: AerospaceMaterial
): { score: number; reason: string } {
  const { minC, maxC, avgC } = site.temperatureProfile;
  const { acidityPh, roughness } = site.terrainProfile;
  const swing = Math.round((maxC - minC) * 10) / 10;
  const isRugged = roughness.includes('Tinggi');
  const isAcidic = acidityPh < 4.5 || site.biome === 'Hydrothermal';
  const isHyperAcidic = acidityPh < 2.5;
  const isDesert = site.biome === 'Desert';
  const isVolcanicOrCrater = site.biome === 'Volcanic' || site.biome === 'Impact Crater';
  const isCold = minC <= -10 || avgC <= 0;

  const positiveReasons: string[] = [];
  const warningReasons: string[] = [];

  // ---------------------------------------------------------------------------
  // 1. Thermal Envelope & Safety Margin (max ~24 pts)
  // ---------------------------------------------------------------------------
  let thermalPts = 0;
  const coldMargin = minC - material.tempRangeMinC;
  const hotMargin = material.tempRangeMaxC - maxC;
  const minMargin = Math.min(coldMargin, hotMargin);

  if (coldMargin < 0 || hotMargin < 0) {
    // Out of operating envelope
    const violation = Math.abs(Math.min(coldMargin, hotMargin));
    thermalPts = Math.max(-28, -14 - violation * 0.6);
    warningReasons.push(`melewati batas suhu aman (${material.tempRangeMinC}°C..${material.tempRangeMaxC}°C)`);
  } else {
    // Base thermal fit + safety margin bonus (capped at +8)
    thermalPts += 10 + Math.min(8, Math.round(minMargin / 15));
    if (minMargin < 12) {
      thermalPts -= 7;
      warningReasons.push(`margin suhu sempit (batas kerja ${material.tempRangeMinC}°C..${material.tempRangeMaxC}°C)`);
    } else {
      positiveReasons.push(`margin suhu aman di ${minC}°C s/d ${maxC}°C`);
    }

    if (isCold) {
      thermalPts += (material.cryogenicScore - 2) * 1.8;
      if (material.cryogenicScore >= 5) {
        positiveReasons.push('stabil di suhu dingin/kriogenik');
      }
    }
    if (maxC >= 32) {
      thermalPts += (material.heatScore - 2) * 1.5;
      if (material.thermalConductivityType === 'Konduktor Termal') {
        thermalPts += 2;
      }
    }
    if (swing >= 18 && material.thermalConductivityType === 'Isolator Termal') {
      thermalPts += 4;
      positiveReasons.push(`isolator untuk ayunan diurnal ${swing}°C`);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Exterior Impact Toughness & Dust/Abrasion Durability (max ~24 pts)
  // ---------------------------------------------------------------------------
  let mechanicalPts = 0;
  const isAbrasiveEnv = isVolcanicOrCrater || isDesert || isRugged;

  if (isAbrasiveEnv) {
    mechanicalPts += material.dustAbrasionScore * 2.5 + material.impactResistanceScore * 2.3;

    // Severe penalty for fragile films or low-abrasion shells on abrasive sites
    if (material.dustAbrasionScore <= 2) {
      mechanicalPts -= 14;
      warningReasons.push('rentan goresan debu/pasir tajam (butuh pelindung luar)');
    }
    if (material.impactResistanceScore <= 2 && isRugged) {
      mechanicalPts -= 10;
      warningReasons.push('rapuh terhadap benturan batu curam & kasar');
    } else if (material.impactResistanceScore <= 1) {
      mechanicalPts -= 10;
      warningReasons.push('film tipis rentan sobek benturan luar');
    }

    if (material.dustAbrasionScore >= 4 && material.impactResistanceScore >= 4) {
      positiveReasons.push('tangguh abrasi debu & benturan batuan');
    }

    // Realism adjustment from NASA ICES-2026: open-weave Orthofabric retains sharp tephra/lunar dust
    if (material.id === 'orthofabric-ptfe' && isVolcanicOrCrater) {
      mechanicalPts -= 2;
    }
  } else {
    mechanicalPts += material.dustAbrasionScore * 1.8 + material.impactResistanceScore * 1.8;
  }

  // ---------------------------------------------------------------------------
  // 3. Chemical Safety: Acid, Salt Pitting & UV/Perchlorate Oxidation (max ~22 pts)
  // ---------------------------------------------------------------------------
  let chemicalPts = 0;
  if (isAcidic) {
    chemicalPts += material.acidResistanceScore * 4.2;
    if (material.acidResistanceScore <= 2) {
      chemicalPts -= isHyperAcidic ? 28 : 20;
      warningReasons.push(`tidak aman terhadap korosi asam (pH ${acidityPh})`);
    } else if (material.acidResistanceScore === 3) {
      chemicalPts -= isHyperAcidic ? 12 : 6;
      warningReasons.push('ketahanan asam terbatas tanpa lapisan luar');
    } else if (material.acidResistanceScore >= 5) {
      positiveReasons.push(`tahan korosi asam ekstrem (pH ${acidityPh})`);
    }
  } else {
    chemicalPts += material.acidResistanceScore * 1.6 + material.uvOxidationScore * 2.6;

    // Arid deserts / high-elevation sites have intense UV & perchlorate/chloride salt crusts
    if (isDesert || site.elevationM >= 2000) {
      if (material.uvOxidationScore <= 2) {
        chemicalPts -= 10;
        warningReasons.push('terdegradasi radiasi UV langsung tanpa pelapis luar');
      } else if (material.uvOxidationScore >= 5) {
        positiveReasons.push('inert terhadap UV & oksidator/garam');
      }
      if (material.id === 'al-7075-t6' && isDesert) {
        chemicalPts -= 5;
        warningReasons.push('perlu anodisasi terhadap kerak garam klorida');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Operational Usefulness, Mass Efficiency & Exposure Role (max ~20 pts)
  // ---------------------------------------------------------------------------
  let operationalPts = 0;

  // Weight efficiency
  if (material.weightClass === 'Sangat Ringan') operationalPts += 10;
  else if (material.weightClass === 'Ringan') operationalPts += 8.5;
  else if (material.weightClass === 'Sedang') operationalPts += 5.5;
  else {
    // Heavy alloy (e.g., Hastelloy 8890 kg/m3) penalized for mobility/high-elevation unless hyper-acidic probe
    operationalPts += isHyperAcidic ? 3 : -4;
    if (!isHyperAcidic) {
      warningReasons.push('bobot jenis berat membatasi mobilitas struktur');
    }
  }

  if (site.elevationM >= 2000 && (material.weightClass === 'Sangat Ringan' || material.weightClass === 'Ringan')) {
    operationalPts += 2.5;
  }

  // Exposure readiness: exterior-rated hardware scores higher as primary field-ready material
  if (material.exposureRole === 'Pelindung Luar Langsung') {
    operationalPts += 8;
  } else if (material.exposureRole === 'Optik & Sensor Kritis') {
    operationalPts += 5;
  } else {
    // Internal / shielded layers (Kapton MLI, Aerogel, Vectran, FVMQ) rely on outer shell protection
    operationalPts += 3.5;
  }

  // Domain-specific physical adjustments
  if (site.biome === 'Cave / Lava Tube' && material.id === 'kevlar-vectran-bladder') {
    operationalPts += 8;
    positiveReasons.push('optimal untuk modul habitat tiup dalam tabung lava');
  }
  if (material.id === 'nitinol-spring-tire') {
    if (isVolcanicOrCrater || isDesert) {
      operationalPts += 5;
      positiveReasons.push('roda pegas superelastis unggul di medan batuan/pasir');
    }
    if (minC <= -35) {
      operationalPts -= 12;
      warningReasons.push('superelastisitas Nitinol kaku di bawah -40°C');
    }
  }
  if (material.id === 'cfrp-peek-composite' && isRugged && isVolcanicOrCrater) {
    operationalPts -= 3;
  }

  // Sum all components around calibrated engineering baseline (+4 baseline -> max realistic ~91–92%)
  const rawScore = 4 + thermalPts + mechanicalPts + chemicalPts + operationalPts;
  const clampedScore = Math.max(28, Math.min(92, Math.round(rawScore)));

  // Build concise, informative engineering verdict prioritizing critical warnings + strengths
  let reasonText = '';
  if (warningReasons.length > 0 && clampedScore < 72) {
    const warns = Array.from(new Set(warningReasons)).slice(0, 2);
    reasonText = warns.join('; ').replace(/^[a-z]/, (c) => c.toUpperCase()) + '.';
  } else if (positiveReasons.length > 0) {
    const pos = Array.from(new Set(positiveReasons)).slice(0, 2);
    const warnSuffix = warningReasons.length > 0 ? ` (Catatan: ${warningReasons[0]})` : '';
    reasonText = pos.join('; ').replace(/^[a-z]/, (c) => c.toUpperCase()) + '.' + warnSuffix;
  } else {
    reasonText = `Sesuai untuk fungsi ${material.exposureRole.toLowerCase()} pada suhu rata-rata ${avgC}°C.`;
  }

  return { score: clampedScore, reason: reasonText };
}

export function recommendTopMaterials(
  site: AnalogSite,
  materials: AerospaceMaterial[] = AEROSPACE_MATERIALS,
  limit = 5,
  categoryFilter: ComparisonNeed = 'all'
): MaterialRecommendation[] {
  const pool =
    categoryFilter === 'all'
      ? materials
      : materials.filter((m) => m.category === categoryFilter);

  const ranked = pool
    .map((material) => {
      const { score, reason } = scoreMaterialForSite(site, material);
      return {
        material,
        score,
        recommendedRole: getRoleForSite(site, material),
        fitReason: reason,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.material.densityKgM3 - b.material.densityKgM3;
    })
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

export function compareSites(
  siteA: AnalogSite,
  siteB: AnalogSite,
  need: ComparisonNeed = 'all',
  materials: AerospaceMaterial[] = AEROSPACE_MATERIALS
): SiteComparisonResult {
  const topMaterialsA = recommendTopMaterials(siteA, materials, 5, need);
  const topMaterialsB = recommendTopMaterials(siteB, materials, 5, need);

  const mapB = new Map(topMaterialsB.map((r) => [r.material.id, r]));
  const sharedMaterials = topMaterialsA
    .filter((r) => {
      const matchB = mapB.get(r.material.id);
      return Boolean(
        matchB &&
          r.score >= SUITABLE_MATERIAL_THRESHOLD &&
          matchB.score >= SUITABLE_MATERIAL_THRESHOLD
      );
    })
    .map((r) => r.material);
  const sharedMaterialIds = sharedMaterials.map((m) => m.id);

  const tempDeltaAvgC = Math.round(Math.abs(siteA.temperatureProfile.avgC - siteB.temperatureProfile.avgC) * 10) / 10;
  const swingA = Math.round((siteA.temperatureProfile.maxC - siteA.temperatureProfile.minC) * 10) / 10;
  const swingB = Math.round((siteB.temperatureProfile.maxC - siteB.temperatureProfile.minC) * 10) / 10;
  const tempDeltaMaxSwingC = Math.max(swingA, swingB);

  const bothMoon =
    (siteA.targetBody === 'Moon' || siteA.targetBody === 'Moon & Mars') &&
    (siteB.targetBody === 'Moon' || siteB.targetBody === 'Moon & Mars');
  const bothMars =
    (siteA.targetBody === 'Mars' || siteA.targetBody === 'Moon & Mars') &&
    (siteB.targetBody === 'Mars' || siteB.targetBody === 'Moon & Mars');

  let scoreA = siteA.similarityScore;
  let scoreB = siteB.similarityScore;
  let scoreScopeLabel = 'skor analog terkalibrasi';

  if (bothMoon && !bothMars) {
    scoreA = siteA.moonSimilarityScore;
    scoreB = siteB.moonSimilarityScore;
    scoreScopeLabel = 'kecocokan Bulan';
  } else if (bothMars && !bothMoon) {
    scoreA = siteA.marsSimilarityScore;
    scoreB = siteB.marsSimilarityScore;
    scoreScopeLabel = 'kecocokan Mars';
  }

  const betterMatch = scoreA >= scoreB ? siteA.name : siteB.name;
  const betterScore = Math.max(scoreA, scoreB).toFixed(1);

  const needLabel =
    need === 'all' ? 'keseluruhan misi' : need;

  const summaryVerdict =
    sharedMaterials.length > 0
      ? `Untuk kebutuhan ${needLabel}, ${betterMatch} unggul pada ${scoreScopeLabel} (${betterScore}%) sementara ${sharedMaterials.length} material inti (seperti ${sharedMaterials[0].name}) memenuhi ambang layak (≥${SUITABLE_MATERIAL_THRESHOLD}%) di kedua lokasi meski selisih suhu rata-rata ${tempDeltaAvgC}°C.`
      : `Untuk kebutuhan ${needLabel}, ${betterMatch} unggul pada ${scoreScopeLabel} (${betterScore}%), namun tidak ada satu material pun yang mencapai ambang layak (≥${SUITABLE_MATERIAL_THRESHOLD}%) di kedua lokasi sekaligus akibat perbedaan ekstrem suhu (${tempDeltaAvgC}°C), kimia permukaan, dan terrain.`;

  return {
    siteA,
    siteB,
    need,
    tempDeltaAvgC,
    tempDeltaMaxSwingC,
    topMaterialsA,
    topMaterialsB,
    sharedMaterialIds,
    sharedMaterials,
    summaryVerdict,
  };
}
