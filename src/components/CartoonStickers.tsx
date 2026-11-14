import React from 'react';
import { ColorTheme } from '../types/theme';

interface StickerProps {
  colorTheme: ColorTheme;
}

/**
 * Playful Neo-Brutalist geometric sticker accents used strictly in Kartun Lo-Fi mode.
 * Inspired by crisp black-ink outlines, acid-lime circles, pastel tilted badges, and 5-point stars.
 */
export const CartoonPageStickers: React.FC<StickerProps & { badgeText: string }> = ({
  colorTheme,
  badgeText,
}) => {
  const isDark = colorTheme === 'dark';

  if (isDark) {
    return (
      <div className="flex items-center gap-3 select-none pointer-events-none" aria-hidden="true">
        {/* StellarX Smooth Pill Tag */}
        <div
          className="-rotate-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #ff6584, #f43f5e)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 14px rgba(255, 101, 132, 0.45)',
          }}
        >
          {badgeText}
        </div>

        {/* StellarX Glowing Orb */}
        <svg width="34" height="34" viewBox="0 0 38 38" className="shrink-0">
          <circle cx="19" cy="19" r="16" fill="#181339" stroke="#818cf8" strokeWidth="1.6" />
          <circle cx="19" cy="19" r="10" fill="#38bdf8" fillOpacity="0.85" />
          <polygon
            points="19,11 20.8,15.2 25.4,15.7 21.9,18.8 22.9,23.3 19,20.9 15.1,23.3 16.1,18.8 12.6,15.7 17.2,15.2"
            fill="#ffffff"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 select-none pointer-events-none" aria-hidden="true">
      {/* Tilted Sticker Pill Tag */}
      <div
        className="-rotate-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
        style={{
          backgroundColor: '#fcd34d',
          color: '#0e1a18',
          border: '2px solid #0e1a18',
          boxShadow: '3px 3px 0px #0e1a18',
        }}
      >
        {badgeText}
      </div>

      {/* Acid Lime Circle Sticker with Star */}
      <svg width="36" height="36" viewBox="0 0 38 38" className="shrink-0">
        <circle cx="20" cy="20" r="15" fill="#0e1a18" />
        <circle cx="18" cy="18" r="15" fill="#c3f73a" stroke="#0e1a18" strokeWidth="2.2" />
        <polygon
          points="18,9.5 20.4,14.8 26.1,15.4 21.8,19.2 23,24.8 18,21.9 13,24.8 14.2,19.2 9.9,15.4 15.6,14.8"
          fill="#ff6b9e"
          stroke="#0e1a18"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const CartoonCornerStamp: React.FC<StickerProps> = () => {
  return null;
};
