import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CrossSectionType } from '../utils/mathEvaluator';
import { export2DCanvasAsUHD, export2DCanvasAsSVG } from '../utils/chartExporter';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileCode,
  Sliders,
  Sparkles,
  Grid,
} from 'lucide-react';

export type GeoGebraModuleType =
  | 'solids_revolution'
  | 'cylindrical_shells'
  | 'cross_sections'
  | 'arc_length'
  | 'surface_area';

interface GeoGebra2DCanvasProps {
  f: (x: number) => number;
  g?: (x: number) => number;
  a: number;
  b: number;
  activeX: number; // representative slice position
  onActiveXChange?: (newX: number) => void;
  moduleType: GeoGebraModuleType;
  revolutionAxis?: 'x-axis' | 'y-axis' | 'line-y' | 'line-x';
  axisValue?: number;
  crossSectionShape?: CrossSectionType;
  numSegments?: number;
}

export const GeoGebra2DCanvas: React.FC<GeoGebra2DCanvasProps> = ({
  f,
  g = () => 0,
  a,
  b,
  activeX,
  onActiveXChange,
  moduleType,
  revolutionAxis = 'x-axis',
  axisValue = 0,
  crossSectionShape = 'square',
  numSegments = 16,
}) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Logical CSS dimensions
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 500, height: 380 });

  // Visual Quality & Clarity Controls
  const [contrastBoost, setContrastBoost] = useState<boolean>(true);
  const [showMinorGrid, setShowMinorGrid] = useState<boolean>(true);

  // Viewport bounds in mathematical coordinates
  const [view, setView] = useState<{ minX: number; maxX: number; minY: number; maxY: number }>({
    minX: -1,
    maxX: 5,
    minY: -2,
    maxY: 5,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Auto-fit viewport to interval [a, b] and function values
  const resetViewport = useCallback(() => {
    let fMin = 0;
    let fMax = 1;
    const samples = 40;
    const step = (b - a) / samples;
    for (let i = 0; i <= samples; i++) {
      const x = a + i * step;
      const y1 = f(x);
      const y2 = g(x);
      if (Number.isFinite(y1)) {
        fMin = Math.min(fMin, y1);
        fMax = Math.max(fMax, y1);
      }
      if (Number.isFinite(y2)) {
        fMin = Math.min(fMin, y2);
        fMax = Math.max(fMax, y2);
      }
    }

    if (axisValue) {
      fMin = Math.min(fMin, axisValue);
      fMax = Math.max(fMax, axisValue);
    }

    const paddingX = Math.max((b - a) * 0.4, 1.2);
    const paddingY = Math.max((fMax - fMin) * 0.4, 1.2);

    setView({
      minX: Math.min(a - paddingX, -1),
      maxX: Math.max(b + paddingX, 3),
      minY: Math.min(fMin - paddingY, -1),
      maxY: Math.max(fMax + paddingY, 3),
    });
  }, [a, b, f, g, axisValue]);

  useEffect(() => {
    resetViewport();
  }, [a, b, resetViewport]);

  // Robust ResizeObserver with DPR calibration
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setSize({ width: Math.round(width), height: Math.round(height) });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Primary High-DPI Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = size;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    // Set physical buffer dimensions for high DPI
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Map logical coordinates to physical subpixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Enable smooth subpixel rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Coordinate transformations
    const toCanvasX = (x: number) => ((x - view.minX) / (view.maxX - view.minX)) * width;
    const toCanvasY = (y: number) => height - ((y - view.minY) / (view.maxY - view.minY)) * height;
    const cx0 = toCanvasX(0);
    const cy0 = toCanvasY(0);

    // 1. Clear background with deep rich cosmos gradient
    const bgGrad = ctx.createRadialGradient(cx0, cy0, 20, cx0, cy0, Math.max(width, height));
    bgGrad.addColorStop(0, '#0f172a'); // slate-900 center glow
    bgGrad.addColorStop(1, '#070b14'); // deep obsidian border
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. GRID SYSTEM (Minor & Major Grids)
    const rangeX = view.maxX - view.minX;
    let stepX = 1;
    if (rangeX > 25) stepX = 5;
    else if (rangeX > 10) stepX = 2;
    else if (rangeX < 3.5) stepX = 0.5;
    else if (rangeX < 1.5) stepX = 0.2;

    const rangeY = view.maxY - view.minY;
    let stepY = 1;
    if (rangeY > 25) stepY = 5;
    else if (rangeY > 10) stepY = 2;
    else if (rangeY < 3.5) stepY = 0.5;
    else if (rangeY < 1.5) stepY = 0.2;

    // A. Minor Sub-grid (subtle dotted lines for fine precision)
    if (showMinorGrid) {
      const minorStepX = stepX / 2;
      const startMinorX = Math.floor(view.minX / minorStepX) * minorStepX;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = contrastBoost ? 'rgba(30, 41, 59, 0.45)' : 'rgba(30, 41, 59, 0.3)';

      ctx.beginPath();
      for (let x = startMinorX; x <= view.maxX; x += minorStepX) {
        const cx = Math.round(toCanvasX(x)) + 0.5;
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
      }
      ctx.stroke();

      const minorStepY = stepY / 2;
      const startMinorY = Math.floor(view.minY / minorStepY) * minorStepY;
      ctx.beginPath();
      for (let y = startMinorY; y <= view.maxY; y += minorStepY) {
        const cy = Math.round(toCanvasY(y)) + 0.5;
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // B. Major Grid Lines (solid, crisp 1px stroke with 0.5px subpixel adjustment)
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastBoost ? 'rgba(51, 65, 85, 0.65)' : 'rgba(51, 65, 85, 0.4)';

    const startGridX = Math.floor(view.minX / stepX) * stepX;
    for (let x = startGridX; x <= view.maxX; x += stepX) {
      const cx = Math.round(toCanvasX(x)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      // Numerical Tick Label with anti-collision background pill
      if (Math.abs(x) > 1e-5) {
        const textY = Math.min(Math.max(cy0 + 14, 18), height - 8);
        const labelText = x.toFixed(stepX < 1 ? (stepX < 0.5 ? 2 : 1) : 0);

        ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const txtWidth = ctx.measureText(labelText).width;

        // Background pill
        ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
        ctx.fillRect(cx - txtWidth / 2 - 3, textY - 10, txtWidth + 6, 13);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
        ctx.strokeRect(cx - txtWidth / 2 - 3, textY - 10, txtWidth + 6, 13);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(labelText, cx - txtWidth / 2, textY);
      }
    }

    const startGridY = Math.floor(view.minY / stepY) * stepY;
    for (let y = startGridY; y <= view.maxY; y += stepY) {
      const cy = Math.round(toCanvasY(y)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Numerical Tick Label with anti-collision background pill
      if (Math.abs(y) > 1e-5) {
        const textX = Math.min(Math.max(cx0 + 6, 6), width - 34);
        const labelText = y.toFixed(stepY < 1 ? (stepY < 0.5 ? 2 : 1) : 0);

        ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const txtWidth = ctx.measureText(labelText).width;

        ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
        ctx.fillRect(textX - 2, cy - 8, txtWidth + 4, 13);
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
        ctx.strokeRect(textX - 2, cy - 8, txtWidth + 4, 13);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(labelText, textX, cy + 2);
      }
    }

    // 3. MAJOR CARTESIAN AXES
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748b'; // slate-500
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, Math.round(cy0) + 0.5);
    ctx.lineTo(width, Math.round(cy0) + 0.5);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(Math.round(cx0) + 0.5, 0);
    ctx.lineTo(Math.round(cx0) + 0.5, height);
    ctx.stroke();

    // Axis Directional Arrowheads & Labels
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px sans-serif';

    // X axis label
    const xLabelY = Math.min(Math.max(cy0 - 8, 16), height - 12);
    ctx.fillText('x', width - 16, xLabelY);
    // Y axis label
    const yLabelX = Math.min(Math.max(cx0 + 8, 8), width - 20);
    ctx.fillText('y', yLabelX, 18);

    // Origin dot
    ctx.beginPath();
    ctx.arc(cx0, cy0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // 4. SHADED REGION OF INTEGRATION on [a, b]
    const minAb = Math.min(a, b);
    const maxAb = Math.max(a, b);
    const ptsCount = 160;
    const dx = (maxAb - minAb) / ptsCount;

    const areaGradient = ctx.createLinearGradient(0, toCanvasY(view.maxY), 0, toCanvasY(view.minY));
    areaGradient.addColorStop(0, contrastBoost ? 'rgba(99, 102, 241, 0.55)' : 'rgba(99, 102, 241, 0.35)');
    areaGradient.addColorStop(1, contrastBoost ? 'rgba(168, 85, 247, 0.22)' : 'rgba(168, 85, 247, 0.12)');

    ctx.fillStyle = areaGradient;
    ctx.beginPath();
    // Top boundary: f(x)
    for (let i = 0; i <= ptsCount; i++) {
      const x = minAb + i * dx;
      const y = f(x);
      const cx = toCanvasX(x);
      const cy = toCanvasY(y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    // Bottom boundary: g(x) backwards
    for (let i = ptsCount; i >= 0; i--) {
      const x = minAb + i * dx;
      const y = g(x);
      const cx = toCanvasX(x);
      const cy = toCanvasY(y);
      ctx.lineTo(cx, cy);
    }
    ctx.closePath();
    ctx.fill();

    // 5. ARC LENGTH POLYGONAL CHORD APPROXIMATION
    if (moduleType === 'arc_length') {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#38bdf8'; // sky-400
      ctx.beginPath();
      const nSeg = Math.max(numSegments, 4);
      const segDx = (maxAb - minAb) / nSeg;
      for (let i = 0; i <= nSeg; i++) {
        const x = minAb + i * segDx;
        const y = f(x);
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Draw chord node beads
      ctx.fillStyle = '#0284c7';
      for (let i = 0; i <= nSeg; i++) {
        const x = minAb + i * segDx;
        const y = f(x);
        ctx.beginPath();
        ctx.arc(toCanvasX(x), toCanvasY(y), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 6. CURVE f(x) (High-Luminance Glow & Anti-Aliasing)
    ctx.save();
    if (contrastBoost) {
      ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
      ctx.shadowBlur = 6;
    }
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#6366f1'; // electric indigo
    ctx.beginPath();
    let started = false;
    const viewSamples = 260;
    const vStep = (view.maxX - view.minX) / viewSamples;
    for (let i = 0; i <= viewSamples; i++) {
      const x = view.minX + i * vStep;
      const y = f(x);
      if (!Number.isFinite(y)) {
        started = false;
        continue;
      }
      const cx = toCanvasX(x);
      const cy = toCanvasY(y);
      if (!started) {
        ctx.moveTo(cx, cy);
        started = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();
    ctx.restore();

    // 7. CURVE g(x) (Mint Emerald)
    let hasG = false;
    for (let i = 0; i <= 20; i++) {
      if (Math.abs(g(a + (i * (b - a)) / 20)) > 1e-4) {
        hasG = true;
        break;
      }
    }

    if (hasG) {
      ctx.save();
      if (contrastBoost) {
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
        ctx.shadowBlur = 5;
      }
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10b981'; // emerald-500
      ctx.beginPath();
      started = false;
      for (let i = 0; i <= viewSamples; i++) {
        const x = view.minX + i * vStep;
        const y = g(x);
        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 8. INTERVAL BOUNDARIES [a, b] WITH CLEAN BADGES
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#818cf8';

    // x = a line
    const caX = toCanvasX(a);
    ctx.beginPath();
    ctx.moveTo(caX, toCanvasY(g(a)));
    ctx.lineTo(caX, toCanvasY(f(a)));
    ctx.stroke();

    // x = b line
    const cbX = toCanvasX(b);
    ctx.beginPath();
    ctx.moveTo(cbX, toCanvasY(g(b)));
    ctx.lineTo(cbX, toCanvasY(f(b)));
    ctx.stroke();
    ctx.setLineDash([]);

    // Boundaries Pill Badges
    const badgeY = Math.min(Math.max(cy0 + 20, 36), height - 20);

    const drawBadge = (text: string, bx: number, bg: string, border: string) => {
      ctx.font = 'bold 11px -apple-system, sans-serif';
      const tw = ctx.measureText(text).width;
      ctx.fillStyle = bg;
      ctx.fillRect(bx - tw / 2 - 4, badgeY - 10, tw + 8, 16);
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - tw / 2 - 4, badgeY - 10, tw + 8, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, bx - tw / 2, badgeY + 2);
    };

    drawBadge(`a = ${a}`, caX, 'rgba(49, 46, 129, 0.9)', '#818cf8');
    drawBadge(`b = ${b}`, cbX, 'rgba(49, 46, 129, 0.9)', '#818cf8');

    // 9. AXIS OF REVOLUTION
    if (moduleType === 'solids_revolution' || moduleType === 'surface_area') {
      const isX = revolutionAxis === 'x-axis' || revolutionAxis === 'line-y';
      const k = revolutionAxis === 'x-axis' ? 0 : axisValue;
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.setLineDash([6, 3]);

      if (isX) {
        const cAxisY = toCanvasY(k);
        ctx.beginPath();
        ctx.moveTo(0, cAxisY);
        ctx.lineTo(width, cAxisY);
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Axis of Revolution: y = ${k}`, width - 170, cAxisY - 6);
      } else {
        const cAxisX = toCanvasX(k);
        ctx.beginPath();
        ctx.moveTo(cAxisX, 0);
        ctx.lineTo(cAxisX, height);
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Axis: x = ${k}`, cAxisX + 6, 28);
      }
      ctx.setLineDash([]);
    } else if (moduleType === 'cylindrical_shells') {
      const k = axisValue;
      const cAxisX = toCanvasX(k);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(cAxisX, 0);
      ctx.lineTo(cAxisX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Rotation Axis: x = ${k}`, cAxisX + 6, 28);
    }

    // 10. REPRESENTATIVE DIFFERENTIAL SLICE AT activeX
    const clampedX = Math.min(Math.max(activeX, minAb), maxAb);
    const sliceYTop = f(clampedX);
    const sliceYBottom = g(clampedX);
    const sliceWidth = (maxAb - minAb) * 0.035;

    const cSliceX = toCanvasX(clampedX);
    const cSliceY1 = toCanvasY(sliceYTop);
    const cSliceY2 = toCanvasY(sliceYBottom);

    if (moduleType === 'solids_revolution') {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.2;
      const rectW = Math.max(toCanvasX(clampedX + sliceWidth) - cSliceX, 6);
      const topY = Math.min(cSliceY1, cSliceY2);
      const botY = Math.max(cSliceY1, cSliceY2);

      ctx.fillRect(cSliceX - rectW / 2, topY, rectW, botY - topY);
      ctx.strokeRect(cSliceX - rectW / 2, topY, rectW, botY - topY);

      // dx label badge
      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`dx`, cSliceX - 7, botY + 16);
      ctx.fillText(`R(x)`, cSliceX + rectW / 2 + 6, (topY + botY) / 2);
    } else if (moduleType === 'cylindrical_shells') {
      ctx.fillStyle = 'rgba(236, 72, 153, 0.55)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.2;
      const rectW = 8;
      const topY = Math.min(cSliceY1, cSliceY2);
      const botY = Math.max(cSliceY1, cSliceY2);

      ctx.fillRect(cSliceX - rectW / 2, topY, rectW, botY - topY);
      ctx.strokeRect(cSliceX - rectW / 2, topY, rectW, botY - topY);

      const cAxisX = toCanvasX(axisValue);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cAxisX, (topY + botY) / 2);
      ctx.lineTo(cSliceX, (topY + botY) / 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`r = |x - k|`, (cAxisX + cSliceX) / 2 - 24, (topY + botY) / 2 - 6);
      ctx.fillStyle = '#f472b6';
      ctx.fillText(`h = f - g`, cSliceX + 10, (topY + botY) / 2 + 14);
    } else if (moduleType === 'cross_sections') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cSliceX, cSliceY1);
      ctx.lineTo(cSliceX, cSliceY2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cSliceX, cSliceY1, 4.5, 0, Math.PI * 2);
      ctx.arc(cSliceX, cSliceY2, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Base s = ${Math.abs(sliceYTop - sliceYBottom).toFixed(2)}`, cSliceX + 8, (cSliceY1 + cSliceY2) / 2);
    } else if (moduleType === 'arc_length') {
      const hLocal = 0.35;
      const x2 = clampedX + hLocal;
      const y2 = f(x2);
      const c2X = toCanvasX(x2);
      const c2Y = toCanvasY(y2);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cSliceX, cSliceY1);
      ctx.lineTo(c2X, cSliceY1); // dx
      ctx.lineTo(c2X, c2Y);      // dy
      ctx.lineTo(cSliceX, cSliceY1); // ds
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 10.5px monospace';
      ctx.fillText('dx', (cSliceX + c2X) / 2 - 4, cSliceY1 + 14);
      ctx.fillText('dy', c2X + 6, (cSliceY1 + c2Y) / 2);
      ctx.fillText('ds', (cSliceX + c2X) / 2 - 12, (cSliceY1 + c2Y) / 2 - 6);
    }

    // 11. MOUSE HOVER COORDINATE READOUT
    if (hoverCoord) {
      const tx = toCanvasX(hoverCoord.x);
      const ty = toCanvasY(hoverCoord.y);

      ctx.beginPath();
      ctx.arc(tx, ty, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      const coordText = `(${hoverCoord.x.toFixed(2)}, ${hoverCoord.y.toFixed(2)})`;
      ctx.font = '600 11px monospace';
      const ctw = ctx.measureText(coordText).width;

      const pillX = Math.min(tx + 8, width - ctw - 16);
      const pillY = Math.max(ty - 16, 20);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(pillX - 4, pillY - 11, ctw + 8, 16);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(pillX - 4, pillY - 11, ctw + 8, 16);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(coordText, pillX, pillY + 1);
    }
  }, [
    size,
    view,
    f,
    g,
    a,
    b,
    activeX,
    moduleType,
    revolutionAxis,
    axisValue,
    crossSectionShape,
    numSegments,
    hoverCoord,
    contrastBoost,
    showMinorGrid,
  ]);

  // Zoom logic
  const zoom = (factor: number) => {
    setView((prev) => {
      const centerX = (prev.minX + prev.maxX) / 2;
      const centerY = (prev.minY + prev.maxY) / 2;
      const width = (prev.maxX - prev.minX) * factor;
      const height = (prev.maxY - prev.minY) * factor;
      return {
        minX: centerX - width / 2,
        maxX: centerX + width / 2,
        minY: centerY - height / 2,
        maxY: centerY + height / 2,
      };
    });
  };

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const mathX = view.minX + (cx / rect.width) * (view.maxX - view.minX);
    const mathY = view.maxY - (cy / rect.height) * (view.maxY - view.minY);
    setHoverCoord({ x: mathX, y: mathY });

    if (isDragging) {
      const dxPixels = e.clientX - dragStart.x;
      const dyPixels = e.clientY - dragStart.y;
      const dxMath = (dxPixels / rect.width) * (view.maxX - view.minX);
      const dyMath = (dyPixels / rect.height) * (view.maxY - view.minY);

      setView((prev) => ({
        minX: prev.minX - dxMath,
        maxX: prev.maxX - dxMath,
        minY: prev.minY + dyMath,
        maxY: prev.maxY + dyMath,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    zoom(factor);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onActiveXChange) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const mathX = view.minX + (cx / rect.width) * (view.maxX - view.minX);
    if (mathX >= Math.min(a, b) && mathX <= Math.max(a, b)) {
      onActiveXChange(Number(mathX.toFixed(2)));
    }
  };

  // High-Resolution Export Actions
  const handleExportPNG = () => {
    if (!canvasRef.current) return;
    export2DCanvasAsUHD(canvasRef.current, `geogebra-2d-calculus-${moduleType}.png`);
  };

  const handleExportSVG = () => {
    if (!canvasRef.current) return;
    export2DCanvasAsSVG(
      {
        canvas: canvasRef.current,
        view,
        f,
        g,
        a,
        b,
        activeX,
        moduleType,
        title: `GeoGebra 2D: ${moduleType.replace('_', ' ').toUpperCase()}`,
      },
      `geogebra-2d-calculus-${moduleType}.svg`
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoverCoord(null);
        }}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Top-Right Overlay Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg z-10">
        <button
          onClick={() => setContrastBoost(!contrastBoost)}
          className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            contrastBoost
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={t('contrastBoost')}
          aria-label={t('contrastBoost')}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowMinorGrid(!showMinorGrid)}
          className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            showMinorGrid
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
          title={t('gridLinesLabel')}
          aria-label={t('gridLinesLabel')}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        <button
          onClick={() => zoom(0.8)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={t('zoomInTooltip')}
          aria-label={t('zoomInTooltip')}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => zoom(1.25)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={t('zoomOutTooltip')}
          aria-label={t('zoomOutTooltip')}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetViewport}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title={t('resetViewTooltip')}
          aria-label={t('resetViewTooltip')}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* Export Buttons */}
        <button
          onClick={handleExportPNG}
          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition cursor-pointer"
          title={t('exportChartPNG')}
          aria-label={t('exportChartPNG')}
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleExportSVG}
          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition cursor-pointer"
          title={t('exportChartSVG')}
          aria-label={t('exportChartSVG')}
        >
          <FileCode className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top-Left Resolution Status Badge */}
      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800/80 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{t('hdQualityBadge')}</span>
      </div>

      {/* Bottom Legend Badge */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block shadow-sm shadow-indigo-500" />
          <span>{t('legendFUpper')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500" />
          <span>{t('legendGLower')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500" />
          <span>{t('legendSliceDx')} {activeX.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
