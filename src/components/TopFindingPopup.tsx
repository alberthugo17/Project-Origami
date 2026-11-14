import React from 'react';
import { ArrowUpRight, Compass, X } from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { formatCoordinatesDMS } from '../utils/geoMath';

interface TopFindingPopupProps {
  site: AnalogSite;
  onInspect: (site: AnalogSite) => void;
  onDismiss: () => void;
}

export const TopFindingPopup: React.FC<TopFindingPopupProps> = ({
  site,
  onInspect,
  onDismiss,
}) => {
  return (
    <aside
      role="region"
      aria-label="Notifikasi temuan analog teratas"
      data-testid="top-finding-popup"
      className="w-[340px] max-w-[calc(100vw-2rem)] rounded-xl bg-[#1f2023]/60 backdrop-blur-md shadow-2xl p-4 text-[#e8eaed]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[11px] font-medium text-amber-300 tracking-wide tabular-nums">
            Temuan Teratas · Skor {site.similarityScore.toFixed(1)}%
          </p>
          <h2 className="font-display text-sm font-semibold text-white mt-0.5 leading-snug">
            {site.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup notifikasi temuan teratas"
          data-testid="close-top-finding"
          className="shrink-0 w-7 h-7 -mt-1 -mr-1 rounded-full flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-[#bdc1c6] leading-relaxed mt-2">
        Lautan Pasir Tengger & kaldera Bromo menunjukkan kemiripan tinggi dengan{' '}
        <span className="text-white font-medium">regolith basaltik Mare Bulan</span> dan{' '}
        <span className="text-white font-medium">Bagnold Dunes (Mars)</span> pada albedo (0,11–0,16),
        butiran tephra halus, serta gradien lereng 18°–34°.
      </p>

      <div className="mt-2.5 flex items-center justify-between font-display text-[11px] text-[#d2d5da] tabular-nums">
        <span>{formatCoordinatesDMS(site.lat, site.lon)}</span>
        <span>{site.targetBody}</span>
      </div>

      <div className="mt-3 pt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onInspect(site)}
          data-testid="inspect-top-finding"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#171717] text-xs font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Compass className="w-3.5 h-3.5" />
          Terbang ke Gunung Bromo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-2.5 py-1.5 rounded-lg text-xs text-[#9aa0a6] hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          Tutup
        </button>
      </div>
    </aside>
  );
};
