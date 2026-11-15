import { ANALOG_SITES, AnalogSite, TargetBody, TerrainBiome } from '../data/analogSites';
import { DATA_SOURCES, DataBodyFilter, DataSourceItem } from '../data/dataSources';

export type TargetFilter = 'All' | 'Moon' | 'Mars';

export function getEffectiveSimilarityScore(
  site: AnalogSite,
  targetFilter: TargetFilter = 'All'
): number {
  if (targetFilter === 'Moon') return site.moonSimilarityScore;
  if (targetFilter === 'Mars') return site.marsSimilarityScore;
  return site.similarityScore;
}

export function filterAnalogSites(
  sites: AnalogSite[],
  options: {
    query?: string;
    targetFilter?: TargetFilter;
    biomeFilter?: TerrainBiome | 'All';
  }
): AnalogSite[] {
  const q = (options.query ?? '').trim().toLowerCase();
  const target = options.targetFilter ?? 'All';
  const biome = options.biomeFilter ?? 'All';

  return sites
    .filter((site) => {
      if (target === 'Moon') {
        if (site.targetBody !== 'Moon' && site.targetBody !== 'Moon & Mars') return false;
      } else if (target === 'Mars') {
        if (site.targetBody !== 'Mars' && site.targetBody !== 'Moon & Mars') return false;
      }

      if (biome !== 'All' && site.biome !== biome) {
        return false;
      }

      if (q.length > 0) {
        const haystack = [
          site.name,
          site.region,
          site.country,
          site.targetBody,
          site.planetaryCounterpart,
          site.biome,
          site.summary,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      }
      return true;
    })
    .sort((a, b) => getEffectiveSimilarityScore(b, target) - getEffectiveSimilarityScore(a, target));
}

export function filterDataSources(
  sources: DataSourceItem[],
  bodyFilter: DataBodyFilter,
  query: string = ''
): DataSourceItem[] {
  const q = query.trim().toLowerCase();
  return sources.filter((src) => {
    if (bodyFilter !== 'All' && src.targetBody !== bodyFilter) return false;
    if (!q) return true;
    return [
      src.agency,
      src.missionOrPlatform,
      src.instrument,
      src.variablesExtracted,
      src.roleInAnalysis,
      src.datasetIdentifier,
    ]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}

export function getTopFindingSite(
  sites: AnalogSite[] = ANALOG_SITES,
  targetFilter: TargetFilter = 'All'
): AnalogSite {
  if (sites.length === 0) return ANALOG_SITES[0];
  if (targetFilter === 'Moon' || targetFilter === 'Mars') {
    const sorted = [...sites].sort(
      (a, b) => getEffectiveSimilarityScore(b, targetFilter) - getEffectiveSimilarityScore(a, targetFilter)
    );
    return sorted[0];
  }
  return sites.find((s) => s.isTopFinding) ?? sites[0];
}

export function getSourcesForSite(site: AnalogSite): DataSourceItem[] {
  const idSet = new Set(site.dataSourceIds);
  return DATA_SOURCES.filter((src) => idSet.has(src.id));
}

export function getTargetBadgeLabel(body: TargetBody): string {
  if (body === 'Moon') return 'Moon Analog';
  if (body === 'Mars') return 'Mars Analog';
  return 'Moon & Mars Analog';
}
