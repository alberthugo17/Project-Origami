export const EARTH_RADIUS_KM = 6371;
export const GLOBE_RADIUS = 1.0;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Converts geographic latitude/longitude (degrees) to a 3D Cartesian unit-sphere vector.
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number = GLOBE_RADIUS
): { x: number; y: number; z: number } {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;

  return {
    x: -radius * Math.sin(theta) * Math.cos(phi),
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta) * Math.sin(phi),
  };
}

/**
 * Converts a 3D Cartesian point on/around the globe back to latitude/longitude (degrees).
 */
export function vector3ToLatLon(vec: { x: number; y: number; z: number }): {
  lat: number;
  lon: number;
} {
  const len = Math.hypot(vec.x, vec.y, vec.z);
  if (len < 1e-8) return { lat: 0, lon: 0 };

  const ny = clamp(vec.y / len, -1, 1);
  const theta = Math.acos(ny);
  const lat = 90 - (theta * 180) / Math.PI;

  let phi = Math.atan2(vec.z, -vec.x);
  if (phi < 0) phi += Math.PI * 2;
  let lon = (phi * 180) / Math.PI - 180;
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;

  return { lat, lon };
}

/**
 * Formats decimal degrees to Google Earth-style DMS string, e.g. 28°44'37.74"S
 */
export function formatDMS(value: number, isLat: boolean): string {
  const abs = Math.abs(value);
  let deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  let min = Math.floor(minFloat);
  let sec = Math.round((minFloat - min) * 60 * 100) / 100;

  if (sec >= 60) {
    sec = 0;
    min += 1;
  }
  if (min >= 60) {
    min = 0;
    deg += 1;
  }

  const hemi = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  const minStr = String(min).padStart(2, '0');
  const secStr = sec.toFixed(2).padStart(5, '0');
  return `${deg}°${minStr}'${secStr}"${hemi}`;
}

export function formatCoordinatesDMS(lat: number, lon: number): string {
  return `${formatDMS(lat, true)} ${formatDMS(lon, false)}`;
}

/**
 * Converts normalized distance (in globe radii, where surface = 1.0)
 * to realistic camera altitude in kilometers.
 */
export function distanceToAltitudeKm(distanceFromCenter: number): number {
  const surfaceDist = Math.max(0.001, distanceFromCenter - GLOBE_RADIUS);
  return Math.round(surfaceDist * EARTH_RADIUS_KM);
}

/**
 * Converts altitude in kilometers to normalized distance from globe center.
 */
export function altitudeKmToDistance(altitudeKm: number): number {
  return GLOBE_RADIUS + Math.max(50, altitudeKm) / EARTH_RADIUS_KM;
}

/**
 * Converts Google Maps 3D `range` (meters) to human-readable camera altitude in km.
 */
export function rangeMetersToAltitudeKm(rangeMeters: number): number {
  const km = Math.max(0.2, rangeMeters / 1000);
  return km >= 10 ? Math.round(km) : Math.round(km * 10) / 10;
}

/**
 * Converts altitude in kilometers to Google Maps 3D `range` in meters.
 */
export function altitudeKmToRangeMeters(altitudeKm: number): number {
  return clamp(Math.round(altitudeKm * 1000), 400, 30_000_000);
}

/**
 * Approximates Google Maps 2D zoom level (2..18) from camera altitude in km.
 */
export function altitudeKmToZoom(altitudeKm: number): number {
  const safeAlt = Math.max(0.3, altitudeKm);
  // 19,370 km -> zoom ~2.5; 25 km -> zoom ~11.8; 6 km -> zoom ~13.9
  const zoom = 16.5 - Math.log2(safeAlt);
  return clamp(Math.round(zoom * 10) / 10, 2, 18);
}

/**
 * Approximates camera altitude in km from a Google Maps 2D zoom level.
 */
export function zoomToAltitudeKm(zoom: number): number {
  const alt = Math.pow(2, 16.5 - clamp(zoom, 1.5, 20));
  return alt >= 10 ? Math.round(alt) : Math.round(alt * 10) / 10;
}

/**
 * Normalizes compass heading to [-180, 180] degrees.
 */
export function normalizeHeadingDeg(headingDeg: number): number {
  let h = ((headingDeg + 180) % 360 + 360) % 360 - 180;
  if (Object.is(h, -0)) h = 0;
  return h;
}

/**
 * Computes a clean Google Earth-style scale bar label in km or m for a given camera altitude.
 */
export function computeScaleBar(
  altitudeKm: number,
  targetPixelWidth: number = 110
): {
  label: string;
  widthPx: number;
} {
  // Approximate ground km per pixel at viewport center for ~45deg FOV at ~900px height
  const kmPerPx = Math.max(0.002, (altitudeKm * 0.85) / 900);
  const rawKm = kmPerPx * targetPixelWidth;

  const niceSteps = [
    0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 3000, 5000,
  ];
  let chosen = niceSteps[0];
  for (const step of niceSteps) {
    if (step <= rawKm * 1.35) {
      chosen = step;
    }
  }
  const widthPx = Math.round(clamp(chosen / kmPerPx, 52, 150));
  const label =
    chosen < 1
      ? `${Math.round(chosen * 1000)} m`
      : chosen >= 1000
        ? `${(chosen / 1000).toFixed(0)}.000 km`
        : `${chosen} km`;
  return { label, widthPx };
}

/**
 * Computes great-circle distance in km between two coordinates (Haversine).
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}
