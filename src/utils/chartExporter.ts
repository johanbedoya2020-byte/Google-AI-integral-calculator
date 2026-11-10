/**
 * High-Quality Presentation Exporter for 2D & 3D Calculus Visualizations
 * Generates Ultra-HD PNG bitmaps (up to 4K resolution) and infinite-scale Vector SVG files.
 */

export interface Export2DOptions {
  canvas: HTMLCanvasElement;
  view: { minX: number; maxX: number; minY: number; maxY: number };
  f: (x: number) => number;
  g?: (x: number) => number;
  a: number;
  b: number;
  activeX: number;
  fStr?: string;
  gStr?: string;
  moduleType: string;
  title?: string;
}

/**
 * Downloads a data URL or Blob as a file
 */
export function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports the 2D canvas at Ultra-HD 4K resolution (PNG) with professional typography and watermarks
 */
export function export2DCanvasAsUHD(
  canvas: HTMLCanvasElement,
  filename = 'geogebra-2d-calculus-chart.png',
  title = 'Integral Calculus Academy — GeoGebra 2D Studio'
) {
  // Create high-res offscreen canvas
  const exportScale = 2; // doubles existing DPR for ultra-crisp presentation
  const targetW = canvas.width * exportScale;
  const targetH = canvas.height * exportScale;

  const offscreen = document.createElement('canvas');
  offscreen.width = targetW;
  offscreen.height = targetH;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return;

  // Render high-res smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill dark executive background
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, targetW, targetH);

  // Draw scaled canvas content
  ctx.drawImage(canvas, 0, 0, targetW, targetH);

  // Add subtle header & watermark banner for formal presentations
  ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
  ctx.fillRect(0, 0, targetW, 48 * exportScale);

  ctx.fillStyle = '#f8fafc';
  ctx.font = `bold ${14 * exportScale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(title, 20 * exportScale, 30 * exportScale);

  ctx.fillStyle = '#6366f1';
  ctx.font = `600 ${11 * exportScale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('HIGH RESOLUTION PRESENTATION EXPORT', targetW - 240 * exportScale, 30 * exportScale);

  // Border frame
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2 * exportScale;
  ctx.strokeRect(0, 0, targetW, targetH);

  // Export as PNG
  const dataUrl = offscreen.toDataURL('image/png', 1.0);
  triggerDownload(dataUrl, filename);
}

/**
 * Generates pure Vector SVG code maintaining infinite scalability for print, papers, and slide decks
 */
export function export2DCanvasAsSVG(
  options: Export2DOptions,
  filename = 'geogebra-2d-calculus-vector.svg'
) {
  const { view, f, g = () => 0, a, b, activeX, fStr = 'f(x)', gStr = 'g(x)', title = 'Calculus 2D Visualization' } = options;

  const svgWidth = 1200;
  const svgHeight = 800;

  const toSvgX = (x: number) => ((x - view.minX) / (view.maxX - view.minX)) * svgWidth;
  const toSvgY = (y: number) => svgHeight - ((y - view.minY) / (view.maxY - view.minY)) * svgHeight;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <defs>
    <!-- Shading Gradients -->
    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.15" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${svgWidth}" height="${svgHeight}" fill="#0b0f19" />

  <!-- Minor & Major Grid Lines -->
`;

  // Grid step
  const rangeX = view.maxX - view.minX;
  let stepX = 1;
  if (rangeX > 20) stepX = 5;
  else if (rangeX > 8) stepX = 2;
  else if (rangeX < 3) stepX = 0.5;

  const startGridX = Math.floor(view.minX / stepX) * stepX;
  for (let x = startGridX; x <= view.maxX; x += stepX) {
    const sx = toSvgX(x).toFixed(1);
    svg += `  <line x1="${sx}" y1="0" x2="${sx}" y2="${svgHeight}" stroke="#1e293b" stroke-width="1" />\n`;
  }

  const rangeY = view.maxY - view.minY;
  let stepY = 1;
  if (rangeY > 20) stepY = 5;
  else if (rangeY > 8) stepY = 2;
  else if (rangeY < 3) stepY = 0.5;

  const startGridY = Math.floor(view.minY / stepY) * stepY;
  for (let y = startGridY; y <= view.maxY; y += stepY) {
    const sy = toSvgY(y).toFixed(1);
    svg += `  <line x1="0" y1="${sy}" x2="${svgWidth}" y2="${sy}" stroke="#1e293b" stroke-width="1" />\n`;
  }

  // Axes
  const cx0 = toSvgX(0).toFixed(1);
  const cy0 = toSvgY(0).toFixed(1);

  svg += `  <!-- Main Axes -->
  <line x1="0" y1="${cy0}" x2="${svgWidth}" y2="${cy0}" stroke="#475569" stroke-width="2.5" />
  <line x1="${cx0}" y1="0" x2="${cx0}" y2="${svgHeight}" stroke="#475569" stroke-width="2.5" />
  <text x="${svgWidth - 25}" y="${Number(cy0) - 10}" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="14">x</text>
  <text x="${Number(cx0) + 12}" y="25" fill="#94a3b8" font-family="sans-serif" font-weight="bold" font-size="14">y</text>
`;

  // Shaded region
  const minAb = Math.min(a, b);
  const maxAb = Math.max(a, b);
  const ptsCount = 120;
  const dx = (maxAb - minAb) / ptsCount;

  let areaPath = '';
  for (let i = 0; i <= ptsCount; i++) {
    const x = minAb + i * dx;
    const y = f(x);
    const sx = toSvgX(x).toFixed(1);
    const sy = toSvgY(y).toFixed(1);
    areaPath += `${i === 0 ? 'M' : 'L'} ${sx} ${sy} `;
  }
  for (let i = ptsCount; i >= 0; i--) {
    const x = minAb + i * dx;
    const y = g(x);
    const sx = toSvgX(x).toFixed(1);
    const sy = toSvgY(y).toFixed(1);
    areaPath += `L ${sx} ${sy} `;
  }
  areaPath += 'Z';

  svg += `  <!-- Integration Area -->
  <path d="${areaPath}" fill="url(#areaGradient)" stroke="#818cf8" stroke-width="1" />
`;

  // Curve f(x)
  let fPath = '';
  const samples = 240;
  const vStep = (view.maxX - view.minX) / samples;
  let started = false;

  for (let i = 0; i <= samples; i++) {
    const x = view.minX + i * vStep;
    const y = f(x);
    if (!Number.isFinite(y)) {
      started = false;
      continue;
    }
    const sx = toSvgX(x).toFixed(1);
    const sy = toSvgY(y).toFixed(1);
    fPath += `${!started ? 'M' : 'L'} ${sx} ${sy} `;
    started = true;
  }

  svg += `  <!-- Upper Curve f(x) -->
  <path d="${fPath}" fill="none" stroke="#6366f1" stroke-width="3" filter="url(#glow)" />
`;

  // Curve g(x)
  let gPath = '';
  started = false;
  for (let i = 0; i <= samples; i++) {
    const x = view.minX + i * vStep;
    const y = g(x);
    if (!Number.isFinite(y)) {
      started = false;
      continue;
    }
    const sx = toSvgX(x).toFixed(1);
    const sy = toSvgY(y).toFixed(1);
    gPath += `${!started ? 'M' : 'L'} ${sx} ${sy} `;
    started = true;
  }

  svg += `  <!-- Lower Curve g(x) -->
  <path d="${gPath}" fill="none" stroke="#10b981" stroke-width="2.5" />
`;

  // Interval boundaries
  const sax = toSvgX(a).toFixed(1);
  const sbx = toSvgX(b).toFixed(1);
  svg += `  <!-- Interval Limits [a, b] -->
  <line x1="${sax}" y1="${toSvgY(g(a)).toFixed(1)}" x2="${sax}" y2="${toSvgY(f(a)).toFixed(1)}" stroke="#818cf8" stroke-width="2" stroke-dasharray="6,4" />
  <line x1="${sbx}" y1="${toSvgY(g(b)).toFixed(1)}" x2="${sbx}" y2="${toSvgY(f(b)).toFixed(1)}" stroke="#818cf8" stroke-width="2" stroke-dasharray="6,4" />
  <rect x="${Number(sax) - 24}" y="${Number(cy0) + 8}" width="48" height="20" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
  <text x="${sax}" y="${Number(cy0) + 22}" fill="#c7d2fe" font-family="sans-serif" font-weight="bold" font-size="11" text-anchor="middle">a = ${a}</text>
  <rect x="${Number(sbx) - 24}" y="${Number(cy0) + 8}" width="48" height="20" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
  <text x="${sbx}" y="${Number(cy0) + 22}" fill="#c7d2fe" font-family="sans-serif" font-weight="bold" font-size="11" text-anchor="middle">b = ${b}</text>
`;

  // Representative slice
  const sSliceX = toSvgX(activeX).toFixed(1);
  const sSliceY1 = toSvgY(f(activeX)).toFixed(1);
  const sSliceY2 = toSvgY(g(activeX)).toFixed(1);

  svg += `  <!-- Representative Slice at x = ${activeX} -->
  <line x1="${sSliceX}" y1="${sSliceY1}" x2="${sSliceX}" y2="${sSliceY2}" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" />
  <circle cx="${sSliceX}" cy="${sSliceY1}" r="5" fill="#f43f5e" />
  <circle cx="${sSliceX}" cy="${sSliceY2}" r="5" fill="#f43f5e" />
  <text x="${Number(sSliceX) + 8}" y="${((Number(sSliceY1) + Number(sSliceY2)) / 2).toFixed(1)}" fill="#fecdd3" font-family="sans-serif" font-weight="bold" font-size="12">dx @ x = ${activeX.toFixed(2)}</text>

  <!-- Presentation Header & Watermark -->
  <rect x="0" y="0" width="${svgWidth}" height="42" fill="#0f172a" opacity="0.9" />
  <text x="20" y="26" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="14">${title}</text>
  <text x="${svgWidth - 20}" y="26" fill="#a5b4fc" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="end">VECTOR SVG EXPORT • INFINITE RESOLUTION</text>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports the 3D WebGL renderer scene as a high-definition PNG image
 */
export function export3DWebGLScene(
  canvas: HTMLCanvasElement,
  filename = 'geogebra-3d-revolution-model.png'
) {
  try {
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    triggerDownload(dataUrl, filename);
  } catch (err) {
    console.error('Failed to export 3D WebGL scene:', err);
  }
}
