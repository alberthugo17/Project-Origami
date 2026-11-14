import React from 'react';
import { MapPin, X } from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { formatCoordinatesDMS } from '../utils/geoMath';
import { getTargetBadgeLabel } from '../utils/analogFilter';

interface AllSitesDrawerProps {
  sites: AnalogSite[];
  selectedSiteId: string | null;
  onSelectSite: (site: AnalogSite) => void;
  onClose: () => void;
}

export const AllSitesDrawer: React.FC<AllSitesDrawerProps> = ({
  sites,
  selectedSiteId,
  onSelectSite,
  onClose,
}) => {
  return (
    <aside
      aria-label="Daftar seluruh situs analog terkarakterisasi"
      data-testid="all-sites-drawer"
      className="w-[360px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-208px)] flex flex-col rounded-xl bg-[#1f2023]/60 backdrop-blur-md border border-white/12 shadow-2xl overflow-hidden text-[#e8eaed]"
    >
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">
            Katalog Situs Analog ({sites.length})
          </h2>
          <p className="text-[11px] text-[#9aa0a6]">
            Diurutkan berdasarkan indeks kecocokan Bulan & Mars
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar situs"
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto earth-scroll divide-y divide-white/10">
        {sites.map((site, idx) => {
          const isSelected = site.id === selectedSiteId;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => onSelectSite(site)}
              className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-3 ${
                isSelected ? 'bg-[#8ab4f8]/15' : 'hover:bg-white/[0.05]'
              }`}
            >
              <span className="mt-0.5 text-xs font-mono-tabular text-[#9aa0a6] w-5 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white truncate">
                    {site.name}
                  </span>
                  <span className="text-[11px] font-mono-tabular text-amber-300 shrink-0">
                    {site.similarityScore.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[11px] text-[#9aa0a6] mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: site.accentColor }} />
                  <span className="truncate">{site.country} · {getTargetBadgeLabel(site.targetBody)}</span>
                </div>
                <div className="text-[10px] font-mono-tabular text-[#7c828a] mt-0.5">
                  {formatCoordinatesDMS(site.lat, site.lon)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
