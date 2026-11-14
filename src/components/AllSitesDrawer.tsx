import React from 'react';
import { MapPin, Thermometer, X } from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { formatCoordinatesDMS } from '../utils/geoMath';
import { getTargetBadgeLabel } from '../utils/analogFilter';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';

interface AllSitesDrawerProps {
  sites: AnalogSite[];
  selectedSiteId: string | null;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onSelectSite: (site: AnalogSite) => void;
  onClose: () => void;
}

export const AllSitesDrawer: React.FC<AllSitesDrawerProps> = ({
  sites,
  selectedSiteId,
  visualStyle,
  colorTheme,
  onSelectSite,
  onClose,
}) => {
  const tokens = getThemeTokens(visualStyle, colorTheme);

  return (
    <aside
      aria-label="Daftar seluruh situs analog terkarakterisasi"
      data-testid="all-sites-drawer"
      className={`w-[368px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-175px)] flex flex-col overflow-hidden transition-colors duration-200 ${tokens.panel}`}
    >
      <div className={`px-4 py-3 border-b flex items-center justify-between ${tokens.divider}`}>
        <div>
          <h2 className={`font-display text-sm font-semibold ${tokens.heading}`}>
            Katalog Situs Analog ({sites.length})
          </h2>
          <p className={`text-[11px] ${tokens.mutedText}`}>
            Diurutkan berdasarkan indeks kecocokan Bulan & Mars
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup daftar situs"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${tokens.mutedText} ${
            tokens.isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-black/5'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto earth-scroll divide-y ${tokens.divider}`}>
        {sites.map((site, idx) => {
          const isSelected = site.id === selectedSiteId;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => onSelectSite(site)}
              className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-3 ${
                isSelected
                  ? tokens.isDark
                    ? 'bg-white/15'
                    : 'bg-blue-50'
                  : tokens.isDark
                    ? 'hover:bg-white/[0.06]'
                    : 'hover:bg-black/[0.04]'
              }`}
            >
              <span className={`mt-0.5 text-xs font-mono-tabular w-5 shrink-0 ${tokens.mutedText}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold truncate ${tokens.heading}`}>
                    {site.name}
                  </span>
                  <span className={`text-[11px] font-mono-tabular font-semibold shrink-0 ${tokens.accentText}`}>
                    {site.similarityScore.toFixed(1)}%
                  </span>
                </div>
                <div className={`text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap ${tokens.mutedText}`}>
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: site.accentColor }} />
                  <span className="truncate">{site.country} · {getTargetBadgeLabel(site.targetBody)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-0.5 font-mono-tabular">
                    <Thermometer className="w-3 h-3" />
                    {site.temperatureProfile.avgC}°C
                  </span>
                </div>
                <div className={`text-[10px] font-mono-tabular mt-0.5 ${tokens.mutedText}`}>
                  {formatCoordinatesDMS(site.lat, site.lon)} · {site.terrainProfile.roughness}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
