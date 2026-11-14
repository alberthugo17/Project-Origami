import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  MapCameraChangedEvent,
  Pin,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  GestureHandling,
  Map3D,
  Map3DCameraChangedEvent,
  Map3DRef,
  MapMode,
  Marker3D,
} from '@vis.gl/react-google-maps/3d';
import { AnalogSite } from '../data/analogSites';
import {
  altitudeKmToRangeMeters,
  altitudeKmToZoom,
  clamp,
  normalizeHeadingDeg,
  rangeMetersToAltitudeKm,
  zoomToAltitudeKm,
} from '../utils/geoMath';

export interface CameraTelemetry {
  lat: number;
  lon: number;
  altitudeKm: number;
  headingDeg: number;
  isTilted3D: boolean;
}

export interface GlobeCommand {
  type: 'flyTo' | 'zoom' | 'resetNorth' | 'toggleTilt';
  lat?: number;
  lon?: number;
  altitudeKm?: number;
  zoomFactor?: number;
  tilt3D?: boolean;
  seq: number;
}

interface GoogleEarthGlobeProps {
  sites: AnalogSite[];
  selectedSiteId: string | null;
  showLabels: boolean;
  command: GlobeCommand | null;
  onSelectSite: (site: AnalogSite) => void;
  onTelemetryChange: (telemetry: CameraTelemetry) => void;
}

const INITIAL_LAT = 6;
const INITIAL_LON = 78;
const INITIAL_ALTITUDE_KM = 19370;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

function detectWebGL2Support(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function getPinLabel(site: AnalogSite): string {
  return site.id === 'gunung-bromo'
    ? 'Gunung Bromo (Top)'
    : site.name.split('(')[0].trim();
}

interface GlobeInnerProps extends GoogleEarthGlobeProps {
  use3D: boolean;
  onFallbackTo2D: () => void;
}

const Globe2DFallback: React.FC<GoogleEarthGlobeProps> = ({
  sites,
  selectedSiteId,
  showLabels,
  command,
  onSelectSite,
  onTelemetryChange,
}) => {
  const map = useMap('terra-analog-2d-map');
  const lastSeqRef = useRef(-1);

  const handleCameraChanged = useCallback(
    (ev: MapCameraChangedEvent) => {
      const { center, zoom, heading, tilt } = ev.detail;
      onTelemetryChange({
        lat: center.lat,
        lon: center.lng,
        altitudeKm: zoomToAltitudeKm(zoom),
        headingDeg: normalizeHeadingDeg(heading || 0),
        isTilted3D: (tilt || 0) >= 12,
      });
    },
    [onTelemetryChange]
  );

  useEffect(() => {
    if (!map || !command || command.seq === lastSeqRef.current) return;
    lastSeqRef.current = command.seq;

    if (
      command.type === 'flyTo' &&
      command.lat !== undefined &&
      command.lon !== undefined
    ) {
      map.panTo({ lat: command.lat, lng: command.lon });
      map.setZoom(altitudeKmToZoom(command.altitudeKm ?? 24));
      map.setHeading(0);
      map.setTilt(command.tilt3D ? 45 : 0);
    } else if (command.type === 'zoom' && command.zoomFactor !== undefined) {
      const curZoom = map.getZoom() ?? 2.5;
      const delta = command.zoomFactor < 1 ? 1.2 : -1.2;
      map.setZoom(clamp(curZoom + delta, 2, 18));
    } else if (command.type === 'resetNorth') {
      map.setHeading(0);
      map.setTilt(0);
    } else if (command.type === 'toggleTilt') {
      const curTilt = map.getTilt() ?? 0;
      const nextTilt = curTilt > 10 ? 0 : 45;
      if (nextTilt > 0 && (map.getZoom() ?? 2.5) < 6) {
        map.setZoom(9);
      }
      map.setTilt(nextTilt);
    }
  }, [command, map]);

  return (
    <GoogleMap
      id="terra-analog-2d-map"
      mapId="DEMO_MAP_ID"
      mapTypeId={showLabels ? 'hybrid' : 'satellite'}
      defaultCenter={{ lat: INITIAL_LAT, lng: INITIAL_LON }}
      defaultZoom={altitudeKmToZoom(INITIAL_ALTITUDE_KM)}
      gestureHandling="greedy"
      disableDefaultUI={true}
      backgroundColor="#000000"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      onCameraChanged={handleCameraChanged}
      style={{ width: '100%', height: '100%' }}
    >
      {sites.map((site) => {
        const isSelected = site.id === selectedSiteId;
        const isTop = Boolean(site.isTopFinding);
        return (
          <AdvancedMarker
            key={site.id}
            position={{ lat: site.lat, lng: site.lon }}
            title={`${site.name} (${site.targetBody}, ${site.similarityScore}%)`}
            zIndex={isSelected ? 100 : isTop ? 90 : Math.round(site.similarityScore)}
            onClick={() => onSelectSite(site)}
          >
            <div className="flex flex-col items-center cursor-pointer group">
              <span
                className={`mb-1 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shadow-md ${
                  isSelected
                    ? 'bg-[#202124] text-white border border-[#8ab4f8]'
                    : isTop
                      ? 'bg-[#202124] text-[#fde68a] border border-amber-400/60'
                      : 'bg-[#202124]/90 text-[#e8eaed] border border-white/15'
                }`}
              >
                {getPinLabel(site)}
              </span>
              <Pin
                background={isSelected ? '#8ab4f8' : site.accentColor}
                borderColor="#0f172a"
                glyphColor="#0f172a"
                scale={isSelected ? 1.2 : isTop ? 1.1 : 0.9}
              />
            </div>
          </AdvancedMarker>
        );
      })}
    </GoogleMap>
  );
};

const GlobeViewport: React.FC<GlobeInnerProps> = ({
  sites,
  selectedSiteId,
  showLabels,
  command,
  onSelectSite,
  onTelemetryChange,
  use3D,
  onFallbackTo2D,
}) => {
  const apiStatus = useApiLoadingStatus();
  const map3dRef = useRef<Map3DRef>(null);
  const lastSeqRef = useRef(-1);
  const lastTelemetryEmitRef = useRef(0);
  const [isRegionalZoom, setIsRegionalZoom] = useState(false);

  const handle3DCameraChanged = useCallback(
    (ev: Map3DCameraChangedEvent) => {
      const now = performance.now();
      if (now - lastTelemetryEmitRef.current < 80) return;
      lastTelemetryEmitRef.current = now;

      const { center, range, heading, tilt } = ev.detail;
      const altitudeKm = rangeMetersToAltitudeKm(range);
      setIsRegionalZoom(altitudeKm < 1500);
      onTelemetryChange({
        lat: center.lat,
        lon: center.lng,
        altitudeKm,
        headingDeg: normalizeHeadingDeg(heading),
        isTilted3D: tilt >= 12,
      });
    },
    [onTelemetryChange]
  );

  useEffect(() => {
    if (!use3D || !command || command.seq === lastSeqRef.current) return;
    const handle = map3dRef.current;
    const map3d = handle?.map3d;
    if (!handle || !map3d) return;
    lastSeqRef.current = command.seq;

    const currentCenter = map3d.center
      ? {
          lat: map3d.center.lat,
          lng: map3d.center.lng,
          altitude: map3d.center.altitude ?? 0,
        }
      : { lat: INITIAL_LAT, lng: INITIAL_LON, altitude: 0 };
    const currentRange = map3d.range ?? altitudeKmToRangeMeters(INITIAL_ALTITUDE_KM);
    const currentHeading = map3d.heading ?? 0;
    const currentTilt = map3d.tilt ?? 0;
    const currentRoll = map3d.roll ?? 0;

    if (
      command.type === 'flyTo' &&
      command.lat !== undefined &&
      command.lon !== undefined
    ) {
      const targetRange = altitudeKmToRangeMeters(command.altitudeKm ?? 24);
      const targetTilt = command.tilt3D ? 56 : 0;
      handle.flyCameraTo({
        endCamera: {
          center: { lat: command.lat, lng: command.lon, altitude: 0 },
          range: targetRange,
          tilt: targetTilt,
          heading: 0,
          roll: 0,
        },
        durationMillis: 1300,
      });
      onTelemetryChange({
        lat: command.lat,
        lon: command.lon,
        altitudeKm: rangeMetersToAltitudeKm(targetRange),
        headingDeg: 0,
        isTilted3D: targetTilt >= 12,
      });
    } else if (command.type === 'zoom' && command.zoomFactor !== undefined) {
      const nextRange = clamp(
        currentRange * command.zoomFactor,
        500,
        26_000_000
      );
      handle.flyCameraTo({
        endCamera: {
          center: currentCenter,
          range: nextRange,
          tilt: currentTilt,
          heading: currentHeading,
          roll: currentRoll,
        },
        durationMillis: 450,
      });
    } else if (command.type === 'resetNorth') {
      handle.flyCameraTo({
        endCamera: {
          center: currentCenter,
          range: currentRange,
          tilt: 0,
          heading: 0,
          roll: 0,
        },
        durationMillis: 600,
      });
    } else if (command.type === 'toggleTilt') {
      const nextTilt = currentTilt >= 12 ? 0 : 56;
      const nextRange =
        nextTilt > 0 && currentRange > 1_200_000 ? 600_000 : currentRange;
      handle.flyCameraTo({
        endCamera: {
          center: currentCenter,
          range: nextRange,
          tilt: nextTilt,
          heading: currentHeading,
          roll: 0,
        },
        durationMillis: 700,
      });
    }
  }, [command, onTelemetryChange, use3D]);

  if (
    apiStatus === APILoadingStatus.FAILED ||
    apiStatus === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black px-6 text-center">
        <div className="max-w-md rounded-xl bg-[#202124] border border-white/15 p-5 text-sm text-[#e8eaed]">
          <p className="font-display font-semibold text-white">
            Gagal Memuat Google Maps Platform
          </p>
          <p className="mt-1.5 text-xs text-[#9aa0a6] leading-relaxed">
            Periksa koneksi jaringan atau kuota kunci API Google Maps Anda, lalu muat ulang halaman.
          </p>
        </div>
      </div>
    );
  }

  if (!use3D) {
    return (
      <Globe2DFallback
        sites={sites}
        selectedSiteId={selectedSiteId}
        showLabels={showLabels}
        command={command}
        onSelectSite={onSelectSite}
        onTelemetryChange={onTelemetryChange}
      />
    );
  }

  return (
    <Map3D
      ref={map3dRef}
      id="terra-analog-3d-globe"
      mode={showLabels ? MapMode.HYBRID : MapMode.SATELLITE}
      defaultCenter={{ lat: INITIAL_LAT, lng: INITIAL_LON, altitude: 0 }}
      defaultRange={altitudeKmToRangeMeters(INITIAL_ALTITUDE_KM)}
      defaultHeading={0}
      defaultTilt={0}
      defaultRoll={0}
      defaultUIHidden={true}
      gestureHandling={GestureHandling.GREEDY}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      onCameraChanged={handle3DCameraChanged}
      onError={onFallbackTo2D}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {sites.map((site) => {
        const isSelected = site.id === selectedSiteId;
        const isTop = Boolean(site.isTopFinding);
        const hideOrbitalClusterLabel =
          !isSelected && !isRegionalZoom && site.id === 'kawah-ijen';
        return (
          <Marker3D
            key={site.id}
            position={{ lat: site.lat, lng: site.lon, altitude: 120 }}
            altitudeMode="RELATIVE_TO_GROUND"
            extruded={isSelected || isTop}
            sizePreserved={true}
            collisionBehavior={
              isSelected || isTop
                ? 'REQUIRED'
                : 'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
            }
            zIndex={isSelected ? 1000 : isTop ? 900 : Math.round(site.similarityScore)}
            label={hideOrbitalClusterLabel ? undefined : getPinLabel(site)}
            title={`${site.name} (${site.targetBody}, ${site.similarityScore}%)`}
            onClick={() => onSelectSite(site)}
          >
            <Pin
              background={isSelected ? '#8ab4f8' : site.accentColor}
              borderColor="#0f172a"
              glyphColor="#0f172a"
              scale={isSelected ? 1.25 : isTop ? 1.15 : 0.95}
            />
          </Marker3D>
        );
      })}
    </Map3D>
  );
};

export const GoogleEarthGlobe: React.FC<GoogleEarthGlobeProps> = (props) => {
  const [use3D, setUse3D] = useState<boolean>(() => detectWebGL2Support());

  const handleFallbackTo2D = useCallback(() => {
    setUse3D(false);
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div
        data-testid="earth-globe-canvas"
        className="w-full h-full flex items-center justify-center bg-black px-6 text-center"
      >
        <div className="max-w-md rounded-xl bg-[#202124] border border-white/15 p-5 text-sm text-[#e8eaed]">
          <p className="font-display font-semibold text-white">
            Konfigurasi Google Maps API Diperlukan
          </p>
          <p className="mt-1.5 text-xs text-[#9aa0a6] leading-relaxed">
            Variabel lingkungan <code className="text-white">VITE_GOOGLE_MAPS_API_KEY</code> belum tersedia pada runtime ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="earth-globe-canvas"
      data-render-mode={use3D ? '3d' : '2d-fallback'}
      className="relative w-full h-full overflow-hidden bg-black"
    >
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={['maps3d', 'marker']}
        language="id"
        region="ID"
      >
        <GlobeViewport
          {...props}
          use3D={use3D}
          onFallbackTo2D={handleFallbackTo2D}
        />
      </APIProvider>
    </div>
  );
};
