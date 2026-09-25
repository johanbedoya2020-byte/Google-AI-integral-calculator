import { CuratedExample, TopicCategory } from '../types/calculus';

export interface TopicInfo {
  id: TopicCategory;
  title: string;
  badge: string;
  summary: string;
  subtopics: string[];
  keyFormulas: { name: string; latex: string }[];
  overview: string;
}

export const TOPIC_CURRICULUM: Record<TopicCategory, TopicInfo> = {
  numerical_methods: {
    id: 'numerical_methods',
    title: 'Numerical Methods',
    badge: 'Approximations',
    summary: 'Riemann sums, Trapezoidal rule, Midpoint rule, and Simpson’s rule for non-elementary or sampled integrands.',
    subtopics: [
      'Left & Right Riemann Sums',
      'Midpoint Rule (Rectangle approximation)',
      'Trapezoidal Rule (Linear interpolation)',
      'Simpson’s Rule (Parabolic interpolation)',
      'Error bounds and convergence analysis',
    ],
    keyFormulas: [
      { name: 'Step size', latex: '\\Delta x = \\frac{b-a}{n}' },
      { name: 'Midpoint Rule', latex: 'M_n = \\Delta x \\sum_{i=0}^{n-1} f\\left(\\frac{x_i+x_{i+1}}{2}\\right)' },
      { name: 'Trapezoidal Rule', latex: 'T_n = \\frac{\\Delta x}{2} [f(x_0) + 2f(x_1) + \\dots + 2f(x_{n-1}) + f(x_n)]' },
      { name: "Simpson's Rule", latex: 'S_n = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\dots + f(x_n)]' },
      { name: 'Trapezoidal Error', latex: '|E_T| \\le \\frac{K(b-a)^3}{12n^2}, \\quad K = \\max |f\'\'(x)|' },
      { name: "Simpson's Error", latex: '|E_S| \\le \\frac{M(b-a)^5}{180n^4}, \\quad M = \\max |f^{(4)}(x)|' },
    ],
    overview:
      'When an antiderivative cannot be expressed in elementary terms (such as e^{-x^2} or \\sin(x^2)), or when data is collected at discrete points, numerical integration approximates the definite integral with guaranteed error bounds.',
  },
  definite_integrals: {
    id: 'definite_integrals',
    title: 'Definite Integrals & Area',
    badge: 'Theory & Geometry',
    summary: 'Fundamental Theorem of Calculus, signed vs net area, symmetry, and geometric interpretation.',
    subtopics: [
      'Fundamental Theorem of Calculus (FTC Part 1 & 2)',
      'Net Signed Area vs Total Geometric Area',
      'Even and Odd Function Symmetry',
      'Additivity of Intervals and Reversing Limits',
    ],
    keyFormulas: [
      { name: 'FTC Part 2 (Evaluation)', latex: '\\int_a^b f(x) dx = F(b) - F(a) = [F(x)]_a^b' },
      { name: 'FTC Part 1 (Derivative of Integral)', latex: '\\frac{d}{dx} \\int_a^x f(t) dt = f(x)' },
      { name: 'Total Area Under Curve', latex: 'A = \\int_a^b |f(x)| dx' },
      { name: 'Odd Symmetry', latex: '\\int_{-a}^a f(x) dx = 0 \\quad \\text{if } f(-x) = -f(x)' },
      { name: 'Even Symmetry', latex: '\\int_{-a}^a f(x) dx = 2\\int_0^a f(x) dx \\quad \\text{if } f(-x) = f(x)' },
    ],
    overview:
      'The definite integral \\int_a^b f(x) dx represents the signed accumulated area between the curve and the x-axis. FTC bridges differential calculus with integral calculus by expressing accumulation via antiderivatives.',
  },
  direct: {
    id: 'direct',
    title: 'Direct Integration',
    badge: 'Foundations',
    summary: 'Linearity properties, power rule, exponential rules, and standard elementary antiderivatives.',
    subtopics: [
      'Linearity of Integrals: ∫(af + bg) dx = a∫f dx + b∫g dx',
      'General Power Rule: ∫ x^n dx = (x^{n+1})/(n+1) + C (n ≠ -1)',
      'Logarithmic Exception: ∫ 1/x dx = ln|x| + C',
      'Direct Exponential & Trigonometric Antiderivatives',
    ],
    keyFormulas: [
      { name: 'Power Rule', latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)' },
      { name: 'Logarithmic Base', latex: '\\int \\frac{1}{x} dx = \\ln|x| + C' },
      { name: 'Exponential Base', latex: '\\int e^{kx} dx = \\frac{1}{k}e^{kx} + C' },
      { name: 'Sine Integral', latex: '\\int \\sin(kx) dx = -\\frac{1}{k}\\cos(kx) + C' },
      { name: 'Secant Squared', latex: '\\int \\sec^2(x) dx = \\tan(x) + C' },
    ],
    overview:
      'Direct integration relies on recognizing elementary differentiation rules in reverse and using algebraic simplification (such as expanding polynomials or splitting fractions) before applying linear integration rules.',
  },
  substitution: {
    id: 'substitution',
    title: 'Substitution Method (u-sub)',
    badge: 'Core Technique',
    summary: 'The chain rule in reverse involving powers, exponentials, logarithms, and trigonometric functions.',
    subtopics: [
      'Powers & Radicals: u = g(x) with du = g\'(x) dx',
      'Exponentials: u as the exponent in e^{g(x)}',
      'Logarithms: u = ln(x) with du = dx / x',
      'Trigonometric functions: u = sin(x), cos(x), or tan(x)',
      'Definite Integrals with transformed limits',
    ],
    keyFormulas: [
      { name: 'Substitution Rule', latex: '\\int f(g(x)) g\'(x) dx = \\int f(u) du \\quad (u = g(x))' },
      { name: 'Definite Substitution', latex: '\\int_a^b f(g(x)) g\'(x) dx = \\int_{g(a)}^{g(b)} f(u) du' },
      { name: 'Logarithmic u-sub', latex: '\\int \\frac{g\'(x)}{g(x)} dx = \\ln|g(x)| + C' },
      { name: 'Power u-sub', latex: '\\int [g(x)]^n g\'(x) dx = \\frac{[g(x)]^{n+1}}{n+1} + C' },
    ],
    overview:
      'Substitution reverses the chain rule. We identify an inner function u = g(x) whose derivative g\'(x) appears as a multiplying factor in the integrand, transforming a complex integral into an elementary one.',
  },
  inverse_trig_hyperbolic: {
    id: 'inverse_trig_hyperbolic',
    title: 'Inverse Trig & Hyperbolic Forms',
    badge: 'Standard Forms',
    summary: 'Forms leading to arcsin, arctan, arcsec, arsinh, arcosh, and artanh.',
    subtopics: [
      'Inverse Tangent: ∫ 1/(x² + a²) dx = (1/a) arctan(x/a) + C',
      'Inverse Sine: ∫ 1/√(a² - x²) dx = arcsin(x/a) + C',
      'Inverse Secant: ∫ 1/(x√(x² - a²)) dx = (1/a) arcsec(|x|/a) + C',
      'Inverse Hyperbolic Sine: ∫ 1/√(x² + a²) dx = arsinh(x/a) + C = ln(x + √(x²+a²)) + C',
      'Inverse Hyperbolic Tangent: ∫ 1/(a² - x²) dx = (1/2a) ln|(a+x)/(a-x)| + C',
    ],
    keyFormulas: [
      { name: 'Arctangent Form', latex: '\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C' },
      { name: 'Arcsine Form', latex: '\\int \\frac{dx}{\\sqrt{a^2 - x^2}} = \\arcsin\\left(\\frac{x}{a}\\right) + C' },
      { name: 'Hyperbolic Sine Form', latex: '\\int \\frac{dx}{\\sqrt{x^2 + a^2}} = \\operatorname{arsinh}\\left(\\frac{x}{a}\\right) + C = \\ln\\left|x + \\sqrt{x^2 + a^2}\\right| + C' },
      { name: 'Hyperbolic Cosine Form', latex: '\\int \\frac{dx}{\\sqrt{x^2 - a^2}} = \\operatorname{arcosh}\\left(\\frac{x}{a}\\right) + C = \\ln\\left|x + \\sqrt{x^2 - a^2}\\right| + C' },
    ],
    overview:
      'Integrands containing quadratic binomials in denominators or under square roots frequently integrate to inverse trigonometric or inverse hyperbolic functions. Recognizing these patterns enables rapid and exact integration.',
  },
  trinomials: {
    id: 'trinomials',
    title: 'Trinomial Forms ax² + bx + c',
    badge: 'Completing the Square',
    summary: 'Integration of quadratics in denominators or under roots: completing the square, linear numerator split.',
    subtopics: [
      'Completing the square: ax² + bx + c = a(x + b/2a)² + (c - b²/4a)',
      'Split linear numerator: ∫ (px + q)/(ax² + bx + c) dx into derivative part + constant part',
      'Radical trinomials: ∫ 1/√(ax² + bx + c) dx',
      'Partial fractions for factorable quadratic trinomials',
    ],
    keyFormulas: [
      { name: 'Completing Square Identity', latex: 'ax^2 + bx + c = a\\left(x + \\frac{b}{2a}\\right)^2 + \\left(c - \\frac{b^2}{4a}\\right)' },
      { name: 'Numerator Decomposition', latex: '\\int \\frac{px+q}{ax^2+bx+c} dx = \\frac{p}{2a} \\int \\frac{2ax+b}{ax^2+bx+c} dx + \\left(q - \\frac{pb}{2a}\\right) \\int \\frac{dx}{ax^2+bx+c}' },
      { name: 'Derivative Match', latex: '\\int \\frac{2ax+b}{ax^2+bx+c} dx = \\ln|ax^2+bx+c| + C' },
    ],
    overview:
      'For quadratic trinomials ax² + bx + c, if the discriminant b² - 4ac < 0 (irreducible), completing the square transforms the denominator into u² + k², yielding arctan or arsinh. If a linear numerator px + q is present, decompose it into the derivative of the denominator plus a constant term.',
  },
  parts: {
    id: 'parts',
    title: 'Integration by Parts',
    badge: 'Product Rule Inverse',
    summary: '∫ u dv = uv - ∫ v du, LIATE prioritization, repeated parts, tabular integration, and cyclic integrals.',
    subtopics: [
      'The Fundamental Formula: ∫ u dv = uv - ∫ v du',
      'LIATE Rule for selecting u (Log, Inverse trig, Algebraic, Trig, Exponential)',
      'Repeated integration by parts & Tabular Method',
      'Cyclic / Looping integrals (e.g. ∫ e^{ax} cos(bx) dx)',
    ],
    keyFormulas: [
      { name: 'Integration by Parts', latex: '\\int u \\, dv = u v - \\int v \\, du' },
      { name: 'Definite By Parts', latex: '\\int_a^b u \\, dv = [u v]_a^b - \\int_a^b v \\, du' },
      { name: 'LIATE Hierarchy', latex: '\\text{Logarithmic} \\succ \\text{Inverse Trig} \\succ \\text{Algebraic} \\succ \\text{Trigonometric} \\succ \\text{Exponential}' },
    ],
    overview:
      'Integration by parts reverses the product rule for differentiation. When integrating the product of two disparate function types, LIATE guides the selection of u (to be differentiated) and dv (to be integrated), simplifying the problem into a manageable antiderivative.',
  },
};

export const CURATED_EXAMPLES: CuratedExample[] = [
  // 1. Numerical Methods: Simpson's Rule
  {
    id: 'num-simpson-1',
    topic: 'numerical_methods',
    title: "Simpson's Rule: ∫_0^2 e^{-x²} dx",
    subTopic: "Simpson's Rule (Parabolic Approximation)",
    problemLatex: '\\int_0^2 e^{-x^2} dx \\quad (n = 4)',
    difficulty: 'Intermediate',
    description: 'Approximate the Gaussian integral over [0, 2] using Simpson’s Rule with 4 subintervals.',
    precomputedSolution: {
      problemStatementLatex: '\\int_0^2 e^{-x^2} dx \\quad \\text{with } n = 4 \\text{ using Simpson\'s Rule}',
      mainTopic: 'Numerical Methods',
      subTopic: "Simpson's Rule (n = 4)",
      theoryAndFormulas: [
        {
          name: "Simpson's Rule Formula",
          latexFormula: 'S_n = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]',
          explanation: 'Approximates the function by parabolas across adjacent pairs of subintervals.',
        },
        {
          name: 'Step Size (Delta x)',
          latexFormula: '\\Delta x = \\frac{b-a}{n} = \\frac{2 - 0}{4} = 0.5',
          explanation: 'The width of each subinterval on [0, 2].',
        },
      ],
      methodJustification:
        'The integrand f(x) = e^{-x^2} has no elementary antiderivative (the error function erf(x)). Simpson\'s Rule provides 4th-order accuracy O(\\Delta x^4), making it ideal for high-precision numerical evaluation.',
      numericalTable: [
        { i: 0, xi: '0.0', fxi: '1.000000', weight: 1, weightedValue: '1.000000' },
        { i: 1, xi: '0.5', fxi: '0.778801', weight: 4, weightedValue: '3.115204' },
        { i: 2, xi: '1.0', fxi: '0.367879', weight: 2, weightedValue: '0.735758' },
        { i: 3, xi: '1.5', fxi: '0.105399', weight: 4, weightedValue: '0.421596' },
        { i: 4, xi: '2.0', fxi: '0.018316', weight: 1, weightedValue: '0.018316' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate grid spacing and partition nodes',
          explanation: 'Find \\Delta x and determine all node points x_i = a + i\\Delta x for i = 0, 1, 2, 3, 4.',
          latexMath: '\\Delta x = \\frac{2 - 0}{4} = 0.5 \\implies x_0 = 0.0, \\, x_1 = 0.5, \\, x_2 = 1.0, \\, x_3 = 1.5, \\, x_4 = 2.0',
        },
        {
          stepNumber: 2,
          title: 'Evaluate function values f(x_i) = e^{-x_i^2}',
          explanation: 'Calculate f(x) at each node to 6 decimal places.',
          latexMath: 'f(0) = 1.0, \\, f(0.5) \\approx 0.778801, \\, f(1.0) \\approx 0.367879, \\, f(1.5) \\approx 0.105399, \\, f(2.0) \\approx 0.018316',
        },
        {
          stepNumber: 3,
          title: 'Apply Simpson coefficients pattern [1, 4, 2, 4, 1]',
          explanation: 'Multiply the interior nodes alternating between 4 and 2, and endpoints by 1.',
          latexMath: '\\sum w_i f(x_i) = 1.000000 + 4(0.778801) + 2(0.367879) + 4(0.105399) + 0.018316 = 5.290874',
        },
        {
          stepNumber: 4,
          title: 'Multiply by Delta x / 3',
          explanation: 'Finalize the weighted sum by scaling with \\Delta x / 3 = 0.5 / 3 = 1/6.',
          latexMath: 'S_4 = \\frac{0.5}{3} \\times 5.290874 \\approx 0.881812',
        },
      ],
      verification: {
        type: 'Error Bound Estimation',
        latexMath: '|E_S| \\le \\frac{M(b-a)^5}{180 n^4} \\approx 0.0004',
        explanation: 'The true exact value is \\frac{\\sqrt{\\pi}}{2}\\operatorname{erf}(2) \\approx 0.882081. The absolute error is |0.881812 - 0.882081| = 0.000269, well within theoretical bounds.',
      },
      finalAnswerLatex: 'S_4 \\approx 0.881812 \\quad (\\text{Exact } \\approx 0.882081)',
      decimalApproximation: '0.881812',
      commonPitfalls: [
        "Applying Simpson's rule when n is odd (Simpson's rule requires an even number of subintervals).",
        'Confusing the alternating weight pattern: odd indices receive weight 4, even interior indices receive weight 2.',
        'Multiplying by \\Delta x / 2 instead of \\Delta x / 3 (which would be Trapezoidal rule).',
      ],
    },
    numericalPreset: {
      funcStr: 'exp(-x^2)',
      a: 0,
      b: 2,
      n: 4,
      method: 'simpson',
      exactValue: 0.882081,
    },
  },

  // 2. Numerical Methods: Trapezoidal Rule
  {
    id: 'num-trap-1',
    topic: 'numerical_methods',
    title: 'Trapezoidal Rule: ∫_1^3 (1/x) dx',
    subTopic: 'Trapezoidal Rule Approximation',
    problemLatex: '\\int_1^3 \\frac{1}{x} dx \\quad (n = 4)',
    difficulty: 'Beginner',
    description: 'Approximate the natural logarithm ln(3) using the Trapezoidal Rule with 4 trapezoids.',
    precomputedSolution: {
      problemStatementLatex: '\\int_1^3 \\frac{1}{x} dx \\quad \\text{with } n = 4 \\text{ using Trapezoidal Rule}',
      mainTopic: 'Numerical Methods',
      subTopic: 'Trapezoidal Rule (n = 4)',
      theoryAndFormulas: [
        {
          name: 'Trapezoidal Rule',
          latexFormula: 'T_n = \\frac{\\Delta x}{2} [f(x_0) + 2f(x_1) + 2f(x_2) + 2f(x_3) + f(x_4)]',
          explanation: 'Connects consecutive data points with secant lines to form trapezoids.',
        },
        {
          name: 'Interval Step Size',
          latexFormula: '\\Delta x = \\frac{3-1}{4} = 0.5',
          explanation: 'Width of each trapezoid base.',
        },
      ],
      methodJustification:
        'The Trapezoidal rule approximates area under f(x)=1/x by trapezoids. Because f(x) is concave up (f\'\'(x) = 2/x^3 > 0), the secant lines lie strictly above the curve, so T_n will be a slight overestimate.',
      numericalTable: [
        { i: 0, xi: '1.0', fxi: '1.000000', weight: 1, weightedValue: '1.000000' },
        { i: 1, xi: '1.5', fxi: '0.666667', weight: 2, weightedValue: '1.333333' },
        { i: 2, xi: '2.0', fxi: '0.500000', weight: 2, weightedValue: '1.000000' },
        { i: 3, xi: '2.5', fxi: '0.400000', weight: 2, weightedValue: '0.800000' },
        { i: 4, xi: '3.0', fxi: '0.333333', weight: 1, weightedValue: '0.333333' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate grid points',
          explanation: 'Subdivide [1, 3] with step size 0.5.',
          latexMath: 'x_0 = 1.0, \\, x_1 = 1.5, \\, x_2 = 2.0, \\, x_3 = 2.5, \\, x_4 = 3.0',
        },
        {
          stepNumber: 2,
          title: 'Evaluate f(x) = 1/x at all nodes',
          explanation: 'Obtain function values at each boundary point.',
          latexMath: 'f(1) = 1, \\, f(1.5) = \\frac{2}{3}, \\, f(2) = \\frac{1}{2}, \\, f(2.5) = \\frac{2}{5}, \\, f(3) = \\frac{1}{3}',
        },
        {
          stepNumber: 3,
          title: 'Compute weighted sum [1, 2, 2, 2, 1]',
          explanation: 'Inner nodes are weighted by 2, end nodes by 1.',
          latexMath: '1 + 2\\left(\\frac{2}{3}\\right) + 2\\left(\\frac{1}{2}\\right) + 2\\left(\\frac{2}{5}\\right) + \\frac{1}{3} = 1 + \\frac{4}{3} + 1 + \\frac{4}{5} + \\frac{1}{3} = \\frac{67}{15} \\approx 4.466667',
        },
        {
          stepNumber: 4,
          title: 'Multiply by Delta x / 2',
          explanation: 'Scale by half the step size: 0.5 / 2 = 0.25.',
          latexMath: 'T_4 = \\frac{0.5}{2} \\times \\frac{67}{15} = \\frac{67}{60} \\approx 1.116667',
        },
      ],
      verification: {
        type: 'Exact Analytical Comparison',
        latexMath: '\\int_1^3 \\frac{1}{x} dx = [\\ln(x)]_1^3 = \\ln(3) - \\ln(1) = \\ln(3) \\approx 1.098612',
        explanation: 'Overestimate error is 1.116667 - 1.098612 = +0.018055, consistent with f(x) being concave upward.',
      },
      finalAnswerLatex: 'T_4 = \\frac{67}{60} \\approx 1.116667 \\quad (\\text{Exact } \\ln(3) \\approx 1.098612)',
      decimalApproximation: '1.116667',
      commonPitfalls: [
        'Forgetting the factor of 1/2 in front of Delta x: T_n = (Delta x / 2)[...]',
        'Weighting the first and last endpoints with 2 instead of 1.',
      ],
    },
    numericalPreset: {
      funcStr: '1/x',
      a: 1,
      b: 3,
      n: 4,
      method: 'trapezoidal',
      exactValue: 1.098612,
    },
  },

  // 3. Substitution: Powers
  {
    id: 'sub-power-1',
    topic: 'substitution',
    title: 'u-Sub with Powers: ∫ x² √(x³ + 5) dx',
    subTopic: 'Substitution involving Radical Powers',
    problemLatex: '\\int x^2 \\sqrt{x^3 + 5} \\, dx',
    difficulty: 'Beginner',
    description: 'Integrate a function where the inner cubic polynomial has its quadratic derivative as a factor.',
    precomputedSolution: {
      problemStatementLatex: '\\int x^2 \\sqrt{x^3 + 5} \\, dx',
      mainTopic: 'Substitution Method',
      subTopic: 'Powers and Radicals Substitution',
      theoryAndFormulas: [
        {
          name: 'General Substitution Rule',
          latexFormula: '\\int f(g(x)) g\'(x) dx = \\int f(u) du \\quad \\text{where } u = g(x)',
          explanation: 'Transforms the integral into a simpler variable u using the chain rule in reverse.',
        },
        {
          name: 'Power Rule of Integration',
          latexFormula: '\\int u^n du = \\frac{u^{n+1}}{n+1} + C \\quad (n \\neq -1)',
          explanation: 'Standard antiderivative for powers.',
        },
      ],
      methodJustification:
        'The integrand has an inner composite term x^3 + 5 inside the square root. Its derivative is \\frac{d}{dx}(x^3 + 5) = 3x^2, which matches the external factor x^2 up to a constant scalar of 3.',
      steps: [
        {
          stepNumber: 1,
          title: 'Define substitution variable u and calculate differential du',
          explanation: 'Let u equal the radicand, and differentiate with respect to x.',
          latexMath: 'u = x^3 + 5 \\implies \\frac{du}{dx} = 3x^2 \\implies du = 3x^2 dx \\implies x^2 dx = \\frac{1}{3} du',
          sideCalculations: ['Radicand = x^3 + 5', 'du = 3x^2 dx', 'x^2 dx = du / 3'],
        },
        {
          stepNumber: 2,
          title: 'Rewrite the integral in terms of u',
          explanation: 'Replace \\sqrt{x^3 + 5} with u^{1/2} and x^2 dx with \\frac{1}{3} du.',
          latexMath: '\\int x^2 \\sqrt{x^3 + 5} dx = \\int u^{1/2} \\cdot \\left(\\frac{1}{3} du\\right) = \\frac{1}{3} \\int u^{1/2} du',
        },
        {
          stepNumber: 3,
          title: 'Integrate using the power rule',
          explanation: 'Add 1 to the exponent: 1/2 + 1 = 3/2, and divide by 3/2.',
          latexMath: '\\frac{1}{3} \\left( \\frac{u^{3/2}}{3/2} \\right) + C = \\frac{1}{3} \\cdot \\frac{2}{3} u^{3/2} + C = \\frac{2}{9} u^{3/2} + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute u = x^3 + 5',
          explanation: 'Return to the original variable x to complete the indefinite integration.',
          latexMath: '\\frac{2}{9} (x^3 + 5)^{3/2} + C = \\frac{2}{9} \\sqrt{(x^3 + 5)^3} + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{2}{9}(x^3+5)^{3/2} + C\\right] = \\frac{2}{9} \\cdot \\frac{3}{2}(x^3+5)^{1/2} \\cdot (3x^2) = x^2 \\sqrt{x^3+5}',
        explanation: 'The derivative matches the original integrand exactly, proving correctness.',
      },
      finalAnswerLatex: '\\frac{2}{9}(x^3 + 5)^{3/2} + C',
      commonPitfalls: [
        'Forgetting the scalar multiplier 1/3 when substituting x^2 dx.',
        'Leaving the answer in terms of u instead of back-substituting x.',
        'Forgetting the constant of integration + C.',
      ],
    },
  },

  // 4. Substitution: Exponentials
  {
    id: 'sub-exp-1',
    topic: 'substitution',
    title: 'u-Sub with Exponentials: ∫ e^{2x} / (1 + e^{2x}) dx',
    subTopic: 'Exponentials & Logarithmic Derivative',
    problemLatex: '\\int \\frac{e^{2x}}{1 + e^{2x}} \\, dx',
    difficulty: 'Intermediate',
    description: 'Integrate a rational exponential expression by substituting the denominator.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{e^{2x}}{1 + e^{2x}} \\, dx',
      mainTopic: 'Substitution Method',
      subTopic: 'Exponential & Logarithmic Form',
      theoryAndFormulas: [
        {
          name: 'Logarithmic Integration Rule',
          latexFormula: '\\int \\frac{g\'(x)}{g(x)} dx = \\ln|g(x)| + C',
          explanation: 'Whenever the numerator is proportional to the derivative of the denominator.',
        },
        {
          name: 'Exponential Derivative',
          latexFormula: '\\frac{d}{dx}(e^{kx}) = k e^{kx}',
          explanation: 'Chain rule for exponential functions.',
        },
      ],
      methodJustification:
        'The denominator is g(x) = 1 + e^{2x}. Its derivative is g\'(x) = 2e^{2x}. The numerator contains e^{2x}, which matches g\'(x) up to a factor of 1/2.',
      steps: [
        {
          stepNumber: 1,
          title: 'Substitute the denominator u = 1 + e^{2x}',
          explanation: 'Assign u to the entire denominator to reduce the integral to 1/u.',
          latexMath: 'u = 1 + e^{2x} \\implies du = 2e^{2x} dx \\implies e^{2x} dx = \\frac{1}{2} du',
        },
        {
          stepNumber: 2,
          title: 'Transform integral into u-space',
          explanation: 'Substitute u and du into the integral.',
          latexMath: '\\int \\frac{e^{2x}}{1 + e^{2x}} dx = \\int \\frac{1}{u} \\cdot \\left(\\frac{1}{2} du\\right) = \\frac{1}{2} \\int \\frac{1}{u} du',
        },
        {
          stepNumber: 3,
          title: 'Evaluate the logarithmic antiderivative',
          explanation: 'Recall that ∫ 1/u du = ln|u| + C.',
          latexMath: '\\frac{1}{2} \\ln|u| + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute u = 1 + e^{2x}',
          explanation: 'Since 1 + e^{2x} > 0 for all real x, the absolute value bars may be simplified to parentheses.',
          latexMath: '\\frac{1}{2} \\ln(1 + e^{2x}) + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{1}{2}\\ln(1+e^{2x}) + C\\right] = \\frac{1}{2} \\cdot \\frac{2e^{2x}}{1+e^{2x}} = \\frac{e^{2x}}{1+e^{2x}}',
        explanation: 'Derivative returns the integrand.',
      },
      finalAnswerLatex: '\\frac{1}{2} \\ln(1 + e^{2x}) + C',
      commonPitfalls: [
        'Attempting to split the denominator: 1 / (1 + e^{2x}) cannot be separated into 1/1 + 1/e^{2x}.',
        'Missing the factor of 1/2 from du = 2e^{2x} dx.',
      ],
    },
  },

  // 5. Substitution: Logarithms
  {
    id: 'sub-log-1',
    topic: 'substitution',
    title: 'u-Sub with Logarithms: ∫ (ln x)³ / x dx',
    subTopic: 'Logarithmic Functions & Differential dx/x',
    problemLatex: '\\int \\frac{(\\ln x)^3}{x} \\, dx',
    difficulty: 'Beginner',
    description: 'Classic logarithmic power substitution where the 1/x factor provides du.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{(\\ln x)^3}{x} \\, dx',
      mainTopic: 'Substitution Method',
      subTopic: 'Logarithmic Substitution',
      theoryAndFormulas: [
        {
          name: 'Derivative of Natural Log',
          latexFormula: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x} \\implies d(\\ln x) = \\frac{dx}{x}',
          explanation: 'The factor 1/x is the exact differential of ln(x).',
        },
        {
          name: 'Power Rule',
          latexFormula: '\\int u^n du = \\frac{u^{n+1}}{n+1} + C',
          explanation: 'Applied to u = ln(x) with power n = 3.',
        },
      ],
      methodJustification:
        'The factor 1/x in the integrand is the derivative of \\ln x. Setting u = \\ln x turns this problem into a simple polynomial power integral.',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify u and compute du',
          explanation: 'Let u = \\ln x.',
          latexMath: 'u = \\ln x \\implies du = \\frac{1}{x} dx',
        },
        {
          stepNumber: 2,
          title: 'Substitute into integral',
          explanation: 'Replace (\\ln x)^3 with u^3 and dx / x with du.',
          latexMath: '\\int \\frac{(\\ln x)^3}{x} dx = \\int u^3 du',
        },
        {
          stepNumber: 3,
          title: 'Integrate u^3',
          explanation: 'Using power rule with n = 3.',
          latexMath: '\\frac{u^4}{4} + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute u = \\ln x',
          explanation: 'Express result in terms of the original variable x.',
          latexMath: '\\frac{(\\ln x)^4}{4} + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{(\\ln x)^4}{4}\\right] = \\frac{4(\\ln x)^3}{4} \\cdot \\frac{1}{x} = \\frac{(\\ln x)^3}{x}',
        explanation: 'Chain rule verifies the integrand.',
      },
      finalAnswerLatex: '\\frac{1}{4}(\\ln x)^4 + C',
      commonPitfalls: ['Attempting Integration by Parts when a direct substitution u = ln(x) is much simpler.'],
    },
  },

  // 6. Substitution: Trigonometric
  {
    id: 'sub-trig-1',
    topic: 'substitution',
    title: 'u-Sub with Trig: ∫ sin³(x) cos(x) dx',
    subTopic: 'Trigonometric Function Substitution',
    problemLatex: '\\int \\sin^3(x) \\cos(x) \\, dx',
    difficulty: 'Beginner',
    description: 'Integrate an odd power of sine multiplied by cosine using u = sin(x).',
    precomputedSolution: {
      problemStatementLatex: '\\int \\sin^3(x) \\cos(x) \\, dx',
      mainTopic: 'Substitution Method',
      subTopic: 'Trigonometric u-Substitution',
      theoryAndFormulas: [
        {
          name: 'Derivative of Sine',
          latexFormula: '\\frac{d}{dx}(\\sin x) = \\cos x \\implies d(\\sin x) = \\cos x dx',
          explanation: 'Cosine serves as the differential for sine.',
        },
      ],
      methodJustification:
        'The derivative of \\sin(x) is \\cos(x), which appears directly as an isolating factor \\cos(x)dx in the integrand.',
      steps: [
        {
          stepNumber: 1,
          title: 'Choose u = sin(x)',
          explanation: 'Calculate du to replace cos(x) dx.',
          latexMath: 'u = \\sin(x) \\implies du = \\cos(x) dx',
        },
        {
          stepNumber: 2,
          title: 'Substitute into integral',
          explanation: 'The integral collapses to a simple single-variable power.',
          latexMath: '\\int \\sin^3(x) \\cos(x) dx = \\int u^3 du',
        },
        {
          stepNumber: 3,
          title: 'Evaluate antiderivative',
          explanation: 'Add 1 to the exponent and divide.',
          latexMath: '\\frac{u^4}{4} + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute u = sin(x)',
          explanation: 'Replace u with sin(x).',
          latexMath: '\\frac{\\sin^4(x)}{4} + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{\\sin^4(x)}{4}\\right] = \\frac{4\\sin^3(x)}{4} \\cdot \\cos(x) = \\sin^3(x)\\cos(x)',
        explanation: 'Matches original integrand.',
      },
      finalAnswerLatex: '\\frac{1}{4}\\sin^4(x) + C',
      commonPitfalls: ['Choosing u = cos(x) which would produce -sin(x) dx and leave sin^2(x) stranded.'],
    },
  },

  // 7. Inverse Trig: Arctan
  {
    id: 'inv-trig-1',
    topic: 'inverse_trig_hyperbolic',
    title: 'Inverse Trig Form: ∫ 1 / (x² + 9) dx',
    subTopic: 'Standard Inverse Tangent Form',
    problemLatex: '\\int \\frac{1}{x^2 + 9} \\, dx',
    difficulty: 'Beginner',
    description: 'Evaluate an elementary quadratic reciprocal that yields an inverse tangent function.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{1}{x^2 + 9} \\, dx',
      mainTopic: 'Inverse Trigonometric & Hyperbolic Forms',
      subTopic: 'Inverse Tangent Form ∫ 1/(x² + a²) dx',
      theoryAndFormulas: [
        {
          name: 'Inverse Tangent Formula',
          latexFormula: '\\int \\frac{1}{x^2 + a^2} dx = \\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C',
          explanation: 'Derived from substituting x = a tan(\\theta) and using 1 + tan²(\\theta) = sec²(\\theta).',
        },
      ],
      methodJustification:
        'The integrand is of the canonical form 1 / (x^2 + a^2) where a^2 = 9 > 0, indicating an immediate arctangent antiderivative.',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify constant a',
          explanation: 'Set a^2 = 9 to find a = 3.',
          latexMath: 'x^2 + 9 = x^2 + 3^2 \\implies a = 3',
        },
        {
          stepNumber: 2,
          title: 'Apply standard formula with a = 3',
          explanation: 'Substitute a = 3 into (1/a) arctan(x/a).',
          latexMath: '\\int \\frac{1}{x^2 + 3^2} dx = \\frac{1}{3} \\arctan\\left(\\frac{x}{3}\\right) + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{1}{3}\\arctan\\left(\\frac{x}{3}\\right)\\right] = \\frac{1}{3} \\cdot \\frac{1}{1 + (x/3)^2} \\cdot \\frac{1}{3} = \\frac{1}{9} \\cdot \\frac{1}{1 + x^2/9} = \\frac{1}{9 + x^2}',
        explanation: 'Matches the integrand exactly.',
      },
      finalAnswerLatex: '\\frac{1}{3}\\arctan\\left(\\frac{x}{3}\\right) + C',
      commonPitfalls: ['Forgetting the leading factor of 1/a = 1/3 (writing arctan(x/3) without the 1/3).'],
    },
  },

  // 8. Inverse Hyperbolic: Arsinh
  {
    id: 'inv-hyp-1',
    topic: 'inverse_trig_hyperbolic',
    title: 'Inverse Hyperbolic: ∫ 1 / √(x² + 4) dx',
    subTopic: 'Inverse Hyperbolic Sine Form',
    problemLatex: '\\int \\frac{1}{\\sqrt{x^2 + 4}} \\, dx',
    difficulty: 'Intermediate',
    description: 'Integrate the reciprocal root of a sum of squares, leading to arsinh or logarithmic form.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{1}{\\sqrt{x^2 + 4}} \\, dx',
      mainTopic: 'Inverse Trigonometric & Hyperbolic Forms',
      subTopic: 'Inverse Hyperbolic Sine Form',
      theoryAndFormulas: [
        {
          name: 'Inverse Hyperbolic Sine Formula',
          latexFormula: '\\int \\frac{1}{\\sqrt{x^2 + a^2}} dx = \\operatorname{arsinh}\\left(\\frac{x}{a}\\right) + C = \\ln\\left|x + \\sqrt{x^2 + a^2}\\right| + C',
          explanation: 'Relates to hyperbolic substitution x = a sinh(t) with 1 + sinh²(t) = cosh²(t).',
        },
      ],
      methodJustification:
        'The quadratic under the radical is x^2 + a^2 with a plus sign, which generates the inverse hyperbolic sine arsinh(x/a), or equivalently the logarithmic form.',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify a and substitute x = 2 sinh(t)',
          explanation: 'Here a^2 = 4 \\implies a = 2. Let x = 2\\sinh(t), then dx = 2\\cosh(t) dt.',
          latexMath: 'x = 2\\sinh(t) \\implies dx = 2\\cosh(t) dt',
        },
        {
          stepNumber: 2,
          title: 'Simplify the radical',
          explanation: 'Use the identity \\cosh^2(t) - \\sinh^2(t) = 1 \\implies 1 + \\sinh^2(t) = \\cosh^2(t).',
          latexMath: '\\sqrt{x^2 + 4} = \\sqrt{4\\sinh^2(t) + 4} = 2\\sqrt{\\sinh^2(t) + 1} = 2\\cosh(t)',
        },
        {
          stepNumber: 3,
          title: 'Evaluate the transformed integral',
          explanation: 'The cosh(t) terms cancel completely.',
          latexMath: '\\int \\frac{2\\cosh(t) dt}{2\\cosh(t)} = \\int 1 \\, dt = t + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute t = arsinh(x/2)',
          explanation: 'Express in terms of x using both inverse hyperbolic and logarithmic identities.',
          latexMath: 't = \\operatorname{arsinh}\\left(\\frac{x}{2}\\right) + C = \\ln\\left( x + \\sqrt{x^2 + 4} \\right) + C\'',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\ln\\left(x + \\sqrt{x^2+4}\\right)\\right] = \\frac{1 + \\frac{x}{\\sqrt{x^2+4}}}{x + \\sqrt{x^2+4}} = \\frac{\\frac{\\sqrt{x^2+4}+x}{\\sqrt{x^2+4}}}{x + \\sqrt{x^2+4}} = \\frac{1}{\\sqrt{x^2+4}}',
        explanation: 'Differentiation confirms the result.',
      },
      finalAnswerLatex: '\\operatorname{arsinh}\\left(\\frac{x}{2}\\right) + C \\quad \\text{or} \\quad \\ln\\left| x + \\sqrt{x^2 + 4} \\right| + C',
      commonPitfalls: ['Confusing ∫ 1/√(x² + a²) dx (hyperbolic) with ∫ 1/√(a² - x²) dx (arcsin).'],
    },
  },

  // 9. Trinomial: Completing the Square
  {
    id: 'trinomial-square-1',
    topic: 'trinomials',
    title: 'Trinomial Completing Square: ∫ 1 / (x² + 6x + 13) dx',
    subTopic: 'Completing the Square & Inverse Tangent',
    problemLatex: '\\int \\frac{1}{x^2 + 6x + 13} \\, dx',
    difficulty: 'Intermediate',
    description: 'Solve an irreducible quadratic trinomial denominator by completing the square.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{1}{x^2 + 6x + 13} \\, dx',
      mainTopic: 'Trinomial Forms ax² + bx + c',
      subTopic: 'Completing the Square & Arctan Form',
      theoryAndFormulas: [
        {
          name: 'Completing the Square',
          latexFormula: 'x^2 + bx + c = \\left(x + \\frac{b}{2}\\right)^2 + \\left(c - \\frac{b^2}{4}\\right)',
          explanation: 'Rewrites quadratic into a sum of squares when the discriminant b² - 4ac < 0.',
        },
        {
          name: 'Arctan Integral',
          latexFormula: '\\int \\frac{du}{u^2 + a^2} = \\frac{1}{a} \\arctan\\left(\\frac{u}{a}\\right) + C',
          explanation: 'Standard form after completing the square.',
        },
      ],
      methodJustification:
        'The denominator x^2 + 6x + 13 has discriminant \\Delta = 6^2 - 4(1)(13) = 36 - 52 = -16 < 0. Since it has no real roots, completing the square converts it into u^2 + a^2.',
      steps: [
        {
          stepNumber: 1,
          title: 'Complete the square on the quadratic trinomial',
          explanation: 'Take half the linear coefficient (6/2 = 3), square it (9), and balance.',
          latexMath: 'x^2 + 6x + 13 = (x^2 + 6x + 9) + 4 = (x + 3)^2 + 2^2',
          sideCalculations: ['b = 6, (b/2)^2 = 9', '13 - 9 = 4 = 2^2'],
        },
        {
          stepNumber: 2,
          title: 'Apply linear substitution u = x + 3',
          explanation: 'Since du = dx, the integral becomes elementary.',
          latexMath: 'u = x + 3 \\implies du = dx \\implies \\int \\frac{dx}{(x+3)^2 + 2^2} = \\int \\frac{du}{u^2 + 2^2}',
        },
        {
          stepNumber: 3,
          title: 'Integrate using standard arctangent rule with a = 2',
          explanation: 'Apply (1/a) arctan(u/a) with a = 2.',
          latexMath: '\\frac{1}{2} \\arctan\\left(\\frac{u}{2}\\right) + C',
        },
        {
          stepNumber: 4,
          title: 'Back-substitute u = x + 3',
          explanation: 'Restore original variable x.',
          latexMath: '\\frac{1}{2} \\arctan\\left(\\frac{x + 3}{2}\\right) + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{1}{2}\\arctan\\left(\\frac{x+3}{2}\\right)\\right] = \\frac{1}{2} \\cdot \\frac{1}{1 + \\left(\\frac{x+3}{2}\\right)^2} \\cdot \\frac{1}{2} = \\frac{1}{4 + (x+3)^2} = \\frac{1}{x^2+6x+13}',
        explanation: 'Matches the original denominator perfectly.',
      },
      finalAnswerLatex: '\\frac{1}{2}\\arctan\\left(\\frac{x + 3}{2}\\right) + C',
      commonPitfalls: [
        'Making arithmetic mistakes when completing the square: forgetting (b/2)² = 9.',
        'Omitting the leading 1/a = 1/2 factor.',
      ],
    },
  },

  // 10. Trinomial: Linear Numerator
  {
    id: 'trinomial-linear-1',
    topic: 'trinomials',
    title: 'Linear Numerator: ∫ (2x + 5) / (x² + 4x + 5) dx',
    subTopic: 'Decomposition into Derivative + Constant Part',
    problemLatex: '\\int \\frac{2x + 5}{x^2 + 4x + 5} \\, dx',
    difficulty: 'Advanced',
    description: 'Split the linear numerator into a multiple of the denominator’s derivative plus an arctangent piece.',
    precomputedSolution: {
      problemStatementLatex: '\\int \\frac{2x + 5}{x^2 + 4x + 5} \\, dx',
      mainTopic: 'Trinomial Forms ax² + bx + c',
      subTopic: 'Linear Numerator Splitting (px + q)/(ax² + bx + c)',
      theoryAndFormulas: [
        {
          name: 'Numerator Decomposition Formula',
          latexFormula: '\\frac{px+q}{ax^2+bx+c} = \\frac{p}{2a} \\cdot \\frac{2ax+b}{ax^2+bx+c} + \\frac{q - \\frac{pb}{2a}}{ax^2+bx+c}',
          explanation: 'Isolates the exact derivative (2ax + b) for a log integral, leaving a constant for completing the square.',
        },
      ],
      methodJustification:
        'The denominator has derivative \\frac{d}{dx}(x^2 + 4x + 5) = 2x + 4. The numerator 2x + 5 can be rewritten as (2x + 4) + 1, decomposing the problem into an easy logarithmic integral and an arctan integral.',
      steps: [
        {
          stepNumber: 1,
          title: 'Find derivative of denominator and split numerator',
          explanation: 'Differentiate denominator: d/dx(x^2 + 4x + 5) = 2x + 4. Rewrite 2x + 5 = (2x + 4) + 1.',
          latexMath: '\\frac{2x + 5}{x^2 + 4x + 5} = \\frac{(2x + 4) + 1}{x^2 + 4x + 5} = \\frac{2x + 4}{x^2 + 4x + 5} + \\frac{1}{x^2 + 4x + 5}',
        },
        {
          stepNumber: 2,
          title: 'Evaluate the first integral (Logarithmic part)',
          explanation: 'Since the numerator is the derivative of the denominator, this is ln|denominator|.',
          latexMath: 'I_1 = \\int \\frac{2x + 4}{x^2 + 4x + 5} dx = \\ln|x^2 + 4x + 5| = \\ln(x^2 + 4x + 5)',
          sideCalculations: ['x^2 + 4x + 5 = (x+2)^2 + 1 > 0 for all x'],
        },
        {
          stepNumber: 3,
          title: 'Complete the square on the second integral',
          explanation: 'Complete the square: x^2 + 4x + 5 = (x + 2)^2 + 1.',
          latexMath: 'I_2 = \\int \\frac{1}{(x + 2)^2 + 1} dx = \\arctan(x + 2)',
        },
        {
          stepNumber: 4,
          title: 'Combine both parts',
          explanation: 'Sum I_1 and I_2 with constant + C.',
          latexMath: 'I = I_1 + I_2 = \\ln(x^2 + 4x + 5) + \\arctan(x + 2) + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\ln(x^2+4x+5) + \\arctan(x+2)\\right] = \\frac{2x+4}{x^2+4x+5} + \\frac{1}{1+(x+2)^2} = \\frac{2x+4+1}{x^2+4x+5} = \\frac{2x+5}{x^2+4x+5}',
        explanation: 'The derivative confirms the original integrand.',
      },
      finalAnswerLatex: '\\ln(x^2 + 4x + 5) + \\arctan(x + 2) + C',
      commonPitfalls: [
        'Attempting u = x^2 + 4x + 5 directly without splitting off the leftover +1 in the numerator.',
        'Sign errors during algebraic splitting.',
      ],
    },
  },

  // 11. Integration by Parts: LIATE
  {
    id: 'parts-liate-1',
    topic: 'parts',
    title: 'Integration by Parts: ∫ x e^{3x} dx',
    subTopic: 'LIATE Rule: Algebraic × Exponential',
    problemLatex: '\\int x e^{3x} \\, dx',
    difficulty: 'Beginner',
    description: 'Use the LIATE priority rule to select u and dv, eliminating the algebraic polynomial factor.',
    precomputedSolution: {
      problemStatementLatex: '\\int x e^{3x} \\, dx',
      mainTopic: 'Integration by Parts',
      subTopic: 'LIATE Selection Rule',
      theoryAndFormulas: [
        {
          name: 'Integration by Parts Formula',
          latexFormula: '\\int u \\, dv = u v - \\int v \\, du',
          explanation: 'Product rule of differentiation in reverse.',
        },
        {
          name: 'LIATE Priority',
          latexFormula: '\\text{L (Log) } > \\text{ I (Inv Trig) } > \\text{ A (Algebraic) } > \\text{ T (Trig) } > \\text{ E (Exp)}',
          explanation: 'Choose u as the function appearing earlier in LIATE.',
        },
      ],
      methodJustification:
        'The integrand is a product of an algebraic function x and an exponential function e^{3x}. By LIATE, Algebraic precedes Exponential, so choose u = x and dv = e^{3x} dx.',
      steps: [
        {
          stepNumber: 1,
          title: 'Assign u and dv according to LIATE',
          explanation: 'Differentiate u to simplify it to 1, and integrate dv.',
          latexMath: '\\begin{aligned} u &= x &\\implies du &= dx \\\\ dv &= e^{3x} dx &\\implies v &= \\frac{1}{3}e^{3x} \\end{aligned}',
        },
        {
          stepNumber: 2,
          title: 'Apply integration by parts formula: uv - ∫ v du',
          explanation: 'Substitute the components into uv - ∫ v du.',
          latexMath: '\\int x e^{3x} dx = (x)\\left(\\frac{1}{3}e^{3x}\\right) - \\int \\left(\\frac{1}{3}e^{3x}\\right) dx',
        },
        {
          stepNumber: 3,
          title: 'Evaluate the remaining elementary integral',
          explanation: 'Integrate (1/3) e^{3x} dx.',
          latexMath: '\\frac{1}{3} x e^{3x} - \\frac{1}{3}\\left(\\frac{1}{3}e^{3x}\\right) + C = \\frac{1}{3} x e^{3x} - \\frac{1}{9} e^{3x} + C',
        },
        {
          stepNumber: 4,
          title: 'Factor out common terms for neat presentation',
          explanation: 'Factor (1/9) e^{3x}.',
          latexMath: '\\frac{1}{9} e^{3x}(3x - 1) + C',
        },
      ],
      verification: {
        type: 'Product Rule Differentiation',
        latexMath: '\\frac{d}{dx}\\left[\\frac{1}{3}xe^{3x} - \\frac{1}{9}e^{3x}\\right] = \\frac{1}{3}e^{3x} + \\frac{1}{3}x(3e^{3x}) - \\frac{1}{3}e^{3x} = x e^{3x}',
        explanation: 'Differentiation yields the integrand.',
      },
      finalAnswerLatex: '\\frac{1}{9} e^{3x}(3x - 1) + C',
      commonPitfalls: [
        'Swapping u and dv (choosing u = e^{3x} and dv = x dx results in a more complicated integral ∫ x² e^{3x} dx).',
        'Forgetting the chain rule coefficient 1/3 when integrating e^{3x}.',
      ],
    },
  },

  // 12. Integration by Parts: Cyclic / Looping
  {
    id: 'parts-cyclic-1',
    topic: 'parts',
    title: 'Cyclic Parts: ∫ e^{x} cos(x) dx',
    subTopic: 'Recurrent Integration by Parts',
    problemLatex: '\\int e^x \\cos(x) \\, dx',
    difficulty: 'Advanced',
    description: 'Solve a looping integral by applying integration by parts twice and solving algebraically for I.',
    precomputedSolution: {
      problemStatementLatex: '\\int e^x \\cos(x) \\, dx',
      mainTopic: 'Integration by Parts',
      subTopic: 'Cyclic / Recurrent Parts',
      theoryAndFormulas: [
        {
          name: 'Cyclic Strategy',
          latexFormula: 'I = \\dots - I \\implies 2I = \\dots \\implies I = \\frac{1}{2}(\\dots)',
          explanation: 'Applying parts twice returns the original integral with a negative sign, allowing algebraic isolation.',
        },
      ],
      methodJustification:
        'Both e^x and \\cos(x) reproduce themselves indefinitely under differentiation and integration. Applying parts twice will regenerate the original integral I, which can then be isolated algebraically.',
      steps: [
        {
          stepNumber: 1,
          title: 'First Integration by Parts',
          explanation: 'Let I = ∫ e^x cos(x) dx. Choose u = e^x, dv = cos(x) dx.',
          latexMath: '\\begin{aligned} u &= e^x &\\implies du &= e^x dx \\\\ dv &= \\cos(x) dx &\\implies v &= \\sin(x) \\end{aligned} \\implies I = e^x \\sin(x) - \\int e^x \\sin(x) dx',
        },
        {
          stepNumber: 2,
          title: 'Second Integration by Parts on ∫ e^x sin(x) dx',
          explanation: 'Consistently choose u = e^x again, dv = sin(x) dx.',
          latexMath: '\\begin{aligned} u &= e^x &\\implies du &= e^x dx \\\\ dv &= \\sin(x) dx &\\implies v &= -\\cos(x) \\end{aligned} \\implies \\int e^x \\sin(x) dx = -e^x \\cos(x) - \\int -e^x \\cos(x) dx = -e^x \\cos(x) + I',
        },
        {
          stepNumber: 3,
          title: 'Substitute back into the original equation',
          explanation: 'Insert the second parts expansion into the equation for I.',
          latexMath: 'I = e^x \\sin(x) - \\left[ -e^x \\cos(x) + I \\right] = e^x \\sin(x) + e^x \\cos(x) - I',
        },
        {
          stepNumber: 4,
          title: 'Solve algebraically for I and add + C',
          explanation: 'Add I to both sides: 2I = e^x(sin(x) + cos(x)), then divide by 2.',
          latexMath: '2I = e^x(\\sin x + \\cos x) \\implies I = \\frac{1}{2} e^x (\\sin x + \\cos x) + C',
        },
      ],
      verification: {
        type: 'Differentiation Check',
        latexMath: '\\frac{d}{dx}\\left[\\frac{1}{2}e^x(\\sin x + \\cos x)\\right] = \\frac{1}{2}e^x(\\sin x + \\cos x) + \\frac{1}{2}e^x(\\cos x - \\sin x) = e^x \\cos x',
        explanation: 'Differentiation confirms the integrand.',
      },
      finalAnswerLatex: '\\frac{1}{2} e^x (\\sin x + \\cos x) + C',
      commonPitfalls: [
        'Switching roles in the second integration by parts (choosing u = sin(x) undoes the first step and gives 0 = 0).',
        'Distributing the minus sign incorrectly: -[-e^x cos(x) + I] = +e^x cos(x) - I.',
      ],
    },
  },
];
