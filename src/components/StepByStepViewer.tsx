import React, { useState } from 'react';
import { SolutionResult } from '../types/calculus';
import { MathView, FormattedMathText } from '../utils/mathRenderer';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Share2,
  Copy,
  Check,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface StepByStepViewerProps {
  solution: SolutionResult;
  onOpenNumericalLab?: () => void;
}

export const StepByStepViewer: React.FC<StepByStepViewerProps> = ({
  solution,
  onOpenNumericalLab,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(solution.finalAnswerLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const isNumerical =
    solution.mainTopic.toLowerCase().includes('numerical') ||
    solution.mainTopic.toLowerCase().includes('numérico') ||
    solution.mainTopic.toLowerCase().includes('numérique') ||
    solution.subTopic.toLowerCase().includes('riemann') ||
    solution.subTopic.toLowerCase().includes('simpson') ||
    solution.subTopic.toLowerCase().includes('trapezoid') ||
    solution.subTopic.toLowerCase().includes('trapecio') ||
    solution.subTopic.toLowerCase().includes('trapèze');

  const getMainTopicLabel = (topic: string) => {
    const lower = topic.toLowerCase();
    if (lower.includes('numeric') || lower.includes('numéric') || lower.includes('numériq')) return t('topicNumerical');
    if (lower.includes('definite') || lower.includes('definid') || lower.includes('définie') || lower.includes('area') || lower.includes('aire')) return t('topicDefinite');
    if (lower.includes('direct')) return t('topicDirect');
    if (lower.includes('substitut') || lower.includes('sustit') || lower.includes('changement')) return t('topicSub');
    if (lower.includes('inverse') || lower.includes('inversa') || lower.includes('hyperbol') || lower.includes('hiperb')) return t('topicInvTrig');
    if (lower.includes('trinom') || lower.includes('square') || lower.includes('cuadrado') || lower.includes('carré')) return t('topicTrinomials');
    if (lower.includes('part') || lower.includes('liate')) return t('topicParts');
    return topic;
  };

  const getVerificationTypeLabel = (vType?: string) => {
    if (!vType) return '';
    const lower = vType.toLowerCase();
    if (lower.includes('differentiat') || lower.includes('deriv') || lower.includes('dériv')) return t('verifDiffCheck');
    if (lower.includes('bound') || lower.includes('cota') || lower.includes('limite') || lower.includes('majoration')) return t('verifErrorEst');
    if (lower.includes('analytic') || lower.includes('analític') || lower.includes('exact')) return t('verifAnalyticComp');
    if (lower.includes('product') || lower.includes('producto') || lower.includes('produto') || lower.includes('produit')) return t('verifProductRule');
    return vType;
  };

  return (
    <div className="space-y-6">
      {/* Problem Header & Metadata Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {getMainTopicLabel(solution.mainTopic)}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              {solution.subTopic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isNumerical && onOpenNumericalLab && (
              <button
                onClick={onOpenNumericalLab}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 transition cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{t('simulateInLab')}</span>
              </button>
            )}

            <button
              onClick={handleCopyLatex}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Copy Final Answer LaTeX"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('copied') : t('copyAnswer')}</span>
            </button>
          </div>
        </div>

        <div className="my-3 py-3 px-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-center">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
            {t('problemStatement')}
          </span>
          <div className="text-2xl text-white font-serif py-1 overflow-x-auto">
            <MathView math={solution.problemStatementLatex} block={true} />
          </div>
        </div>

        {/* Strategy / Method Justification */}
        {solution.methodJustification && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
                {t('strategicJustification')}
              </h4>
              <FormattedMathText
                content={solution.methodJustification}
                className="text-sm text-slate-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Theoretical Foundations & Formulas */}
      {solution.theoryAndFormulas && solution.theoryAndFormulas.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">{t('theoreticalFoundations')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.theoryAndFormulas.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-800/40 transition"
              >
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide block mb-1.5">
                  {item.name}
                </span>
                <div className="my-2 py-2 px-3 bg-slate-900/90 rounded-lg border border-slate-800 text-center overflow-x-auto">
                  <MathView math={item.latexFormula} block={true} />
                </div>
                <FormattedMathText content={item.explanation} className="text-xs text-slate-400 mt-2 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-Step Algebraic Process */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">{t('stepByStepSolution')}</h3>
          </div>
          <span className="text-xs text-slate-400">{solution.steps.length} {t('sequentialSteps')}</span>
        </div>

        {solution.steps.map((step) => {
          const isCollapsed = expandedSteps[step.stepNumber] === false;
          return (
            <div
              key={step.stepNumber}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-slate-700"
            >
              {/* Step Header */}
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className="px-6 py-4 bg-slate-900/80 flex items-center justify-between cursor-pointer select-none border-b border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-extrabold font-mono">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                </div>
                <div className="text-xs text-slate-500 hover:text-slate-300">
                  {isCollapsed ? t('showDetails') : t('hideDetails')}
                </div>
              </div>

              {/* Step Body */}
              {!isCollapsed && (
                <div className="p-6 space-y-4">
                  {/* Instructional explanation */}
                  <FormattedMathText
                    content={step.explanation}
                    className="text-sm text-slate-300 leading-relaxed"
                  />

                  {/* Mathematical Transformation */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/30 text-center overflow-x-auto shadow-inner">
                    <MathView math={step.latexMath} block={true} />
                  </div>

                  {/* Side notes / scratch calculations */}
                  {step.sideCalculations && step.sideCalculations.length > 0 && (
                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                        {t('scratchCalculations')}
                      </span>
                      {step.sideCalculations.map((calc, i) => (
                        <div key={i} className="text-slate-300 flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{calc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Verification Card (Differentiation / Error Bound) */}
      {solution.verification && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              {t('rigorousVerification')} ({getVerificationTypeLabel(solution.verification.type)})
            </h4>
          </div>

          <FormattedMathText content={solution.verification.explanation} className="text-xs text-slate-400" />

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-950 text-center overflow-x-auto">
            <MathView math={solution.verification.latexMath} block={true} />
          </div>
        </div>
      )}

      {/* Final Answer Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
          {t('finalMathematicalAnswer')}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif py-2 overflow-x-auto">
          <MathView math={solution.finalAnswerLatex} block={true} />
        </div>
        {solution.decimalApproximation && (
          <p className="text-sm text-slate-400 font-mono">
            {t('decimalValue')} <span className="text-indigo-300 font-semibold">{solution.decimalApproximation}</span>
          </p>
        )}
      </div>

      {/* Common Pitfalls & Difficulties of Students */}
      {solution.commonPitfalls && solution.commonPitfalls.length > 0 && (
        <div className="bg-slate-900 border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">{t('commonPitfalls')}</h4>
            </div>
            <span className="text-[11px] font-medium text-amber-300/80 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              {t('pitfallAdvice')}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {solution.commonPitfalls.map((pitfall, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-amber-800/30 hover:border-amber-600/40 rounded-xl p-4 transition-colors flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                    {t('misconceptionBadge')}{idx + 1}
                  </div>
                  <FormattedMathText
                    content={pitfall}
                    className="text-xs text-slate-200 leading-relaxed font-normal"
                    inline={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
