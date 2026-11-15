import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, GitCompareArrows, Globe2, Info, Minus, Palette, Plus, X } from 'lucide-react';
import { ANALOG_SITES, AnalogSite } from './data/analogSites';
import { TargetFilter, filterAnalogSites, getTopFindingSite } from './utils/analogFilter';
import { computeScaleBar, formatCoordinatesDMS } from './utils/geoMath';
import { ColorTheme, VisualStyle, getThemeTokens } from './types/theme';
import {
  CameraTelemetry,
  GlobeCommand,
  LeafletMap,
} from './components/LeafletMap';
import { ActivePage, TopBar } from './components/TopBar';
import { SiteAnalysisPanel } from './components/SiteAnalysisPanel';
import { AllSitesDrawer } from './components/AllSitesDrawer';

const MaterialsInfoPage = lazy(() =>
  import('./components/MaterialsInfoPage').then((m) => ({ default: m.MaterialsInfoPage }))
);
const CompareSitesPage = lazy(() =>
  import('./components/CompareSitesPage').then((m) => ({ default: m.CompareSitesPage }))
);
const DataSourcesPage = lazy(() =>
  import('./components/DataSourcesPage').then((m) => ({ default: m.DataSourcesPage }))
);

export default function App() {
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('realistic');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('dark');
  const [activePage, setActivePage] = useState<ActivePage>('map');

  const [targetFilter, setTargetFilter] = useState<TargetFilter>('All');
  const [selectedSite, setSelectedSite] = useState<AnalogSite | null>(null);
  const [showSitesList, setShowSitesList] = useState(false);
  const [focusedMaterialId, setFocusedMaterialId] = useState<string | null>(null);
  const [focusedSiteId, setFocusedSiteId] = useState<string | null>(null);

  // Compare two sites state
  const [compareMode, setCompareMode] = useState(false);
  const [compareSitesList, setCompareSitesList] = useState<AnalogSite[]>([]);
  const [materialReturnPage, setMaterialReturnPage] = useState<'map' | 'compare'>('map');

  // Navigation history for back/forward buttons
  const [history, setHistory] = useState<AnalogSite[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [legendInfoOpen, setLegendInfoOpen] = useState(false);

  const legendRef = useRef<HTMLDivElement>(null);
  const cmdSeqRef = useRef(0);
  const [globeCommand, setGlobeCommand] = useState<GlobeCommand | null>(null);

  const [telemetry, setTelemetry] = useState<CameraTelemetry>({
    lat: 6,
    lon: 78,
    altitudeKm: 19370,
  });

  // Sync Tailwind .dark class on <html> root cleanly
  useEffect(() => {
    const root = document.documentElement;
    if (colorTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.dataset.style = visualStyle;
    root.dataset.theme = colorTheme;
  }, [colorTheme, visualStyle]);

  const tokens = getThemeTokens(visualStyle, colorTheme);

  const visibleSites = useMemo(
    () => filterAnalogSites(ANALOG_SITES, { targetFilter }),
    [targetFilter]
  );

  const topVisibleSiteId = useMemo(
    () => getTopFindingSite(visibleSites, targetFilter).id,
    [visibleSites, targetFilter]
  );

  const issueCommand = useCallback((cmd: Omit<GlobeCommand, 'seq'>) => {
    cmdSeqRef.current += 1;
    setGlobeCommand({ ...cmd, seq: cmdSeqRef.current });
  }, []);

  const flyToSite = useCallback(
    (site: AnalogSite, altitudeKm = 24, recordHistory = true) => {
      setActivePage('map');
      setSelectedSite(site);
      setShowSitesList(false);
      issueCommand({
        type: 'flyTo',
        lat: site.lat,
        lon: site.lon,
        altitudeKm,
      });

      if (recordHistory) {
        setHistory((prev) => {
          const truncated = prev.slice(0, historyIdx + 1);
          if (truncated[truncated.length - 1]?.id === site.id) return truncated;
          const next = [...truncated, site];
          setHistoryIdx(next.length - 1);
          return next;
        });
      }
    },
    [historyIdx, issueCommand]
  );

  const handleSelectPin = useCallback(
    (site: AnalogSite) => {
      if (compareMode) {
        // Clicking an already-picked site toggles it off
        if (compareSitesList.some((s) => s.id === site.id)) {
          setCompareSitesList(compareSitesList.filter((s) => s.id !== site.id));
          return;
        }
        const next =
          compareSitesList.length >= 2
            ? [compareSitesList[1], site]
            : [...compareSitesList, site];
        setCompareSitesList(next);
        if (next.length === 2) {
          setActivePage('compare');
        }
        return;
      }
      flyToSite(site, 24, true);
    },
    [compareMode, compareSitesList, flyToSite]
  );

  const handleExitCompare = useCallback(() => {
    setCompareMode(false);
    setCompareSitesList([]);
    setMaterialReturnPage('map');
    setActivePage('map');
  }, []);

  const handleToggleCompareMode = useCallback(() => {
    // Clicking "Bandingkan Lokasi" while active (picking on map OR viewing compare page) cleanly exits back to map
    if (compareMode || activePage === 'compare') {
      handleExitCompare();
      return;
    }

    setActivePage('map');
    setSelectedSite(null);
    setShowSitesList(false);
    setCompareSitesList([]);
    setCompareMode(true);

    // Only gently zoom out to global overview if currently zoomed in close, so user sees all 14 pins
    if (telemetry.altitudeKm < 6000) {
      issueCommand({
        type: 'flyTo',
        lat: 14,
        lon: 35,
        altitudeKm: 19370,
      });
    }
  }, [activePage, compareMode, handleExitCompare, issueCommand, telemetry.altitudeKm]);

  const handleOpenMaterial = useCallback(
    (
      materialId: string | null = null,
      siteId: string | null = null,
      returnTo: 'map' | 'compare' = 'map'
    ) => {
      setFocusedMaterialId(materialId);
      setFocusedSiteId(siteId ?? selectedSite?.id ?? null);
      setMaterialReturnPage(returnTo);
      setActivePage('materials');
    },
    [selectedSite]
  );

  const handleCloseMaterials = useCallback(() => {
    setFocusedMaterialId(null);
    setFocusedSiteId(null);
    if (materialReturnPage === 'compare' && compareSitesList.length === 2) {
      setActivePage('compare');
    } else {
      if (compareSitesList.length >= 2) {
        setCompareMode(false);
        setCompareSitesList([]);
      }
      setActivePage('map');
    }
    setMaterialReturnPage('map');
  }, [compareSitesList.length, materialReturnPage]);

  const handleTargetFilterChange = useCallback(
    (nextFilter: TargetFilter) => {
      setTargetFilter(nextFilter);
      if (
        selectedSite &&
        nextFilter !== 'All' &&
        selectedSite.targetBody !== 'Moon & Mars' &&
        selectedSite.targetBody !== nextFilter
      ) {
        setSelectedSite(null);
      }
    },
    [selectedSite]
  );

  const handleGoBack = useCallback(() => {
    if (historyIdx <= 0) return;
    const nextIdx = historyIdx - 1;
    setHistoryIdx(nextIdx);
    const site = history[nextIdx];
    if (site) flyToSite(site, 24, false);
  }, [flyToSite, history, historyIdx]);

  const handleGoForward = useCallback(() => {
    if (historyIdx >= history.length - 1) return;
    const nextIdx = historyIdx + 1;
    setHistoryIdx(nextIdx);
    const site = history[nextIdx];
    if (site) flyToSite(site, 24, false);
  }, [flyToSite, history, historyIdx]);

  useEffect(() => {
    if (!legendInfoOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (legendRef.current && !legendRef.current.contains(e.target as Node)) {
        setLegendInfoOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [legendInfoOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (legendInfoOpen) {
          setLegendInfoOpen(false);
        } else if (activePage === 'materials') {
          handleCloseMaterials();
        } else if (activePage === 'sources') {
          if (compareMode && compareSitesList.length === 2) {
            setActivePage('compare');
          } else {
            setActivePage('map');
          }
        } else if (activePage === 'compare') {
          handleExitCompare();
        } else if (compareMode) {
          handleExitCompare();
        } else if (selectedSite) {
          setSelectedSite(null);
        } else if (showSitesList) {
          setShowSitesList(false);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activePage,
    compareMode,
    compareSitesList.length,
    handleCloseMaterials,
    handleExitCompare,
    legendInfoOpen,
    selectedSite,
    showSitesList,
  ]);

  const scaleBar = useMemo(
    () => computeScaleBar(telemetry.altitudeKm),
    [telemetry.altitudeKm]
  );

  const isMapVisible = activePage === 'map';

  return (
    <div
      data-visual-style={visualStyle}
      data-color-theme={colorTheme}
      data-active-page={activePage}
      className={`relative w-full h-screen h-dvh overflow-hidden transition-colors duration-200 ${tokens.pageCanvas}`}
    >
      {/* Translucent Floating Top Header (Persistent Across All Pages) */}
      <TopBar
        activePage={activePage}
        onNavigateMap={() => {
          if (compareMode && compareSitesList.length >= 2) {
            setCompareMode(false);
            setCompareSitesList([]);
          }
          setMaterialReturnPage('map');
          setActivePage('map');
        }}
        allSites={ANALOG_SITES}
        targetFilter={targetFilter}
        onTargetFilterChange={handleTargetFilterChange}
        onSelectSite={(site) => {
          if (compareMode) {
            handleSelectPin(site);
          } else {
            flyToSite(site, 24, true);
          }
        }}
        showSitesList={showSitesList}
        onToggleSitesList={() => {
          setActivePage('map');
          setCompareMode(false);
          setCompareSitesList([]);
          setMaterialReturnPage('map');
          setShowSitesList((v) => !v);
          if (!showSitesList) setSelectedSite(null);
        }}
        onToggleMaterialsPage={() => {
          if (activePage === 'materials') {
            handleCloseMaterials();
          } else if (activePage === 'compare' && compareSitesList.length === 2) {
            handleOpenMaterial(null, compareSitesList[0].id, 'compare');
          } else {
            handleOpenMaterial(null, selectedSite?.id ?? null, 'map');
          }
        }}
        compareMode={compareMode}
        onToggleCompareMode={handleToggleCompareMode}
        onToggleDataSourcesPage={() => {
          if (activePage === 'sources') {
            if (compareMode && compareSitesList.length === 2) {
              setActivePage('compare');
            } else {
              setActivePage('map');
            }
          } else {
            setActivePage('sources');
          }
        }}
        visualStyle={visualStyle}
        colorTheme={colorTheme}
        onToggleColorTheme={() => setColorTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Persistent Map Stage (Kept mounted so tiles & zoom state NEVER vanish when switching pages) */}
      <main
        aria-hidden={!isMapVisible}
        className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
          isMapVisible ? 'opacity-100 pointer-events-auto z-0' : 'opacity-0 pointer-events-none z-0'
        }`}
      >
        <LeafletMap
          sites={visibleSites}
          targetFilter={targetFilter}
          topSiteId={topVisibleSiteId}
          selectedSiteId={selectedSite?.id ?? null}
          compareMode={compareMode}
          compareSiteIds={compareSitesList.map((s) => s.id)}
          visualStyle={visualStyle}
          colorTheme={colorTheme}
          isVisible={isMapVisible}
          command={globeCommand}
          onSelectSite={handleSelectPin}
          onTelemetryChange={setTelemetry}
        />

        {/* Compare Mode Interactive Map Selection Banner */}
        {compareMode && isMapVisible && (
          <div
            role="status"
            data-testid="compare-mode-banner"
            className={`pointer-events-auto absolute top-[94px] left-1/2 -translate-x-1/2 z-[1045] px-4 py-2.5 max-w-[calc(100vw-2rem)] flex flex-wrap items-center gap-3 text-xs ${tokens.panel}`}
          >
            <GitCompareArrows className={`w-4 h-4 shrink-0 ${tokens.accentText}`} />
            <div className="min-w-0">
              <span className={`font-semibold ${tokens.heading}`}>
                Mode Bandingkan Lokasi ({compareSitesList.length}/2):{' '}
              </span>
              <span className={tokens.bodyText}>
                {compareSitesList.length === 0
                  ? 'Klik 2 pin lokasi di peta untuk membandingkan.'
                  : `Dipilih A: ${compareSitesList[0].name}. Sekarang klik lokasi ke-2 di peta.`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              {compareSitesList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCompareSitesList([])}
                  className={`px-2 py-1 rounded text-[11px] ${tokens.secondaryButton}`}
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={handleExitCompare}
                aria-label="Batalkan mode bandingkan"
                className={`px-2 py-1 rounded text-[11px] inline-flex items-center gap-1 ${tokens.secondaryButton}`}
              >
                <X className="w-3 h-3" />
                <span>Batal</span>
              </button>
            </div>
          </div>
        )}

        {/* Left Side Detail / Catalog Overlay (Positioned cleanly below floating header) */}
        {!compareMode && isMapVisible && (
          <div className="pointer-events-none absolute top-[94px] left-4 z-[1040] flex flex-col gap-3">
            {selectedSite ? (
              <div className="pointer-events-auto">
                <SiteAnalysisPanel
                  key={selectedSite.id}
                  site={selectedSite}
                  visualStyle={visualStyle}
                  colorTheme={colorTheme}
                  onClose={() => setSelectedSite(null)}
                  onZoomCloser={(site) => flyToSite(site, 6, false)}
                  onOpenDataSources={() => setActivePage('sources')}
                  onInspectMaterial={(matId, siteId) => handleOpenMaterial(matId, siteId)}
                />
              </div>
            ) : showSitesList ? (
              <div className="pointer-events-auto">
                <AllSitesDrawer
                  sites={visibleSites}
                  targetFilter={targetFilter}
                  selectedSiteId={null}
                  visualStyle={visualStyle}
                  colorTheme={colorTheme}
                  onSelectSite={(site) => flyToSite(site, 24, true)}
                  onClose={() => setShowSitesList(false)}
                />
              </div>
            ) : null}
          </div>
        )}

        {/* Bottom-Right Cluster: Zoom -> Legend -> Scale (Fixed to visual viewport like bottom-left style button) */}
        {isMapVisible && (
          <div
            data-testid="map-bottom-right-hud"
            className="pointer-events-none fixed bottom-3 right-3.5 z-[1040] flex flex-col items-end gap-2 max-w-[calc(100vw-1.75rem)]"
          >
            {/* 1. History Back/Forward + Zoom Control Cluster (Always Top) */}
            <div className="order-1 pointer-events-auto flex items-center gap-2">
              {history.length > 1 && (
                <div
                  className={`h-9 rounded-full flex items-center overflow-hidden ${tokens.panel}`}
                  aria-label="Riwayat lokasi yang dikunjungi"
                >
                  <button
                    type="button"
                    onClick={handleGoBack}
                    disabled={historyIdx <= 0}
                    title="Lokasi sebelumnya"
                    aria-label="Lokasi sebelumnya"
                    data-testid="history-back-btn"
                    className={`w-9 h-full flex items-center justify-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${tokens.heading} ${
                      tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className={`w-px h-4 border-l ${tokens.divider}`} />
                  <button
                    type="button"
                    onClick={handleGoForward}
                    disabled={historyIdx >= history.length - 1}
                    title="Lokasi berikutnya"
                    aria-label="Lokasi berikutnya"
                    data-testid="history-forward-btn"
                    className={`w-9 h-full flex items-center justify-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${tokens.heading} ${
                      tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className={`h-9 rounded-full flex items-center overflow-hidden ${tokens.panel}`}>
                <button
                  type="button"
                  onClick={() => issueCommand({ type: 'zoom', zoomFactor: 1.8 })}
                  title="Perkecil tampilan"
                  aria-label="Perkecil zoom peta"
                  data-testid="zoom-out-btn"
                  className={`w-9 h-full flex items-center justify-center transition-colors ${tokens.heading} ${
                    tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className={`w-px h-4 border-l ${tokens.divider}`} />
                <button
                  type="button"
                  onClick={() => issueCommand({ type: 'zoom', zoomFactor: 0.55 })}
                  title="Perbesar tampilan"
                  aria-label="Perbesar zoom peta"
                  data-testid="zoom-in-btn"
                  className={`w-9 h-full flex items-center justify-center transition-colors ${tokens.heading} ${
                    tokens.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Pin Color Legend + Info Tooltip */}
            <div
              ref={legendRef}
              data-testid="map-pin-legend"
              className={`order-2 pointer-events-auto relative flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 ${tokens.panel}`}
            >
              <span className={`inline-flex items-center gap-1 sm:gap-1.5 ${tokens.bodyText}`}>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                <span>Bulan</span>
              </span>
              <span className={`inline-flex items-center gap-1 sm:gap-1.5 ${tokens.bodyText}`}>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                <span>Mars</span>
              </span>
              <span className={`inline-flex items-center gap-1 sm:gap-1.5 ${tokens.bodyText}`}>
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                  style={{ background: 'linear-gradient(90deg, #3b82f6 50%, #ef4444 50%)' }}
                />
                <span>Bulan &amp; Mars</span>
              </span>
              <span className={`w-px h-3.5 border-l ${tokens.divider}`} aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLegendInfoOpen((v) => !v)}
                aria-expanded={legendInfoOpen}
                aria-label="Penjelasan arti warna pin"
                title="Klik untuk penjelasan arti warna pin"
                data-testid="legend-info-btn"
                className={`w-5 h-5 -mr-0.5 rounded-full flex items-center justify-center transition-colors ${
                  legendInfoOpen
                    ? tokens.accentText
                    : tokens.mutedText
                } ${tokens.isDark ? 'hover:bg-white/10 hover:text-white' : 'hover:bg-black/5 hover:text-slate-900'}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {legendInfoOpen && (
                <div
                  role="tooltip"
                  data-testid="legend-info-tooltip"
                  className={`absolute bottom-full right-0 mb-[52px] w-64 sm:w-72 max-w-[calc(100vw-1.75rem)] p-3 text-[11px] leading-relaxed z-[1070] shadow-2xl ${
                    tokens.isCartoon
                      ? tokens.panel
                      : tokens.isDark
                        ? 'bg-[#121722] border border-white/20 rounded-xl'
                        : 'bg-white border border-slate-300 rounded-xl'
                  }`}
                >
                  <div className={`font-semibold mb-1 ${tokens.heading}`}>
                    Arti Warna Pin (Target Misi Primer)
                  </div>
                  <p className={tokens.bodyText}>
                    Warna pin menunjukkan <span className={`font-semibold ${tokens.heading}`}>target misi utama</span> dalam uji lapangan NASA/ESA/USGS (Biru: Bulan, Merah: Mars, Belah: Analog Ganda). Skor persentase Bulan &amp; Mars tetap dihitung penuh pada setiap situs sebagai pembanding ilmiah.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Scale Bar + Live Camera Altitude & DMS Coordinates */}
            <div className={`order-3 pointer-events-auto flex items-end gap-2.5 text-[11px] font-mono-tabular px-2.5 py-1 ${tokens.panel}`}>
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-[10px] mb-0.5 ${tokens.mutedText}`}>{scaleBar.label}</span>
                <div
                  className={`h-1.5 border-b border-l border-r ${
                    tokens.isDark ? 'border-white/75' : 'border-slate-700'
                  }`}
                  style={{ width: `${scaleBar.widthPx}px` }}
                />
              </div>
              <span data-testid="camera-altitude" className={tokens.heading}>
                {telemetry.altitudeKm.toLocaleString('id-ID')} km
              </span>
              <span data-testid="camera-coords" className={`hidden sm:inline ${tokens.bodyText}`}>
                {formatCoordinatesDMS(telemetry.lat, telemetry.lon)}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Dedicated Full-Screen Pages (Lazy-loaded for lean initial map chunk) */}
      <Suspense
        fallback={
          <div className={`relative z-[1010] w-full h-full flex items-center justify-center text-xs ${tokens.pageCanvas} ${tokens.mutedText}`}>
            Memuat halaman analisis...
          </div>
        }
      >
        {activePage === 'materials' && (
          <div className="relative z-[1010] w-full h-full">
            <MaterialsInfoPage
              visualStyle={visualStyle}
              colorTheme={colorTheme}
              initialMaterialId={focusedMaterialId}
              initialSiteId={focusedSiteId}
              backLabel={materialReturnPage === 'compare' ? 'Kembali ke Perbandingan' : 'Kembali ke Peta'}
              onBackToMap={handleCloseMaterials}
            />
          </div>
        )}

        {activePage === 'compare' && compareSitesList.length === 2 && (
          <div className="relative z-[1010] w-full h-full">
            <CompareSitesPage
              siteA={compareSitesList[0]}
              siteB={compareSitesList[1]}
              visualStyle={visualStyle}
              colorTheme={colorTheme}
              onRepick={() => {
                setCompareSitesList([]);
                setCompareMode(true);
                setMaterialReturnPage('map');
                setActivePage('map');
              }}
              onExitCompare={handleExitCompare}
              onInspectMaterial={(matId, siteId) => handleOpenMaterial(matId, siteId, 'compare')}
            />
          </div>
        )}

        {activePage === 'sources' && (
          <div className="relative z-[1010] w-full h-full">
            <DataSourcesPage
              visualStyle={visualStyle}
              colorTheme={colorTheme}
              onBackToMap={() => {
                if (compareMode && compareSitesList.length === 2) {
                  setActivePage('compare');
                } else {
                  setActivePage('map');
                }
              }}
            />
          </div>
        )}
      </Suspense>

      {/* Global Bottom-Left: Style Toggle (Realistis vs Kartun Lo-Fi) + Origami Attribution */}
      <div className="pointer-events-none fixed bottom-3 left-3.5 z-[1060] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setVisualStyle((s) => (s === 'realistic' ? 'cartoon' : 'realistic'))}
          aria-pressed={visualStyle === 'cartoon'}
          aria-label={
            visualStyle === 'realistic'
              ? 'Ubah gaya tampilan ke Kartun Lo-Fi'
              : 'Ubah gaya tampilan ke Realistis'
          }
          data-testid="style-toggle-btn"
          className={`pointer-events-auto h-9 px-3.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all whitespace-nowrap ${
            visualStyle === 'cartoon' ? tokens.primaryButton : tokens.panel
          }`}
        >
          {visualStyle === 'cartoon' ? (
            <>
              <Palette className="w-3.5 h-3.5 shrink-0" />
              <span>Kartun Lo-Fi</span>
            </>
          ) : (
            <>
              <Globe2 className="w-3.5 h-3.5 shrink-0" />
              <span>Realistis</span>
            </>
          )}
        </button>


      </div>
    </div>
  );
}
