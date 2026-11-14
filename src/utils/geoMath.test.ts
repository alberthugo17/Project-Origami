import test from 'node:test';
import assert from 'node:assert/strict';
import {
  latLonToVector3,
  vector3ToLatLon,
  formatDMS,
  formatCoordinatesDMS,
  distanceToAltitudeKm,
  altitudeKmToDistance,
  rangeMetersToAltitudeKm,
  altitudeKmToRangeMeters,
  altitudeKmToZoom,
  zoomToAltitudeKm,
  normalizeHeadingDeg,
  computeScaleBar,
  haversineDistanceKm,
} from './geoMath';
import {
  filterAnalogSites,
  filterDataSources,
  getTopFindingSite,
  getSourcesForSite,
} from './analogFilter';
import { ANALOG_SITES } from '../data/analogSites';
import { DATA_SOURCES } from '../data/dataSources';
import { AEROSPACE_MATERIALS } from '../data/materials';
import { recommendTopMaterials, compareSites } from './materialMatcher';

test('latLonToVector3 and vector3ToLatLon round-trip accurately for key coordinates', () => {
  const samples = [
    { lat: 0, lon: 0 },
    { lat: -7.9425, lon: 112.953 }, // Gunung Bromo
    { lat: -24.0833, lon: -69.9167 }, // Atacama
    { lat: 75.3833, lon: -89.6833 }, // Haughton Crater
    { lat: -77.4667, lon: 162.5167 }, // McMurdo
    { lat: 36.5054, lon: -117.0794 }, // Death Valley
  ];

  for (const s of samples) {
    const v = latLonToVector3(s.lat, s.lon, 1.0);
    const len = Math.hypot(v.x, v.y, v.z);
    assert.ok(Math.abs(len - 1.0) < 1e-6, 'Vector should lie on unit sphere');
    const back = vector3ToLatLon(v);
    assert.ok(Math.abs(back.lat - s.lat) < 1e-4, `Lat mismatch for ${s.lat}: ${back.lat}`);
    assert.ok(Math.abs(back.lon - s.lon) < 1e-4, `Lon mismatch for ${s.lon}: ${back.lon}`);
  }
});

test('Prime Meridian and Equator map to expected spherical axes', () => {
  const prime = latLonToVector3(0, 0, 1);
  assert.ok(Math.abs(prime.x - 1) < 1e-6);
  assert.ok(Math.abs(prime.y) < 1e-6);
  assert.ok(Math.abs(prime.z) < 1e-6);

  const west90 = latLonToVector3(0, -90, 1);
  assert.ok(Math.abs(west90.x) < 1e-6);
  assert.ok(Math.abs(west90.z - 1) < 1e-6);

  const northPole = latLonToVector3(90, 0, 1);
  assert.ok(Math.abs(northPole.y - 1) < 1e-6);
});

test('formatDMS and formatCoordinatesDMS produce Google Earth style strings', () => {
  assert.equal(formatDMS(-7.9425, true), `7°56'33.00"S`);
  assert.equal(formatDMS(112.953, false), `112°57'10.80"E`);
  assert.equal(formatDMS(69.9999999, false), `70°00'00.00"E`);
  assert.equal(
    formatCoordinatesDMS(-7.9425, 112.953),
    `7°56'33.00"S 112°57'10.80"E`
  );
});

test('altitude conversions for 3D range and 2D zoom stay bounded and consistent', () => {
  const dist = altitudeKmToDistance(19370);
  const alt = distanceToAltitudeKm(dist);
  assert.equal(alt, 19370);

  assert.equal(altitudeKmToRangeMeters(19370), 19_370_000);
  assert.equal(rangeMetersToAltitudeKm(19_370_000), 19370);
  assert.equal(rangeMetersToAltitudeKm(5500), 5.5);

  const zGlobal = altitudeKmToZoom(19370);
  assert.ok(zGlobal >= 2 && zGlobal <= 3, `Expected global zoom ~2.2, got ${zGlobal}`);
  const zLocal = altitudeKmToZoom(24);
  assert.ok(zLocal >= 11 && zLocal <= 13, `Expected caldera zoom ~11.9, got ${zLocal}`);
  assert.ok(zoomToAltitudeKm(12) > 10 && zoomToAltitudeKm(12) < 40);
});

test('normalizeHeadingDeg wraps headings cleanly to [-180, 180)', () => {
  assert.equal(normalizeHeadingDeg(0), 0);
  assert.equal(normalizeHeadingDeg(360), 0);
  assert.equal(normalizeHeadingDeg(270), -90);
  assert.equal(normalizeHeadingDeg(-270), 90);
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

test('haversineDistanceKm calculates realistic Earth distances', () => {
  const bromoToIjen = haversineDistanceKm(-7.9425, 112.953, -8.0583, 114.2417);
  assert.ok(bromoToIjen > 135 && bromoToIjen < 150, `Expected ~142 km, got ${bromoToIjen}`);
});

test('filterAnalogSites finds Gunung Bromo as top finding and filters by target/query', () => {
  const top = getTopFindingSite(ANALOG_SITES);
  assert.equal(top.id, 'gunung-bromo');

  const bromoSearch = filterAnalogSites(ANALOG_SITES, { query: 'Bromo' });
  assert.equal(bromoSearch.length, 1);
  assert.equal(bromoSearch[0].id, 'gunung-bromo');

  const moonOnly = filterAnalogSites(ANALOG_SITES, { targetFilter: 'Moon' });
  assert.ok(moonOnly.every((s) => s.targetBody === 'Moon' || s.targetBody === 'Moon & Mars'));
  assert.ok(moonOnly.some((s) => s.id === 'gunung-bromo'));
  assert.ok(moonOnly.some((s) => s.id === 'craters-of-the-moon'));
  assert.ok(!moonOnly.some((s) => s.id === 'atacama-yungay'));
});

test('filterDataSources and getSourcesForSite resolve valid citations', () => {
  const top = getTopFindingSite(ANALOG_SITES);
  const citations = getSourcesForSite(top);
  assert.ok(citations.length >= 4, 'Top finding should cite at least 4 datasets');

  const marsSources = filterDataSources(DATA_SOURCES, 'Mars');
  assert.ok(marsSources.length >= 3);
  assert.ok(marsSources.every((s) => s.targetBody === 'Mars'));
});

test('all 14 analog sites have consistent temperature, terrain, and seasonal data', () => {
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
});
