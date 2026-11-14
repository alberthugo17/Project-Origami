import React from 'react';
import {
  AlertTriangle,
  Database,
  Layers,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { formatCoordinatesDMS } from '../utils/geoMath';
import { getSourcesForSite, getTargetBadgeLabel } from '../utils/analogFilter';

interface SiteAnalysisPanelProps {
  site: AnalogSite;
  onClose: () => void;
  onZoomCloser: (site: AnalogSite) => void;
  onOpenDataSources: () => void;
}

export const SiteAnalysisPanel: React.FC<SiteAnalysisPanelProps> = ({
  site,
  onClose,
  onZoomCloser,
  onOpenDataSources,
}) => {
  const citations = getSourcesForSite(site);

  return (
    <aside
      aria-label={`Detail analisis analog ${site.name}`}
      data-testid="site-analysis-panel"
      className="w-[396px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-208px)] flex flex-col rounded-xl bg-[#1f2023]/60 backdrop-blur-md border border-white/12 shadow-2xl overflow-hidden text-[#e8eaed]"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3.5 border-b border-white/10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#9aa0a6] flex-wrap">
            <span className="text-[#8ab4f8] font-medium">
              {getTargetBadgeLabel(site.targetBody)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{site.biome}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular text-white font-semibold">
              {site.similarityScore.toFixed(1)}% kecocokan
            </span>
          </div>
          <h2 className="font-display text-lg font-semibold text-white mt-1 leading-snug">
            {site.name}
          </h2>
          <p className="text-xs text-[#9aa0a6] mt-0.5">
            {site.region}, {site.country} · Target: {site.planetaryCounterpart}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panel detail analisis"
          data-testid="close-site-panel"
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Scientific Content */}
      <div className="flex-1 overflow-y-auto earth-scroll px-5 py-4 space-y-5">
        {/* Coordinates & Elevation strip */}
        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="text-[11px] text-[#9aa0a6]">Koordinat Geografis</div>
            <div className="text-xs font-mono-tabular text-white mt-0.5">
              {formatCoordinatesDMS(site.lat, site.lon)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#9aa0a6]">Elevasi Permukaan</div>
            <div className="text-xs font-mono-tabular text-white mt-0.5">
              {site.elevationM.toLocaleString('id-ID')} m mdpl
            </div>
          </div>
        </div>

        {/* Summary & Geological Rationale */}
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-[#8ab4f8] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Karakterisasi Geologi & Lingkungan
          </h3>
          <p className="text-xs text-[#e8eaed] leading-relaxed">{site.summary}</p>
          <p className="text-xs text-[#bdc1c6] leading-relaxed">{site.geologicalRationale}</p>
        </section>

        {/* Comparative Metrics Matrix */}
        <section className="space-y-2.5">
          <h3 className="text-xs font-semibold text-[#8ab4f8]">
            Perbandingan Parameter Bumi vs {site.targetBody}
          </h3>
          <div className="divide-y divide-white/10 border border-white/10 rounded-lg overflow-hidden bg-black/25">
            {site.comparativeMetrics.map((m) => (
              <div key={m.parameter} className="p-3 space-y-1">
                <div className="text-xs font-medium text-white">{m.parameter}</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#9aa0a6] block">Situs Bumi:</span>
                    <span className="text-[#e8eaed] font-mono-tabular">{m.earthValue}</span>
                  </div>
                  <div>
                    <span className="text-[#9aa0a6] block">Acuan Planet:</span>
                    <span className="text-[#fde68a] font-mono-tabular">{m.planetaryBenchmark}</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#9aa0a6] pt-0.5">{m.matchNote}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Testing Applications */}
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-[#8ab4f8] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Aplikasi Uji Peralatan & Misi
          </h3>
          <ul className="space-y-1.5 text-xs text-[#d2d5da] list-disc pl-4">
            {site.missionApplications.map((app, i) => (
              <li key={i} className="leading-relaxed">
                {app}
              </li>
            ))}
          </ul>
        </section>

        {/* Operational Hazards */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Kendala & Batasan Lapangan
          </h3>
          <ul className="space-y-1 text-xs text-[#bdc1c6] list-disc pl-4">
            {site.hazardsAndConstraints.map((h, i) => (
              <li key={i} className="leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Specific Datasets Used */}
        <section className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#e8eaed] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#8ab4f8]" />
              Sumber Data Analisis ({citations.length})
            </h3>
            <button
              type="button"
              onClick={onOpenDataSources}
              className="text-[11px] text-[#8ab4f8] hover:underline whitespace-nowrap"
            >
              Lihat semua sumber
            </button>
          </div>
          <div className="space-y-1.5">
            {citations.map((src) => (
              <div
                key={src.id}
                className="text-[11px] text-[#bdc1c6] py-1.5 px-2.5 rounded bg-white/[0.04] border border-white/5"
              >
                <span className="font-medium text-white">{src.agency}</span>
                <span aria-hidden="true"> · </span>
                <span>{src.missionOrPlatform}</span>
                <div className="text-[10px] text-[#9aa0a6] font-mono-tabular mt-0.5">
                  {src.instrument} ({src.resolution})
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 border-t border-white/10 bg-black/20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onZoomCloser(site)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#171717] text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5" />
          Zoom Dekat
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 rounded-lg border border-white/15 text-xs text-[#e8eaed] hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          Tutup
        </button>
      </div>
    </aside>
  );
};
