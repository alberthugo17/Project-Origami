import React, { useMemo, useState } from 'react';
import { Database, ExternalLink, Search, X } from 'lucide-react';
import { ANALOG_SITES } from '../data/analogSites';
import { DATA_SOURCES, DataBodyFilter } from '../data/dataSources';
import { filterDataSources } from '../utils/analogFilter';

interface DataSourcesModalProps {
  onClose: () => void;
}

const BODY_TABS: DataBodyFilter[] = ['Semua', 'Bumi', 'Bulan', 'Mars'];

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({ onClose }) => {
  const [bodyFilter, setBodyFilter] = useState<DataBodyFilter>('Semua');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => filterDataSources(DATA_SOURCES, bodyFilter, query),
    [bodyFilter, query]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sumber Data dan Metodologi Analisis NASA serta Agensi Antariksa"
      data-testid="data-sources-modal"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 md:p-8"
    >
      <div className="w-full max-w-5xl max-h-[86vh] flex flex-col rounded-xl bg-[#1f2023]/60 backdrop-blur-md border border-white/15 shadow-2xl overflow-hidden text-[#e8eaed]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8ab4f8] font-medium">
              <Database className="w-4 h-4" />
              <span>Inventaris Data Terbuka Bumi, Bulan & Mars</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white mt-1">
              Sumber Informasi & Dataset Analisis Analog Terestrial
            </h2>
            <p className="text-xs text-[#9aa0a6] mt-1 max-w-3xl leading-relaxed">
              Karakterisasi {ANALOG_SITES.length} situs analog (termasuk temuan teratas Gunung Bromo, Atacama, Haughton Crater, dan Death Valley) menggunakan data penginderaan jauh terbuka dari NASA, ESA, USGS Astrogeology, JAXA, serta BIG/PVMBG Indonesia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel sumber data"
            data-testid="close-data-sources"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#28292d]" role="tablist" aria-label="Filter objek langit">
            {BODY_TABS.map((tab) => {
              const active = bodyFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setBodyFilter(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#8ab4f8] text-[#171717]'
                      : 'text-[#bdc1c6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari misi, instrumen, agensi..."
              aria-label="Cari sumber data"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#28292d] border border-white/10 text-xs text-white placeholder-[#9aa0a6] focus:outline-none focus:border-[#8ab4f8]"
            />
          </div>
        </div>

        {/* Methodology Strip */}
        <div className="px-6 py-3 bg-black/25 border-b border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-[#8ab4f8] font-medium">1. Morfometri & Topografi</div>
            <p className="text-[#bdc1c6] mt-0.5 leading-relaxed">
              Gradien lereng dan kekasaran terrain dibandingkan antara DEM SRTM 30m / DEMNAS 8m dengan LRO LOLA (Bulan) dan HiRISE DTM (Mars).
            </p>
          </div>
          <div>
            <div className="text-[#8ab4f8] font-medium">2. Spektroskopi & Mineralogi</div>
            <p className="text-[#bdc1c6] mt-0.5 leading-relaxed">
              Pita reflektansi VNIR/SWIR dari Sentinel-2 MSI dicocokkan terhadap spektrum mineral basaltik, sulfat, dan karbonat MRO CRISM serta JAXA MI.
            </p>
          </div>
          <div>
            <div className="text-[#8ab4f8] font-medium">3. Albedo, Inersia Termal & Ariditas</div>
            <p className="text-[#bdc1c6] mt-0.5 leading-relaxed">
              Albedo MODIS MCD43A3 dan indeks vegetasi NDVI disaring terhadap data inersia termal Mars Odyssey THEMIS untuk validasi zona regolith gembur.
            </p>
          </div>
        </div>

        {/* Dataset List */}
        <div className="flex-1 overflow-y-auto earth-scroll px-6 py-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#9aa0a6]">
              Tidak ada dataset yang cocok dengan filter pencarian.
            </div>
          ) : (
            filtered.map((src) => (
              <article
                key={src.id}
                className="rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#9aa0a6] flex-wrap">
                      <span className="font-semibold text-[#8ab4f8]">{src.agency}</span>
                      <span aria-hidden="true">·</span>
                      <span>Objek: {src.targetBody}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{src.resolution}</span>
                    </div>
                    <h3 className="font-display text-sm font-semibold text-white mt-1">
                      {src.missionOrPlatform} — {src.instrument}
                    </h3>
                  </div>
                  <a
                    href={src.accessUrl.split(' / ')[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/15 text-[11px] text-[#e8eaed] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                  >
                    Portal Resmi
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#9aa0a6] block text-[11px]">Variabel Diekstrak</span>
                    <p className="text-[#d2d5da] mt-0.5 leading-relaxed">{src.variablesExtracted}</p>
                  </div>
                  <div>
                    <span className="text-[#9aa0a6] block text-[11px]">Peran dalam Analisis Analog</span>
                    <p className="text-[#d2d5da] mt-0.5 leading-relaxed">{src.roleInAnalysis}</p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9aa0a6] font-mono-tabular">
                  <span>ID Dataset: {src.datasetIdentifier}</span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <span className="text-xs text-[#9aa0a6] font-mono-tabular">
            Menampilkan {filtered.length} dari {DATA_SOURCES.length} sumber data agensi antariksa & kebumian
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#171717] text-xs font-semibold transition-colors"
          >
            Kembali ke Globe 3D
          </button>
        </div>
      </div>
    </div>
  );
};
