import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Database,
  GitCompareArrows,
  Info,
  Layers,
  List,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { TargetFilter, filterAnalogSites } from '../utils/analogFilter';
import { ColorTheme, VisualStyle, getThemeTokens } from '../types/theme';

export type ActivePage = 'map' | 'materials' | 'sources' | 'compare';

interface TopBarProps {
  activePage: ActivePage;
  onNavigateMap: () => void;
  allSites: AnalogSite[];
  targetFilter: TargetFilter;
  onTargetFilterChange: (filter: TargetFilter) => void;
  onSelectSite: (site: AnalogSite) => void;
  showSitesList: boolean;
  onToggleSitesList: () => void;
  onToggleMaterialsPage: () => void;
  compareMode: boolean;
  onToggleCompareMode: () => void;
  onToggleDataSourcesPage: () => void;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  onToggleColorTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  onNavigateMap,
  allSites,
  targetFilter,
  onTargetFilterChange,
  onSelectSite,
  showSitesList,
  onToggleSitesList,
  onToggleMaterialsPage,
  compareMode,
  onToggleCompareMode,
  onToggleDataSourcesPage,
  visualStyle,
  colorTheme,
  onToggleColorTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterInfoOpen, setFilterInfoOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterInfoOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (filterInfoRef.current && !filterInfoRef.current.contains(e.target as Node)) {
        setFilterInfoOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilterInfoOpen(false);
    };
    document.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [filterInfoOpen]);

  const tokens = getThemeTokens(visualStyle, colorTheme);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !searchFocused) return [];
    return filterAnalogSites(allSites, { query: searchQuery, targetFilter: 'All' }).slice(0, 7);
  }, [allSites, searchQuery, searchFocused]);

  const navButtonClass = (active: boolean) => {
    if (tokens.isCartoon) {
      return active
        ? tokens.isDark
          ? 'bg-gradient-to-r from-[#ff6584] to-[#f43f5e] text-white font-bold rounded-lg shadow-[0_2px_10px_rgba(255,101,132,0.4)]'
          : 'bg-[#c3f73a] text-[#0e1a18] border-2 border-[#0e1a18] shadow-[2px_2px_0px_#0e1a18] font-bold'
        : tokens.isDark
          ? 'text-[#c7d2fe] hover:text-white hover:bg-white/10 font-medium'
          : 'text-[#0e1a18] hover:bg-[#fef08a] font-medium';
    }
    return active
      ? tokens.isDark
        ? 'bg-white/18 text-white font-semibold'
        : 'bg-blue-600 text-white font-semibold'
      : tokens.isDark
        ? 'text-[#d2d5da] hover:text-white hover:bg-white/10'
        : 'text-slate-800 hover:text-slate-950 hover:bg-slate-900/8';
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-[1050] w-full transition-colors duration-200 ${tokens.header}`}>
      {/* Row 1: Translucent Navigation & Theme Switch Strip */}
      <div className={`h-11 px-3.5 flex items-center justify-between gap-4 ${activePage === 'map' ? `border-b ${tokens.divider}` : ''}`}>
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          {/* Brand Logo -> Returns to Map */}
          <button
            type="button"
            onClick={() => {
              onNavigateMap();
              setMobileMenuOpen(false);
            }}
            aria-label="Kembali ke Peta Origami"
            className="flex items-center gap-2 shrink-0 text-left focus:outline-none group"
          >
            <img
              src="./assets/aistudio/Untitled47_20261114195505_b30478be.png"
              alt="Origami Logo"
              className="w-6 h-6 rounded-full object-cover shrink-0 shadow-sm bg-slate-800"
            />
            <span className={`font-display text-sm font-extrabold tracking-tight whitespace-nowrap ${tokens.heading}`}>
              Project Origami
            </span>
          </button>

          {/* Clean Single-Line Navigation Pages */}
          <nav aria-label="Menu utama" className="hidden sm:flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={onToggleSitesList}
              aria-expanded={activePage === 'map' && showSitesList}
              data-testid="nav-sites-btn"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${navButtonClass(
                activePage === 'map' && showSitesList
              )}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Situs Analog</span>
            </button>
            <button
              type="button"
              onClick={onToggleMaterialsPage}
              aria-current={activePage === 'materials' ? 'page' : undefined}
              data-testid="nav-materials-btn"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${navButtonClass(
                activePage === 'materials'
              )}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Info Material</span>
            </button>
            <button
              type="button"
              onClick={onToggleCompareMode}
              aria-pressed={compareMode || activePage === 'compare'}
              data-testid="nav-compare-btn"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${navButtonClass(
                compareMode || activePage === 'compare'
              )}`}
            >
              <GitCompareArrows className="w-3.5 h-3.5" />
              <span>Bandingkan Lokasi</span>
            </button>
            <button
              type="button"
              onClick={onToggleDataSourcesPage}
              aria-current={activePage === 'sources' ? 'page' : undefined}
              data-testid="nav-data-sources"
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${navButtonClass(
                activePage === 'sources'
              )}`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Sumber Data</span>
            </button>
          </nav>
        </div>

        {/* Top-Right: Global Dark/Light Theme Toggle + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleColorTheme}
            aria-label={colorTheme === 'dark' ? 'Ubah ke tema terang' : 'Ubah ke tema gelap'}
            data-testid="theme-toggle-btn"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${tokens.secondaryButton}`}
          >
            {colorTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gelap</span>
              </>
            )}
          </button>

          {/* Mobile Menu Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            data-testid="mobile-menu-btn"
            className={`sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${tokens.secondaryButton}`}
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Navigation Dropdown Menu (Transparent / Translucent) */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            role="menu"
            aria-label="Menu navigasi mobile"
            data-testid="mobile-dropdown-menu"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 0.7, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`sm:hidden overflow-hidden border-b ${tokens.divider} ${tokens.header}`}
          >
            <div className="px-3.5 py-3 space-y-2.5 text-xs">
              <div className={`text-[11px] font-semibold px-0.5 ${tokens.mutedText}`}>
                Navigasi Eksplorasi
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onToggleSitesList();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs ${
                    activePage === 'map' && showSitesList ? tokens.primaryButton : tokens.secondaryButton
                  }`}
                >
                  <List className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Situs Analog</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  data-testid="mobile-nav-materials-btn"
                  onClick={() => {
                    onToggleMaterialsPage();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs ${
                    activePage === 'materials' ? tokens.primaryButton : tokens.secondaryButton
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Info Material</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  data-testid="mobile-nav-compare-btn"
                  onClick={() => {
                    onToggleCompareMode();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs ${
                    compareMode || activePage === 'compare' ? tokens.primaryButton : tokens.secondaryButton
                  }`}
                >
                  <GitCompareArrows className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Bandingkan</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onToggleDataSourcesPage();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs ${
                    activePage === 'sources' ? tokens.primaryButton : tokens.secondaryButton
                  }`}
                >
                  <Database className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Sumber</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 2: Search & Celestial Filter Strip (Only on Map view so full pages feel spacious) */}
      {activePage === 'map' && (
        <div className={`px-3.5 py-1.5 flex items-center justify-between gap-2 ${tokens.headerSubRow}`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial sm:w-72 min-w-0">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${tokens.mutedText}`} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    onSelectSite(searchResults[0]);
                    setSearchQuery(searchResults[0].name);
                    setSearchFocused(false);
                    inputRef.current?.blur();
                  }
                }}
                placeholder="Telusuri situs analog..."
                aria-label="Telusuri situs analog"
                data-testid="search-analog-input"
                className={`w-full h-8 pl-9 pr-7 rounded-full text-xs focus:outline-none transition-colors ${tokens.input}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${tokens.mutedText}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search Dropdown */}
              {searchFocused && searchResults.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Hasil pencarian situs analog"
                  className={`absolute left-0 top-9 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] py-1.5 z-50 ${tokens.panel}`}
                >
                  {searchResults.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectSite(site);
                        setSearchQuery(site.name);
                        setSearchFocused(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between gap-2 transition-colors ${
                        tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className={`text-xs font-medium truncate ${tokens.heading}`}>
                          {site.name}
                        </div>
                        <div className={`text-[11px] truncate ${tokens.mutedText}`}>
                          {site.country} · {site.targetBody} · {site.temperatureProfile.avgC}°C
                        </div>
                      </div>
                      <div className={`text-[10px] font-mono-tabular shrink-0 flex items-center gap-1.5 ${tokens.accentText}`}>
                        <span>🌙 {site.moonSimilarityScore.toFixed(1)}%</span>
                        <span>🪐 {site.marsSimilarityScore.toFixed(1)}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Target Celestial Body Filter + Info Tooltip */}
            <div ref={filterInfoRef} className="relative flex items-center gap-1.5 shrink-0">
              <div
                className={`flex items-center gap-0.5 p-0.5 rounded-lg ${tokens.pillGroup}`}
                role="group"
                aria-label="Filter target misi primer"
              >
                {(['All', 'Moon', 'Mars'] as TargetFilter[]).map((f) => {
                  const active = targetFilter === f;
                  const label = f === 'All' ? 'Semua' : f === 'Moon' ? 'Bulan' : 'Mars';
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => onTargetFilterChange(f)}
                      data-testid={`filter-${f.toLowerCase()}`}
                      className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                        active ? tokens.pillActive : tokens.pillInactive
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setFilterInfoOpen((v) => !v)}
                aria-expanded={filterInfoOpen}
                aria-label="Penjelasan filter target misi primer"
                title="Target Misi Primer"
                data-testid="filter-info-btn"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  filterInfoOpen ? tokens.accentText : tokens.mutedText
                } ${tokens.secondaryButton}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {filterInfoOpen && (
                <div
                  role="tooltip"
                  data-testid="filter-info-tooltip"
                  className={`absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-64 sm:w-72 max-w-[calc(100vw-1.75rem)] p-3 text-[11px] leading-relaxed z-[1070] shadow-2xl ${
                    tokens.isCartoon
                      ? tokens.panel
                      : tokens.isDark
                        ? 'bg-[#121722] border border-white/20 rounded-xl'
                        : 'bg-white border border-slate-300 rounded-xl'
                  }`}
                >
                  <div className={`font-semibold mb-1 ${tokens.heading}`}>
                    Filter Target Misi Primer
                  </div>
                  <p className={tokens.bodyText}>
                    Menyaring situs berdasarkan fokus misi resmi NASA/ESA/USGS (Biru: Bulan, Merah: Mars, Belah: Keduanya). Skor persentase kedua planet tetap dihitung penuh sebagai pembanding.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
