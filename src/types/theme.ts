export type VisualStyle = 'realistic' | 'cartoon';
export type ColorTheme = 'dark' | 'light';

export interface ThemeTokens {
  isCartoon: boolean;
  isDark: boolean;
  pageCanvas: string;
  panel: string;
  header: string;
  headerSubRow: string;
  card: string;
  subCard: string;
  divider: string;
  heading: string;
  bodyText: string;
  mutedText: string;
  accentText: string;
  highlighter: string;
  primaryButton: string;
  secondaryButton: string;
  input: string;
  pillGroup: string;
  pillActive: string;
  pillInactive: string;
}

export function getThemeTokens(style: VisualStyle, theme: ColorTheme): ThemeTokens {
  const isCartoon = style === 'cartoon';
  const isDark = theme === 'dark';

  // Kartun Lo-Fi + Light (Warm Cream #FDF6E9 + Acid Lime #C3F73A + Crisp Ink #0E1A18 + Hard Offset Shadows)
  if (isCartoon && !isDark) {
    return {
      isCartoon: true,
      isDark: false,
      pageCanvas: 'cartoon-dot-grid-light text-[#0e1a18]',
      panel:
        'bg-[#fffdf7]/95 backdrop-blur-md border-2 border-[#0e1a18] shadow-[4px_4px_0px_#0e1a18] text-[#0e1a18] rounded-2xl',
      header:
        'bg-[#fdf6e9]/75 backdrop-blur-md border-b-2 border-[#0e1a18] text-[#0e1a18]',
      headerSubRow:
        'bg-transparent',
      card:
        'bg-[#fffdf7] border-2 border-[#0e1a18] shadow-[3px_3px_0px_#0e1a18] rounded-2xl',
      subCard:
        'bg-[#fdf6e9] border-2 border-[#0e1a18] rounded-xl',
      divider: 'border-[#0e1a18]/15',
      heading: 'text-[#0e1a18]',
      bodyText: 'text-[#1e293b]',
      mutedText: 'text-[#475569]',
      accentText: 'text-[#0f5132]',
      highlighter: 'bg-[#c3f73a] text-[#0e1a18] px-1.5 rounded-sm inline-block',
      primaryButton:
        'bg-[#c3f73a] hover:bg-[#b2eb25] text-[#0e1a18] border-2 border-[#0e1a18] shadow-[2px_2px_0px_#0e1a18] font-bold',
      secondaryButton:
        'bg-[#fffdf7]/80 hover:bg-[#fef08a] text-[#0e1a18] border-2 border-[#0e1a18] shadow-[2px_2px_0px_#0e1a18] font-medium backdrop-blur-sm',
      input:
        'bg-[#fffdf7]/65 hover:bg-[#fffdf7]/85 focus:bg-[#fffdf7] border-2 border-[#0e1a18] text-[#0e1a18] placeholder-[#64748b] focus:border-[#0284c7] shadow-[2px_2px_0px_#0e1a18] backdrop-blur-sm',
      pillGroup: 'bg-[#fffdf7]/60 border-2 border-[#0e1a18] shadow-[2px_2px_0px_#0e1a18] backdrop-blur-sm',
      pillActive: 'bg-[#c3f73a] text-[#0e1a18] font-bold border border-[#0e1a18]',
      pillInactive: 'text-[#1e293b] hover:bg-[#e0f2fe]',
    };
  }

  // Kartun Lo-Fi + Dark (StellarX Smooth Cosmic Space Palette: Deep Space #0C0922 + Smooth Indigo #181339 + Radiant Coral #FF6584 + Cyan #38BDF8)
  if (isCartoon && isDark) {
    return {
      isCartoon: true,
      isDark: true,
      pageCanvas: 'cartoon-dot-grid-dark text-[#f1f5f9]',
      panel:
        'bg-[#151136]/90 backdrop-blur-xl border border-[#818cf8]/35 shadow-[0_8px_32px_rgba(8,6,26,0.6)] text-[#f1f5f9] rounded-2xl',
      header:
        'bg-[#0f0b29]/70 backdrop-blur-xl border-b border-[#818cf8]/30 text-[#f1f5f9]',
      headerSubRow:
        'bg-transparent',
      card:
        'bg-[#19143f]/90 border border-[#818cf8]/35 shadow-[0_6px_24px_rgba(8,6,26,0.45)] rounded-2xl',
      subCard:
        'bg-[#120e30]/85 border border-[#6366f1]/30 rounded-xl',
      divider: 'border-[#818cf8]/20',
      heading: 'text-white',
      bodyText: 'text-[#e0e7ff]',
      mutedText: 'text-[#a5b4fc]',
      accentText: 'text-[#ff6584]',
      highlighter: 'bg-gradient-to-r from-[#ff6584] to-[#f472b6] text-white px-2 py-0.5 rounded-md inline-block font-bold',
      primaryButton:
        'bg-gradient-to-r from-[#ff6584] via-[#f43f5e] to-[#ec4899] hover:from-[#ff7a97] hover:to-[#f43f5e] text-white font-bold rounded-xl shadow-[0_4px_16px_rgba(244,63,94,0.45)] border border-white/20',
      secondaryButton:
        'bg-[#231b4e]/80 hover:bg-[#2e2468] text-[#f1f5f9] border border-[#818cf8]/40 shadow-sm font-medium rounded-xl backdrop-blur-sm',
      input:
        'bg-[#120e30]/70 hover:bg-[#120e30]/90 focus:bg-[#120e30] border border-[#818cf8]/40 text-white placeholder-[#a5b4fc]/60 focus:border-[#ff6584] focus:ring-1 focus:ring-[#ff6584] rounded-xl backdrop-blur-md',
      pillGroup: 'bg-[#120e30]/75 border border-[#818cf8]/35 backdrop-blur-md rounded-xl',
      pillActive: 'bg-gradient-to-r from-[#ff6584] to-[#fb7185] text-white font-bold shadow-md rounded-lg',
      pillInactive: 'text-[#c7d2fe] hover:text-white hover:bg-white/10',
    };
  }

  // Realistic + Light (Translucent Frosted White Glass Header + Crisp Editorial Surfaces)
  if (!isCartoon && !isDark) {
    return {
      isCartoon: false,
      isDark: false,
      pageCanvas: 'bg-slate-50 text-slate-900',
      panel:
        'bg-white/92 backdrop-blur-md border border-slate-200 shadow-xl text-slate-900 rounded-xl',
      header:
        'bg-white/60 backdrop-blur-md border-b border-slate-900/10 text-slate-900',
      headerSubRow:
        'bg-transparent',
      card:
        'bg-white border border-slate-200 shadow-sm rounded-xl',
      subCard:
        'bg-slate-50 border border-slate-200 rounded-lg',
      divider: 'border-slate-900/10',
      heading: 'text-slate-950',
      bodyText: 'text-slate-700',
      mutedText: 'text-slate-500',
      accentText: 'text-blue-700',
      highlighter: 'text-blue-700 font-semibold',
      primaryButton:
        'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
      secondaryButton:
        'bg-white/70 hover:bg-white/90 text-slate-800 border border-slate-300/80 backdrop-blur-sm',
      input:
        'bg-white/45 hover:bg-white/65 focus:bg-white/85 border border-slate-900/15 text-slate-900 placeholder-slate-500 focus:border-blue-600 backdrop-blur-sm',
      pillGroup: 'bg-white/40 border border-slate-900/12 backdrop-blur-sm',
      pillActive: 'bg-blue-600 text-white font-semibold shadow-sm',
      pillInactive: 'text-slate-700 hover:text-slate-950 hover:bg-white/50',
    };
  }

  // Realistic + Dark (Translucent Frosted Dark Aerospace Telemetry Glass)
  return {
    isCartoon: false,
    isDark: true,
    pageCanvas: 'bg-[#0b1320] text-[#e8eaed]',
    panel:
      'bg-[#181b21]/80 backdrop-blur-md border border-white/12 shadow-2xl text-[#e8eaed] rounded-xl',
    header:
      'bg-[#0f141d]/55 backdrop-blur-md border-b border-white/12 text-[#e8eaed]',
    headerSubRow:
      'bg-transparent',
    card:
      'bg-[#161b24]/90 border border-white/10 rounded-xl',
    subCard:
      'bg-white/[0.04] border border-white/10 rounded-lg',
    divider: 'border-white/10',
    heading: 'text-white',
    bodyText: 'text-[#d2d5da]',
    mutedText: 'text-[#9aa0a6]',
    accentText: 'text-[#8ab4f8]',
    highlighter: 'text-[#8ab4f8] font-semibold',
    primaryButton:
      'bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#171717] font-semibold',
    secondaryButton:
      'bg-white/8 hover:bg-white/15 text-[#e8eaed] border border-white/15 backdrop-blur-sm',
    input:
      'bg-white/[0.07] hover:bg-white/[0.11] focus:bg-white/[0.15] border border-white/15 text-white placeholder-white/50 focus:border-[#8ab4f8] backdrop-blur-sm',
    pillGroup: 'bg-white/[0.06] border border-white/12 backdrop-blur-sm',
    pillActive: 'bg-[#8ab4f8] text-[#171717] font-semibold shadow-sm',
    pillInactive: 'text-[#d2d5da] hover:text-white hover:bg-white/10',
  };
}
