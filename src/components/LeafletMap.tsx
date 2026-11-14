import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AnalogSite } from '../data/analogSites';
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
  selectedSiteId: string | null;
  command: GlobeCommand | null;
  onSelectSite: (site: AnalogSite) => void;
  onTelemetryChange: (telemetry: CameraTelemetry) => void;
}

const INITIAL_LAT = 6;
const INITIAL_LON = 78;
const INITIAL_ALTITUDE_KM = 19370;

function createPinHtml(site: AnalogSite, isSelected: boolean): string {
  const isTop = Boolean(site.isTopFinding);
  const label = site.id === 'gunung-bromo' ? 'Gunung Bromo (Top)' : site.name.split('(')[0].trim();
  const badgeStyle = isSelected
    ? 'background: #202124; color: #ffffff; border: 1px solid #8ab4f8;'
    : isTop
      ? 'background: #202124; color: #fde68a; border: 1px solid rgba(251, 191, 36, 0.6);'
      : 'background: rgba(32, 33, 36, 0.9); color: #e8eaed; border: 1px solid rgba(255, 255, 255, 0.15);';
  const pinColor = isSelected ? '#8ab4f8' : site.accentColor;
  const scale = isSelected ? 1.25 : isTop ? 1.15 : 0.95;

  return `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:translate(-50%,-100%);">
      <span style="margin-bottom:3px;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:500;white-space:nowrap;box-shadow:0 4px 6px -1px rgba(0,0,0,0.5);${badgeStyle}">
        ${label}
      </span>
      <svg width="${Math.round(26 * scale)}" height="${Math.round(36 * scale)}" viewBox="0 0 24 34" fill="none">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z" fill="${pinColor}" stroke="#0f172a" stroke-width="1.5" />
        <circle cx="12" cy="11" r="4.5" fill="#0f172a" />
      </svg>
    </div>
  `;
}

const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [-85.05112878, -180],
  [85.05112878, 180],
];

function computeMinZoom(container: HTMLElement | null): number {
  if (!container) return 3;
  const w = container.clientWidth || window.innerWidth || 1440;
  const h = container.clientHeight || window.innerHeight || 900;
  const maxDim = Math.max(w, h);
  // Leaflet tile is 256px. At zoom z, map is 256 * 2^z px.
  // We guarantee the map is at least as large as the viewport so maxBounds fills the screen with no black voids.
  return clamp(Math.ceil(Math.log2(maxDim / 256)), 2, 6);
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  sites,
  selectedSiteId,
  command,
  onSelectSite,
  onTelemetryChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const lastSeqRef = useRef(-1);

  // Initialize Leaflet map
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

    // 1. Esri World Imagery (High-Resolution Satellite Basemap - Free, Open, No Key)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, USGS',
      }
    ).addTo(map);

    // 2. Esri World Boundaries & Places Layer (Transparent country boundaries & labels - Free, No Key, No Watermark)
    const labelsLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        opacity: 0.85,
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    satelliteLayerRef.current = satelliteLayer;
    labelsLayerRef.current = labelsLayer;
    markersLayerRef.current = markersLayer;

    // Telemetry updates on camera move/zoom
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

    // Dynamic viewport resize handling to keep minZoom strictly covering container
    const onResize = () => {
      if (!mapContainerRef.current || !mapInstanceRef.current) return;
      const newMinZoom = computeMinZoom(mapContainerRef.current);
      mapInstanceRef.current.setMinZoom(newMinZoom);
      if (mapInstanceRef.current.getZoom() < newMinZoom) {
        mapInstanceRef.current.setZoom(newMinZoom);
      }
    };
    window.addEventListener('resize', onResize);

    emitTelemetry();

    return () => {
      window.removeEventListener('resize', onResize);
      map.off('move', emitTelemetry);
      map.off('zoom', emitTelemetry);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onTelemetryChange]);

  // Render site pin markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    sites.forEach((site) => {
      const isSelected = site.id === selectedSiteId;
      const isTop = Boolean(site.isTopFinding);

      const customIcon = L.divIcon({
        className: 'analog-site-marker',
        html: createPinHtml(site, isSelected),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([site.lat, site.lon], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : isTop ? 900 : Math.round(site.similarityScore),
        title: `${site.name} (${site.targetBody}, ${site.similarityScore}%)`,
      });

      marker.on('click', () => {
        onSelectSite(site);
      });

      markersLayer.addLayer(marker);
    });
  }, [sites, selectedSiteId, onSelectSite]);

  // Handle commands (flyTo, zoom)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !command || command.seq === lastSeqRef.current) return;
    lastSeqRef.current = command.seq;

    if (
      command.type === 'flyTo' &&
      command.lat !== undefined &&
      command.lon !== undefined
    ) {
      const targetZoom = Math.max(
        map.getMinZoom(),
        altitudeKmToZoom(command.altitudeKm ?? 24)
      );
      map.flyTo([command.lat, command.lon], targetZoom, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    } else if (command.type === 'zoom' && command.zoomFactor !== undefined) {
      if (command.zoomFactor < 1) {
        map.zoomIn(1.2);
      } else {
        map.zoomOut(1.2);
      }
    }
  }, [command]);

  return (
    <div
      ref={mapContainerRef}
      data-testid="earth-globe-canvas"
      data-render-mode="leaflet-satellite"
      className="w-full h-full relative overflow-hidden select-none isolate z-0"
      style={{ background: '#0b1320', isolation: 'isolate', zIndex: 0 }}
    />
  );
};
