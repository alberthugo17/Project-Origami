import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Database,
  List,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { AnalogSite } from '../data/analogSites';
import { TargetFilter, filterAnalogSites } from '../utils/analogFilter';

interface TopBarProps {
  allSites: AnalogSite[];
  targetFilter: TargetFilter;
  onTargetFilterChange: (filter: TargetFilter) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onSelectSite: (site: AnalogSite) => void;
  showSitesList: boolean;
  onToggleSitesList: () => void;
  showDataSources: boolean;
  onOpenDataSources: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  allSites,
  targetFilter,
  onTargetFilterChange,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onSelectSite,
  showSitesList,
  onToggleSitesList,
  showDataSources,
  onOpenDataSources,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !searchFocused) return [];
    return filterAnalogSites(allSites, { query: searchQuery, targetFilter: 'All' }).slice(0, 7);
  }, [allSites, searchQuery, searchFocused]);

  return (
    <header className="absolute top-0 left-0 right-0 z-[1050] w-full bg-[#1f2023]/60 backdrop-blur-md border-b border-white/10 text-[#e8eaed]">
      {/* Row 1: Top Navigation & Title Strip */}
      <div className="h-9 px-3.5 flex items-center justify-between gap-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-5 min-w-0">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="earthOrb" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8ab4f8" />
                  <stop offset="55%" stopColor="#1a73e8" />
                  <stop offset="100%" stopColor="#0d3b8c" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10.5" fill="url(#earthOrb)" />
              <path
                d="M3.5 9.5c2.8-1.4 6.2-1 8.8.8 2.7 1.8 6.4 1.6 8.5-.3M4.5 15.2c2.9 1 6.7.3 9.2-1.4 2.1-1.4 4.8-1.5 6.8-.5"
                stroke="#d2e3fc"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-sm font-semibold tracking-tight text-white whitespace-nowrap">
              project Origami
            </span>
          </div>

          {/* Clean single-line navigation links */}
          <nav aria-label="Menu utama" className="hidden sm:flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={onToggleSitesList}
              aria-expanded={showSitesList}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                showSitesList
                  ? 'bg-white/15 text-white'
                  : 'text-[#d2d5da] hover:text-white hover:bg-white/10'
              }`}
            >
              Situs Analog
            </button>
            <button
              type="button"
              onClick={onOpenDataSources}
              data-testid="nav-data-sources"
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                showDataSources
                  ? 'bg-[#8ab4f8]/20 text-[#8ab4f8]'
                  : 'text-[#d2d5da] hover:text-white hover:bg-white/10'
              }`}
            >
              Sumber Data
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline text-[11px] text-[#9aa0a6] whitespace-nowrap">
            NASA Earth · Moon · Mars Analog Atlas
          </span>

          {/* Mobile Menu Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
            data-testid="mobile-menu-btn"
            className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#1f2023]/60 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span className="text-[11px]">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          role="menu"
          aria-label="Menu navigasi mobile"
          data-testid="mobile-dropdown-menu"
          className="sm:hidden border-b border-white/10 bg-[#1f2023]/95 backdrop-blur-md px-3.5 py-3 space-y-2.5 text-xs shadow-2xl"
        >
          <div className="text-[10px] uppercase tracking-wider text-[#9aa0a6] font-semibold px-1">
            Navigasi & Menu
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onToggleSitesList();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left ${
                showSitesList ? 'bg-[#8ab4f8]/20 text-[#8ab4f8]' : 'bg-white/5 hover:bg-white/10 text-[#e8eaed]'
              }`}
            >
              <List className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span>Katalog Situs</span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onOpenDataSources();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left ${
                showDataSources ? 'bg-[#8ab4f8]/20 text-[#8ab4f8]' : 'bg-white/5 hover:bg-white/10 text-[#e8eaed]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span>Sumber Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Row 2: Search & Celestial Filter Strip */}
      <div className="px-3.5 py-1.5 flex items-center justify-between gap-2.5 bg-black/15">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Search Input Pill */}
          <div className="relative flex-1 sm:flex-initial sm:w-72 min-w-0">
            <Search className="w-4 h-4 text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full h-8 pl-9 pr-7 rounded-full bg-black/25 backdrop-blur-sm border border-white/10 text-xs text-white placeholder-[#9aa0a6] focus:outline-none focus:border-[#8ab4f8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div
                role="listbox"
                aria-label="Hasil pencarian situs analog"
                className="absolute left-0 top-9 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-xl bg-[#1f2023]/90 backdrop-blur-md border border-white/15 shadow-2xl py-1.5 z-50"
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
                    className="w-full text-left px-3.5 py-2 hover:bg-white/10 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">
                        {site.name}
                      </div>
                      <div className="text-[11px] text-[#9aa0a6] truncate">
                        {site.country} · {site.targetBody} · {site.biome}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-tabular text-amber-300 shrink-0">
                      {site.similarityScore.toFixed(1)}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Back / Forward Navigation */}
          <div className="hidden sm:flex items-center gap-0.5 pl-1 pr-2 border-r border-white/10">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              title="Lokasi sebelumnya"
              aria-label="Lokasi sebelumnya"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#d2d5da] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              title="Lokasi berikutnya"
              aria-label="Lokasi berikutnya"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#d2d5da] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Target Celestial Body Filter */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/25 backdrop-blur-sm border border-white/10"
            role="group"
            aria-label="Filter target planet"
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#8ab4f8] text-[#171717]'
                      : 'text-[#bdc1c6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Primary Action Tab: Sumber Data */}
        <button
          type="button"
          onClick={onOpenDataSources}
          data-testid="toolbar-data-sources-btn"
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
            showDataSources
              ? 'bg-[#8ab4f8] text-[#171717] border-[#8ab4f8]'
              : 'bg-[#1f2023]/60 hover:bg-white/15 backdrop-blur-sm text-[#e8eaed] border-white/12'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Sumber Data</span>
        </button>
      </div>
    </header>
  );
};
