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
    // Strip leading/trailing dollar signs if passed directly
    let cleanMath = math.trim();
    if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
      cleanMath = cleanMath.slice(2, -2).trim();
    } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
      cleanMath = cleanMath.slice(1, -1).trim();
    }

    try {
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
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

// Component to parse a mixed text string with embedded $...$ and $$...$$
interface FormattedTextProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const FormattedMathText: React.FC<FormattedTextProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  const parts = useMemo(() => {
    if (!content) return [];

    // First normalize any escaped dollars if any: \$ -> $
    let normalized = content;

    // Check if there are an odd number of $ signs (unmatched)
    const dollarCount = (normalized.match(/(?<!\\)\$/g) || []).length;
    // If odd number and not matching, remove lone stray $
    if (dollarCount % 2 !== 0) {
      // Find the last unmatched dollar and remove or close it
      const lastDollarIdx = normalized.lastIndexOf('$');
      if (lastDollarIdx !== -1) {
        normalized =
          normalized.slice(0, lastDollarIdx) + normalized.slice(lastDollarIdx + 1);
      }
    }

    // Regex to split text by $$...$$ (display) and $...$ (inline)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    const tokens = normalized.split(regex);

    return tokens.map((token, idx) => {
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const mathContent = token.slice(2, -2).trim();
        return (
          <div key={idx} className="my-2 overflow-x-auto py-1 text-center">
            <MathView math={mathContent} block={true} />
          </div>
        );
      } else if (token.startsWith('$') && token.endsWith('$')) {
        const mathContent = token.slice(1, -1).trim();
        return <MathView key={idx} math={mathContent} block={false} />;
      } else {
        // Plain text: strip any stray literal $ that might have survived
        const cleanText = token.replace(/\$/g, '');

        // Check if there are common LaTeX macros without dollar signs like \Delta x or \frac
        if (/\\(Delta|frac|int|sqrt|operatorname|approx|le|ge|ne)\b/.test(cleanText)) {
          return (
            <span key={idx} className="whitespace-pre-line">
              <MathView math={cleanText.trim()} block={false} />
            </span>
          );
        }

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
