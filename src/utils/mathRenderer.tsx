import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    if (!math) return '';
    let cleanMath = math.trim();

    // Strip standalone block delimiters: $$ ... $$ or \[ ... \]
    if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
      cleanMath = cleanMath.slice(2, -2).trim();
    } else if (cleanMath.startsWith('\\[') && cleanMath.endsWith('\\]')) {
      cleanMath = cleanMath.slice(2, -2).trim();
    } else if (cleanMath.startsWith('\\(') && cleanMath.endsWith('\\)')) {
      // Strip inline escape delimiters: \( ... \)
      cleanMath = cleanMath.slice(2, -2).trim();
    } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
      // Strip legacy single dollar delimiters: $ ... $
      cleanMath = cleanMath.slice(1, -1).trim();
    } else if (cleanMath.startsWith('[') && cleanMath.endsWith(']') && cleanMath.includes('\\')) {
      // Strip bracket formatting: [ ... ]
      cleanMath = cleanMath.slice(1, -1).trim();
    }

    try {
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
        macros: {
          '\\arsinh': '\\operatorname{arsinh}',
          '\\arcosh': '\\operatorname{arcosh}',
          '\\artanh': '\\operatorname{artanh}',
          '\\sen': '\\sin',
          '\\tg': '\\tan',
          '\\ctg': '\\cot',
          '\\arctg': '\\arctan',
        },
      });
    } catch (err) {
      console.warn('KaTeX rendering error for:', math, err);
      return `<span class="font-mono text-amber-300">${cleanMath}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block ${block ? 'my-2 overflow-x-auto max-w-full text-center py-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Component to parse a mixed text string with embedded KaTeX blocks
interface FormattedTextProps {
  content?: string;
  text?: string;
  className?: string;
  inline?: boolean;
}

export const FormattedMathText: React.FC<FormattedTextProps> = ({
  content,
  text,
  className = '',
  inline = false,
}) => {
  const parts = useMemo(() => {
    const raw = content ?? text ?? '';
    if (!raw) return [];

    let normalized = raw;

    // Check if there are an odd number of unescaped $ signs (unmatched legacy math)
    const dollarCount = (normalized.match(/(?<!\\)\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      const lastDollarIdx = normalized.lastIndexOf('$');
      if (lastDollarIdx !== -1) {
        normalized =
          normalized.slice(0, lastDollarIdx) + normalized.slice(lastDollarIdx + 1);
      }
    }

    // Regex to strictly split KaTeX expressions from plain text:
    // 1. $$ ... $$ (standalone display blocks)
    // 2. \[ ... \] (standard LaTeX display blocks, normalized to block display)
    // 3. \( ... \) (inline math with escape syntax)
    // 4. $ ... $   (legacy inline math fallback)
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^\$]+?\$)/g;
    const tokens = normalized.split(regex);

    return tokens.map((token, idx) => {
      if (!token) return null;

      // Rule 2: Standalone, centered formula blocks: $$ katex_code $$
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const mathContent = token.slice(2, -2).trim();
        return (
          <div key={idx} className="my-2.5 overflow-x-auto py-1 text-center">
            <MathView math={mathContent} block={true} />
          </div>
        );
      }
      // Bracket display block: \[ katex_code \]
      else if (token.startsWith('\\[') && token.endsWith('\\]')) {
        const mathContent = token.slice(2, -2).trim();
        return (
          <div key={idx} className="my-2.5 overflow-x-auto py-1 text-center">
            <MathView math={mathContent} block={true} />
          </div>
        );
      }
      // Rule 3: Formulas embedded within the text (inline): \( katex_code \)
      else if (token.startsWith('\\(') && token.endsWith('\\)')) {
        const mathContent = token.slice(2, -2).trim();
        return <MathView key={idx} math={mathContent} block={false} />;
      }
      // Fallback single dollar inline: $ katex_code $
      else if (token.startsWith('$') && token.endsWith('$')) {
        const mathContent = token.slice(1, -1).trim();
        return <MathView key={idx} math={mathContent} block={false} />;
      }
      // Rule 5: Plain text clearly separated from KaTeX blocks to prevent rendering errors
      else {
        // Strip any accidental stray literal $ in plain text
        const cleanText = token.replace(/\$/g, '');

        return (
          <span key={idx} className="whitespace-pre-line">
            {cleanText}
          </span>
        );
      }
    });
  }, [content]);

  if (inline) {
    return <span className={`leading-relaxed text-slate-200 ${className}`}>{parts}</span>;
  }

  return <div className={`leading-relaxed text-slate-200 ${className}`}>{parts}</div>;
};
