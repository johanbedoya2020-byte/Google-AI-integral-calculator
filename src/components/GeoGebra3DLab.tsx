import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GeoGebra2DCanvas, GeoGebraModuleType } from './GeoGebra2DCanvas';
import { GeoGebra3DView } from './GeoGebra3DView';
import { MathView } from '../utils/mathRenderer';
import {
  parseMathFunction,
  calculateVolumeRevolution,
  calculateVolumeShells,
  calculateVolumeCrossSections,
  calculateArcLength,
  calculateSurfaceArea,
  CrossSectionType,
} from '../utils/mathEvaluator';
import { getLocalizedPresets, LocalizedPresetOption } from '../data/geogebraPresets';
import {
  Box,
  Play,
  Pause,
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

interface GeoGebra3DLabProps {
  onLoadIntoSolver?: (problemLatex: string, topic?: string) => void;
  onOpenTutorial?: () => void;
}

export const GeoGebra3DLab: React.FC<GeoGebra3DLabProps> = ({
  onLoadIntoSolver,
  onOpenTutorial,
}) => {
  const { t, language } = useLanguage();

  // Localized presets list
  const presets = useMemo(() => getLocalizedPresets(language), [language]);

  // Active module
  const [activeModule, setActiveModule] = useState<GeoGebraModuleType>('solids_revolution');

  // Input states
  const [fInput, setFInput] = useState<string>('x^2');
  const [gInput, setGInput] = useState<string>('0');
  const [aInput, setAInput] = useState<number>(0);
  const [bInput, setBInput] = useState<number>(2);
  const [revolutionAxis, setRevolutionAxis] = useState<'x-axis' | 'y-axis' | 'line-y' | 'line-x'>('x-axis');
  const [axisValue, setAxisValue] = useState<number>(0);
  const [crossSectionShape, setCrossSectionShape] = useState<CrossSectionType>('semicircle');

  // Interactive Sliders
  const [revolutionDegrees, setRevolutionDegrees] = useState<number>(360);
  const [activeX, setActiveX] = useState<number>(1.0);
  const [numSlices, setNumSlices] = useState<number>(24);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [unrollShell, setUnrollShell] = useState<boolean>(false);

  // Play/pause slice animation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'split' | '2d' | '3d'>('split');

  // Selected preset
  const [currentPresetId, setCurrentPresetId] = useState<string>('rev-paraboloid');

  // Parse functions
  const f = useMemo(() => parseMathFunction(fInput), [fInput]);
  const g = useMemo(() => parseMathFunction(gInput), [gInput]);

  // Load preset
  const handleSelectPreset = (preset: LocalizedPresetOption) => {
    setCurrentPresetId(preset.id);
    setActiveModule(preset.module);
    setFInput(preset.fStr);
    setGInput(preset.gStr || '0');
    setAInput(preset.a);
    setBInput(preset.b);
    if (preset.axisType) setRevolutionAxis(preset.axisType);
    if (preset.axisValue !== undefined) setAxisValue(preset.axisValue);
    if (preset.shape) setCrossSectionShape(preset.shape);
    setActiveX((preset.a + preset.b) / 2);
  };

  // Slice animation ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveX((prev) => {
        const minX = Math.min(aInput, bInput);
        const maxX = Math.max(aInput, bInput);
        const next = prev + (maxX - minX) * 0.015;
        return next > maxX ? minX : next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, aInput, bInput]);

  // Real-time Calculus Calculations
  const calculatedResult = useMemo(() => {
    const a = aInput;
    const b = bInput;
    switch (activeModule) {
      case 'solids_revolution': {
        const val = calculateVolumeRevolution(f, g, a, b, revolutionAxis, axisValue);
        return {
          label: t('volRevResultLabel'),
          value: val,
          unit: t('unitCube'),
          latex: `V = \\pi \\int_{${a}}^{${b}} [R(x)^2 - r(x)^2] dx \\approx ${val.toFixed(4)}`,
        };
      }
      case 'cylindrical_shells': {
        const val = calculateVolumeShells(f, g, a, b, axisValue);
        return {
          label: t('volShellsResultLabel'),
          value: val,
          unit: t('unitCube'),
          latex: `V = 2\\pi \\int_{${a}}^{${b}} |x - ${axisValue}| [f(x) - g(x)] dx \\approx ${val.toFixed(4)}`,
        };
      }
      case 'cross_sections': {
        const val = calculateVolumeCrossSections(f, g, a, b, crossSectionShape);
        return {
          label: t('volCrossSecResultLabel'),
          value: val,
          unit: t('unitCube'),
          latex: `V = \\int_{${a}}^{${b}} A(x) dx \\approx ${val.toFixed(4)}`,
        };
      }
      case 'arc_length': {
        const val = calculateArcLength(f, a, b);
        return {
          label: t('arcLenResultLabel'),
          value: val,
          unit: t('unitLength'),
          latex: `L = \\int_{${a}}^{${b}} \\sqrt{1 + [f'(x)]^2} dx \\approx ${val.toFixed(4)}`,
        };
      }
      case 'surface_area': {
        const val = calculateSurfaceArea(f, a, b, revolutionAxis === 'x-axis' ? 'x-axis' : 'y-axis');
        return {
          label: t('surfAreaResultLabel'),
          value: val,
          unit: t('unitSquare'),
          latex: `S = 2\\pi \\int_{${a}}^{${b}} y \\sqrt{1 + [f'(x)]^2} dx \\approx ${val.toFixed(4)}`,
        };
      }
    }
  }, [activeModule, f, g, aInput, bInput, revolutionAxis, axisValue, crossSectionShape, t]);

  // Send to AI solver
  const handleSolveWithAI = () => {
    if (!onLoadIntoSolver) return;
    let latexProblem = '';
    const topicName = activeModule;
    if (activeModule === 'solids_revolution') {
      latexProblem = `\\text{Find the volume of the solid generated by revolving } y = ${fInput} \\text{ from } x = ${aInput} \\text{ to } x = ${bInput} \\text{ around the } ${revolutionAxis}`;
    } else if (activeModule === 'cylindrical_shells') {
      latexProblem = `\\text{Use cylindrical shells to find the volume of revolving } y = ${fInput} \\text{ on } [${aInput}, ${bInput}] \\text{ around } x = ${axisValue}`;
    } else if (activeModule === 'cross_sections') {
      latexProblem = `\\text{Find the volume of the solid whose base is bounded by } y = ${fInput} \\text{ on } [${aInput}, ${bInput}] \\text{ with } ${crossSectionShape} \\text{ cross sections}`;
    } else if (activeModule === 'arc_length') {
      latexProblem = `\\int_{${aInput}}^{${bInput}} \\sqrt{1 + \\left(\\frac{d}{dx}[${fInput}]\\right)^2} dx`;
    } else if (activeModule === 'surface_area') {
      latexProblem = `2\\pi \\int_{${aInput}}^{${bInput}} (${fInput}) \\sqrt{1 + \\left(\\frac{d}{dx}[${fInput}]\\right)^2} dx`;
    }
    onLoadIntoSolver(latexProblem, topicName);
  };

  const currentPreset = presets.find((p) => p.id === currentPresetId) || presets[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {t('geogebraTitle')}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t('geogebraPhase2Badge')}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              {t('geogebraSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('studentGuide')}</span>
              </button>
            )}

            {/* Layout switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewLayout('split')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  viewLayout === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('layoutSplit')}
              </button>
              <button
                onClick={() => setViewLayout('2d')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  viewLayout === '2d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('layout2DOnly')}
              </button>
              <button
                onClick={() => setViewLayout('3d')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  viewLayout === '3d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('layout3DOnly')}
              </button>
            </div>
          </div>
        </div>

        {/* Method Mode Selector Tabs */}
        <div className="flex overflow-x-auto gap-2 pt-4 scrollbar-thin">
          {[
            { id: 'solids_revolution', label: t('tabSolidsRev'), badge: 'V = π ∫ [R² - r²]' },
            { id: 'cylindrical_shells', label: t('tabCylindricalShells'), badge: 'V = 2π ∫ r · h' },
            { id: 'cross_sections', label: t('tabCrossSections'), badge: 'V = ∫ A(x) dx' },
            { id: 'arc_length', label: t('tabArcLength'), badge: 'L = ∫ √(1 + [f\']²)' },
            { id: 'surface_area', label: t('tabSurfaceArea'), badge: 'S = 2π ∫ y ds' },
          ].map((tab) => {
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as GeoGebraModuleType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-500/40 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Controls & Function Input Dashboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Presets Picker */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                {t('syllabusPresets')}
              </label>
              <select
                value={currentPresetId}
                onChange={(e) => {
                  const p = presets.find((item) => item.id === e.target.value);
                  if (p) handleSelectPreset(p);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.module.toUpperCase()}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Function Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-semibold text-indigo-300 block mb-1">
                  {t('upperCurveLabel')}
                </label>
                <input
                  type="text"
                  value={fInput}
                  onChange={(e) => setFInput(e.target.value)}
                  placeholder="e.g. x^2, sqrt(x), 4 - x^2, sin(x)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {(activeModule === 'solids_revolution' ||
                activeModule === 'cylindrical_shells' ||
                activeModule === 'cross_sections') && (
                <div>
                  <label className="text-xs font-semibold text-emerald-300 block mb-1">
                    {t('lowerCurveLabel')}
                  </label>
                  <input
                    type="text"
                    value={gInput}
                    onChange={(e) => setGInput(e.target.value)}
                    placeholder="e.g. 0 or x^2"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Interval Bounds [a, b] */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    {t('lowerLimitA')}:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={aInput}
                    onChange={(e) => setAInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    {t('upperLimitB')}:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bInput}
                    onChange={(e) => setBInput(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Revolution Axis (for revolution & surface area) */}
              {(activeModule === 'solids_revolution' || activeModule === 'surface_area') && (
                <div>
                  <label className="text-xs font-semibold text-amber-300 block mb-1">
                    {t('axisOfRevolutionLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setRevolutionAxis('x-axis');
                        setAxisValue(0);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        revolutionAxis === 'x-axis'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t('xAxisOption')}
                    </button>
                    <button
                      onClick={() => {
                        setRevolutionAxis('y-axis');
                        setAxisValue(0);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        revolutionAxis === 'y-axis'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t('yAxisOption')}
                    </button>
                  </div>
                </div>
              )}

              {/* Cylindrical Shells Axis */}
              {activeModule === 'cylindrical_shells' && (
                <div>
                  <label className="text-xs font-semibold text-amber-300 block mb-1">
                    {t('shellsAxisLabel')} {axisValue}:
                  </label>
                  <input
                    type="range"
                    min="-3"
                    max="5"
                    step="0.5"
                    value={axisValue}
                    onChange={(e) => setAxisValue(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}

              {/* Cross Section Shape */}
              {activeModule === 'cross_sections' && (
                <div>
                  <label className="text-xs font-semibold text-sky-300 block mb-1">
                    {t('crossSectionGeometryLabel')}
                  </label>
                  <select
                    value={crossSectionShape}
                    onChange={(e) => setCrossSectionShape(e.target.value as CrossSectionType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="square">{t('csShapeSquare')}</option>
                    <option value="semicircle">{t('csShapeSemicircle')}</option>
                    <option value="equilateral_triangle">{t('csShapeEquilateral')}</option>
                    <option value="isosceles_right_leg">{t('csShapeIsoLeg')}</option>
                    <option value="isosceles_right_hyp">{t('csShapeIsoHyp')}</option>
                    <option value="rectangle_2x">{t('csShapeRectangle')}</option>
                  </select>
                </div>
              )}
            </div>

            {/* Interactive Slicing & Angle Sliders */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Revolution Sweep Angle */}
              {(activeModule === 'solids_revolution' ||
                activeModule === 'cylindrical_shells' ||
                activeModule === 'surface_area') && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">{t('revAngleSliderLabel')}</span>
                    <span className="font-mono text-indigo-400 font-bold">{revolutionDegrees}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="360"
                    step="5"
                    value={revolutionDegrees}
                    onChange={(e) => setRevolutionDegrees(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              )}

              {/* Representative Slice Position x0 */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">{t('slicePosLabel')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-bold">{activeX.toFixed(2)}</span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                      title={isPlaying ? t('animPauseTooltip') : t('animPlayTooltip')}
                      aria-label={isPlaying ? t('animPauseTooltip') : t('animPlayTooltip')}
                    >
                      {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={Math.min(aInput, bInput)}
                  max={Math.max(aInput, bInput)}
                  step="0.05"
                  value={activeX}
                  onChange={(e) => setActiveX(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Number of Slices / Mesh Resolution */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">{t('riemannSlicesLabel')}</span>
                  <span className="font-mono text-slate-400">{numSlices}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  step="4"
                  value={numSlices}
                  onChange={(e) => setNumSlices(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Visual Display Toggles */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    showWireframe
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {t('toggleWireframe')}
                </button>
                <button
                  onClick={() => setIsTransparent(!isTransparent)}
                  className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    isTransparent
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {t('toggleGlass')}
                </button>
                {activeModule === 'cylindrical_shells' && (
                  <button
                    onClick={() => setUnrollShell(!unrollShell)}
                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      unrollShell
                        ? 'bg-pink-600/30 text-pink-300 border-pink-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {t('toggleUnrollShell')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Preset Description Card */}
          {currentPreset && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                {currentPreset.name}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{currentPreset.description}</p>
            </div>
          )}
        </div>

        {/* Right Side: 2D & 3D Interactive Viewports */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className={`grid gap-4 ${
              viewLayout === 'split' ? 'grid-cols-1 md:grid-cols-2 h-[480px]' : 'grid-cols-1 h-[520px]'
            }`}
          >
            {/* 2D GeoGebra Canvas */}
            {(viewLayout === 'split' || viewLayout === '2d') && (
              <div className="h-full flex flex-col space-y-1">
                <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
                  <span>{t('canvas2DTitle')}</span>
                  <span className="text-[11px] text-indigo-400">{t('canvas2DSubtitle')}</span>
                </div>
                <div className="flex-1 w-full min-h-[360px]">
                  <GeoGebra2DCanvas
                    f={f}
                    g={g}
                    a={aInput}
                    b={bInput}
                    activeX={activeX}
                    onActiveXChange={setActiveX}
                    moduleType={activeModule}
                    revolutionAxis={revolutionAxis}
                    axisValue={axisValue}
                    crossSectionShape={crossSectionShape}
                    numSegments={numSlices}
                  />
                </div>
              </div>
            )}

            {/* 3D WebGL Viewport */}
            {(viewLayout === 'split' || viewLayout === '3d') && (
              <div className="h-full flex flex-col space-y-1">
                <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
                  <span>{t('canvas3DTitle')}</span>
                  <span className="text-[11px] text-sky-400">{t('canvas3DSubtitle')}</span>
                </div>
                <div className="flex-1 w-full min-h-[360px]">
                  <GeoGebra3DView
                    f={f}
                    g={g}
                    a={aInput}
                    b={bInput}
                    activeX={activeX}
                    revolutionAngle={(revolutionDegrees * Math.PI) / 180}
                    moduleType={activeModule}
                    revolutionAxis={revolutionAxis}
                    axisValue={axisValue}
                    crossSectionShape={crossSectionShape}
                    numSlices={numSlices}
                    showWireframe={showWireframe}
                    isTransparent={isTransparent}
                    unrollShell={unrollShell}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Mathematical Evaluation & KaTeX Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                  {t('defIntegralFormulation')}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {calculatedResult.label}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">{t('exactNumResult')}</span>
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
                  {calculatedResult.value.toFixed(5)}{' '}
                  <span className="text-xs font-normal text-slate-400">{calculatedResult.unit}</span>
                </span>
              </div>
            </div>

            {/* Rendered KaTeX Integral Equation */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center overflow-x-auto">
              <MathView math={calculatedResult.latex} block={true} />
            </div>

            {/* Geometric Element Insight & Send to Solver */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="text-xs text-slate-400 space-y-1">
                <p>
                  <strong className="text-slate-200">{t('sliceAtLabel')} {activeX.toFixed(2)}:</strong>{' '}
                  f({activeX.toFixed(2)}) = {f(activeX).toFixed(3)}, g({activeX.toFixed(2)}) ={' '}
                  {g(activeX).toFixed(3)}, height = {Math.abs(f(activeX) - g(activeX)).toFixed(3)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {t('integratesDifferentialNote')} [{aInput}, {bInput}].
                </p>
              </div>

              {onLoadIntoSolver && (
                <button
                  onClick={handleSolveWithAI}
                  className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('sendToSolverBtn')}</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
