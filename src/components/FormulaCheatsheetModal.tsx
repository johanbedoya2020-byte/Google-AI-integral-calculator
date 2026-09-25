import React from 'react';
import { MathView } from '../utils/mathRenderer';
import { useLanguage } from '../context/LanguageContext';
import { X, Book, Award, Layers } from 'lucide-react';

interface FormulaCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaCheatsheetModal: React.FC<FormulaCheatsheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t('cheatSheetTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section 1: Standard Table of Integrals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>{t('sec1Title')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { titleKey: 'csPowerRule', math: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\, (n \\ne -1)' },
                { titleKey: 'csReciprocalLog', math: '\\int \\frac{1}{x} dx = \\ln|x| + C' },
                { titleKey: 'csExponential', math: '\\int e^{kx} dx = \\frac{1}{k}e^{kx} + C' },
                { titleKey: 'csGeneralExp', math: '\\int a^x dx = \\frac{a^x}{\\ln a} + C' },
                { titleKey: 'csSine', math: '\\int \\sin(kx) dx = -\\frac{1}{k}\\cos(kx) + C' },
                { titleKey: 'csCosine', math: '\\int \\cos(kx) dx = \\frac{1}{k}\\sin(kx) + C' },
                { titleKey: 'csSecantSquared', math: '\\int \\sec^2(x) dx = \\tan(x) + C' },
                { titleKey: 'csSecantTangent', math: '\\int \\sec(x)\\tan(x) dx = \\sec(x) + C' },
                { titleKey: 'csTangent', math: '\\int \\tan(x) dx = \\ln|\\sec(x)| + C' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">{t(item.titleKey)}</span>
                  <MathView math={item.math} block={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Inverse Trig and Hyperbolic Forms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>{t('sec2Title')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  titleKey: 'csInverseTangent',
                  math: '\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C',
                },
                {
                  titleKey: 'csInverseSine',
                  math: '\\int \\frac{dx}{\\sqrt{a^2 - x^2}} = \\arcsin\\left(\\frac{x}{a}\\right) + C',
                },
                {
                  titleKey: 'csInverseHypSine',
                  math: '\\int \\frac{dx}{\\sqrt{x^2 + a^2}} = \\ln|x + \\sqrt{x^2 + a^2}| + C',
                },
                {
                  titleKey: 'csInverseHypCosine',
                  math: '\\int \\frac{dx}{\\sqrt{x^2 - a^2}} = \\ln|x + \\sqrt{x^2 - a^2}| + C',
                },
                {
                  titleKey: 'csInverseHypTangent',
                  math: '\\int \\frac{dx}{a^2 - x^2} = \\frac{1}{2a}\\ln\\left|\\frac{a+x}{a-x}\\right| + C',
                },
                {
                  titleKey: 'csInverseSecant',
                  math: '\\int \\frac{dx}{x\\sqrt{x^2 - a^2}} = \\frac{1}{a}\\operatorname{arcsec}\\left(\\frac{|x|}{a}\\right) + C',
                },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">{t(item.titleKey)}</span>
                  <MathView math={item.math} block={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Trinomials & Completing the Square */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>{t('sec3Title')}</span>
            </h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-indigo-300 font-semibold uppercase">
                {t('completingSquareIdentity')}
              </span>
              <MathView
                math="ax^2 + bx + c = a\\left(x + \\frac{b}{2a}\\right)^2 + \\left(c - \\frac{b^2}{4a}\\right)"
                block={true}
              />
              <span className="text-[10px] text-indigo-300 font-semibold uppercase mt-3 block">
                {t('numeratorSplitting')}
              </span>
              <MathView
                math="\\int \\frac{px+q}{ax^2+bx+c} dx = \\frac{p}{2a}\\int \\frac{2ax+b}{ax^2+bx+c} dx + \\left(q - \\frac{pb}{2a}\\right) \\int \\frac{dx}{ax^2+bx+c}"
                block={true}
              />
            </div>
          </div>

          {/* Section 4: Integration by Parts & LIATE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>{t('sec4Title')}</span>
            </h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <MathView math="\\int u \\, dv = u v - \\int v \\, du" block={true} />
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  {t('liateExplanation')}
                </span>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400 text-[11px]">
                  <li><strong className="text-indigo-300">{t('liateL')}</strong></li>
                  <li><strong className="text-indigo-300">{t('liateI')}</strong></li>
                  <li><strong className="text-indigo-300">{t('liateA')}</strong></li>
                  <li><strong className="text-indigo-300">{t('liateT')}</strong></li>
                  <li><strong className="text-indigo-300">{t('liateE')}</strong></li>
                </ol>
              </div>
            </div>
          </div>

          {/* Section 5: Numerical Integration Formulas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>{t('sec5Title')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">{t('trapezoidRule')}</span>
                <MathView
                  math="T_n = \\frac{\\Delta x}{2}[f(x_0) + 2f(x_1) + \\dots + 2f(x_{n-1}) + f(x_n)]"
                  block={true}
                />
                <div className="text-[10px] text-amber-300 block mt-2 text-center">
                  <MathView math="|E_T| \\le \\frac{K(b-a)^3}{12n^2} \\quad (K = \\max|f''(x)|)" />
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">{t('simpsonRule')}</span>
                <MathView
                  math="S_n = \\frac{\\Delta x}{3}[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\dots + f(x_n)]"
                  block={true}
                />
                <div className="text-[10px] text-amber-300 block mt-2 text-center">
                  <MathView math="|E_S| \\le \\frac{M(b-a)^5}{180n^4} \\quad (M = \\max|f^{(4)}(x)|)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            {t('closeCheatSheet')}
          </button>
        </div>
      </div>
    </div>
  );
};
