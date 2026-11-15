import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Database,
  ExternalLink,
  Layers,
  MapPin,
  Mountain,
  Navigation,
  ShieldCheck,
  Thermometer,
  X,
} from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { AEROSPACE_MATERIALS } from '../data/materials';
import { formatCoordinatesDMS } from '../utils/geoMath';
import { getSourcesForSite } from '../utils/analogFilter';
import { getMaterialScoreBand, recommendTopMaterials } from '../utils/materialMatcher';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';

interface SiteAnalysisPanelProps {
  site: AnalogSite;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onClose: () => void;
  onZoomCloser: (site: AnalogSite) => void;
  onOpenDataSources: () => void;
  onInspectMaterial: (materialId: string, siteId: string) => void;
}

export const SiteAnalysisPanel: React.FC<SiteAnalysisPanelProps> = ({
  site,
  visualStyle,
  colorTheme,
  onClose,
  onZoomCloser,
  onOpenDataSources,
  onInspectMaterial,
}) => {
  const citations = getSourcesForSite(site);
  const top5Materials = useMemo(
    () => recommendTopMaterials(site, AEROSPACE_MATERIALS, 5),
    [site]
  );
  const tokens = getThemeTokens(visualStyle, colorTheme);
  const defaultBreakdownTarget: 'Moon' | 'Mars' =
    site.targetBody === 'Moon'
      ? 'Moon'
      : site.targetBody === 'Mars'
        ? 'Mars'
        : site.moonSimilarityScore >= site.marsSimilarityScore
          ? 'Moon'
          : 'Mars';
  const [breakdownTarget, setBreakdownTarget] = useState<'Moon' | 'Mars'>(defaultBreakdownTarget);
  const activeBreakdownTarget: 'Moon' | 'Mars' =
    site.targetBody === 'Moon'
      ? 'Moon'
      : site.targetBody === 'Mars'
        ? 'Mars'
        : breakdownTarget;

  return (
    <aside
      aria-label={`Analog analysis details for ${site.name}`}
      data-testid="site-analysis-panel"
      className={`w-[412px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-225px)] sm:max-h-[calc(100vh-175px)] flex flex-col overflow-hidden transition-colors duration-200 ${tokens.panel}`}
    >
      {/* Header */}
      <div className={`px-5 pt-4 pb-3.5 border-b flex items-start justify-between gap-3 ${tokens.divider}`}>
        <div className="min-w-0">
          <div className={`flex items-center gap-x-2 gap-y-1 text-xs flex-wrap ${tokens.mutedText}`}>
            <span className={`font-semibold ${tokens.accentText}`}>
              Primary Target:{' '}
              {site.targetBody === 'Moon'
                ? 'Moon'
                : site.targetBody === 'Mars'
                  ? 'Mars'
                  : 'Moon & Mars (Dual Analog)'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{site.biome}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-medium ${tokens.heading}`}>{site.validationStatus}</span>
          </div>
          <div className={`mt-1 flex items-center gap-1.5 text-[11px] font-mono-tabular flex-wrap ${tokens.heading}`}>
            <span className={tokens.mutedText}>Comparative:</span>
            <span className="font-semibold whitespace-nowrap">🌙 Moon {site.moonSimilarityScore.toFixed(1)}%</span>
            <span aria-hidden="true" className={tokens.mutedText}>·</span>
            <span className="font-semibold whitespace-nowrap">🪐 Mars {site.marsSimilarityScore.toFixed(1)}%</span>
          </div>
          <h2 className={`font-display text-lg font-semibold mt-1 leading-snug ${tokens.heading}`}>
            {site.name}
          </h2>
          <p className={`text-xs mt-0.5 ${tokens.mutedText}`}>
            {site.region}, {site.country} · Target: {site.planetaryCounterpart}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close analysis details panel"
          data-testid="close-site-panel"
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${tokens.mutedText} ${
            tokens.isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-black/5'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Scientific Content */}
      <div className="flex-1 overflow-y-auto earth-scroll px-5 py-4 space-y-5">
        {/* Coordinates, Elevation & Temperature Strip */}
        <div className={`grid grid-cols-3 gap-2.5 pb-4 border-b ${tokens.divider}`}>
          <div>
            <div className={`text-[11px] ${tokens.mutedText}`}>Coordinates</div>
            <div className={`text-[11px] font-mono-tabular mt-0.5 ${tokens.heading}`}>
              {formatCoordinatesDMS(site.lat, site.lon)}
            </div>
          </div>
          <div>
            <div className={`text-[11px] ${tokens.mutedText}`}>Elevation</div>
            <div className={`text-xs font-mono-tabular mt-0.5 ${tokens.heading}`}>
              {site.elevationM.toLocaleString('en-US')} m a.s.l.
            </div>
          </div>
          <div>
            <div className={`text-[11px] flex items-center gap-1 ${tokens.mutedText}`}>
              <Thermometer className="w-3 h-3" />
              Average Temperature
            </div>
            <div className={`text-xs font-mono-tabular font-semibold mt-0.5 ${tokens.accentText}`}>
              {site.temperatureProfile.avgC}°C ({site.temperatureProfile.minC}°..{site.temperatureProfile.maxC}°C)
            </div>
          </div>
        </div>

        {/* Temperature Detail */}
        <section className={`p-3 space-y-1.5 ${tokens.subCard}`} data-testid="site-temperature-section">
          <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
            <Thermometer className="w-3.5 h-3.5" />
            Detected Temperature Profile
          </h3>
          <div className={`flex items-center gap-3 text-xs font-mono-tabular ${tokens.heading}`}>
            <span>Average: {site.temperatureProfile.avgC}°C</span>
            <span aria-hidden="true">·</span>
            <span>Min: {site.temperatureProfile.minC}°C</span>
            <span aria-hidden="true">·</span>
            <span>Max: {site.temperatureProfile.maxC}°C</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${tokens.bodyText}`}>
            {site.temperatureProfile.note}
          </p>
        </section>

        {/* Terrain Condition */}
        <section className={`p-3 space-y-2 ${tokens.subCard}`} data-testid="site-terrain-section">
          <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
            <Mountain className="w-3.5 h-3.5" />
            Terrain Conditions & Surface Chemistry
          </h3>
          <div className={`text-xs font-medium ${tokens.heading}`}>
            {site.terrainProfile.surfaceType}
          </div>
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono-tabular ${tokens.mutedText}`}>
            <span>Roughness: {site.terrainProfile.roughness}</span>
            <span aria-hidden="true">·</span>
            <span>Slope: {site.terrainProfile.slopeRange}</span>
            <span aria-hidden="true">·</span>
            <span>pH: {site.terrainProfile.acidityPh}</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${tokens.bodyText}`}>
            {site.terrainProfile.description}
          </p>
        </section>

        {/* Seasonal & Climate Mission Window */}
        <section className={`p-3 space-y-2 ${tokens.subCard}`} data-testid="site-seasonal-section">
          <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
            <Calendar className="w-3.5 h-3.5" />
            Mission Recommendations & Best Season
          </h3>
          <div className={`text-xs font-semibold ${tokens.heading}`}>
            Optimal Window: {site.seasonalRecommendation.bestWindow}
          </div>
          <p className={`text-[11px] leading-relaxed ${tokens.bodyText}`}>
            {site.seasonalRecommendation.climateCondition}
          </p>
          <ul className={`space-y-1 text-[11px] list-disc pl-4 ${tokens.bodyText}`}>
            {site.seasonalRecommendation.recommendedTests.map((t, i) => (
              <li key={i} className="leading-relaxed">
                {t}
              </li>
            ))}
          </ul>
          <p className={`text-[11px] ${tokens.mutedText}`}>
            Avoid: {site.seasonalRecommendation.avoidWindow}
          </p>
        </section>

        {/* Top 5 Material Recommendations */}
        <section className="space-y-2.5" data-testid="site-top5-materials">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Top 5 Mission Material Recommendations
            </h3>
            <span className={`text-[11px] font-mono-tabular ${tokens.mutedText}`}>
              Multi-factor score (max 92%)
            </span>
          </div>
          <div className="space-y-2">
            {top5Materials.map((rec) => {
              const band = getMaterialScoreBand(rec.score);
              return (
              <button
                key={rec.material.id}
                type="button"
                onClick={() => onInspectMaterial(rec.material.id, site.id)}
                className={`w-full text-left p-2.5 transition-colors ${tokens.card} ${
                  tokens.isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${tokens.heading}`}>
                    #{rec.rank} {rec.material.name}
                  </span>
                  <span className={`text-[11px] font-mono-tabular font-semibold shrink-0 ${band.textClass}`}>
                    {rec.score}% · {band.label}
                  </span>
                </div>
                <div className={`text-[11px] mt-0.5 flex flex-wrap items-center gap-x-2 ${tokens.mutedText}`}>
                  <span>{rec.recommendedRole}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rec.material.thermalConductivityType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rec.material.weightClass}</span>
                </div>
                <p className={`text-[11px] mt-1 leading-snug ${tokens.bodyText}`}>
                  {rec.fitReason}
                </p>
              </button>
              );
            })}
          </div>
        </section>

        {/* Summary, Geological Rationale & 4-Component Visual Score Breakdown */}
        <section className="space-y-2.5" data-testid="site-score-breakdown">
          <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
            <Layers className="w-3.5 h-3.5" />
            Geological & Environmental Characterization
          </h3>
          <p className={`text-xs leading-relaxed ${tokens.heading}`}>{site.summary}</p>
          <p className={`text-xs leading-relaxed ${tokens.bodyText}`}>{site.geologicalRationale}</p>

          <div className={`p-3 space-y-2.5 ${tokens.subCard}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.heading}`}>
                <BarChart3 className={`w-3.5 h-3.5 ${tokens.accentText}`} />
                <span>Analog Score Breakdown (4 Components)</span>
              </div>
              {site.targetBody === 'Moon & Mars' ? (
                <div className={`flex items-center gap-0.5 p-0.5 rounded-md ${tokens.pillGroup}`} role="group" aria-label="Select score breakdown target">
                  {(['Moon', 'Mars'] as const).map((t) => {
                    const active = activeBreakdownTarget === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBreakdownTarget(t)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          active ? tokens.pillActive : tokens.pillInactive
                        }`}
                      >
                        {t === 'Moon' ? '🌙 Moon' : '🪐 Mars'}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className={`text-[10px] font-mono-tabular font-semibold ${tokens.accentText}`}>
                  Target: {activeBreakdownTarget === 'Moon' ? '🌙 Moon' : '🪐 Mars'}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {site.scoreComponents.map((comp) => {
                const pts = activeBreakdownTarget === 'Moon' ? comp.moonPts : comp.marsPts;
                const pct = Math.max(0, Math.min(100, Math.round((pts / comp.maxPts) * 100)));
                const barColor =
                  pct >= 75
                    ? 'bg-emerald-500'
                    : pct >= 50
                      ? 'bg-sky-500'
                      : pct >= 25
                        ? 'bg-amber-500'
                        : 'bg-rose-500';
                return (
                  <div key={comp.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className={tokens.bodyText}>{comp.label}</span>
                      <span className={`font-mono-tabular font-semibold ${tokens.heading}`}>
                        {pts.toFixed(1)} / {comp.maxPts}
                      </span>
                    </div>
                    <div
                      className={`w-full h-1.5 rounded-full overflow-hidden ${
                        tokens.isDark ? 'bg-white/10' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className={`text-[10px] font-mono-tabular leading-relaxed pt-1 border-t ${tokens.divider} ${tokens.mutedText}`}>
              {site.scoreBreakdown}
            </p>
          </div>
        </section>

        {/* Comparative Metrics Matrix */}
        <section className="space-y-2.5">
          <h3 className={`text-xs font-semibold ${tokens.accentText}`}>
            Earth vs {site.targetBody} Parameter Comparison
          </h3>
          <div className={`overflow-hidden ${tokens.card}`}>
            {site.comparativeMetrics.map((m) => (
              <div key={m.parameter} className={`p-3 space-y-1 border-b last:border-b-0 ${tokens.divider}`}>
                <div className={`text-xs font-medium ${tokens.heading}`}>{m.parameter}</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className={`block ${tokens.mutedText}`}>Earth Site:</span>
                    <span className={`font-mono-tabular ${tokens.bodyText}`}>{m.earthValue}</span>
                  </div>
                  <div>
                    <span className={`block ${tokens.mutedText}`}>Planetary Benchmark:</span>
                    <span className={`font-mono-tabular font-medium ${tokens.accentText}`}>{m.planetaryBenchmark}</span>
                  </div>
                </div>
                <div className={`text-[11px] pt-0.5 ${tokens.mutedText}`}>{m.matchNote}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Testing Applications */}
        <section className="space-y-2">
          <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
            <MapPin className="w-3.5 h-3.5" />
            Equipment & Mission Testing Applications
          </h3>
          <ul className={`space-y-1.5 text-xs list-disc pl-4 ${tokens.bodyText}`}>
            {site.missionApplications.map((app, i) => (
              <li key={i} className="leading-relaxed">
                {app}
              </li>
            ))}
          </ul>
        </section>

        {/* Operational Hazards */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold text-amber-500 dark:text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Field Constraints & Limitations
          </h3>
          <ul className={`space-y-1 text-xs list-disc pl-4 ${tokens.bodyText}`}>
            {site.hazardsAndConstraints.map((h, i) => (
              <li key={i} className="leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Specific Datasets Used */}
        <section className={`space-y-2 pt-2 border-t ${tokens.divider}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.heading}`}>
              <Database className={`w-3.5 h-3.5 ${tokens.accentText}`} />
              Analysis Data Sources ({citations.length})
            </h3>
            <button
              type="button"
              onClick={onOpenDataSources}
              className={`text-[11px] hover:underline whitespace-nowrap ${tokens.accentText}`}
            >
              View all sources
            </button>
          </div>
          <div className="space-y-1.5">
            {citations.map((src) => (
              <div
                key={src.id}
                className={`text-[11px] py-1.5 px-2.5 ${tokens.subCard} ${tokens.bodyText}`}
              >
                <span className={`font-medium ${tokens.heading}`}>{src.agency}</span>
                <span aria-hidden="true"> · </span>
                <span>{src.missionOrPlatform}</span>
                <div className={`text-[10px] font-mono-tabular mt-0.5 ${tokens.mutedText}`}>
                  {src.instrument} ({src.resolution})
                </div>
              </div>
            ))}
          </div>

          {site.scientificReferences.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <div className={`text-[11px] font-semibold ${tokens.heading}`}>
                Journal References & Scientific Publications ({site.scientificReferences.length})
              </div>
              {site.scientificReferences.map((ref) => (
                <a
                  key={ref.url + ref.citation}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start justify-between gap-2 text-[11px] py-1.5 px-2.5 transition-colors ${tokens.subCard} ${tokens.bodyText} ${
                    tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  }`}
                >
                  <span className="leading-snug">{ref.citation}</span>
                  <ExternalLink className={`w-3 h-3 shrink-0 mt-0.5 ${tokens.accentText}`} />
                </a>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer Actions */}
      <div className={`px-5 py-3 border-t flex items-center gap-2 ${tokens.divider}`}>
        <button
          type="button"
          onClick={() => onZoomCloser(site)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${tokens.primaryButton}`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Zoom Closer
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`px-3.5 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${tokens.secondaryButton}`}
        >
          Close
        </button>
      </div>
    </aside>
  );
};
