import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  GitCompareArrows,
  Mountain,
  RefreshCw,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { MaterialCategory } from '../data/materials';
import { ComparisonNeed, compareSites } from '../utils/materialMatcher';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';
import { CartoonPageStickers } from './CartoonStickers';

interface CompareSitesPageProps {
  siteA: AnalogSite;
  siteB: AnalogSite;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onRepick: () => void;
  onExitCompare: () => void;
  onInspectMaterial: (materialId: string) => void;
}

const NEED_OPTIONS: Array<{ id: ComparisonNeed; label: string }> = [
  { id: 'all', label: 'Semua Kebutuhan Misi' },
  { id: 'Spacesuit & EVA', label: 'Spacesuit & EVA' },
  { id: 'Transportasi & Rover', label: 'Transportasi & Rover' },
  { id: 'Peralatan & Sensor', label: 'Peralatan & Sensor' },
  { id: 'Struktur & Habitat', label: 'Struktur & Habitat' },
];

export const CompareSitesPage: React.FC<CompareSitesPageProps> = ({
  siteA,
  siteB,
  visualStyle,
  colorTheme,
  onRepick,
  onExitCompare,
  onInspectMaterial,
}) => {
  const [need, setNeed] = useState<ComparisonNeed>('all');
  const tokens = getThemeTokens(visualStyle, colorTheme);

  const comparison = useMemo(
    () => compareSites(siteA, siteB, need),
    [siteA, siteB, need]
  );

  return (
    <section
      aria-label="Halaman Perbandingan Dua Lokasi Analog"
      data-testid="compare-sites-page"
      className={`w-full h-full overflow-y-auto earth-scroll pt-16 pb-24 transition-colors duration-200 ${tokens.pageCanvas}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pt-3">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onExitCompare}
                data-testid="close-compare-page"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${tokens.secondaryButton}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Peta</span>
              </button>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${tokens.accentText}`}>
                <GitCompareArrows className="w-4 h-4" />
                <span>Analisis Komparatif Lintas Situs Analog</span>
              </div>
            </div>
            <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${tokens.heading}`}>
              {siteA.name} <span className={tokens.highlighter}>vs</span> {siteB.name}
            </h1>
            <p className={`text-sm leading-relaxed ${tokens.bodyText}`}>
              {comparison.summaryVerdict}
            </p>
          </div>
          {tokens.isCartoon && (
            <CartoonPageStickers colorTheme={colorTheme} badgeText="PERBANDINGAN A vs B" />
          )}
        </div>

        {/* Mission Need Filter Bar */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold ${tokens.mutedText}`}>Kebutuhan Pengujian:</span>
            <div className={`flex flex-wrap items-center gap-1 p-1 rounded-lg ${tokens.pillGroup}`}>
              {NEED_OPTIONS.map((opt) => {
                const active = need === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setNeed(opt.id as 'all' | MaterialCategory)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      active ? tokens.pillActive : tokens.pillInactive
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onRepick}
            data-testid="repick-compare-btn"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs transition-colors whitespace-nowrap ${tokens.secondaryButton}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pilih Ulang 2 Lokasi di Peta</span>
          </button>
        </div>

        {/* Quick Delta KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 ${tokens.card}`}>
            <div className={`text-xs ${tokens.mutedText}`}>Selisih Suhu Rata-Rata</div>
            <div className={`text-2xl font-mono-tabular font-bold mt-1 ${tokens.heading}`}>
              Δ {comparison.tempDeltaAvgC}°C
            </div>
            <div className={`text-xs mt-0.5 ${tokens.mutedText}`}>
              {siteA.temperatureProfile.avgC}°C vs {siteB.temperatureProfile.avgC}°C
            </div>
          </div>
          <div className={`p-4 ${tokens.card}`}>
            <div className={`text-xs ${tokens.mutedText}`}>Ayunan Suhu Terlebar</div>
            <div className={`text-2xl font-mono-tabular font-bold mt-1 ${tokens.heading}`}>
              {comparison.tempDeltaMaxSwingC}°C
            </div>
            <div className={`text-xs mt-0.5 ${tokens.mutedText}`}>
              Perlu kompensasi isolator/konduktor termal
            </div>
          </div>
          <div className={`p-4 ${tokens.card}`}>
            <div className={`text-xs ${tokens.mutedText}`}>Material Cocok Lintas Situs</div>
            <div className={`text-2xl font-mono-tabular font-bold mt-1 ${tokens.accentText}`}>
              {comparison.sharedMaterials.length} Material
            </div>
            <div className={`text-xs mt-0.5 truncate ${tokens.mutedText}`}>
              {comparison.sharedMaterials.length > 0
                ? comparison.sharedMaterials.map((m) => m.name.split('(')[0].trim()).join(', ')
                : 'Butuh paket material spesifik lokasi'}
            </div>
          </div>
        </div>

        {/* Two-Column Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {[
            { label: 'Lokasi A', site: siteA, recs: comparison.topMaterialsA },
            { label: 'Lokasi B', site: siteB, recs: comparison.topMaterialsB },
          ].map(({ label, site, recs }) => (
            <div key={site.id} className={`p-5 flex flex-col gap-4 ${tokens.card}`}>
              {/* Site Header */}
              <div className={`pb-3 border-b ${tokens.divider}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${tokens.accentText}`}>
                    {label} · {site.targetBody}
                  </span>
                  <span className={`text-xs font-mono-tabular font-bold ${tokens.heading}`}>
                    {site.similarityScore.toFixed(1)}% kecocokan
                  </span>
                </div>
                <h2 className={`font-display text-lg font-bold mt-1 ${tokens.heading}`}>
                  {site.name}
                </h2>
                <p className={`text-xs ${tokens.mutedText}`}>
                  {site.region}, {site.country} · {site.elevationM.toLocaleString('id-ID')} m mdpl
                </p>
              </div>

              {/* Temperature */}
              <div className={`p-3.5 space-y-1 ${tokens.subCard}`}>
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
                  <Thermometer className="w-3.5 h-3.5" />
                  Temperatur Terdeteksi
                </div>
                <div className={`text-xs font-mono-tabular font-medium ${tokens.heading}`}>
                  Rata-rata {site.temperatureProfile.avgC}°C (Min {site.temperatureProfile.minC}°C / Maks {site.temperatureProfile.maxC}°C)
                </div>
                <p className={`text-xs leading-relaxed ${tokens.bodyText}`}>
                  {site.temperatureProfile.note}
                </p>
              </div>

              {/* Terrain */}
              <div className={`p-3.5 space-y-1 ${tokens.subCard}`}>
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
                  <Mountain className="w-3.5 h-3.5" />
                  Kondisi Terrain & pH
                </div>
                <div className={`text-xs font-medium ${tokens.heading}`}>
                  {site.terrainProfile.surfaceType}
                </div>
                <div className={`text-xs font-mono-tabular ${tokens.mutedText}`}>
                  {site.terrainProfile.roughness} · Lereng {site.terrainProfile.slopeRange} · pH {site.terrainProfile.acidityPh}
                </div>
                <p className={`text-xs leading-relaxed ${tokens.bodyText}`}>
                  {site.terrainProfile.description}
                </p>
              </div>

              {/* Seasonal Window */}
              <div className={`p-3.5 space-y-1 ${tokens.subCard}`}>
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  Musim Uji Terbaik
                </div>
                <div className={`text-xs font-medium ${tokens.heading}`}>
                  {site.seasonalRecommendation.bestWindow}
                </div>
                <p className={`text-xs leading-relaxed ${tokens.bodyText}`}>
                  {site.seasonalRecommendation.climateCondition} — {site.seasonalRecommendation.recommendedTests[0]}
                </p>
              </div>

              {/* Top Materials for Selected Need */}
              <div className="space-y-2.5 flex-1">
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${tokens.accentText}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Rekomendasi Material ({recs.length})
                </div>
                <div className="space-y-2">
                  {recs.map((rec) => {
                    const isShared = comparison.sharedMaterialIds.includes(rec.material.id);
                    return (
                      <button
                        key={rec.material.id}
                        type="button"
                        onClick={() => onInspectMaterial(rec.material.id)}
                        className={`w-full text-left p-3 transition-colors ${tokens.subCard} ${
                          tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-semibold ${tokens.heading}`}>
                            #{rec.rank} {rec.material.name}
                          </span>
                          <span className={`text-xs font-mono-tabular font-semibold ${tokens.accentText}`}>
                            {rec.score}%{isShared ? ' · Lintas Situs' : ''}
                          </span>
                        </div>
                        <div className={`text-[11px] mt-1 ${tokens.bodyText}`}>
                          {rec.fitReason}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <span className={`text-xs ${tokens.mutedText}`}>
            Klik salah satu material untuk berpindah ke halaman Info Material dan melihat detail fisikanya.
          </span>
          <button
            type="button"
            onClick={onExitCompare}
            className={`px-4 py-2 rounded-lg text-xs transition-colors ${tokens.primaryButton}`}
          >
            Selesai & Kembali ke Peta
          </button>
        </div>
      </div>
    </section>
  );
};
