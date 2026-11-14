import { ANALOG_SITES, AnalogSite, TargetBody, TerrainBiome } from '../data/analogSites';
import { DATA_SOURCES, DataBodyFilter, DataSourceItem } from '../data/dataSources';

export type TargetFilter = 'All' | 'Moon' | 'Mars';

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
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

export function filterDataSources(
  sources: DataSourceItem[],
  bodyFilter: DataBodyFilter,
  query: string = ''
): DataSourceItem[] {
  const q = query.trim().toLowerCase();
  return sources.filter((src) => {
    if (bodyFilter !== 'Semua' && src.targetBody !== bodyFilter) return false;
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

export function getTopFindingSite(sites: AnalogSite[] = ANALOG_SITES): AnalogSite {
  return sites.find((s) => s.isTopFinding) ?? sites[0];
}

export function getSourcesForSite(site: AnalogSite): DataSourceItem[] {
  const idSet = new Set(site.dataSourceIds);
  return DATA_SOURCES.filter((src) => idSet.has(src.id));
}

export function getTargetBadgeLabel(body: TargetBody): string {
  if (body === 'Moon') return 'Analog Bulan';
  if (body === 'Mars') return 'Analog Mars';
  return 'Analog Bulan & Mars';
}
