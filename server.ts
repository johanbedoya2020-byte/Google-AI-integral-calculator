// Coming soon: Phase 2/3.
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt enforcing deep pedagogical rigor in Integral Calculus strictly formatted for KaTeX compatibility
const CALCULUS_TUTOR_SYSTEM_INSTRUCTION = `You are a world-class university mathematics professor and educational platform specializing in Integral Calculus.
Your objective is to provide structured explanations, mathematically rigorous proofs, and detailed step-by-step solutions to calculus problems.
You must cover:
1. Numerical methods: Riemann sums (Left, Right, Midpoint), Trapezoidal rule, Simpson's rule (with step sizes, delta x, table of nodes x_i, weights, error estimates).
2. Definite integrals and area under the curve (Fundamental Theorem of Calculus, signed area vs total area, symmetry).
3. Integration methods:
   - Direct integration (standard rules, power rule, linearity).
   - Substitution (u-substitution) involving powers, exponentials, logarithms, and trigonometric functions.
   - Forms leading to inverse trigonometric (arcsin, arctan, arcsec) or inverse hyperbolic functions (arsinh, arcosh, artanh).
4. Integration by parts (∫ u dv = uv - ∫ v du, LIATE priority rule, repeated/tabular method, cyclic recurrence).
5. Integration of irrational functions:
   - Algebraic radical substitutions u = ⁿ√(ax + b).
   - Chebyshev conditions for binomial differentials xᵐ(a + bxⁿ)ᵖ.
   - Euler substitutions for √(ax² + bx + c).
6. Trigonometric integration:
   - Products and powers of sine and cosine (odd/even powers, Pythagorean identities, half-angle power reduction).
   - Integrals of tanᵐ(x) secⁿ(x) and cotᵐ(x) cscⁿ(x).
   - Product-to-sum angle identities.
7. Trigonometric substitutions:
   - Form √(a² - x²): x = a sin(θ).
   - Form √(a² + x²): x = a tan(θ).
   - Form √(x² - a²): x = a sec(θ).
   - Reference right triangles for returning to variable x.
8. The Universal Substitution (Weierstrass substitution):
   - Half-angle parameter t = tan(x/2).
   - Rational representations: sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), dx = 2 dt/(1+t²).
9. Geometric and Physical Applications of the Integral:
   - Area between intersecting curves (∫ [f(x) - g(x)] dx).
   - Mechanical work, Hooke's Law, fluid hydrostatic force, center of mass / centroids.
10. Volume of Solids of Revolution:
   - Disk Method: V = π ∫ [R(x)]² dx.
   - Washer Method: V = π ∫ ([R(x)]² - [r(x)]²) dx.
   - Revolution around shifted horizontal (y = k) or vertical lines (x = k).
11. Method of Cylindrical Shells:
   - V = 2π ∫ (radius)(height) dx.
   - Unrolled rectangular slab intuition (dV = 2π r · h · dx).
12. Volume of Solids with Known Cross-Sections:
   - General slicing Cavalieri formula V = ∫ A(x) dx.
   - Cross-sections: Squares, semicircles, equilateral triangles, isosceles right triangles, rectangles.
13. Arc Length of Plane Curves:
   - Curvilinear differential ds = √(1 + [f'(x)]²) dx.
   - L = ∫_a^b √(1 + [f'(x)]²) dx.
14. Surface Area of Solids of Revolution:
   - Frustum ribbon dS = 2π r ds.
   - S = 2π ∫ y √(1 + [y']²) dx (revolved around x-axis) or 2π ∫ x √(1 + [y']²) dx (revolved around y-axis).

KATEX FORMATTING RULES (STRICT COMPLIANCE MANDATORY):
Your goal is to process any query, formula, or mathematical problem assigned by the user and return a response structured strictly for compatibility with the KaTeX library.
Follow these formatting rules rigorously:
1. Do not use standard LaTeX block formatting such as [ ... ] or $ ... $.
2. For standalone, centered formula blocks, enclose the code strictly between double dollar signs: $$ katex_code $$
3. For formulas embedded within the text (inline), enclose the code strictly within the escape syntax: \\( katex_code \\)
4. Ensure you use compatible KaTeX functions (e.g., \\int, \\frac{}{}, \\sqrt{}, \\ln, \\arctan, \\arcsin, \\operatorname{arsinh}, \\cdot).
5. If the user requests an explanation, plain text must be clearly separated from KaTeX blocks to prevent rendering errors on the frontend.
6. Pure formula fields (e.g. problemStatementLatex, finalAnswerLatex, latexFormula, latexMath) must contain clean KaTeX notation without outer delimiters.

Explain WHY each method is selected, show every algebraic manipulation clearly, verify the result (e.g. by differentiation or limit checks), and highlight common pitfalls students face.
Always output pure valid JSON matching the requested schema.`;

// Helper to format language instruction with strict KaTeX rules
function getLanguageInstruction(lang?: string): string {
  const katexMandate = 'STRICT KATEX COMPLIANCE: 1. Do NOT use standard [ ... ] or $ ... $. 2. For standalone centered formula blocks use strictly $$ katex_code $$. 3. For inline formulas use strictly \\( katex_code \\). 4. Use valid KaTeX functions (\\int, \\frac{}{}, \\sqrt{}, \\ln, \\arctan). 5. Clearly separate plain text from KaTeX blocks.';
  switch (lang) {
    case 'es':
      return `IMPORTANT: Write ALL pedagogical explanations, step titles, theory descriptions, method justifications, verification notes, and common student pitfalls in fluent, natural Spanish (Español Latinoamericano). ${katexMandate}`;
    case 'pt':
      return `IMPORTANT: Write ALL pedagogical explanations, step titles, theory descriptions, method justifications, verification notes, and common student pitfalls in fluent, natural Portuguese (Português). ${katexMandate}`;
    case 'fr':
      return `IMPORTANT: Write ALL pedagogical explanations, step titles, theory descriptions, method justifications, verification notes, and common student pitfalls in fluent, natural French (Français). ${katexMandate}`;
    case 'en':
    default:
      return `IMPORTANT: Write ALL pedagogical explanations, step titles, theory descriptions, method justifications, verification notes, and common student pitfalls in clear English. ${katexMandate}`;
  }
}

/**
 * Normalizes text to strictly follow KaTeX rules:
 * - Standalone blocks enclosed in $$ ... $$
 * - Inline formulas enclosed in \( ... \)
 * - Eliminates legacy single $ and standard [ ... ]
 * - Separates plain text from KaTeX blocks
 */
function normalizeToKatexFormat(text: string): string {
  if (!text) return text;
  let normalized = text;
  // Convert \[ ... \] to $$ ... $$
  normalized = normalized.replace(/\\\[([\s\S]*?)\\\]/g, '$$ $1 $$');
  // Convert unescaped [ ... ] containing calculus macros to $$ ... $$
  normalized = normalized.replace(/(^|\n)\[\s*(\\int|\\frac|\\sqrt|\\sum|\\lim|\\ln)[\s\S]*?\](?=\n|$)/g, (match) => {
    return '$$ ' + match.trim().slice(1, -1).trim() + ' $$';
  });
  // Convert legacy single dollar $...$ to \( ... \)
  normalized = normalized.replace(/(?<!\$)\$(?!\$)([^\$\n]+?)(?<!\$)\$(?!\$)/g, '\\( $1 \\)');
  return normalized;
}

/**
 * Normalizes raw mathematical formulas (strip outer delimiters if returned by model)
 */
function normalizeRawKatexFormula(formula: string): string {
  if (!formula) return formula;
  let clean = formula.trim();
  if (clean.startsWith('$$') && clean.endsWith('$$')) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\\[') && clean.endsWith('\\]')) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\\(') && clean.endsWith('\\)')) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('$') && clean.endsWith('$')) {
    clean = clean.slice(1, -1).trim();
  } else if (clean.startsWith('[') && clean.endsWith(']') && clean.includes('\\')) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

// API endpoint to solve an integral problem
app.post('/api/solve-integral', async (req, res) => {
  try {
    const { problemText, topic, bounds, numericalConfig, language } = req.body;
    if (!problemText || typeof problemText !== 'string') {
      return res.status(400).json({ error: 'problemText is required' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check environment configuration.',
      });
    }

    const langInstruction = getLanguageInstruction(language);

    const prompt = `Solve this integral calculus problem with extreme pedagogical care and full algebraic steps:
Problem: ${problemText}
${topic && topic !== 'auto' ? `Targeted Topic / Technique: ${topic}` : ''}
${bounds ? `Integration Bounds: Lower = ${bounds.lower}, Upper = ${bounds.upper}` : ''}
${
  numericalConfig
    ? `Numerical Method: ${numericalConfig.method}, Interval [${numericalConfig.a}, ${numericalConfig.b}], Subintervals n = ${numericalConfig.n}`
    : ''
}

${langInstruction}

Ensure you:
1. Identify the primary calculus topic and sub-topic.
2. Formulate theoretical foundations, theorems, and key formulas.
3. Explain why this approach is optimal.
4. Detail all algebraic intermediate steps with clear instructional guidance.
5. Provide differentiation verification or numerical error estimation.
6. Provide the exact mathematical answer and decimal approximation if definite/numerical.
7. List 2-3 common student misconceptions or pitfalls for this technique.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let text: string | undefined;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: CALCULUS_TUTOR_SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                problemStatementLatex: {
                  type: Type.STRING,
                  description: 'The formatted problem statement in LaTeX, e.g. \\int x e^{2x} dx',
                },
                mainTopic: {
                  type: Type.STRING,
                  description: 'One of the major topics: Numerical Methods, Definite Integrals & Area, Direct Integration, Substitution (u-sub), Inverse Trig & Hyperbolic, Trinomials (ax²+bx+c), Integration by Parts',
                },
                subTopic: {
                  type: Type.STRING,
                  description: 'Specific sub-method, e.g. "Integration by Parts with LIATE Rule", "Completing the Square and Inverse Tangent", "Simpson\'s Rule (Parabolic)", "u-Substitution with Logarithmic Functions"',
                },
                theoryAndFormulas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      latexFormula: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['name', 'latexFormula', 'explanation'],
                  },
                  description: 'Core formulas and mathematical theorems applied.',
                },
                methodJustification: {
                  type: Type.STRING,
                  description: 'Pedagogical explanation of why this specific technique is chosen based on the structure of the integrand.',
                },
                numericalTable: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      i: { type: Type.INTEGER },
                      xi: { type: Type.STRING },
                      fxi: { type: Type.STRING },
                      weight: { type: Type.NUMBER },
                      weightedValue: { type: Type.STRING },
                    },
                    required: ['i', 'xi', 'fxi', 'weight', 'weightedValue'],
                  },
                  description: 'Only for numerical methods: table of nodes, function values, weights.',
                },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      latexMath: { type: Type.STRING },
                      sideCalculations: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['stepNumber', 'title', 'explanation', 'latexMath'],
                  },
                  description: 'Exhaustive sequential algebraic steps showing every intermediate substitution, simplification, and evaluation.',
                },
                verification: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: 'Differentiation Check or Error Estimation' },
                    latexMath: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ['type', 'latexMath', 'explanation'],
                },
                finalAnswerLatex: {
                  type: Type.STRING,
                  description: 'Exact final answer in LaTeX (including + C for indefinite integrals).',
                },
                decimalApproximation: {
                  type: Type.STRING,
                  description: 'Decimal numerical value if applicable (or empty string).',
                },
                commonPitfalls: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 to 3 traps calculus students often fall into with this method.',
                },
              },
              required: [
                'problemStatementLatex',
                'mainTopic',
                'subTopic',
                'theoryAndFormulas',
                'methodJustification',
                'steps',
                'verification',
                'finalAnswerLatex',
                'commonPitfalls',
              ],
            },
          },
        });

        text = response.text;
        if (text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message);
      }
    }

    if (!text) {
      throw lastError || new Error('All AI models failed to return content');
    }

    const parsed = JSON.parse(text);

    // Enforce KaTeX compatibility formatting on all response fields
    if (parsed.problemStatementLatex) {
      parsed.problemStatementLatex = normalizeRawKatexFormula(parsed.problemStatementLatex);
    }
    if (parsed.finalAnswerLatex) {
      parsed.finalAnswerLatex = normalizeRawKatexFormula(parsed.finalAnswerLatex);
    }
    if (parsed.methodJustification) {
      parsed.methodJustification = normalizeToKatexFormat(parsed.methodJustification);
    }
    if (Array.isArray(parsed.theoryAndFormulas)) {
      parsed.theoryAndFormulas.forEach((item: any) => {
        if (item.latexFormula) item.latexFormula = normalizeRawKatexFormula(item.latexFormula);
        if (item.explanation) item.explanation = normalizeToKatexFormat(item.explanation);
      });
    }
    if (Array.isArray(parsed.steps)) {
      parsed.steps.forEach((step: any) => {
        if (step.latexMath) step.latexMath = normalizeRawKatexFormula(step.latexMath);
        if (step.explanation) step.explanation = normalizeToKatexFormat(step.explanation);
        if (Array.isArray(step.sideCalculations)) {
          step.sideCalculations = step.sideCalculations.map((c: string) => normalizeToKatexFormat(c));
        }
      });
    }
    if (parsed.verification) {
      if (parsed.verification.latexMath) {
        parsed.verification.latexMath = normalizeRawKatexFormula(parsed.verification.latexMath);
      }
      if (parsed.verification.explanation) {
        parsed.verification.explanation = normalizeToKatexFormat(parsed.verification.explanation);
      }
    }
    if (Array.isArray(parsed.commonPitfalls)) {
      parsed.commonPitfalls = parsed.commonPitfalls.map((p: string) => normalizeToKatexFormat(p));
    }

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error solving integral:', error);
    return res.status(500).json({
      error: error.message || 'Failed to solve integral calculus problem',
    });
  }
});

// Endpoint to generate targeted practice problem with hints
app.post('/api/generate-practice', async (req, res) => {
  try {
    const { topic, difficulty, language } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const langInstruction = getLanguageInstruction(language);

    const prompt = `Generate an integral calculus practice problem on topic: "${topic || 'Integration Methods'}" with difficulty "${difficulty || 'Medium'}".
Topics to choose from if general: Numerical methods (Riemann, Trapezoid, Simpson), Definite integrals & Area, Direct, Substitution (powers, exponentials, logs, trig), Inverse trig / hyperbolic, Trinomials (ax² + bx + c), Integration by parts.

${langInstruction}

Provide:
- Problem statement in LaTeX
- Topic and subtopic (translated to requested language)
- Hint 1 (Method identification hint in requested language)
- Hint 2 (Algebraic substitution or setup hint in requested language)
- Final exact answer in LaTeX
- Step-by-step complete solution with explanations in requested language`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let text: string | undefined;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: CALCULUS_TUTOR_SYSTEM_INSTRUCTION,
            temperature: 0.4,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                problemLatex: { type: Type.STRING },
                topic: { type: Type.STRING },
                subTopic: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                hint1: { type: Type.STRING },
                hint2: { type: Type.STRING },
                finalAnswerLatex: { type: Type.STRING },
                solutionSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      latexMath: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'title', 'latexMath', 'explanation'],
                  },
                },
              },
              required: [
                'problemLatex',
                'topic',
                'subTopic',
                'difficulty',
                'hint1',
                'hint2',
                'finalAnswerLatex',
                'solutionSteps',
              ],
            },
          },
        });

        text = response.text;
        if (text) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed for practice, trying next:`, err.message);
      }
    }

    if (!text) {
      throw lastError || new Error('All AI models failed to return content');
    }

    const parsed = JSON.parse(text);

    // Enforce KaTeX compatibility formatting on all response fields
    if (parsed.problemLatex) {
      parsed.problemLatex = normalizeRawKatexFormula(parsed.problemLatex);
    }
    if (parsed.finalAnswerLatex) {
      parsed.finalAnswerLatex = normalizeRawKatexFormula(parsed.finalAnswerLatex);
    }
    if (parsed.hint1) {
      parsed.hint1 = normalizeToKatexFormat(parsed.hint1);
    }
    if (parsed.hint2) {
      parsed.hint2 = normalizeToKatexFormat(parsed.hint2);
    }
    if (Array.isArray(parsed.solutionSteps)) {
      parsed.solutionSteps.forEach((step: any) => {
        if (step.latexMath) step.latexMath = normalizeRawKatexFormula(step.latexMath);
        if (step.explanation) step.explanation = normalizeToKatexFormat(step.explanation);
      });
    }

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating practice problem:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate practice problem',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Integral Calculus Academy running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
