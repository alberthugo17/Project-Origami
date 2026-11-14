import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
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
import { scoreMaterialForSite } from '../utils/materialMatcher';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';
import { CartoonPageStickers } from './CartoonStickers';

interface MaterialsInfoPageProps {
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  initialMaterialId?: string | null;
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
  onBackToMap,
}) => {
  const [category, setCategory] = useState<'Semua' | MaterialCategory>('Semua');
  const [query, setQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(ANALOG_SITES[0].id);

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
                <span>Kembali ke Peta</span>
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
              Karakteristik kecenderungan mekanis, daya tahan, berat/densitas, respons pada suhu ekstrem, sifat isolator atau konduktor termal-listrik, serta ketahanan asam yang menentukan Top 5 rekomendasi tiap situs.
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
            <label className="flex items-center gap-2 text-xs">
              <span className={`whitespace-nowrap ${tokens.mutedText}`}>Simulasi Lokasi:</span>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                aria-label="Pilih lokasi untuk simulasi kecocokan material"
                className={`px-3 py-1.5 rounded-lg text-xs focus:outline-none max-w-[200px] sm:max-w-[240px] truncate ${tokens.input}`}
              >
                {ANALOG_SITES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name.split('(')[0].trim()}
                  </option>
                ))}
              </select>
            </label>

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
                        {mat.code} · {mat.category}
                      </div>
                      <h2 className={`font-display text-base font-bold mt-0.5 ${tokens.heading}`}>
                        {mat.name}
                      </h2>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-[10px] ${tokens.mutedText}`}>Skor di lokasi ini</div>
                      <div className={`font-mono-tabular text-base font-bold ${tokens.accentText}`}>
                        {fit.score}%
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
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Shield className={`w-3.5 h-3.5 shrink-0 ${tokens.accentText}`} />
                      <span className={`font-semibold ${tokens.heading}`}>Ketahanan Asam:</span>
                      <span className={tokens.bodyText}>{mat.acidResistanceLabel}</span>
                    </div>
                  </div>

                  {/* Applications & Site Fit Verdict */}
                  <div className={`pt-2 border-t text-[11px] space-y-1 ${tokens.divider}`}>
                    <div className={tokens.mutedText}>
                      Aplikasi: {mat.primaryApplications.join(' · ')}
                    </div>
                    <div className={`font-medium ${tokens.accentText}`}>
                      Analisis {activeSite.name.split('(')[0].trim()}: {fit.reason}
                    </div>
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
