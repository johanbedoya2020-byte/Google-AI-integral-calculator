import React, { useState } from 'react';
import { TopicCategory, CuratedExample } from '../types/calculus';
import { LOCALIZED_TOPIC_CURRICULUM } from '../data/localizedContent';
import { getCuratedExamplesByLanguage } from '../data/localizedExamples';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calculator, BookOpen, Layers, ArrowRight, CornerDownLeft } from 'lucide-react';

interface IntegralSolverInputProps {
  onSolve: (problemText: string, topic: string, numericalParams?: any) => void;
  isLoading: boolean;
  onSelectCurated: (example: CuratedExample) => void;
}

const MATH_KEYPAD = [
  { label: '∫ dx', insert: '\\int  dx' },
  { label: '∫_a^b', insert: '\\int_{a}^{b}  dx' },
  { label: 'x²', insert: 'x^2' },
  { label: '√x', insert: '\\sqrt{x}' },
  { label: 'e^x', insert: 'e^{x}' },
  { label: 'ln(x)', insert: '\\ln(x)' },
  { label: 'sin(x)', insert: '\\sin(x)' },
  { label: 'cos(x)', insert: '\\cos(x)' },
  { label: 'tan(x)', insert: '\\tan(x)' },
  { label: 'arctan(x)', insert: '\\arctan(x)' },
  { label: 'a/b', insert: '\\frac{a}{b}' },
  { label: 'ax²+bx+c', insert: 'x^2 + 4x + 13' },
];

export const IntegralSolverInput: React.FC<IntegralSolverInputProps> = ({
  onSolve,
  isLoading,
  onSelectCurated,
}) => {
  const { t, language } = useLanguage();
  const [problemText, setProblemText] = useState('\\int x e^{3x} \\, dx');
  const [selectedTopic, setSelectedTopic] = useState<string>('auto');

  const curatedList = getCuratedExamplesByLanguage(language);
  const curriculum = LOCALIZED_TOPIC_CURRICULUM[language] || LOCALIZED_TOPIC_CURRICULUM.en;

  // Numerical parameters if numerical method is chosen
  const [numMethod, setNumMethod] = useState('simpson');
  const [numA, setNumA] = useState('0');
  const [numB, setNumB] = useState('2');
  const [numN, setNumN] = useState('4');

  const handleKeypadInsert = (symbol: string) => {
    setProblemText((prev) => prev + ' ' + symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;

    if (selectedTopic === 'numerical_methods') {
      onSolve(problemText, selectedTopic, {
        method: numMethod,
        a: parseFloat(numA) || 0,
        b: parseFloat(numB) || 1,
        n: parseInt(numN, 10) || 4,
      });
    } else {
      onSolve(problemText, selectedTopic);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <span>{t('solverTitle')}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('solverSubtitle')}
          </p>
        </div>

        {/* Curated Benchmark Dropdown */}
        <div className="w-full sm:w-auto">
          <select
            onChange={(e) => {
              const found = curatedList.find((ex) => ex.id === e.target.value);
              if (found) {
                setProblemText(found.problemLatex);
                setSelectedTopic(found.topic);
                onSelectCurated(found);
              }
            }}
            defaultValue=""
            className="w-full sm:w-64 bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled>
              {t('exploreBenchmarks')}
            </option>
            {curatedList.map((ex) => (
              <option key={ex.id} value={ex.id}>
                [{curriculum[ex.topic]?.badge || ex.topic}] {ex.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Input Bar */}
        <div className="relative">
          <textarea
            rows={2}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 shadow-inner pr-36 resize-none"
          />
          <button
            type="submit"
            disabled={isLoading || !problemText.trim()}
            className="absolute right-2.5 bottom-3.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('solving')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>{t('solveAndExplain')}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Math Keypad */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            {t('quickInsert')}
          </span>
          {MATH_KEYPAD.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleKeypadInsert(item.insert)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Topic Guide Selection Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400">{t('targetTechnique')}</span>
          {[
            { id: 'auto', labelKey: 'topicAuto' },
            { id: 'numerical_methods', labelKey: 'topicNumerical' },
            { id: 'definite_integrals', labelKey: 'topicDefinite' },
            { id: 'direct', labelKey: 'topicDirect' },
            { id: 'substitution', labelKey: 'topicSub' },
            { id: 'inverse_trig_hyperbolic', labelKey: 'topicInvTrig' },
            { id: 'trinomials', labelKey: 'topicTrinomials' },
            { id: 'parts', labelKey: 'topicParts' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedTopic(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedTopic === item.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>

        {/* Numerical Config Drawer if Numerical Selected */}
        {selectedTopic === 'numerical_methods' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t('methodFormula')}</label>
              <select
                value={numMethod}
                onChange={(e) => setNumMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="simpson">{t('simpsonRule')}</option>
                <option value="trapezoidal">{t('trapezoidRule')}</option>
                <option value="midpoint">{t('midpointRule')}</option>
                <option value="left_riemann">{t('leftRule')}</option>
                <option value="right_riemann">{t('rightRule')}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">{t('lowerLimitA')}</label>
              <input
                type="text"
                value={numA}
                onChange={(e) => setNumA(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">{t('upperLimitB')}</label>
              <input
                type="text"
                value={numB}
                onChange={(e) => setNumB(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">{t('subintervalsN')}</label>
              <input
                type="number"
                min="2"
                max="50"
                step="2"
                value={numN}
                onChange={(e) => setNumN(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
