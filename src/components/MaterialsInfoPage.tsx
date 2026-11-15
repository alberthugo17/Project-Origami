import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Flame,
  Layers,
  Search,
  Shield,
  Thermometer,
  Weight,
  Zap,
} from 'lucide-react';
import { ANALOG_SITES } from '../data/analogSites';
import { AEROSPACE_MATERIALS, MaterialCategory } from '../data/materials';
import { getMaterialScoreBand, scoreMaterialForSite } from '../utils/materialMatcher';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';
import { CartoonPageStickers } from './CartoonStickers';

interface MaterialsInfoPageProps {
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  initialMaterialId?: string | null;
  initialSiteId?: string | null;
  backLabel?: string;
  onBackToMap: () => void;
}

const CATEGORIES: Array<'Semua' | MaterialCategory> = [
  'Semua',
  'Spacesuit & EVA',
  'Peralatan & Sensor',
  'Transportasi & Rover',
  'Struktur & Habitat',
];

export const MaterialsInfoPage: React.FC<MaterialsInfoPageProps> = ({
  visualStyle,
  colorTheme,
  initialMaterialId = null,
  initialSiteId = null,
  backLabel = 'Kembali ke Peta',
  onBackToMap,
}) => {
  const [category, setCategory] = useState<'Semua' | MaterialCategory>('Semua');
  const [query, setQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(() =>
    initialSiteId && ANALOG_SITES.some((s) => s.id === initialSiteId)
      ? initialSiteId
      : ANALOG_SITES[0].id
  );
  const [isSitePopupOpen, setIsSitePopupOpen] = useState(false);

  useEffect(() => {
    if (initialSiteId && ANALOG_SITES.some((s) => s.id === initialSiteId)) {
      setSelectedSiteId(initialSiteId);
    }
  }, [initialSiteId]);

  useEffect(() => {
    if (!initialMaterialId) return;
    setCategory('Semua');
    setQuery('');
    const timer = window.setTimeout(() => {
      const el = document.querySelector(`[data-testid="material-card-${initialMaterialId}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [initialMaterialId]);

  const tokens = getThemeTokens(visualStyle, colorTheme);

  const activeSite = useMemo(
    () => ANALOG_SITES.find((s) => s.id === selectedSiteId) ?? ANALOG_SITES[0],
    [selectedSiteId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AEROSPACE_MATERIALS.filter((mat) => {
      if (category !== 'Semua' && mat.category !== category) return false;
      if (!q) return true;
      return [
        mat.name,
        mat.category,
        mat.tendency,
        mat.durability,
        mat.thermalConductivityType,
        mat.electricalConductivityType,
        mat.acidResistanceLabel,
        mat.primaryApplications.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [category, query]);

  return (
    <section
      aria-label="Halaman Basis Pengetahuan Info Material"
      data-testid="materials-info-page"
      className={`w-full h-full overflow-y-auto earth-scroll pt-16 pb-24 transition-colors duration-200 ${tokens.pageCanvas}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pt-3">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onBackToMap}
                data-testid="back-to-map-from-materials"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${tokens.secondaryButton}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backLabel}</span>
              </button>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${tokens.accentText}`}>
                <Layers className="w-4 h-4" />
                <span>Referensi Rekayasa Bahan Spacesuit, Peralatan & Transportasi</span>
              </div>
            </div>
            <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${tokens.heading}`}>
              Basis Pengetahuan{' '}
              <span className={tokens.highlighter}>Info Material</span> Eksplorasi
            </h1>
            <p className={`text-sm leading-relaxed ${tokens.bodyText}`}>
              Evaluasi teknis berbobot berdasarkan rentang suhu, ketahanan benturan (impact), abrasi debu, radiasi UV/oksidator, korosi asam, massa, dan peran paparan (eksterior vs internal) mengacu pada data NASA MAPTIS &amp; NTRS.
            </p>
          </div>
          {tokens.isCartoon && (
            <CartoonPageStickers colorTheme={colorTheme} badgeText="12 MATERIAL TERUJI" />
          )}
        </div>

        {/* Category Filter + Search + Live Site Calibration Selector */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <div
            className={`flex flex-wrap items-center gap-1 p-1 rounded-lg ${tokens.pillGroup}`}
            role="tablist"
            aria-label="Filter kategori material"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    active ? tokens.pillActive : tokens.pillInactive
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative">
              <div className="flex items-center gap-2 text-xs">
                <span className={`whitespace-nowrap ${tokens.mutedText}`}>Simulasi Lokasi:</span>
                <button
                  type="button"
                  onClick={() => setIsSitePopupOpen(!isSitePopupOpen)}
                  aria-expanded={isSitePopupOpen}
                  aria-haspopup="listbox"
                  aria-label={`Simulasi lokasi: ${activeSite.name}`}
                  data-testid="materials-site-selector"
                  className={`px-3 py-1.5 rounded-lg text-xs focus:outline-none flex items-center justify-between gap-2 max-w-[200px] sm:max-w-[240px] truncate ${tokens.input}`}
                >
                  <span className="truncate">{activeSite.name.split('(')[0].trim()}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              </div>

              {isSitePopupOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSitePopupOpen(false)}
                  />
                  <div className={`absolute right-0 mt-1.5 w-72 max-h-72 overflow-y-auto earth-scroll rounded-xl shadow-2xl z-50 p-1.5 border backdrop-blur-xl ${tokens.panel}`}>
                    <div className="px-2 py-1.5 text-[11px] font-semibold opacity-70 border-b mb-1">
                      Pilih Lokasi Simulasi ({ANALOG_SITES.length})
                    </div>
                    {ANALOG_SITES.map((s) => {
                      const isSelected = s.id === selectedSiteId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedSiteId(s.id);
                            setIsSitePopupOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? tokens.isDark ? 'bg-white/20 text-white font-bold' : 'bg-blue-100 text-blue-900 font-bold'
                              : tokens.isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-black/5 text-slate-800'
                          }`}
                        >
                          <span className="truncate">{s.name.split('(')[0].trim()}</span>
                          <div className="text-[10px] font-mono-tabular opacity-70 shrink-0 flex items-center gap-1.5">
                            <span>🌙 {s.moonSimilarityScore.toFixed(1)}%</span>
                            <span>🪐 {s.marsSimilarityScore.toFixed(1)}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="relative flex-1 sm:w-60">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${tokens.mutedText}`} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari material, isolator, asam..."
                aria-label="Cari info material"
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none ${tokens.input}`}
              />
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className={`col-span-full py-16 text-center text-sm ${tokens.card} ${tokens.mutedText}`}>
              Tidak ada material yang cocok dengan kata kunci pencarian.
            </div>
          ) : (
            filtered.map((mat) => {
              const fit = scoreMaterialForSite(activeSite, mat);
              const band = getMaterialScoreBand(fit.score);
              const isHighlighted = initialMaterialId === mat.id;
              return (
                <article
                  key={mat.id}
                  data-testid={`material-card-${mat.id}`}
                  className={`p-4 flex flex-col gap-3 transition-colors ${tokens.card} ${
                    isHighlighted
                      ? tokens.isCartoon
                        ? 'ring-4 ring-[#c3f73a]'
                        : 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  {/* Title & Live Site Suitability Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`text-[11px] font-medium ${tokens.mutedText}`}>
                        {mat.code} · {mat.category} · {mat.exposureRole}
                      </div>
                      <h2 className={`font-display text-base font-bold mt-0.5 ${tokens.heading}`}>
                        {mat.name}
                      </h2>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-[10px] ${tokens.mutedText}`}>Skor di lokasi ini</div>
                      <div className={`font-mono-tabular text-base font-bold ${band.textClass}`}>
                        {fit.score}%
                      </div>
                      <div className={`text-[10px] font-semibold ${band.textClass}`}>
                        {band.label}
                      </div>
                    </div>
                  </div>

                  {/* Key Physics Spec Matrix */}
                  <div className={`grid grid-cols-2 gap-2 p-2.5 text-[11px] ${tokens.subCard}`}>
                    <div className="flex items-start gap-1.5">
                      <Weight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tokens.accentText}`} />
                      <div>
                        <span className={`block ${tokens.mutedText}`}>Berat & Densitas</span>
                        <span className={`font-mono-tabular font-medium ${tokens.heading}`}>
                          {mat.weightClass} ({mat.densityKgM3.toLocaleString('id-ID')} kg/m³)
                        </span>
                        {mat.densityNote && (
                          <span className={`block text-[10px] mt-0.5 ${tokens.mutedText}`}>
                            {mat.densityNote}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Thermometer className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tokens.accentText}`} />
                      <div>
                        <span className={`block ${tokens.mutedText}`}>Rentang Suhu Kerja</span>
                        <span className={`font-mono-tabular font-medium ${tokens.heading}`}>
                          {mat.tempRangeMinC}°C s/d +{mat.tempRangeMaxC}°C
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Flame className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tokens.accentText}`} />
                      <div>
                        <span className={`block ${tokens.mutedText}`}>Sifat Termal</span>
                        <span className={`font-medium ${tokens.heading}`}>
                          {mat.thermalConductivityType} ({mat.thermalConductivityWmK})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Zap className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tokens.accentText}`} />
                      <div>
                        <span className={`block ${tokens.mutedText}`}>Sifat Listrik</span>
                        <span className={`font-medium ${tokens.heading}`}>
                          {mat.electricalConductivityType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Characteristics */}
                  <div className="space-y-1.5 text-xs flex-1">
                    <div>
                      <span className={`font-semibold ${tokens.heading}`}>Kecenderungan: </span>
                      <span className={tokens.bodyText}>{mat.tendency}</span>
                    </div>
                    <div>
                      <span className={`font-semibold ${tokens.heading}`}>Daya Tahan: </span>
                      <span className={tokens.bodyText}>{mat.durability}</span>
                    </div>
                    <div>
                      <span className={`font-semibold ${tokens.heading}`}>Pengaruh Suhu: </span>
                      <span className={tokens.bodyText}>{mat.thermalBehaviorNote}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pt-0.5">
                      <Shield className={`w-3.5 h-3.5 shrink-0 ${tokens.accentText}`} />
                      <span className={`font-semibold shrink-0 whitespace-nowrap ${tokens.heading}`}>
                        Ketahanan Asam:
                      </span>
                      <span className={tokens.bodyText}>{mat.acidResistanceLabel}</span>
                    </div>
                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] font-mono-tabular ${tokens.mutedText}`}>
                      <span>Impact: {mat.impactResistanceScore}/5</span>
                      <span aria-hidden="true">·</span>
                      <span>Abrasi Debu: {mat.dustAbrasionScore}/5</span>
                      <span aria-hidden="true">·</span>
                      <span>UV/Oksidator: {mat.uvOxidationScore}/5</span>
                    </div>
                  </div>

                  {/* Applications, Site Fit Verdict & Scientific Reference */}
                  <div className={`pt-2 border-t text-[11px] space-y-1.5 ${tokens.divider}`}>
                    <div className={tokens.mutedText}>
                      Aplikasi: {mat.primaryApplications.join(' · ')}
                    </div>
                    <div className={tokens.mutedText}>
                      Batasan: {mat.limitations}
                    </div>
                    <div className={`font-medium ${tokens.accentText}`}>
                      Analisis {activeSite.name.split('(')[0].trim()}: {fit.reason}
                    </div>
                    <a
                      href={mat.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 pt-0.5 hover:underline ${tokens.accentText}`}
                    >
                      <span>Sumber: {mat.referenceCitation}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Bottom Summary Bar */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <span className={`text-xs font-mono-tabular ${tokens.mutedText}`}>
            Menampilkan {filtered.length} dari {AEROSPACE_MATERIALS.length} material terkarakterisasi
          </span>
          <button
            type="button"
            onClick={onBackToMap}
            className={`px-4 py-2 rounded-lg text-xs transition-colors ${tokens.primaryButton}`}
          >
            Kembali ke Peta Eksplorasi
          </button>
        </div>
      </div>
    </section>
  );
};
