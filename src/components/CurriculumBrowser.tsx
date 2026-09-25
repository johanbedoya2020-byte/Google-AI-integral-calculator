import React, { useState } from 'react';
import { TopicCategory, CuratedExample } from '../types/calculus';
import { LOCALIZED_TOPIC_CURRICULUM } from '../data/localizedContent';
import { getCuratedExamplesByLanguage } from '../data/localizedExamples';
import { MathView } from '../utils/mathRenderer';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface CurriculumBrowserProps {
  onSelectExample: (example: CuratedExample) => void;
  onOpenNumericalLab: () => void;
}

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({
  onSelectExample,
  onOpenNumericalLab,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TopicCategory>('numerical_methods');

  const curriculum = LOCALIZED_TOPIC_CURRICULUM[language] || LOCALIZED_TOPIC_CURRICULUM.en;
  const topicInfo = curriculum[activeTab];
  const allCurated = getCuratedExamplesByLanguage(language);
  const relevantExamples = allCurated.filter((ex) => ex.topic === activeTab);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">{t('syllabusTitle')}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('syllabusSubtitle')}
          </p>
        </div>

        {activeTab === 'numerical_methods' && (
          <button
            onClick={onOpenNumericalLab}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('launchVisualizer')}</span>
          </button>
        )}
      </div>

      {/* Topic Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
        {(Object.keys(curriculum) as TopicCategory[]).map((topicKey) => {
          const item = curriculum[topicKey];
          const isActive = activeTab === topicKey;
          return (
            <button
              key={topicKey}
              onClick={() => setActiveTab(topicKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <span>{item.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-indigo-500/40 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Topic Details */}
      <div className="space-y-6">
        {/* Overview Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">{topicInfo.title}</h3>
            <span className="text-xs text-indigo-400 font-semibold">{topicInfo.badge}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{topicInfo.overview}</p>

          <div className="pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              {t('keyConcepts')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {topicInfo.subtopics.map((sub, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Formulas Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {t('coreFormulas')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topicInfo.keyFormulas.map((f, i) => (
              <div
                key={i}
                className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl hover:border-indigo-800/50 transition"
              >
                <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
                  {f.name}
                </span>
                <div className="py-2 px-3 bg-slate-900/90 rounded-lg border border-slate-800 text-center overflow-x-auto">
                  <MathView math={f.latex} block={true} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Worked Examples */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('workedExamples')} ({relevantExamples.length})
            </h4>
            <span className="text-xs text-slate-500">{t('clickInspect')}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {relevantExamples.map((ex) => (
              <div
                key={ex.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-indigo-700/60 p-4 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      {ex.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        ex.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ex.difficulty === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {ex.difficulty === 'Beginner'
                        ? t('difficultyBeginner')
                        : ex.difficulty === 'Intermediate'
                        ? t('difficultyMedium')
                        : t('difficultyAdvanced')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{ex.description}</p>
                  <div className="pt-1 font-mono text-sm text-sky-300">
                    <MathView math={ex.problemLatex} block={false} />
                  </div>
                </div>

                <button
                  onClick={() => onSelectExample(ex)}
                  className="shrink-0 px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('inspectSolution')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
