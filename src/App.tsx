import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ANALOG_SITES, AnalogSite } from './data/analogSites';
import { TargetFilter, filterAnalogSites, getTopFindingSite } from './utils/analogFilter';
import { computeScaleBar, formatCoordinatesDMS } from './utils/geoMath';
import {
  CameraTelemetry,
  GlobeCommand,
  LeafletMap,
} from './components/LeafletMap';
import { TopBar } from './components/TopBar';
import { TopFindingPopup } from './components/TopFindingPopup';
import { SiteAnalysisPanel } from './components/SiteAnalysisPanel';
import { AllSitesDrawer } from './components/AllSitesDrawer';
import { DataSourcesModal } from './components/DataSourcesModal';

export default function App() {
  const topFinding = useMemo(() => getTopFindingSite(ANALOG_SITES), []);

  const [targetFilter, setTargetFilter] = useState<TargetFilter>('All');
  const [selectedSite, setSelectedSite] = useState<AnalogSite | null>(null);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);

  // Startup top-finding popup: appears ONLY on initial load and stays gone once dismissed
  const [showTopFindingPopup, setShowTopFindingPopup] = useState(true);

  // Navigation history for back/forward buttons
  const [history, setHistory] = useState<AnalogSite[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const cmdSeqRef = useRef(0);
  const [globeCommand, setGlobeCommand] = useState<GlobeCommand | null>(null);

  const [telemetry, setTelemetry] = useState<CameraTelemetry>({
    lat: 6,
    lon: 78,
    altitudeKm: 19370,
  });

  const visibleSites = useMemo(
    () => filterAnalogSites(ANALOG_SITES, { targetFilter }),
    [targetFilter]
  );

  const issueCommand = useCallback((cmd: Omit<GlobeCommand, 'seq'>) => {
    cmdSeqRef.current += 1;
    setGlobeCommand({ ...cmd, seq: cmdSeqRef.current });
  }, []);

  const flyToSite = useCallback(
    (site: AnalogSite, altitudeKm = 24, recordHistory = true) => {
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
      flyToSite(site, 24, true);
    },
    [flyToSite]
  );

  const handleInspectTopFinding = useCallback(
    (site: AnalogSite) => {
      setShowTopFindingPopup(false);
      flyToSite(site, 24, true);
    },
    [flyToSite]
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDataSources) setShowDataSources(false);
        else if (selectedSite) setSelectedSite(null);
        else if (showSitesList) setShowSitesList(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedSite, showDataSources, showSitesList]);

  const scaleBar = useMemo(
    () => computeScaleBar(telemetry.altitudeKm),
    [telemetry.altitudeKm]
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-black overflow-hidden">
      {/* Top Navigation & Search Bar */}
      <TopBar
        allSites={ANALOG_SITES}
        targetFilter={targetFilter}
        onTargetFilterChange={setTargetFilter}
        canGoBack={historyIdx > 0}
        canGoForward={historyIdx < history.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onSelectSite={(site) => flyToSite(site, 24, true)}
        showSitesList={showSitesList}
        onToggleSitesList={() => {
          setShowSitesList((v) => !v);
          if (!showSitesList) setSelectedSite(null);
        }}
        showDataSources={showDataSources}
        onOpenDataSources={() => setShowDataSources(true)}
      />

      {/* Main Satellite Map Stage (Leaflet + OpenStreetMap & Esri World Imagery) */}
      <main className="relative flex-1 w-full overflow-hidden">
        <LeafletMap
          sites={visibleSites}
          selectedSiteId={selectedSite?.id ?? null}
          command={globeCommand}
          onSelectSite={handleSelectPin}
          onTelemetryChange={setTelemetry}
        />

        {/* Left Side Detail / Catalog Overlay */}
        <div className="pointer-events-none absolute top-[96px] left-4 z-[1040] flex flex-col gap-3">
          {selectedSite ? (
            <div className="pointer-events-auto">
              <SiteAnalysisPanel
                site={selectedSite}
                onClose={() => setSelectedSite(null)}
                onZoomCloser={(site) => flyToSite(site, 6, false)}
                onOpenDataSources={() => setShowDataSources(true)}
              />
            </div>
          ) : showSitesList ? (
            <div className="pointer-events-auto">
              <AllSitesDrawer
                sites={visibleSites}
                selectedSiteId={null}
                onSelectSite={(site) => flyToSite(site, 24, true)}
                onClose={() => setShowSitesList(false)}
              />
            </div>
          ) : null}
        </div>

        {/* Bottom-Left Data Attribution (Minimap removed per request) */}
        <div className="pointer-events-none absolute bottom-3 left-3.5 z-[1040] flex items-center">
          <div className="pointer-events-auto flex items-center gap-2.5 text-[11px] text-[#d2d5da] bg-[#1f2023]/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            <span className="font-display font-semibold text-white tracking-tight">
              TerraAnalog
            </span>
            <span className="font-mono-tabular text-[#9aa0a6]">100%</span>
            <button
              type="button"
              onClick={() => setShowDataSources(true)}
              className="underline decoration-white/40 hover:text-white transition-colors"
            >
              Atribusi data
            </button>
          </div>
        </div>

        {/* Bottom-Right Top Finding Popup + Zoom Controls & Telemetry */}
        <div className="pointer-events-none absolute bottom-3 right-3.5 z-[1040] flex flex-col items-end gap-3">
          {showTopFindingPopup && (
            <div className="pointer-events-auto">
              <TopFindingPopup
                site={topFinding}
                onInspect={handleInspectTopFinding}
                onDismiss={() => setShowTopFindingPopup(false)}
              />
            </div>
          )}

          {/* Zoom Control Cluster (3D & Compass removed per user request) */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="h-9 rounded-full bg-[#1f2023]/60 backdrop-blur-md border border-white/12 flex items-center overflow-hidden">
              <button
                type="button"
                onClick={() => issueCommand({ type: 'zoom', zoomFactor: 1.8 })}
                title="Perkecil tampilan"
                aria-label="Perkecil zoom peta"
                data-testid="zoom-out-btn"
                className="w-9 h-full flex items-center justify-center text-[#e8eaed] hover:bg-white/10 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/12" />
              <button
                type="button"
                onClick={() => issueCommand({ type: 'zoom', zoomFactor: 0.55 })}
                title="Perbesar tampilan"
                aria-label="Perbesar zoom peta"
                data-testid="zoom-in-btn"
                className="w-9 h-full flex items-center justify-center text-[#e8eaed] hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scale Bar + Live Camera Altitude & DMS Coordinates */}
          <div className="pointer-events-auto flex items-end gap-3 text-[11px] text-[#e8eaed] font-mono-tabular bg-[#1f2023]/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#d2d5da] mb-0.5">{scaleBar.label}</span>
              <div
                className="h-1.5 border-b border-l border-r border-white/75"
                style={{ width: `${scaleBar.widthPx}px` }}
              />
            </div>
            <span data-testid="camera-altitude">
              Kamera: {telemetry.altitudeKm.toLocaleString('id-ID')} km
            </span>
            <span data-testid="camera-coords" className="hidden sm:inline">
              {formatCoordinatesDMS(telemetry.lat, telemetry.lon)}
            </span>
          </div>
        </div>
      </main>

      {/* Open Space Agency Data Sources & Methodology Tab Modal */}
      {showDataSources && <DataSourcesModal onClose={() => setShowDataSources(false)} />}
    </div>
  );
}
