import React, { useEffect, useRef } from 'react';
import { WORLD_LANDMASSES } from '../data/worldCoastlines';

interface MinimapProps {
  lat: number;
  lon: number;
  onResetOverview: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({ lat, lon, onResetOverview }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Pale cyan ocean matching Google Earth's bottom-left locator inset
    ctx.fillStyle = '#d7eef6';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Project landmasses centered around current camera (lon, lat) with ~120deg span
    const spanLon = 120;
    const spanLat = 95;

    const project = (ptLon: number, ptLat: number): [number, number] => {
      let dLon = ptLon - lon;
      while (dLon > 180) dLon -= 360;
      while (dLon < -180) dLon += 360;
      const x = w / 2 + (dLon / spanLon) * w;
      const y = h / 2 - ((ptLat - lat) / spanLat) * h;
      return [x, y];
    };

    ctx.fillStyle = '#cde6d2';
    ctx.strokeStyle = '#94b8a1';
    ctx.lineWidth = 0.7;

    for (const land of WORLD_LANDMASSES) {
      if (land.coords.length === 0) continue;
      // Skip polygons wrapping wildly across dateline in local view
      ctx.beginPath();
      let prevLon = land.coords[0][0];
      const [sx, sy] = project(land.coords[0][0], land.coords[0][1]);
      ctx.moveTo(sx, sy);
      let jump = false;
      for (let i = 1; i < land.coords.length; i++) {
        const curLon = land.coords[i][0];
        if (Math.abs(curLon - prevLon) > 100) {
          jump = true;
        }
        prevLon = curLon;
        const [px, py] = project(curLon, land.coords[i][1]);
        ctx.lineTo(px, py);
      }
      if (!jump) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // Center reticle box
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 1.25;
    ctx.strokeRect(w / 2 - 5, h / 2 - 5, 10, 10);
    ctx.fillStyle = '#1a73e8';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }, [lat, lon]);

  return (
    <button
      type="button"
      onClick={onResetOverview}
      title="Kembali ke tampilan global"
      aria-label="Minimap lokasi kamera saat ini, klik untuk reset ke tampilan global"
      className="group relative w-14 h-14 rounded-md overflow-hidden border border-white/25 shadow-lg bg-[#d7eef6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
    >
      <canvas ref={canvasRef} width={56} height={56} className="w-full h-full block" />
      <span className="sr-only">Reset tampilan globe</span>
    </button>
  );
};
