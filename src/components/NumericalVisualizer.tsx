import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  computeNumericalMethod,
  NumericalMethodType,
  NumericalCalculationResult,
} from '../utils/numericalCalculus';
import { LOCALIZED_PRESET_FUNCTIONS } from '../data/localizedContent';
import { MathView } from '../utils/mathRenderer';
import { useLanguage } from '../context/LanguageContext';
import { Play, RotateCcw, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface NumericalVisualizerProps {
  initialFunc?: string;
  initialA?: number;
  initialB?: number;
  initialN?: number;
  initialMethod?: NumericalMethodType;
  initialExact?: number;
}

export const NumericalVisualizer: React.FC<NumericalVisualizerProps> = ({
  initialFunc = 'exp(-x^2)',
  initialA = 0,
  initialB = 2,
  initialN = 4,
  initialMethod = 'simpson',
  initialExact = 0.88208139,
}) => {
  const { t, language } = useLanguage();
  const [funcExpr, setFuncExpr] = useState(initialFunc);
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [n, setN] = useState(initialN);
  const [method, setMethod] = useState<NumericalMethodType>(initialMethod);
  const [knownExact, setKnownExact] = useState<number | undefined>(initialExact);
  const [showTable, setShowTable] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presetFunctions = LOCALIZED_PRESET_FUNCTIONS[language] || LOCALIZED_PRESET_FUNCTIONS.en;

  // Compute numerical results
  const result: NumericalCalculationResult = useMemo(() => {
    return computeNumericalMethod(funcExpr, a, b, n, method, knownExact);
  }, [funcExpr, a, b, n, method, knownExact]);

  // Handle Preset selection
  const handleSelectPreset = (preset: (typeof presetFunctions)[0]) => {
    setFuncExpr(preset.expr);
    setA(preset.a);
    setB(preset.b);
    setKnownExact(preset.exact);
  };

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Padding
    const padX = 50;
    const padY = 40;
    const plotW = width - padX * 2;
    const plotH = height - padY * 2;

    // Domain and range
    const xMin = Math.min(a, b) - (Math.abs(b - a) * 0.15 || 0.5);
    const xMax = Math.max(a, b) + (Math.abs(b - a) * 0.15 || 0.5);

    // Sample function to find yMin and yMax
    const numSamples = 200;
    let yMin = 0;
    let yMax = 0.1;
    const sampledPoints: { x: number; y: number }[] = [];

    for (let i = 0; i <= numSamples; i++) {
      const curX = xMin + (i / numSamples) * (xMax - xMin);
      let curY = 0;
      try {
        const fn = new Function(
          'x',
          `try { return ${funcExpr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/exp/g, 'Math.exp')
            .replace(/ln|log/g, 'Math.log')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/pi/g, 'Math.PI')
            .replace(/e\b/g, 'Math.E')}; } catch(e) { return 0; }`
        );
        curY = fn(curX) || 0;
      } catch {
        curY = 0;
      }
      sampledPoints.push({ x: curX, y: curY });
      if (curY > yMax) yMax = curY;
      if (curY < yMin) yMin = curY;
    }

    // Add margin to y range
    const yMargin = Math.max((yMax - yMin) * 0.2, 0.5);
    const plotYMin = yMin - (yMin < 0 ? yMargin : 0);
    const plotYMax = yMax + yMargin;

    // Coordinate transforms
    const toScreenX = (valX: number) => padX + ((valX - xMin) / (xMax - xMin)) * plotW;
    const toScreenY = (valY: number) => padY + plotH - ((valY - plotYMin) / (plotYMax - plotYMin)) * plotH;

    // Draw Grid Lines
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const gX = padX + (i / 6) * plotW;
      ctx.beginPath();
      ctx.moveTo(gX, padY);
      ctx.lineTo(gX, padY + plotH);
      ctx.stroke();

      const gY = padY + (i / 6) * plotH;
      ctx.beginPath();
      ctx.moveTo(padX, gY);
      ctx.lineTo(padX + plotW, gY);
      ctx.stroke();
    }

    // Draw Axes
    const zeroY = toScreenY(0);
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, zeroY);
    ctx.lineTo(padX + plotW, zeroY);
    ctx.stroke();

    // Draw Slices / Geometric Approximations
    result.slices.forEach((slice, idx) => {
      const sxLeft = toScreenX(slice.xLeft);
      const sxRight = toScreenX(slice.xRight);
      const sZeroY = zeroY;

      // Slice colors alternating
      const isEven = idx % 2 === 0;
      ctx.fillStyle = isEven ? 'rgba(99, 102, 241, 0.35)' : 'rgba(79, 70, 229, 0.25)'; // indigo
      ctx.strokeStyle = '#818cf8'; // indigo-400
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      if (slice.method === 'left_riemann' || slice.method === 'right_riemann' || slice.method === 'midpoint') {
        const sTop = toScreenY(slice.height || 0);
        ctx.rect(sxLeft, sTop, sxRight - sxLeft, sZeroY - sTop);
        ctx.fill();
        ctx.stroke();

        // Sample point dot
        if (slice.sampleX !== undefined && slice.sampleY !== undefined) {
          ctx.fillStyle = '#f43f5e'; // rose-500
          ctx.beginPath();
          ctx.arc(toScreenX(slice.sampleX), toScreenY(slice.sampleY), 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (slice.method === 'trapezoidal') {
        const syLeft = toScreenY(slice.yLeft);
        const syRight = toScreenY(slice.yRight);
        ctx.moveTo(sxLeft, sZeroY);
        ctx.lineTo(sxLeft, syLeft);
        ctx.lineTo(sxRight, syRight);
        ctx.lineTo(sxRight, sZeroY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (slice.method === 'simpson') {
        // Parabolic top arc for Simpson's rule
        const syLeft = toScreenY(slice.yLeft);
        const syRight = toScreenY(slice.yRight);
        const midX = (slice.xLeft + slice.xRight) / 2;
        const midY = slice.sampleY ?? (slice.yLeft + slice.yRight) / 2;
        const sMidX = toScreenX(midX);
        const sMidY = toScreenY(midY);

        ctx.moveTo(sxLeft, sZeroY);
        ctx.lineTo(sxLeft, syLeft);
        // Quadratic curve through midpoint
        ctx.quadraticCurveTo(sMidX, sMidY * 2 - (syLeft + syRight) / 2, sxRight, syRight);
        ctx.lineTo(sxRight, sZeroY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });

    // Draw Function Curve
    ctx.strokeStyle = '#38bdf8'; // sky-400
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    sampledPoints.forEach((pt, i) => {
      const scrX = toScreenX(pt.x);
      const scrY = toScreenY(pt.y);
      if (i === 0) ctx.moveTo(scrX, scrY);
      else ctx.lineTo(scrX, scrY);
    });
    ctx.stroke();

    // Draw Boundary Markers at a and b
    const scrA = toScreenX(a);
    const scrB = toScreenX(b);
    ctx.strokeStyle = '#ef4444'; // red-500
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(scrA, padY);
    ctx.lineTo(scrA, padY + plotH);
    ctx.moveTo(scrB, padY);
    ctx.lineTo(scrB, padY + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Labels on Axes
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`a = ${a}`, scrA, zeroY + 16);
    ctx.fillText(`b = ${b}`, scrB, zeroY + 16);

    // Legend
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`f(x) = ${funcExpr}`, padX + 10, padY + 18);
  }, [funcExpr, a, b, n, method, result]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Interactive Lab
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">{t('numLabTitle')}</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t('numLabSubtitle')}
          </p>
        </div>

        {/* Method selector pills */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(
            [
              { id: 'left_riemann', labelKey: 'leftRule' },
              { id: 'right_riemann', labelKey: 'rightRule' },
              { id: 'midpoint', labelKey: 'midpointRule' },
              { id: 'trapezoidal', labelKey: 'trapezoidRule' },
              { id: 'simpson', labelKey: 'simpsonRule' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                method === m.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {t(m.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">{t('benchmarkPresets')}</span>
        {presetFunctions.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(p)}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition whitespace-nowrap border border-slate-700/60 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Controls row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">{t('integrandLabel')}</label>
          <input
            type="text"
            value={funcExpr}
            onChange={(e) => setFuncExpr(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="exp(-x^2), sin(x), 1/x..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t('lowerLimitA')}</label>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t('upperLimitB')}</label>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-slate-400">
              {t('subintervalsN')} <span className="text-indigo-400 font-bold">{n}</span>
            </label>
            {method === 'simpson' && n % 2 !== 0 && (
              <span className="text-[10px] text-amber-400 font-medium">{t('autoEvenSimpson')}</span>
            )}
          </div>
          <input
            type="range"
            min="2"
            max="32"
            step="2"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>n = 2</span>
            <span>n = 16</span>
            <span>n = 32</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">{t('exactValueOptional')}</label>
          <input
            type="number"
            step="any"
            value={knownExact !== undefined ? knownExact : ''}
            onChange={(e) => setKnownExact(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="e.g. 0.882081"
          />
        </div>
      </div>

      {/* Canvas Plot */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-72 block cursor-crosshair" />
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
          <span className="text-slate-300">{t('curveLegend')}</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block ml-2"></span>
          <span className="text-slate-300">{t('slicesLegend')}</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/70 border border-indigo-900/40 rounded-xl p-3.5">
          <span className="text-xs text-slate-400 font-medium">{t('numApproximation')}</span>
          <p className="text-xl font-extrabold text-indigo-300 font-mono mt-1">
            {result.totalSum.toFixed(6)}
          </p>
          <span className="text-[11px] text-slate-500">
            {method === 'simpson'
              ? t('simpsonRule')
              : method === 'trapezoidal'
              ? t('trapezoidRule')
              : method === 'midpoint'
              ? t('midpointRule')
              : method === 'left_riemann'
              ? t('leftRule')
              : t('rightRule')}
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <span className="text-xs text-slate-400 font-medium">{t('stepSize')}</span>
          <p className="text-xl font-extrabold text-slate-200 font-mono mt-1">
            {result.deltaX.toFixed(4)}
          </p>
          <span className="text-[11px] text-slate-500">Δx = (b - a) / n</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <span className="text-xs text-slate-400 font-medium">{t('exactValue')}</span>
          <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
            {result.exactValue !== undefined ? result.exactValue.toFixed(6) : 'N/A'}
          </p>
          <span className="text-[11px] text-slate-500">{t('analyticalBenchmark')}</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
          <span className="text-xs text-slate-400 font-medium">{t('absoluteError')}</span>
          <p
            className={`text-xl font-extrabold font-mono mt-1 ${
              result.absoluteError !== undefined && result.absoluteError < 0.005
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {result.absoluteError !== undefined ? result.absoluteError.toExponential(3) : 'N/A'}
          </p>
          <span className="text-[11px] text-slate-500">
            {result.relativeErrorPercent !== undefined
              ? `${result.relativeErrorPercent.toFixed(3)}% ${t('relative')}`
              : 'Error'}
          </span>
        </div>
      </div>

      {/* Formula & Error Theoretical Bound Card */}
      <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{t('methodFormula')}</span>
          <div className="text-white mt-1">
            <MathView math={result.formulaLatex} block={false} />
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-indigo-900/60 pt-3 md:pt-0 md:pl-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{t('theoreticalErrorBound')}</span>
          <div className="text-white mt-1">
            <MathView math={result.theoreticalErrorFormula} block={false} />
          </div>
        </div>
      </div>

      {/* Collapsible Table of Nodes */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>{t('partitionNodesTable')} ({result.nodes.length} {t('pointsCount')})</span>
          </div>
          {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTable && (
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{t('nodeIndex')}</th>
                  <th className="py-2.5 px-3">{t('nodeXi')}</th>
                  <th className="py-2.5 px-3">{t('nodeFxi')}</th>
                  <th className="py-2.5 px-3">{t('nodeWeight')}</th>
                  <th className="py-2.5 px-3 text-right">{t('nodeWeightedVal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {result.nodes.map((node) => (
                  <tr key={node.index} className="hover:bg-slate-900/40">
                    <td className="py-2 px-3 text-slate-400">{node.index}</td>
                    <td className="py-2 px-3 text-sky-400">{node.xi.toFixed(4)}</td>
                    <td className="py-2 px-3">{node.fxi.toFixed(6)}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          node.weight === 4
                            ? 'bg-amber-500/20 text-amber-300'
                            : node.weight === 2
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {node.weight}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                      {node.weightedVal.toFixed(6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
