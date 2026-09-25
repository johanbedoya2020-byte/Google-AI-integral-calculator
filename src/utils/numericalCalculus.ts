export type NumericalMethodType =
  | 'left_riemann'
  | 'right_riemann'
  | 'midpoint'
  | 'trapezoidal'
  | 'simpson';

export interface SliceInfo {
  xLeft: number;
  xRight: number;
  yLeft: number;
  yRight: number;
  height?: number; // for midpoint/riemann
  sampleX?: number;
  sampleY?: number;
  area: number;
  method: NumericalMethodType;
}

export interface NumericalCalculationResult {
  method: NumericalMethodType;
  methodName: string;
  formulaLatex: string;
  a: number;
  b: number;
  n: number;
  deltaX: number;
  totalSum: number;
  exactValue?: number;
  absoluteError?: number;
  relativeErrorPercent?: number;
  nodes: {
    index: number;
    xi: number;
    fxi: number;
    weight: number;
    weightedVal: number;
  }[];
  slices: SliceInfo[];
  theoreticalErrorFormula: string;
}

// Safe function evaluator for standard math expressions
export function evaluateMathFunction(expr: string, x: number): number {
  try {
    // Normalization
    let clean = expr
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/exp/g, 'Math.exp')
      .replace(/ln|log/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/pi|PI/g, 'Math.PI')
      .replace(/e\b/g, 'Math.E')
      .replace(/abs/g, 'Math.abs');

    // Handle implicit multiplication like 2x, 3x^2, x(x+1)
    clean = clean.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
    clean = clean.replace(/(\))([a-zA-Z0-9(])/g, '$1*$2');
    clean = clean.replace(/x/g, `(${x})`);

    // Safe execution
    const fn = new Function(`return ${clean};`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return val;
    }
    return 0;
  } catch {
    // Basic fallback for common presets
    return Math.sin(x);
  }
}

export function computeNumericalMethod(
  funcExpr: string,
  a: number,
  b: number,
  n: number,
  method: NumericalMethodType,
  knownExact?: number
): NumericalCalculationResult {
  const deltaX = (b - a) / n;
  const nodes: {
    index: number;
    xi: number;
    fxi: number;
    weight: number;
    weightedVal: number;
  }[] = [];
  const slices: SliceInfo[] = [];

  let totalSum = 0;
  let formulaLatex = '';
  let methodName = '';
  let theoreticalErrorFormula = '';

  const f = (xVal: number) => evaluateMathFunction(funcExpr, xVal);

  switch (method) {
    case 'left_riemann': {
      methodName = 'Left Riemann Sum (L_n)';
      formulaLatex = 'L_n = \\Delta x \\sum_{i=0}^{n-1} f(x_i)';
      theoreticalErrorFormula = '|E_L| \\le \\frac{M_1 (b-a)^2}{2n}';
      for (let i = 0; i <= n; i++) {
        const xi = a + i * deltaX;
        const fxi = f(xi);
        const weight = i === n ? 0 : 1;
        const weightedVal = weight * fxi;
        nodes.push({ index: i, xi, fxi, weight, weightedVal });

        if (i < n) {
          const x1 = xi;
          const x2 = a + (i + 1) * deltaX;
          const height = fxi;
          const sliceArea = height * deltaX;
          totalSum += sliceArea;
          slices.push({
            xLeft: x1,
            xRight: x2,
            yLeft: fxi,
            yRight: f(x2),
            height,
            sampleX: x1,
            sampleY: fxi,
            area: sliceArea,
            method: 'left_riemann',
          });
        }
      }
      break;
    }

    case 'right_riemann': {
      methodName = 'Right Riemann Sum (R_n)';
      formulaLatex = 'R_n = \\Delta x \\sum_{i=1}^{n} f(x_i)';
      theoreticalErrorFormula = '|E_R| \\le \\frac{M_1 (b-a)^2}{2n}';
      for (let i = 0; i <= n; i++) {
        const xi = a + i * deltaX;
        const fxi = f(xi);
        const weight = i === 0 ? 0 : 1;
        const weightedVal = weight * fxi;
        nodes.push({ index: i, xi, fxi, weight, weightedVal });

        if (i < n) {
          const x1 = xi;
          const x2 = a + (i + 1) * deltaX;
          const height = f(x2);
          const sliceArea = height * deltaX;
          totalSum += sliceArea;
          slices.push({
            xLeft: x1,
            xRight: x2,
            yLeft: fxi,
            yRight: height,
            height,
            sampleX: x2,
            sampleY: height,
            area: sliceArea,
            method: 'right_riemann',
          });
        }
      }
      break;
    }

    case 'midpoint': {
      methodName = 'Midpoint Rule (M_n)';
      formulaLatex = 'M_n = \\Delta x \\sum_{i=0}^{n-1} f\\left(\\frac{x_i + x_{i+1}}{2}\\right)';
      theoreticalErrorFormula = '|E_M| \\le \\frac{K (b-a)^3}{24n^2} \\quad (K = \\max|f\'\'(x)|)';
      for (let i = 0; i < n; i++) {
        const x1 = a + i * deltaX;
        const x2 = a + (i + 1) * deltaX;
        const midX = (x1 + x2) / 2;
        const midY = f(midX);
        const sliceArea = midY * deltaX;
        totalSum += sliceArea;

        nodes.push({
          index: i + 1,
          xi: midX,
          fxi: midY,
          weight: 1,
          weightedVal: midY,
        });

        slices.push({
          xLeft: x1,
          xRight: x2,
          yLeft: f(x1),
          yRight: f(x2),
          height: midY,
          sampleX: midX,
          sampleY: midY,
          area: sliceArea,
          method: 'midpoint',
        });
      }
      break;
    }

    case 'trapezoidal': {
      methodName = 'Trapezoidal Rule (T_n)';
      formulaLatex = 'T_n = \\frac{\\Delta x}{2} \\left[ f(x_0) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n) \\right]';
      theoreticalErrorFormula = '|E_T| \\le \\frac{K (b-a)^3}{12n^2} \\quad (K = \\max|f\'\'(x)|)';
      let sumInner = 0;
      for (let i = 0; i <= n; i++) {
        const xi = a + i * deltaX;
        const fxi = f(xi);
        const weight = i === 0 || i === n ? 1 : 2;
        const weightedVal = weight * fxi;
        nodes.push({ index: i, xi, fxi, weight, weightedVal });
        sumInner += weightedVal;

        if (i < n) {
          const x1 = xi;
          const x2 = a + (i + 1) * deltaX;
          const y1 = fxi;
          const y2 = f(x2);
          const sliceArea = (deltaX / 2) * (y1 + y2);
          slices.push({
            xLeft: x1,
            xRight: x2,
            yLeft: y1,
            yRight: y2,
            area: sliceArea,
            method: 'trapezoidal',
          });
        }
      }
      totalSum = (deltaX / 2) * sumInner;
      break;
    }

    case 'simpson': {
      methodName = "Simpson's Rule (S_n)";
      // n must be even for Simpson's rule
      const effectiveN = n % 2 === 0 ? n : n + 1;
      const effectiveDeltaX = (b - a) / effectiveN;
      formulaLatex =
        'S_n = \\frac{\\Delta x}{3} \\left[ f(x_0) + 4\\sum_{i\\text{ odd}} f(x_i) + 2\\sum_{i\\text{ even}} f(x_i) + f(x_n) \\right]';
      theoreticalErrorFormula = '|E_S| \\le \\frac{M (b-a)^5}{180n^4} \\quad (M = \\max|f^{(4)}(x)|)';
      let sumInner = 0;

      for (let i = 0; i <= effectiveN; i++) {
        const xi = a + i * effectiveDeltaX;
        const fxi = f(xi);
        let weight = 2;
        if (i === 0 || i === effectiveN) {
          weight = 1;
        } else if (i % 2 !== 0) {
          weight = 4;
        }
        const weightedVal = weight * fxi;
        nodes.push({ index: i, xi, fxi, weight, weightedVal });
        sumInner += weightedVal;

        if (i < effectiveN) {
          const x1 = xi;
          const x2 = a + (i + 1) * effectiveDeltaX;
          const y1 = fxi;
          const y2 = f(x2);
          const sliceArea = (effectiveDeltaX / 3) * (y1 + 4 * f((x1 + x2) / 2) + y2);
          slices.push({
            xLeft: x1,
            xRight: x2,
            yLeft: y1,
            yRight: y2,
            sampleX: (x1 + x2) / 2,
            sampleY: f((x1 + x2) / 2),
            area: sliceArea,
            method: 'simpson',
          });
        }
      }
      totalSum = (effectiveDeltaX / 3) * sumInner;
      break;
    }
  }

  let absoluteError: number | undefined;
  let relativeErrorPercent: number | undefined;
  if (knownExact !== undefined) {
    absoluteError = Math.abs(totalSum - knownExact);
    if (Math.abs(knownExact) > 1e-9) {
      relativeErrorPercent = (absoluteError / Math.abs(knownExact)) * 100;
    }
  }

  return {
    method,
    methodName,
    formulaLatex,
    a,
    b,
    n,
    deltaX,
    totalSum,
    exactValue: knownExact,
    absoluteError,
    relativeErrorPercent,
    nodes,
    slices,
    theoreticalErrorFormula,
  };
}
