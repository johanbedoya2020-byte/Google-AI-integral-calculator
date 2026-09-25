/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SolutionResult, CuratedExample } from './types/calculus';
import { CURATED_EXAMPLES } from './data/curriculumData';
import { getCuratedExamplesByLanguage } from './data/localizedExamples';
import { NumericalMethodType } from './utils/numericalCalculus';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { IntegralSolverInput } from './components/IntegralSolverInput';
import { StepByStepViewer } from './components/StepByStepViewer';
import { NumericalVisualizer } from './components/NumericalVisualizer';
import { CurriculumBrowser } from './components/CurriculumBrowser';
import { PracticeArena } from './components/PracticeArena';
import { FormulaCheatsheetModal } from './components/FormulaCheatsheetModal';
import {
  Calculator,
  Activity,
  BookOpen,
  Award,
  BookText,
  Sparkles,
  ExternalLink,
  Sigma,
  HelpCircle,
} from 'lucide-react';

function AcademyAppContent() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'solver' | 'numerical' | 'curriculum' | 'practice'>('solver');
  const [currentCuratedId, setCurrentCuratedId] = useState<string>('num-simpson-1');
  const [currentSolution, setCurrentSolution] = useState<SolutionResult>(() => {
    const list = getCuratedExamplesByLanguage(language);
    return list[0]?.precomputedSolution || CURATED_EXAMPLES[0].precomputedSolution;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When language changes, update current solution if it corresponds to a curated example
  useEffect(() => {
    if (currentCuratedId) {
      const list = getCuratedExamplesByLanguage(language);
      const matched = list.find((ex) => ex.id === currentCuratedId);
      if (matched) {
        setCurrentSolution(matched.precomputedSolution);
      }
    }
  }, [language, currentCuratedId]);

  // Numerical Lab state initialized from presets
  const [labConfig, setLabConfig] = useState<{
    func: string;
    a: number;
    b: number;
    n: number;
    method: NumericalMethodType;
    exact: number;
  }>({
    func: 'exp(-x^2)',
    a: 0,
    b: 2,
    n: 4,
    method: 'simpson',
    exact: 0.88208139,
  });

  // Handle solving a problem
  const handleSolve = async (problemText: string, topic: string, numericalParams?: any) => {
    setIsLoading(true);
    setErrorMessage(null);

    // 1. Check if the user selected or typed a problem matching one of our high-quality benchmarks
    const cleanInput = problemText.trim().replace(/\s+/g, ' ');
    const list = getCuratedExamplesByLanguage(language);
    const matchedCurated = list.find((ex) => {
      const cleanEx = ex.problemLatex.trim().replace(/\s+/g, ' ');
      return (
        cleanInput.includes(cleanEx) ||
        cleanEx.includes(cleanInput) ||
        cleanInput === ex.id
      );
    });

    if (matchedCurated && topic === 'auto') {
      setCurrentCuratedId(matchedCurated.id);
      setCurrentSolution(matchedCurated.precomputedSolution);
      if (matchedCurated.numericalPreset) {
        setLabConfig({
          func: matchedCurated.numericalPreset.funcStr,
          a: matchedCurated.numericalPreset.a,
          b: matchedCurated.numericalPreset.b,
          n: matchedCurated.numericalPreset.n,
          method: matchedCurated.numericalPreset.method,
          exact: matchedCurated.numericalPreset.exactValue || 0,
        });
      }
      setIsLoading(false);
      return;
    }

    // 2. Call backend /api/solve-integral powered by Gemini with language parameter
    try {
      setCurrentCuratedId(''); // custom problem
      const response = await fetch('/api/solve-integral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText,
          topic,
          numericalConfig: numericalParams,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setCurrentSolution(resData.data);
      } else {
        throw new Error('Invalid response structure from solver engine');
      }
    } catch (err: any) {
      console.warn('API solve failed, falling back to nearest textbook model:', err);
      // Fallback gracefully so the student's workflow is never interrupted
      setErrorMessage(t('noteFallback'));
      // Pick matching topic benchmark in current language
      const fallbackList = getCuratedExamplesByLanguage(language);
      const fallback =
        fallbackList.find((ex) => ex.topic === topic) || fallbackList[0];
      setCurrentSolution(fallback.precomputedSolution);
      setCurrentCuratedId(fallback.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a curated example from curriculum browser or preset picker
  const handleSelectCurated = (example: CuratedExample) => {
    setCurrentCuratedId(example.id);
    const list = getCuratedExamplesByLanguage(language);
    const matched = list.find((ex) => ex.id === example.id) || example;
    setCurrentSolution(matched.precomputedSolution);

    if (example.numericalPreset) {
      setLabConfig({
        func: example.numericalPreset.funcStr,
        a: example.numericalPreset.a,
        b: example.numericalPreset.b,
        n: example.numericalPreset.n,
        method: example.numericalPreset.method,
        exact: example.numericalPreset.exactValue || 0,
      });
    }
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch visualizer from step-by-step viewer
  const handleOpenNumericalLab = () => {
    setActiveTab('numerical');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-serif text-2xl font-bold shrink-0">
              ∫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  {t('appName')}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t('appBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Right Action: Language Selector & Formula Cheat Sheet Button */}
          <div className="flex items-center gap-2.5">
            <LanguageSelector />

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
            >
              <BookText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{t('masterFormulaSheet')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'solver', labelKey: 'tabSolver', icon: Calculator },
            { id: 'numerical', labelKey: 'tabNumerical', icon: Activity },
            { id: 'curriculum', labelKey: 'tabCurriculum', icon: BookOpen },
            { id: 'practice', labelKey: 'tabPractice', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 text-white bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-400 hover:text-white font-bold ml-3 cursor-pointer"
            >
              {t('dismiss')}
            </button>
          </div>
        )}

        {/* Tab 1: Solver & Step-by-Step */}
        {activeTab === 'solver' && (
          <div className="space-y-8">
            {/* Input Bar */}
            <IntegralSolverInput
              onSolve={handleSolve}
              isLoading={isLoading}
              onSelectCurated={handleSelectCurated}
            />

            {/* Step-by-Step Solution Card */}
            {currentSolution && (
              <StepByStepViewer
                solution={currentSolution}
                onOpenNumericalLab={handleOpenNumericalLab}
              />
            )}
          </div>
        )}

        {/* Tab 2: Numerical Integration Lab */}
        {activeTab === 'numerical' && (
          <NumericalVisualizer
            initialFunc={labConfig.func}
            initialA={labConfig.a}
            initialB={labConfig.b}
            initialN={labConfig.n}
            initialMethod={labConfig.method}
            initialExact={labConfig.exact}
          />
        )}

        {/* Tab 3: Curriculum & Syllabus Modules */}
        {activeTab === 'curriculum' && (
          <CurriculumBrowser
            onSelectExample={handleSelectCurated}
            onOpenNumericalLab={handleOpenNumericalLab}
          />
        )}

        {/* Tab 4: Practice & Quiz Arena */}
        {activeTab === 'practice' && <PracticeArena />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {t('appName')} — {t('appSubtitle')}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Riemann</span>
            <span>•</span>
            <span>Trapezoid</span>
            <span>•</span>
            <span>Simpson</span>
            <span>•</span>
            <span>u-Sub</span>
            <span>•</span>
            <span>Trinomials</span>
            <span>•</span>
            <span>Parts</span>
          </div>
        </div>
      </footer>

      {/* Master Formula Cheat Sheet Modal */}
      <FormulaCheatsheetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AcademyAppContent />
    </LanguageProvider>
  );
}
