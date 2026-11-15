import React from 'react';
import { MapPin, Thermometer, X } from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { formatCoordinatesDMS } from '../utils/geoMath';
import { TargetFilter, getTargetBadgeLabel } from '../utils/analogFilter';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';

interface AllSitesDrawerProps {
  sites: AnalogSite[];
  targetFilter?: TargetFilter;
  selectedSiteId: string | null;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onSelectSite: (site: AnalogSite) => void;
  onClose: () => void;
}

export const AllSitesDrawer: React.FC<AllSitesDrawerProps> = ({
  sites,
  targetFilter = 'All',
  selectedSiteId,
  visualStyle,
  colorTheme,
  onSelectSite,
  onClose,
}) => {
  const tokens = getThemeTokens(visualStyle, colorTheme);
  const sortCaption =
    targetFilter === 'Moon'
      ? 'Sorted by Moon similarity'
      : targetFilter === 'Mars'
        ? 'Sorted by Mars similarity'
        : 'Sorted by target similarity index';

  const rowBorderClass = tokens.isCartoon
    ? tokens.isDark
      ? 'border-[#818cf8]/15'
      : 'border-[#0e1a18]/10'
    : tokens.isDark
      ? 'border-white/[0.06]'
      : 'border-slate-900/[0.06]';

  return (
    <aside
      aria-label="List of all characterized analog sites"
      data-testid="all-sites-drawer"
      className={`w-[368px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-225px)] sm:max-h-[calc(100vh-175px)] flex flex-col overflow-hidden transition-colors duration-200 ${tokens.panel}`}
    >
      <div className={`px-4 py-3 border-b flex items-center justify-between ${tokens.divider}`}>
        <div>
          <h2 className={`font-display text-sm font-semibold ${tokens.heading}`}>
            Analog Sites Catalog ({sites.length})
          </h2>
          <p className={`text-[11px] ${tokens.mutedText}`}>
            {sortCaption}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sites list"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${tokens.mutedText} ${
            tokens.isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-black/5'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto earth-scroll">
        {sites.map((site, idx) => {
          const isSelected = site.id === selectedSiteId;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => onSelectSite(site)}
              className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${rowBorderClass} transition-colors flex items-start gap-3 ${
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
                  <div className="text-[10px] font-mono-tabular font-semibold shrink-0 flex items-center gap-2">
                    <span className={targetFilter === 'Mars' ? tokens.mutedText : tokens.accentText}>
                      🌙 {site.moonSimilarityScore.toFixed(1)}%
                    </span>
                    <span className={targetFilter === 'Moon' ? tokens.mutedText : tokens.accentText}>
                      🪐 {site.marsSimilarityScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className={`text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap ${tokens.mutedText}`}>
                  {site.targetBody === 'Moon & Mars' ? (
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/25"
                      style={{ background: 'linear-gradient(90deg, #3b82f6 50%, #ef4444 50%)' }}
                    />
                  ) : (
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: site.accentColor }} />
                  )}
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
