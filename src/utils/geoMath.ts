export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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
