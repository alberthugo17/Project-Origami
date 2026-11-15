import React, { useMemo, useState } from 'react';
import { ArrowLeft, Database, ExternalLink, FileText, Search } from 'lucide-react';
import { ANALOG_SITES } from '../data/analogSites';
import { DATA_SOURCES, DataBodyFilter } from '../data/dataSources';
import { filterDataSources } from '../utils/analogFilter';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';
import { CartoonPageStickers } from './CartoonStickers';

interface DataSourcesPageProps {
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onBackToMap: () => void;
}

const BODY_TABS: DataBodyFilter[] = ['Semua', 'Bumi', 'Bulan', 'Mars'];

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({
  visualStyle,
  colorTheme,
  onBackToMap,
}) => {
  const [bodyFilter, setBodyFilter] = useState<DataBodyFilter>('Semua');
  const [query, setQuery] = useState('');
  const tokens = getThemeTokens(visualStyle, colorTheme);

  const filtered = useMemo(
    () => filterDataSources(DATA_SOURCES, bodyFilter, query),
    [bodyFilter, query]
  );

  return (
    <section
      aria-label="Halaman Sumber Data dan Metodologi Analisis"
      data-testid="data-sources-page"
      className={`w-full h-full overflow-y-auto earth-scroll pt-16 pb-24 transition-colors duration-200 ${tokens.pageCanvas}`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
        {/* Header */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between gap-x-3 gap-y-2 flex-wrap">
            <button
              type="button"
              onClick={onBackToMap}
              data-testid="back-to-map-from-sources"
              className={`order-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 ${tokens.secondaryButton}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Peta</span>
            </button>

            <div className={`order-3 md:order-2 w-full md:w-auto md:mr-auto flex items-center gap-1.5 text-xs font-medium ${tokens.accentText}`}>
              <Database className="w-4 h-4 shrink-0" />
              <span>Inventaris Data Terbuka Bumi, Bulan & Mars</span>
            </div>

            <a
              href="./docs/analisis-data.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="data-analysis-pdf-btn"
              className={`order-2 md:order-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 ${tokens.primaryButton}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Analisis Data</span>
            </a>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${tokens.heading}`}>
                Sumber Informasi & <span className={tokens.highlighter}>Dataset Analisis</span>
              </h1>
              <p className={`text-sm leading-relaxed ${tokens.bodyText}`}>
                Karakterisasi {ANALOG_SITES.length} situs analog menggunakan data penginderaan jauh terbuka dari NASA, ESA, USGS Astrogeology, JAXA, serta BIG/PVMBG Indonesia.
              </p>
            </div>
            {tokens.isCartoon && (
              <CartoonPageStickers colorTheme={colorTheme} badgeText="DATA TERBUKA NASA/ESA" />
            )}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <div className={`flex items-center gap-1 p-1 rounded-lg ${tokens.pillGroup}`} role="tablist" aria-label="Filter objek langit">
            {BODY_TABS.map((tab) => {
              const active = bodyFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setBodyFilter(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    active ? tokens.pillActive : tokens.pillInactive
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${tokens.mutedText}`} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari misi, instrumen, agensi..."
              aria-label="Cari sumber data"
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none ${tokens.input}`}
            />
          </div>
        </div>

        {/* Methodology Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className={`p-4 ${tokens.card}`}>
            <div className={`font-semibold text-sm ${tokens.accentText}`}>1. Morfometri & Topografi</div>
            <p className={`mt-1.5 leading-relaxed ${tokens.bodyText}`}>
              Gradien lereng dan kekasaran terrain dibandingkan antara SRTM 30m / ASTER GDEM / DEMNAS 8m (serta ArcticDEM 2m untuk lintang &gt;60°LU) dengan LRO LOLA (Bulan) dan HiRISE DTM (Mars).
            </p>
          </div>
          <div className={`p-4 ${tokens.card}`}>
            <div className={`font-semibold text-sm ${tokens.accentText}`}>2. Spektroskopi & Mineralogi</div>
            <p className={`mt-1.5 leading-relaxed ${tokens.bodyText}`}>
              Pita reflektansi VNIR/SWIR dari Sentinel-2 MSI dicocokkan terhadap spektrum mineral basaltik, sulfat, dan karbonat MRO CRISM serta JAXA MI.
            </p>
          </div>
          <div className={`p-4 ${tokens.card}`}>
            <div className={`font-semibold text-sm ${tokens.accentText}`}>3. Albedo, Suhu & Ariditas</div>
            <p className={`mt-1.5 leading-relaxed ${tokens.bodyText}`}>
              Albedo & suhu MODIS LST disaring terhadap inersia termal THEMIS untuk validasi zona regolith dan kecocokan material misi.
            </p>
          </div>
        </div>

        {/* Dataset List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className={`py-14 text-center text-sm ${tokens.card} ${tokens.mutedText}`}>
              Tidak ada dataset yang cocok dengan filter pencarian.
            </div>
          ) : (
            filtered.map((src) => (
              <article
                key={src.id}
                className={`p-5 transition-colors ${tokens.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className={`flex items-center gap-2 text-xs flex-wrap ${tokens.mutedText}`}>
                      <span className={`font-semibold ${tokens.accentText}`}>{src.agency}</span>
                      <span aria-hidden="true">·</span>
                      <span>Objek: {src.targetBody}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{src.resolution}</span>
                    </div>
                    <h2 className={`font-display text-base font-bold mt-1 ${tokens.heading}`}>
                      {src.missionOrPlatform} — {src.instrument}
                    </h2>
                  </div>
                  <a
                    href={src.accessUrl.split(' / ')[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 self-start ${tokens.secondaryButton}`}
                  >
                    Portal Resmi
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className={`block text-[11px] font-medium ${tokens.mutedText}`}>Variabel Diekstrak</span>
                    <p className={`mt-0.5 leading-relaxed ${tokens.bodyText}`}>{src.variablesExtracted}</p>
                  </div>
                  <div>
                    <span className={`block text-[11px] font-medium ${tokens.mutedText}`}>Peran dalam Analisis Analog</span>
                    <p className={`mt-0.5 leading-relaxed ${tokens.bodyText}`}>{src.roleInAnalysis}</p>
                  </div>
                </div>

                <div className={`mt-3 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${tokens.divider} ${tokens.mutedText}`}>
                  <span className="font-mono-tabular">ID Dataset: {src.datasetIdentifier}</span>
                  <a
                    href={src.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 hover:underline ${tokens.accentText}`}
                  >
                    <span>Referensi: {src.scientificReference}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 flex flex-wrap items-center justify-between gap-3 ${tokens.card}`}>
          <span className={`text-xs font-mono-tabular ${tokens.mutedText}`}>
            Menampilkan {filtered.length} dari {DATA_SOURCES.length} sumber data agensi antariksa & kebumian
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
