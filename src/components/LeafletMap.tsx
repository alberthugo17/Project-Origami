import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ANALOG_SITES, AnalogSite } from '../data/analogSites';
import { WORLD_LANDMASSES, LandMass } from '../data/worldCoastlines';
import { ColorTheme, VisualStyle } from '../types/theme';
import { TargetFilter, getEffectiveSimilarityScore } from '../utils/analogFilter';
import {
  altitudeKmToZoom,
  clamp,
  zoomToAltitudeKm,
} from '../utils/geoMath';

export interface CameraTelemetry {
  lat: number;
  lon: number;
  altitudeKm: number;
}

export interface GlobeCommand {
  type: 'flyTo' | 'zoom';
  lat?: number;
  lon?: number;
  altitudeKm?: number;
  zoomFactor?: number;
  seq: number;
}

interface LeafletMapProps {
  sites: AnalogSite[];
  targetFilter?: TargetFilter;
  topSiteId?: string | null;
  selectedSiteId: string | null;
  compareMode: boolean;
  compareSiteIds: string[];
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  isVisible: boolean;
  command: GlobeCommand | null;
  onSelectSite: (site: AnalogSite) => void;
  onTelemetryChange: (telemetry: CameraTelemetry) => void;
}

const INITIAL_LAT = 6;
const INITIAL_LON = 78;
const INITIAL_ALTITUDE_KM = 19370;

const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [-85.05112878, -180],
  [85.05112878, 180],
];

function computeMinZoom(container: HTMLElement | null): number {
  if (!container) return 3;
  const w = container.clientWidth || window.innerWidth || 1440;
  const h = container.clientHeight || window.innerHeight || 900;
  const maxDim = Math.max(w, h);
  return clamp(Math.ceil(Math.log2(maxDim / 256)), 2, 6);
}

function getCartoonLandFill(biomeHint: LandMass['biomeHint'], theme: ColorTheme): string {
  if (theme === 'light') {
    switch (biomeHint) {
      case 'tropical':
        return '#c3f73a'; // Acid lime sticker pop
      case 'arid':
        return '#fde047'; // Sunny yellow
      case 'polar':
        return '#fffdf7'; // Warm cream snow
      default:
        return '#86efac'; // Fresh pastel mint
    }
  }
  switch (biomeHint) {
    case 'tropical':
      return '#2dd4bf'; // Luminous turquoise/cyan facet
    case 'arid':
      return '#818cf8'; // Smooth periwinkle-violet facet
    case 'polar':
      return '#c084fc'; // Soft cosmic lavender
    default:
      return '#4f46e5'; // Deep royal cosmic indigo
  }
}

function getCartoonBiomeRingColor(biome: AnalogSite['biome'], theme: ColorTheme): string {
  if (theme === 'light') {
    switch (biome) {
      case 'Volcanic':
        return '#ff6b9e'; // Bubblegum pink
      case 'Desert':
        return '#fcd34d'; // Sunny yellow
      case 'Polar':
        return '#7dd3fc'; // Sky cyan
      case 'Hydrothermal':
        return '#fb7185';
      case 'Cave / Lava Tube':
        return '#c4b5fd'; // Lavender
      default:
        return '#c3f73a'; // Acid lime
    }
  }
  switch (biome) {
    case 'Volcanic':
      return '#ff6584'; // Luminous coral
    case 'Desert':
      return '#fb923c'; // Warm sunset amber
    case 'Polar':
      return '#38bdf8'; // Radiant sky cyan
    case 'Hydrothermal':
      return '#f43f5e'; // Rose neon
    case 'Cave / Lava Tube':
      return '#a855f7'; // Cosmic purple
    default:
      return '#38bdf8';
  }
}

function createPinHtml(
  site: AnalogSite,
  isSelected: boolean,
  compareIndex: number,
  visualStyle: VisualStyle,
  colorTheme: ColorTheme,
  isTop: boolean
): { width: number; height: number; html: string } {
  const isCartoon = visualStyle === 'cartoon';
  const isDark = colorTheme === 'dark';
  const isCompared = compareIndex >= 0;
  const compareBadge = compareIndex === 0 ? 'A' : compareIndex === 1 ? 'B' : '';
  const baseName = site.name.split('(')[0].trim();
  const shortName = isTop ? `${baseName} (Top)` : baseName;
  const label = isCompared ? `[${compareBadge}] ${shortName}` : shortName;

  // Offset Ijen Crater and Kazumura labels below their pins so neighboring pins never collide at global zoom
  const labelBelow =
    (site.id === 'kawah-ijen' || site.id === 'kazumura-lava-tubes') &&
    !isSelected &&
    !isCompared;

  let badgeStyle = '';
  if (isCartoon) {
    if (isDark) {
      if (isCompared) {
        badgeStyle =
          'background: linear-gradient(135deg, #ff6584, #f43f5e); color: #ffffff; border: 1.5px solid #ffccd5; box-shadow: 0 4px 14px rgba(255,101,132,0.45); font-weight: 800;';
      } else if (isSelected) {
        badgeStyle =
          'background: #181339; color: #38bdf8; border: 1.5px solid #38bdf8; box-shadow: 0 4px 14px rgba(56,189,248,0.4); font-weight: 800;';
      } else if (isTop) {
        badgeStyle =
          'background: linear-gradient(135deg, #ff6584, #ec4899); color: #ffffff; border: 1.5px solid #ffffff; box-shadow: 0 4px 16px rgba(255,101,132,0.5); font-weight: 800;';
      } else {
        badgeStyle =
          'background: #181339; color: #f1f5f9; border: 1.5px solid rgba(129, 140, 248, 0.45); box-shadow: 0 4px 12px rgba(10, 8, 30, 0.5); font-weight: 600;';
      }
    } else {
      const ink = '#0e1a18';
      const shd = '#0e1a18';
      if (isCompared) {
        badgeStyle = `background: #c3f73a; color: #0e1a18; border: 2px solid ${ink}; box-shadow: 2px 2px 0 ${shd}; font-weight: 800;`;
      } else if (isSelected) {
        badgeStyle = `background: #7dd3fc; color: #0e1a18; border: 2px solid ${ink}; box-shadow: 2px 2px 0 ${shd}; font-weight: 800;`;
      } else if (isTop) {
        badgeStyle = `background: #ff6b9e; color: #0e1a18; border: 2px solid ${ink}; box-shadow: 2px 2px 0 ${shd}; font-weight: 800;`;
      } else {
        badgeStyle =
          'background: #fffdf7; color: #0e1a18; border: 2px solid #0e1a18; box-shadow: 2px 2px 0 #0e1a18; font-weight: 700;';
      }
    }
  } else {
    if (isCompared) {
      badgeStyle =
        'background: #2563eb; color: #ffffff; border: 1.5px solid #93c5fd; box-shadow: 0 4px 10px rgba(0,0,0,0.45); font-weight: 700;';
    } else if (isSelected) {
      badgeStyle = isDark
        ? 'background: #202124; color: #ffffff; border: 1.5px solid #8ab4f8; box-shadow: 0 4px 6px rgba(0,0,0,0.5);'
        : 'background: #1d4ed8; color: #ffffff; border: 1px solid #1e40af; box-shadow: 0 4px 8px rgba(15,23,42,0.28);';
    } else if (isTop) {
      badgeStyle = isDark
        ? 'background: #202124; color: #fde68a; border: 1px solid rgba(251,191,36,0.65); box-shadow: 0 4px 6px rgba(0,0,0,0.5);'
        : 'background: #fffbeb; color: #92400e; border: 1px solid #f59e0b; box-shadow: 0 3px 8px rgba(15,23,42,0.2);';
    } else {
      badgeStyle = isDark
        ? 'background: rgba(32,33,36,0.92); color: #e8eaed; border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 4px 6px rgba(0,0,0,0.5);'
        : 'background: rgba(255,255,255,0.95); color: #0f172a; border: 1px solid rgba(15,23,42,0.2); box-shadow: 0 3px 8px rgba(15,23,42,0.18);';
    }
  }

  const isDualTarget = site.targetBody === 'Moon & Mars';
  const pinColor =
    site.targetBody === 'Mars'
      ? '#ef4444'
      : site.targetBody === 'Moon'
        ? '#3b82f6'
        : '#8b5cf6';
  const scale = isCompared ? 1.32 : isSelected ? 1.25 : isCartoon ? 1.14 : isTop ? 1.15 : 0.95;
  const strokeColor = isCartoon ? (isDark ? '#818cf8' : '#0e1a18') : '#0f172a';
  const strokeWidth = isCartoon ? '2.3' : '1.5';

  const pinW = Math.round(26 * scale);
  const pinH = Math.round(36 * scale);

  const labelEl = `
    <span style="position:absolute;left:50%;transform:translateX(-50%);${labelBelow ? 'top:100%;margin-top:4px;' : 'bottom:100%;margin-bottom:4px;'}padding:2px 9px;border-radius:${isCartoon ? '9999px' : '5px'};font-size:11px;white-space:nowrap;pointer-events:auto;${badgeStyle}">
      ${label} · ${site.temperatureProfile.avgC}°C
    </span>
  `;

  const pinBodySvg = isDualTarget
    ? `<path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22V0z" fill="#3b82f6" />
       <path d="M12 0v34s12-13 12-22C24 5.37 18.63 0 12 0z" fill="#ef4444" />
       <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`
    : `<path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z" fill="${pinColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;

  const svgEl = `
    <svg width="${pinW}" height="${pinH}" viewBox="0 0 24 34" fill="none" style="display:block;filter:${isCartoon ? (isDark ? 'drop-shadow(0 3px 6px rgba(10,8,30,0.6))' : 'drop-shadow(2px 2px 0px #0e1a18)') : 'none'};">
      ${pinBodySvg}
      ${
        isCartoon
          ? `<circle cx="9.2" cy="10" r="1.45" fill="${isDark ? '#ffffff' : '#0e1a18'}" />
             <circle cx="14.8" cy="10" r="1.45" fill="${isDark ? '#ffffff' : '#0e1a18'}" />
             <path d="M9.4 13.6c1.5 1.5 3.7 1.5 5.2 0" stroke="${isDark ? '#ffffff' : '#0e1a18'}" stroke-width="1.6" stroke-linecap="round" />`
          : `<circle cx="12" cy="11" r="4.5" fill="#0f172a" />`
      }
    </svg>
  `;

  return {
    width: pinW,
    height: pinH,
    html: `
      <div style="position:relative;width:${pinW}px;height:${pinH}px;display:flex;align-items:flex-end;justify-content:center;cursor:pointer;overflow:visible;">
        ${labelEl}
        ${svgEl}
      </div>
    `,
  };
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  sites,
  targetFilter = 'All',
  topSiteId = null,
  selectedSiteId,
  compareMode,
  compareSiteIds,
  visualStyle,
  colorTheme,
  isVisible,
  command,
  onSelectSite,
  onTelemetryChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const fallbackGroupRef = useRef<L.LayerGroup | null>(null);
  const realisticGroupRef = useRef<L.LayerGroup | null>(null);
  const cartoonGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const lastSeqRef = useRef(-1);
  const onSelectSiteRef = useRef(onSelectSite);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const minZoom = computeMinZoom(mapContainerRef.current);
    const initialZoom = Math.max(minZoom, altitudeKmToZoom(INITIAL_ALTITUDE_KM));

    const map = L.map(mapContainerRef.current, {
      center: [INITIAL_LAT, INITIAL_LON],
      zoom: initialZoom,
      minZoom,
      maxZoom: 18,
      maxBounds: WORLD_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: false,
      bounceAtZoomLimits: false,
    });

    // Dedicated vector landmass pane sitting BELOW Leaflet's tilePane (zIndex 200)
    // so if Esri tiles are momentarily loading during zoom/pan, the map NEVER goes blank.
    const fallbackPane = map.createPane('fallbackPane');
    fallbackPane.style.zIndex = '150';
    fallbackPane.style.pointerEvents = 'none';

    const fallbackGroup = L.layerGroup().addTo(map);
    const realisticGroup = L.layerGroup().addTo(map);
    const cartoonGroup = L.layerGroup();
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    fallbackGroupRef.current = fallbackGroup;
    realisticGroupRef.current = realisticGroup;
    cartoonGroupRef.current = cartoonGroup;
    markersLayerRef.current = markersLayer;

    const emitTelemetry = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onTelemetryChange({
        lat: clamp(center.lat, -85.05, 85.05),
        lon: clamp(center.lng, -180, 180),
        altitudeKm: zoomToAltitudeKm(zoom),
      });
    };

    map.on('move', emitTelemetry);
    map.on('zoom', emitTelemetry);

    const handleResize = () => {
      if (!mapContainerRef.current || !mapInstanceRef.current) return;
      mapInstanceRef.current.invalidateSize({ pan: false });
      const newMinZoom = computeMinZoom(mapContainerRef.current);
      mapInstanceRef.current.setMinZoom(newMinZoom);
      if (mapInstanceRef.current.getZoom() < newMinZoom) {
        mapInstanceRef.current.setZoom(newMinZoom);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(mapContainerRef.current);
    }
    window.addEventListener('resize', handleResize);

    emitTelemetry();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      map.off('move', emitTelemetry);
      map.off('zoom', emitTelemetry);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onTelemetryChange]);

  // Re-sync tile sizes whenever switching back from compare mode or another full-page view
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isVisible) return;
    map.invalidateSize({ pan: false });
    const raf = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });
    return () => cancelAnimationFrame(raf);
  }, [isVisible, compareMode]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const fallbackGroup = fallbackGroupRef.current;
    const realisticGroup = realisticGroupRef.current;
    const cartoonGroup = cartoonGroupRef.current;
    if (!map || !fallbackGroup || !realisticGroup || !cartoonGroup) return;

    fallbackGroup.clearLayers();
    realisticGroup.clearLayers();
    cartoonGroup.clearLayers();

    if (visualStyle === 'realistic') {
      if (map.hasLayer(cartoonGroup)) map.removeLayer(cartoonGroup);
      if (!map.hasLayer(realisticGroup)) realisticGroup.addTo(map);

      const isLight = colorTheme === 'light';

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          keepBuffer: 6,
          updateWhenIdle: false,
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, USGS',
        }
      ).addTo(realisticGroup);

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          keepBuffer: 6,
          opacity: isLight ? 0.92 : 0.85,
        }
      ).addTo(realisticGroup);
    } else {
      if (map.hasLayer(realisticGroup)) map.removeLayer(realisticGroup);
      if (!map.hasLayer(cartoonGroup)) cartoonGroup.addTo(map);

      const isLight = colorTheme === 'light';
      const gridColor = isLight ? 'rgba(14, 26, 24, 0.16)' : 'rgba(129, 140, 248, 0.15)';
      const strokeColor = isLight ? '#0e1a18' : '#4f46e5';
      const shadowColor = isLight ? '#0e1a18' : 'rgba(8, 6, 25, 0.7)';

      for (let lat = -60; lat <= 60; lat += 30) {
        L.polyline(
          [
            [lat, -180],
            [lat, 180],
          ],
          {
            color: gridColor,
            weight: lat === 0 ? 2 : 1.1,
            dashArray: lat === 0 ? '8 6' : '4 8',
            interactive: false,
          }
        ).addTo(cartoonGroup);
      }
      for (let lon = -150; lon <= 150; lon += 30) {
        L.polyline(
          [
            [-85, lon],
            [85, lon],
          ],
          {
            color: gridColor,
            weight: 1.1,
            dashArray: '4 8',
            interactive: false,
          }
        ).addTo(cartoonGroup);
      }

      // Pass 1: Neo-Brutalist paper-cutout drop shadow silhouettes beneath continents
      WORLD_LANDMASSES.forEach((land) => {
        const shadowLatLngs: L.LatLngExpression[] = land.coords.map(([lon, lat]) => [
          clamp(lat - 0.85, -85, 85),
          clamp(lon + 0.95, -180, 180),
        ]);
        L.polygon(shadowLatLngs, {
          color: shadowColor,
          weight: 0,
          fillColor: shadowColor,
          fillOpacity: isLight ? 0.88 : 0.72,
          interactive: false,
        }).addTo(cartoonGroup);
      });

      // Pass 2: Bold inked sticker landmasses
      WORLD_LANDMASSES.forEach((land) => {
        const latLngs: L.LatLngExpression[] = land.coords.map(([lon, lat]) => [lat, lon]);
        L.polygon(latLngs, {
          color: strokeColor,
          weight: 2.5,
          lineJoin: 'round',
          fillColor: getCartoonLandFill(land.biomeHint, colorTheme),
          fillOpacity: 1,
          interactive: false,
        }).addTo(cartoonGroup);
      });

      // Pass 3: Sticker biome rings around each analog site
      ANALOG_SITES.forEach((site) => {
        const ringColor = getCartoonBiomeRingColor(site.biome, colorTheme);
        [24000, 12000].forEach((radius, idx) => {
          L.circle([site.lat, site.lon], {
            radius,
            color: strokeColor,
            weight: idx === 0 ? 1.8 : 2,
            dashArray: idx === 0 ? '5 5' : undefined,
            fillColor: ringColor,
            fillOpacity: idx === 0 ? 0.28 : 0.52,
            interactive: false,
          }).addTo(cartoonGroup);
        });
      });
    }
  }, [visualStyle, colorTheme]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    sites.forEach((site) => {
      const isSelected = site.id === selectedSiteId;
      const compareIndex = compareMode ? compareSiteIds.indexOf(site.id) : -1;
      const isTop = topSiteId ? site.id === topSiteId : Boolean(site.isTopFinding);
      const effectiveScore = getEffectiveSimilarityScore(site, targetFilter);
      const scopeLabel =
        targetFilter === 'Moon'
          ? 'Moon'
          : targetFilter === 'Mars'
            ? 'Mars'
            : site.targetBody;

      const pin = createPinHtml(site, isSelected, compareIndex, visualStyle, colorTheme, isTop);
      const customIcon = L.divIcon({
        className: 'analog-site-marker',
        html: pin.html,
        iconSize: [pin.width, pin.height],
        iconAnchor: [Math.round(pin.width / 2), pin.height],
      });

      const marker = L.marker([site.lat, site.lon], {
        icon: customIcon,
        zIndexOffset:
          compareIndex >= 0
            ? 1200 + compareIndex
            : isSelected
              ? 1000
              : isTop
                ? 900
                : Math.round(effectiveScore),
        title: `${site.name} (${scopeLabel}, ${effectiveScore.toFixed(1)}%)`,
      });

      marker.on('click', () => {
        onSelectSiteRef.current(site);
      });

      markersLayer.addLayer(marker);
    });
  }, [sites, targetFilter, topSiteId, selectedSiteId, compareMode, compareSiteIds, visualStyle, colorTheme]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !command || command.seq === lastSeqRef.current) return;
    lastSeqRef.current = command.seq;

    if (
      command.type === 'flyTo' &&
      command.lat !== undefined &&
      command.lon !== undefined
    ) {
      const targetZoom = clamp(
        altitudeKmToZoom(command.altitudeKm ?? 24),
        map.getMinZoom(),
        18
      );
      // Use animated setView instead of flyTo so zoom never dips below minZoom
      // (preventing Leaflet's known tile-vanishing bug when zooming out to global view).
      map.setView([command.lat, command.lon], targetZoom, {
        animate: true,
        duration: 0.65,
      });
    } else if (command.type === 'zoom' && command.zoomFactor !== undefined) {
      if (command.zoomFactor < 1) {
        map.zoomIn(1.2);
      } else {
        map.zoomOut(1.2);
      }
    }
  }, [command]);

  const bgColor =
    visualStyle === 'cartoon'
      ? colorTheme === 'light'
        ? '#c7eeff'
        : '#0c0922'
      : colorTheme === 'light'
        ? '#cbd5e1'
        : '#0b1320';

  return (
    <div
      ref={mapContainerRef}
      data-testid="earth-globe-canvas"
      data-render-mode={visualStyle === 'cartoon' ? `cartoon-${colorTheme}` : `realistic-${colorTheme}`}
      className={`w-full h-full relative overflow-hidden select-none isolate z-0 transition-colors duration-300 ${
        compareMode ? 'cursor-crosshair' : ''
      }`}
      style={{ background: bgColor, isolation: 'isolate', zIndex: 0 }}
    />
  );
};
