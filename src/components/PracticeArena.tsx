import React, { useState } from 'react';
import { PracticeProblem, QuizOption } from '../types/calculus';
import { LOCALIZED_PRACTICE_PROBLEMS } from '../data/localizedContent';
import { MathView, FormattedMathText } from '../utils/mathRenderer';
import { useLanguage } from '../context/LanguageContext';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Eye,
  Award,
  ExternalLink,
  Check,
  XCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PracticeArenaProps {
  onLoadInSolver?: (problemLatex: string, topic?: string) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ onLoadInSolver }) => {
  const { t, language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [customProblem, setCustomProblem] = useState<PracticeProblem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Substitution');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const presetList = LOCALIZED_PRACTICE_PROBLEMS[language] || LOCALIZED_PRACTICE_PROBLEMS.en;

  // Filtered preset problems
  const filteredProblems = React.useMemo(() => {
    if (filterTopic === 'all') return presetList;
    return presetList.filter((p) => {
      const top = p.topic.toLowerCase();
      if (filterTopic === 'sub') return top.includes('substit') || top.includes('sustitu') || top.includes('variable');
      if (filterTopic === 'parts') return top.includes('part');
      if (filterTopic === 'trinomial') return top.includes('trinom') || top.includes('quadrat');
      if (filterTopic === 'definite') return top.includes('defin');
      if (filterTopic === 'invtrig') return top.includes('invers') || top.includes('hiperb') || top.includes('hyperb');
      if (filterTopic === 'numerical') return top.includes('numér') || top.includes('numer') || top.includes('simpson');
      return true;
    });
  }, [presetList, filterTopic]);

  const activeProblem: PracticeProblem = customProblem || (
    filteredProblems[selectedIndex] || presetList[0]
  );

  const handleSelectProblem = (idx: number) => {
    setCustomProblem(null);
    setSelectedIndex(idx);
    setShowHint1(false);
    setShowHint2(false);
    setShowSolution(false);
    setSelectedOptionId(null);
  };

  const handleNextProblem = () => {
    setCustomProblem(null);
    setShowHint1(false);
    setShowHint2(false);
    setShowSolution(false);
    setSelectedOptionId(null);
    setSelectedIndex((prev) => (prev + 1) % filteredProblems.length);
  };

  const getDifficultyLabel = (diff: string) => {
    if (diff === 'Beginner' || diff === 'Principiante' || diff === 'Iniciante' || diff === 'Débutant') {
      return t('difficultyBeginner');
    }
    if (
      diff === 'Intermediate' ||
      diff === 'Medium' ||
      diff === 'Intermedio' ||
      diff === 'Intermediário' ||
      diff === 'Intermédiaire'
    ) {
      return t('difficultyMedium');
    }
    return t('difficultyAdvanced');
  };

  const handleGenerateLive = async () => {
    setIsGenerating(true);
    setShowHint1(false);
    setShowHint2(false);
    setShowSolution(false);
    setSelectedOptionId(null);

    try {
      const res = await fetch('/api/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          language,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      if (data.success && data.data) {
        setCustomProblem(data.data);
      }
    } catch (err) {
      console.warn('Fallback to local practice generator', err);
      handleNextProblem();
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedOption: QuizOption | undefined = activeProblem.quizOptions?.find(
    (o) => o.id === selectedOptionId
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('practiceTitle')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('practiceSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateLive}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              {isGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isGenerating ? t('generating') : t('generateNewLive')}</span>
            </button>
          </div>
        </div>

        {/* Custom Generator Controls Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
          <span className="text-slate-400 font-semibold">{t('customSettings')}</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
          >
            <option value="Substitution">{t('topicSub')}</option>
            <option value="Integration by Parts">{t('topicParts')}</option>
            <option value="Trinomials">{t('topicTrinomials')}</option>
            <option value="Definite Integrals">{t('topicDefinite')}</option>
            <option value="Inverse Trig & Hyperbolic">{t('topicInvTrig')}</option>
            <option value="Numerical Methods">{t('topicNumerical')}</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
          >
            <option value="Beginner">{t('difficultyBeginner')}</option>
            <option value="Medium">{t('difficultyMedium')}</option>
            <option value="Advanced">{t('difficultyAdvanced')}</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: VISUAL EXERCISE DECK (Cards Gallery) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white tracking-tight">{t('visualDeckTitle')}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('visualDeckSubtitle')}</p>
          </div>

          {/* Topic Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: t('allTopics') },
              { id: 'sub', label: t('topicSub') },
              { id: 'parts', label: t('topicParts') },
              { id: 'trinomial', label: t('topicTrinomials') },
              { id: 'definite', label: t('topicDefinite') },
              { id: 'invtrig', label: t('topicInvTrig') },
              { id: 'numerical', label: t('topicNumerical') },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => {
                  setFilterTopic(chip.id);
                  setSelectedIndex(0);
                  setCustomProblem(null);
                  setSelectedOptionId(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  filterTopic === chip.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProblems.map((prob, idx) => {
            const isCurrent = !customProblem && selectedIndex === idx;
            const diffLabel = getDifficultyLabel(prob.difficulty);
            return (
              <div
                key={idx}
                onClick={() => handleSelectProblem(idx)}
                className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer border text-left flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {t('exerciseLabel')} #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        prob.difficulty === 'Beginner' || prob.difficulty === 'Principiante' || prob.difficulty === 'Iniciante' || prob.difficulty === 'Débutant'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : prob.difficulty === 'Advanced' || prob.difficulty === 'Avanzado' || prob.difficulty === 'Avançado' || prob.difficulty === 'Avancé'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {diffLabel}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-indigo-300 block truncate mb-2">
                    {prob.topic}
                  </span>

                  {/* Visual Rendered Integral Box */}
                  <div className="py-2.5 px-3 bg-slate-900/90 rounded-lg border border-slate-800 text-center overflow-x-auto my-1 transition group-hover:border-indigo-800/40">
                    <MathView math={prob.problemLatex} block={true} className="text-white text-base" />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {prob.solutionSteps?.length || 3} {t('stepsCountLabel')} • 2 {t('hintsCountLabel')}
                  </span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isCurrent ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {isCurrent ? t('currentlyActive') : t('selectExercise')}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ACTIVE PROBLEM HERO CARD & INTERACTIVE VISUAL QUIZ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              {activeProblem.topic}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
              {activeProblem.subTopic}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              {getDifficultyLabel(activeProblem.difficulty)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onLoadInSolver && (
              <button
                onClick={() => onLoadInSolver(activeProblem.problemLatex, activeProblem.topic)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold transition cursor-pointer"
                title={t('openInSolverBtn')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('openInSolverBtn')}</span>
              </button>
            )}
            <button
              onClick={handleNextProblem}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              {t('nextPreset')}
            </button>
          </div>
        </div>

        {/* Visual Math Hero Display */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold block">
            {t('evaluateIntegral')}
          </span>
          <div className="text-3xl sm:text-4xl text-white font-serif py-3 overflow-x-auto">
            <MathView math={activeProblem.problemLatex} block={true} />
          </div>
        </div>

        {/* INTERACTIVE STRATEGY & METHOD INTUITION QUIZ */}
        {activeProblem.quizOptions && activeProblem.quizOptions.length > 0 && (
          <div className="bg-slate-950/60 border border-indigo-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">
                {t('interactiveQuizTitle')}
              </h4>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              {activeProblem.quizQuestion || t('quizQuestionPrompt')}
            </p>

            {/* Visual Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {activeProblem.quizOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'bg-slate-900/90 border-slate-800 hover:border-indigo-600/60 text-slate-200';
                if (isSelected) {
                  if (opt.isCorrect) {
                    cardStyle = 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-100';
                  } else {
                    cardStyle = 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/40 text-rose-100';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-start gap-3 ${cardStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {opt.id}
                    </span>

                    <div className="flex-1 space-y-1.5">
                      <span className="text-xs font-semibold block">{opt.label}</span>
                      {opt.mathFormula && (
                        <div className="py-1 px-2.5 bg-slate-950/80 rounded-md border border-slate-800/80 overflow-x-auto">
                          <MathView math={opt.mathFormula} block={false} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quiz Feedback Banner */}
            {selectedOption && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                }`}
              >
                {selectedOption.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <span className="font-bold block">
                    {selectedOption.isCorrect ? t('quizCorrect') : t('quizIncorrect')}
                  </span>
                  <p className="leading-relaxed text-slate-300">{selectedOption.feedback}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scaffolding Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowHint1(!showHint1)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              showHint1
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('hint1Btn')}</span>
          </button>

          <button
            onClick={() => setShowHint2(!showHint2)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              showHint2
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('hint2Btn')}</span>
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              showSolution
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showSolution ? t('hideSolution') : t('revealSolution')}</span>
          </button>
        </div>

        {/* Hint 1 Display */}
        {showHint1 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wide">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{t('hint1Btn')}</span>
            </div>
            <FormattedMathText content={activeProblem.hint1} className="text-xs text-amber-100/90 leading-relaxed font-normal" />
          </div>
        )}

        {/* Hint 2 Display */}
        {showHint2 && (
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>{t('hint2Btn')}</span>
            </div>
            <FormattedMathText content={activeProblem.hint2} className="text-xs text-indigo-100/90 leading-relaxed font-normal" />
          </div>
        )}

        {/* Full Derivation Accordion */}
        {showSolution && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-900/40 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">{t('fullDerivation')}</h4>
            </div>

            <div className="space-y-3.5">
              {activeProblem.solutionSteps.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide block">
                    {t('stepWord')} {step.stepNumber}: {step.title}
                  </span>
                  <FormattedMathText content={step.explanation} className="text-xs text-slate-300 leading-relaxed" />
                  <div className="py-2.5 px-3 bg-slate-950 rounded-lg text-center overflow-x-auto border border-slate-800/80">
                    <MathView math={step.latexMath} block={true} />
                  </div>
                </div>
              ))}
            </div>

            {/* Final Answer Banner */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{t('finalAnswer')}</span>
              <div className="text-2xl sm:text-3xl font-serif text-white py-1 overflow-x-auto">
                <MathView math={activeProblem.finalAnswerLatex} block={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
