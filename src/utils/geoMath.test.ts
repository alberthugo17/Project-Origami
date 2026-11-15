import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDMS,
  formatCoordinatesDMS,
  altitudeKmToZoom,
  zoomToAltitudeKm,
  computeScaleBar,
} from './geoMath';
import {
  filterAnalogSites,
  filterDataSources,
  getEffectiveSimilarityScore,
  getTopFindingSite,
  getSourcesForSite,
} from './analogFilter';
import { ANALOG_SITES } from '../data/analogSites';
import { DATA_SOURCES } from '../data/dataSources';
import { AEROSPACE_MATERIALS } from '../data/materials';
import {
  SUITABLE_MATERIAL_THRESHOLD,
  compareSites,
  getMaterialScoreBand,
  recommendTopMaterials,
  scoreMaterialForSite,
} from './materialMatcher';

test('formatDMS and formatCoordinatesDMS produce Google Earth style strings', () => {
  assert.equal(formatDMS(-7.9425, true), `7°56'33.00"S`);
  assert.equal(formatDMS(112.953, false), `112°57'10.80"E`);
  assert.equal(formatDMS(69.9999999, false), `70°00'00.00"E`);
  assert.equal(
    formatCoordinatesDMS(-7.9425, 112.953),
    `7°56'33.00"S 112°57'10.80"E`
  );
});

test('altitude to 2D zoom conversions stay bounded and consistent', () => {
  const zGlobal = altitudeKmToZoom(19370);
  assert.ok(zGlobal >= 2 && zGlobal <= 3, `Expected global zoom ~2.2, got ${zGlobal}`);
  const zLocal = altitudeKmToZoom(24);
  assert.ok(zLocal >= 11 && zLocal <= 13, `Expected caldera zoom ~11.9, got ${zLocal}`);
  assert.ok(zoomToAltitudeKm(12) > 10 && zoomToAltitudeKm(12) < 40);
});

test('computeScaleBar yields clean km and meter values across orbital and caldera altitudes', () => {
  const high = computeScaleBar(19370);
  assert.ok(high.label.endsWith('km'));
  assert.ok(high.widthPx >= 52 && high.widthPx <= 150);

  const low = computeScaleBar(24);
  assert.ok(low.label.endsWith('km'));
  assert.ok(low.widthPx >= 52 && low.widthPx <= 150);

  const ultraLow = computeScaleBar(2);
  assert.ok(ultraLow.label.endsWith('m') || ultraLow.label.endsWith('km'));
  assert.ok(ultraLow.widthPx >= 52 && ultraLow.widthPx <= 150);
});

test('filterAnalogSites finds Atacama Yungay as top finding and filters by target/query', () => {
  const top = getTopFindingSite(ANALOG_SITES);
  assert.equal(top.id, 'atacama-yungay');

  const bromoSearch = filterAnalogSites(ANALOG_SITES, { query: 'Bromo' });
  assert.equal(bromoSearch.length, 1);
  assert.equal(bromoSearch[0].id, 'gunung-bromo');
  assert.equal(bromoSearch[0].validationStatus, 'Eksploratif Lokal');

  const moonOnly = filterAnalogSites(ANALOG_SITES, { targetFilter: 'Moon' });
  assert.ok(moonOnly.every((s) => s.targetBody === 'Moon' || s.targetBody === 'Moon & Mars'));
  assert.ok(moonOnly.some((s) => s.id === 'gunung-bromo'));
  assert.ok(moonOnly.some((s) => s.id === 'craters-of-the-moon'));
  assert.ok(moonOnly.some((s) => s.id === 'mauna-kea'));
  assert.ok(!moonOnly.some((s) => s.id === 'atacama-yungay'));

  // Moon filter must sort strictly by moonSimilarityScore descending
  for (let i = 1; i < moonOnly.length; i++) {
    assert.ok(
      moonOnly[i - 1].moonSimilarityScore >= moonOnly[i].moonSimilarityScore,
      `Moon filter sorting mismatch: ${moonOnly[i - 1].id} (${moonOnly[i - 1].moonSimilarityScore}) < ${moonOnly[i].id} (${moonOnly[i].moonSimilarityScore})`
    );
  }
  const topMoon = getTopFindingSite(moonOnly, 'Moon');
  assert.equal(topMoon.id, moonOnly[0].id);

  const marsOnly = filterAnalogSites(ANALOG_SITES, { targetFilter: 'Mars' });
  for (let i = 1; i < marsOnly.length; i++) {
    assert.ok(
      marsOnly[i - 1].marsSimilarityScore >= marsOnly[i].marsSimilarityScore,
      `Mars filter sorting mismatch: ${marsOnly[i - 1].id} < ${marsOnly[i].id}`
    );
  }
  assert.equal(getTopFindingSite(marsOnly, 'Mars').id, 'atacama-yungay');
  assert.equal(getEffectiveSimilarityScore(topMoon, 'Moon'), topMoon.moonSimilarityScore);
});

test('filterDataSources and getSourcesForSite resolve valid citations and scientific DOIs', () => {
  const top = getTopFindingSite(ANALOG_SITES);
  const citations = getSourcesForSite(top);
  assert.ok(citations.length >= 4, 'Top finding should cite at least 4 datasets');

  const marsSources = filterDataSources(DATA_SOURCES, 'Mars');
  assert.ok(marsSources.length >= 3);
  assert.ok(marsSources.every((s) => s.targetBody === 'Mars'));

  for (const src of DATA_SOURCES) {
    assert.ok(src.accessUrl.startsWith('https://'), `Invalid accessUrl for ${src.id}`);
    assert.ok(src.referenceUrl.startsWith('https://'), `Invalid referenceUrl for ${src.id}`);
    assert.ok(src.scientificReference.length > 10, `Missing scientificReference for ${src.id}`);
  }
});

test('all 14 analog sites have consistent temperature, terrain, seasonal data, ArcticDEM above 60N, and DOIs', () => {
  assert.equal(ANALOG_SITES.length, 14);
  for (const site of ANALOG_SITES) {
    assert.ok(
      site.temperatureProfile.minC <= site.temperatureProfile.avgC &&
        site.temperatureProfile.avgC <= site.temperatureProfile.maxC,
      `Temperature bounds invalid for ${site.id}`
    );
    assert.ok(site.terrainProfile.surfaceType.length > 5);
    assert.ok(site.terrainProfile.acidityPh > 0 && site.terrainProfile.acidityPh < 14);
    assert.ok(site.seasonalRecommendation.bestWindow.length > 5);
    assert.ok(site.seasonalRecommendation.recommendedTests.length >= 1);
    assert.ok(site.scientificReferences.length >= 1, `Missing DOI/reference for ${site.id}`);
    assert.ok(site.scientificReferences.every((r) => r.url.startsWith('https://')));

    if (site.lat > 60) {
      assert.ok(!site.dataSourceIds.includes('nasa-srtm'), `${site.id} (>60N) must not use SRTM`);
      assert.ok(site.dataSourceIds.includes('pgc-arcticdem'), `${site.id} (>60N) should use ArcticDEM`);
    }

    assert.ok(
      site.moonSimilarityScore >= 25 && site.moonSimilarityScore <= 91.5,
      `Moon score out of realistic range [25..91.5] for ${site.id}: ${site.moonSimilarityScore}`
    );
    assert.ok(
      site.marsSimilarityScore >= 25 && site.marsSimilarityScore <= 91.5,
      `Mars score out of realistic range [25..91.5] for ${site.id}: ${site.marsSimilarityScore}`
    );
    assert.ok(site.scoreBreakdown.length > 20);
    if (site.targetBody === 'Moon') {
      assert.equal(site.accentColor, '#3b82f6');
    } else if (site.targetBody === 'Mars') {
      assert.equal(site.accentColor, '#ef4444');
    } else {
      assert.equal(site.accentColor, '#8b5cf6');
    }
  }

  const atacama = ANALOG_SITES.find((s) => s.id === 'atacama-yungay')!;
  const bromo = ANALOG_SITES.find((s) => s.id === 'gunung-bromo')!;
  assert.ok(atacama.marsSimilarityScore >= 88 && atacama.moonSimilarityScore < 60);
  assert.ok(bromo.similarityScore < 65 && bromo.similarityScore < atacama.marsSimilarityScore - 20);

  const maunaKea = ANALOG_SITES.find((s) => s.id === 'mauna-kea')!;
  assert.equal(maunaKea.targetBody, 'Moon & Mars');
  assert.ok(maunaKea.geologicalRationale.includes('JSC Mars-1'));
});

test('all 12 aerospace materials include valid references, corrected densities, and no markdown artifacts', () => {
  assert.equal(AEROSPACE_MATERIALS.length, 12);
  for (const mat of AEROSPACE_MATERIALS) {
    assert.ok(mat.referenceUrl.startsWith('https://'), `Invalid referenceUrl for ${mat.id}`);
    assert.ok(mat.referenceCitation.length > 10);
    assert.ok(!mat.tendency.includes('**') && !mat.durability.includes('**'));
  }
  const ortho = AEROSPACE_MATERIALS.find((m) => m.id === 'orthofabric-ptfe')!;
  assert.equal(ortho.densityKgM3, 710);
  assert.ok(ortho.densityNote?.includes('490 g/m²'));

  const fvmq = AEROSPACE_MATERIALS.find((m) => m.id === 'fluorosilicone-viton-seal')!;
  assert.equal(fvmq.densityKgM3, 1450);

  for (const site of ANALOG_SITES) {
    assert.ok(!site.geologicalRationale.includes('**'), `Markdown ** found in ${site.id}`);
    assert.ok(!site.summary.includes('**'), `Markdown ** found in summary of ${site.id}`);
  }
});

test('recommendTopMaterials strictly returns 5 ranked materials tailored to site hazards', () => {
  const ijen = ANALOG_SITES.find((s) => s.id === 'kawah-ijen')!;
  const topIjen = recommendTopMaterials(ijen, AEROSPACE_MATERIALS, 5);
  assert.equal(topIjen.length, 5);
  assert.deepEqual(
    topIjen.map((r) => r.rank),
    [1, 2, 3, 4, 5]
  );
  // Acidic caldera (pH 0.4) must NOT recommend untreated Aluminium 7075 in top 5
  assert.ok(!topIjen.some((r) => r.material.id === 'al-7075-t6'));
  // Acid-resistant materials (Hastelloy / SiC / PTFE) must appear in top 5
  assert.ok(
    topIjen.some(
      (r) =>
        r.material.id === 'hastelloy-c276' ||
        r.material.id === 'silicon-carbide-ceramic' ||
        r.material.id === 'orthofabric-ptfe'
    )
  );

  const mcmurdo = ANALOG_SITES.find((s) => s.id === 'mcmurdo-dry-valleys')!;
  const topMcMurdo = recommendTopMaterials(mcmurdo, AEROSPACE_MATERIALS, 5);
  assert.equal(topMcMurdo.length, 5);
  assert.ok(
    topMcMurdo.some(
      (r) =>
        r.material.id === 'aerogel-silica-blanket' ||
        r.material.id === 'kapton-mli-aluminized' ||
        r.material.id === 'orthofabric-ptfe'
    )
  );
});

test('compareSites computes temperature deltas and shared materials across mission needs', () => {
  const bromo = ANALOG_SITES.find((s) => s.id === 'gunung-bromo')!;
  const mcmurdo = ANALOG_SITES.find((s) => s.id === 'mcmurdo-dry-valleys')!;
  const comparison = compareSites(bromo, mcmurdo, 'Spacesuit & EVA');

  assert.equal(comparison.tempDeltaAvgC, Math.abs(bromo.temperatureProfile.avgC - mcmurdo.temperatureProfile.avgC));
  assert.ok(comparison.topMaterialsA.length >= 1 && comparison.topMaterialsA.length <= 5);
  assert.ok(comparison.topMaterialsB.length >= 1 && comparison.topMaterialsB.length <= 5);
  assert.ok(comparison.sharedMaterials.length >= 1);
  assert.ok(comparison.summaryVerdict.includes('Spacesuit & EVA'));

  // Shared cross-site materials must meet >= SUITABLE_MATERIAL_THRESHOLD on both sites
  const ijen = ANALOG_SITES.find((s) => s.id === 'kawah-ijen')!;
  const atacama = ANALOG_SITES.find((s) => s.id === 'atacama-yungay')!;
  const structureCompare = compareSites(ijen, atacama, 'Struktur & Habitat');
  assert.ok(!structureCompare.sharedMaterialIds.includes('al-7075-t6'));
  for (const mat of structureCompare.sharedMaterials) {
    assert.ok(scoreMaterialForSite(ijen, mat).score >= SUITABLE_MATERIAL_THRESHOLD);
    assert.ok(scoreMaterialForSite(atacama, mat).score >= SUITABLE_MATERIAL_THRESHOLD);
  }

  assert.equal(getMaterialScoreBand(85).label, 'Optimal');
  assert.equal(getMaterialScoreBand(70).label, 'Layak');
  assert.equal(getMaterialScoreBand(55).label, 'Terbatas');
  assert.equal(getMaterialScoreBand(42).label, 'Tidak Disarankan');
});

test('material scoring avoids 99% ceiling saturation and penalizes fragile, corrosive, or cold-stiffening weaknesses', () => {
  const atacama = ANALOG_SITES.find((s) => s.id === 'atacama-yungay')!;
  const craters = ANALOG_SITES.find((s) => s.id === 'craters-of-the-moon')!;
  const mcmurdo = ANALOG_SITES.find((s) => s.id === 'mcmurdo-dry-valleys')!;

  const kapton = AEROSPACE_MATERIALS.find((m) => m.id === 'kapton-mli-aluminized')!;
  const ortho = AEROSPACE_MATERIALS.find((m) => m.id === 'orthofabric-ptfe')!;
  const ti = AEROSPACE_MATERIALS.find((m) => m.id === 'ti-6al-4v')!;
  const nitinol = AEROSPACE_MATERIALS.find((m) => m.id === 'nitinol-spring-tire')!;

  for (const site of ANALOG_SITES) {
    for (const mat of AEROSPACE_MATERIALS) {
      const { score } = scoreMaterialForSite(site, mat);
      assert.ok(score >= 28 && score <= 92, `Score out of realistic engineering bounds [28..92]: ${site.id}/${mat.id}=${score}`);
    }
  }

  // Thin Kapton MLI film must NOT tie with exterior-grade Orthofabric/Ti on abrasive Atacama desert
  const kaptonAtacama = scoreMaterialForSite(atacama, kapton).score;
  const orthoAtacama = scoreMaterialForSite(atacama, ortho).score;
  const tiAtacama = scoreMaterialForSite(atacama, ti).score;
  assert.ok(
    orthoAtacama - kaptonAtacama >= 12 && tiAtacama - kaptonAtacama >= 12,
    `Expected Kapton (${kaptonAtacama}) to score significantly below Orthofabric (${orthoAtacama}) and Ti (${tiAtacama})`
  );

  // Nitinol excels on rocky volcanic lava (Craters of the Moon) but drops at extreme -55C McMurdo
  const nitinolCraters = scoreMaterialForSite(craters, nitinol).score;
  const nitinolMcMurdo = scoreMaterialForSite(mcmurdo, nitinol).score;
  assert.ok(
    nitinolCraters - nitinolMcMurdo >= 15,
    `Expected Nitinol Craters (${nitinolCraters}) >> McMurdo (${nitinolMcMurdo})`
  );
});

test('all scientific DOIs and NTRS material URLs are specific and corrected', () => {
  const genericRootUrls = new Set([
    'https://ntrs.nasa.gov/',
    'https://maptis.nasa.gov/',
    'https://astrogeology.usgs.gov/',
  ]);

  for (const mat of AEROSPACE_MATERIALS) {
    assert.ok(
      !genericRootUrls.has(mat.referenceUrl),
      `Material ${mat.id} still points to generic root URL: ${mat.referenceUrl}`
    );
  }

  for (const src of DATA_SOURCES) {
    assert.ok(
      !genericRootUrls.has(src.referenceUrl),
      `DataSource ${src.id} still points to generic root URL: ${src.referenceUrl}`
    );
  }

  for (const site of ANALOG_SITES) {
    for (const ref of site.scientificReferences) {
      assert.ok(
        !genericRootUrls.has(ref.url),
        `Site ${site.id} still points to generic root URL: ${ref.url}`
      );
    }
  }

  const craters = ANALOG_SITES.find((s) => s.id === 'craters-of-the-moon')!;
  assert.ok(
    craters.scientificReferences.some((r) => r.url === 'https://doi.org/10.1016/j.pss.2020.105091')
  );

  const rioTinto = ANALOG_SITES.find((s) => s.id === 'rio-tinto')!;
  assert.ok(
    rioTinto.scientificReferences.some((r) =>
      r.citation.includes('Amils, Fernández-Remolar')
    )
  );

  const nitinol = AEROSPACE_MATERIALS.find((m) => m.id === 'nitinol-spring-tire')!;
  assert.ok(nitinol.referenceCitation.includes('Naghipour, Padula II, Creager & Oravec (2023)'));

  const vectran = AEROSPACE_MATERIALS.find((m) => m.id === 'kevlar-vectran-bladder')!;
  assert.ok(vectran.referenceCitation.includes('Valle, Edgecombe & de la Fuente (2009)'));

  const svalbard = ANALOG_SITES.find((s) => s.id === 'svalbard-bockfjorden')!;
  assert.ok(
    svalbard.scientificReferences.some((r) => r.url === 'https://doi.org/10.1016/S0012-821X(02)00998-6')
  );
  assert.ok(
    svalbard.scientificReferences.some((r) => r.url === 'https://doi.org/10.1111/j.1945-5100.2007.tb00590.x')
  );

  const maunaKea = ANALOG_SITES.find((s) => s.id === 'mauna-kea')!;
  assert.ok(
    maunaKea.scientificReferences.some((r) => r.url === 'https://doi.org/10.1029/98EO00309')
  );
  assert.ok(
    maunaKea.scientificReferences.some((r) => r.url === 'https://doi.org/10.1029/91JB00940')
  );

  const ijen = ANALOG_SITES.find((s) => s.id === 'kawah-ijen')!;
  assert.ok(
    ijen.scientificReferences.some((r) => r.url === 'https://doi.org/10.1016/0016-7037(94)90023-X')
  );
  assert.ok(
    ijen.scientificReferences.some((r) => r.citation.includes('Löhr et al. (2004)'))
  );

  const mcmurdo = ANALOG_SITES.find((s) => s.id === 'mcmurdo-dry-valleys')!;
  assert.ok(
    mcmurdo.scientificReferences.some((r) => r.citation.includes('Salvatore & Levy (2021)'))
  );

  for (const site of ANALOG_SITES) {
    assert.equal(site.scoreComponents.length, 4);
    assert.deepEqual(
      site.scoreComponents.map((c) => c.id),
      ['geology', 'terrain', 'climate', 'validation']
    );
    const maxSum = site.scoreComponents.reduce((sum, c) => sum + c.maxPts, 0);
    assert.equal(maxSum, 100);
    for (const comp of site.scoreComponents) {
      assert.ok(
        comp.moonPts >= 0 && comp.moonPts <= comp.maxPts,
        `Out-of-bounds moonPts for ${site.id}.${comp.id}: ${comp.moonPts}`
      );
      assert.ok(
        comp.marsPts >= 0 && comp.marsPts <= comp.maxPts,
        `Out-of-bounds marsPts for ${site.id}.${comp.id}: ${comp.marsPts}`
      );
    }
  }
});

test('Dallol climate, temperatures, recalibrated scores, references, and comparison rounding are accurate', () => {
  const dallol = ANALOG_SITES.find((s) => s.id === 'dallol-danakil')!;
  const atacama = ANALOG_SITES.find((s) => s.id === 'atacama-yungay')!;

  assert.equal(dallol.fidelityInputs.aridity, 'Hiper-Arid / Beku');
  assert.equal(dallol.fidelityInputs.hasActiveLiquidWaterOrRain, true);
  assert.equal(dallol.temperatureProfile.avgC, 34.6);
  assert.equal(dallol.temperatureProfile.minC, 24.6);
  assert.equal(dallol.temperatureProfile.maxC, 49);

  // Recalibrated scores with hyper-arid climate (14) - active hydrothermal brine penalty (-4 Mars / -6.5 Moon) + hot temp (+2 Mars / +1 Moon)
  const dallolClimate = dallol.scoreComponents.find((c) => c.id === 'climate')!;
  assert.equal(dallolClimate.marsPts, 12);
  assert.equal(dallolClimate.moonPts, 8.5);
  assert.equal(dallol.marsSimilarityScore, 67.9);
  assert.equal(dallol.moonSimilarityScore, 32.1);
  assert.equal(dallol.similarityScore, 67.9);

  assert.ok(
    dallol.scientificReferences.some((r) => r.url === 'https://doi.org/10.3389/feart.2019.00351')
  );
  assert.ok(
    dallol.scientificReferences.some((r) => r.url === 'https://doi.org/10.1089/ast.2018.1926')
  );

  // Ensure no IEEE-754 floating point artifacts (e.g. 17.599999999999998) when comparing decimal temperatures
  const cmp = compareSites(dallol, atacama);
  assert.equal(cmp.tempDeltaAvgC, 17.6);
  assert.equal(cmp.tempDeltaMaxSwingC, 38);
});



