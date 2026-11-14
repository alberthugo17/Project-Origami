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
    return site.biome === 'Hydrothermal'
      ? 'Pelindung Baju & Segel Anti-Asam'
      : 'Lapisan Spacesuit & Insulasi EVA';
  }
  if (material.category === 'Transportasi & Rover') {
    return site.biome === 'Volcanic' || site.biome === 'Impact Crater'
      ? 'Sasis, Suspensi & Roda Rover'
      : 'Struktur Transportasi & Mobilitas';
  }
  if (material.category === 'Peralatan & Sensor') {
    return site.biome === 'Hydrothermal'
      ? 'Probe Sampling & Sensor Tahan Korosi'
      : 'Peralatan Bor, Segel & Optik Sensor';
  }
  return 'Struktur Habitat & Pelindung Peralatan';
}

export function scoreMaterialForSite(
  site: AnalogSite,
  material: AerospaceMaterial
): { score: number; reason: string } {
  const { minC, maxC, avgC } = site.temperatureProfile;
  const { acidityPh, roughness } = site.terrainProfile;

  let score = 56;
  const reasons: string[] = [];

  // 1. Temperature envelope fit
  const withinRange = minC >= material.tempRangeMinC && maxC <= material.tempRangeMaxC;
  if (withinRange) {
    score += 14;
    reasons.push(`stabil di rentang ${minC}°C s/d ${maxC}°C`);
  } else {
    score -= 22;
    reasons.push(`mendekati batas suhu kerja (${material.tempRangeMinC}°C..${material.tempRangeMaxC}°C)`);
  }

  // 2. Cold / cryogenic weighting
  if (minC <= -10) {
    score += material.cryogenicScore * 4.2;
    if (material.cryogenicScore >= 4) {
      reasons.push('tetap tangguh di suhu dingin/beku');
    }
  }

  // 3. Heat weighting
  if (maxC >= 35) {
    score += material.heatScore * 4.0;
    if (material.thermalConductivityType === 'Konduktor Termal') {
      score += 3;
      reasons.push('membantu pelepasan panas permukaan tinggi');
    } else if (material.thermalConductivityType === 'Isolator Termal') {
      score += 4;
      reasons.push('menahan rambatan panas berlebih ke dalam sistem');
    }
  }

  // 4. Diurnal swing / thermal isolation
  const swing = maxC - minC;
  if (swing >= 18 && material.thermalConductivityType === 'Isolator Termal') {
    score += 5;
    reasons.push(`isolator termal ideal untuk ayunan suhu ${swing}°C`);
  }

  // 5. Acid & hydrothermal chemical fit
  const isAcidic = acidityPh < 4.5 || site.biome === 'Hydrothermal';
  if (isAcidic) {
    score += material.acidResistanceScore * 5.2;
    if (material.acidResistanceScore >= 5) {
      reasons.push(`tahan korosi asam ekstrem (pH ${acidityPh})`);
    } else if (material.acidResistanceScore <= 2) {
      score -= 18;
    }
  } else {
    score += material.acidResistanceScore * 1.1;
  }

  // 6. Abrasion, dust & rugged terrain fit
  const isAbrasive =
    site.biome === 'Volcanic' ||
    site.biome === 'Desert' ||
    site.biome === 'Impact Crater' ||
    roughness.includes('Tinggi');
  if (isAbrasive) {
    score += material.dustAbrasionScore * 4.0;
    if (material.dustAbrasionScore >= 4) {
      reasons.push('tahan gesekan debu silikat & batuan tajam');
    }
  } else {
    score += material.dustAbrasionScore * 1.5;
  }

  // 7. Lightness bonus for EVA / high-altitude mobility
  if (site.elevationM >= 2000 && (material.weightClass === 'Sangat Ringan' || material.weightClass === 'Ringan')) {
    score += 4;
    reasons.push(`bobot ${material.weightClass.toLowerCase()} untuk operasi elevasi tinggi`);
  }

  // 8. Lava tube / habitat bonus
  if (site.biome === 'Cave / Lava Tube' && material.category === 'Struktur & Habitat') {
    score += 7;
    reasons.push('optimal untuk konstruksi habitat bawah permukaan');
  }

  // 9. Polar solar/thermal balance note
  if (avgC < 0 && material.category === 'Spacesuit & EVA') {
    score += 3;
  }

  const clampedScore = Math.max(40, Math.min(99, Math.round(score)));
  const uniqueReasons = Array.from(new Set(reasons)).slice(0, 2);
  const reasonText =
    uniqueReasons.length > 0
      ? uniqueReasons.join('; ').replace(/^[a-z]/, (c) => c.toUpperCase()) + '.'
      : `Sesuai dengan karakter ${site.biome.toLowerCase()} pada rata-rata ${avgC}°C.`;

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

  const idsB = new Set(topMaterialsB.map((r) => r.material.id));
  const sharedMaterials = topMaterialsA
    .filter((r) => idsB.has(r.material.id))
    .map((r) => r.material);
  const sharedMaterialIds = sharedMaterials.map((m) => m.id);

  const tempDeltaAvgC = Math.abs(siteA.temperatureProfile.avgC - siteB.temperatureProfile.avgC);
  const swingA = siteA.temperatureProfile.maxC - siteA.temperatureProfile.minC;
  const swingB = siteB.temperatureProfile.maxC - siteB.temperatureProfile.minC;
  const tempDeltaMaxSwingC = Math.max(swingA, swingB);

  const betterMatch =
    siteA.similarityScore >= siteB.similarityScore ? siteA.name : siteB.name;

  const needLabel =
    need === 'all' ? 'keseluruhan misi' : need;

  const summaryVerdict =
    sharedMaterials.length > 0
      ? `Untuk kebutuhan ${needLabel}, ${betterMatch} memiliki skor analog lebih tinggi sementara ${sharedMaterials.length} material inti (seperti ${sharedMaterials[0].name}) dapat digunakan lintas kedua lokasi meski selisih suhu rata-rata mencapai ${tempDeltaAvgC}°C.`
      : `Untuk kebutuhan ${needLabel}, kedua lokasi menuntut spesifikasi material berbeda akibat perbedaan ekstrem suhu (${tempDeltaAvgC}°C) dan karakter terrain (${siteA.terrainProfile.roughness} vs ${siteB.terrainProfile.roughness}).`;

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
