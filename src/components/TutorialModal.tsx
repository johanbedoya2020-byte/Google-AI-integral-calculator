import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TUTORIAL_CONTENT } from '../data/tutorialContent';
import { MathView } from '../utils/mathRenderer';
import {
  BookOpen,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Box,
  RotateCw,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [activeTopicId, setActiveTopicId] = useState<string>('revolution');

  if (!isOpen) return null;

  const topicsList = TUTORIAL_CONTENT[language] || TUTORIAL_CONTENT.en;
  const currentTopic = topicsList.find((item) => item.id === activeTopicId) || topicsList[0];

  const renderCardIcon = (icon: 'box' | 'rotate' | 'layers' | 'sparkles') => {
    switch (icon) {
      case 'box':
        return <Box className="w-4 h-4 text-indigo-400" />;
      case 'rotate':
        return <RotateCw className="w-4 h-4 text-amber-400" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-rose-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t('studentGuideTitle')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('studentGuideSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Navigation Sidebar */}
          <div className="md:col-span-4 space-y-1.5 border-r border-slate-800/80 pr-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-2">
              {t('tutorialModules')}
            </span>
            {topicsList.map((item) => {
              const isActive = activeTopicId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTopicId(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Tutorial Details Panel */}
          <div className="md:col-span-8 space-y-5 text-xs text-slate-300 leading-relaxed overflow-y-auto pr-1">
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">
                {currentTopic.title}
              </h4>
              <p>{currentTopic.intro}</p>

              {/* Blocks */}
              {currentTopic.blocks.map((block, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-indigo-900/40 space-y-2">
                  {block.heading && (
                    <span className="text-indigo-400 font-bold block text-[11px] uppercase">
                      {block.heading}
                    </span>
                  )}
                  {block.text && <p>{block.text}</p>}
                  {block.latex && (
                    <div className="py-2 text-center overflow-x-auto">
                      <MathView math={block.latex} block={true} />
                    </div>
                  )}
                  {block.alert && (
                    <p className="text-[11px] text-amber-300">
                      {block.alert}
                    </p>
                  )}
                  {block.subgrid && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      {block.subgrid.map((sub, sIdx) => (
                        <div key={sIdx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                          <strong>{sub.label}</strong>
                          <MathView math={sub.formula} block={false} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Interactive Guide Cards (for GeoGebra controls) */}
              {currentTopic.cards && currentTopic.cards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentTopic.cards.map((card, cIdx) => (
                    <div key={cIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white flex items-center gap-1.5">
                        {renderCardIcon(card.icon)}
                        {card.title}
                      </strong>
                      <p className="text-[11px] text-slate-400">{card.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {t('studentGuideFooter')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            {t('gotItBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
