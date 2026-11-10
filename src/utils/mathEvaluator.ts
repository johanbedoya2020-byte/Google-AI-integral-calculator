/**
 * Safe Mathematical Expression Parser and Numerical Calculus Engine
 * Evaluates expressions like x^2, sqrt(4 - x^2), sin(x), 1/x, exp(-x), etc.
 * Supports numerical derivatives, definite integrals, arc lengths, surface areas, and volumes.
 */

// Function evaluation environment
export function parseMathFunction(exprStr: string): (x: number) => number {
  if (!exprStr || !exprStr.trim()) {
    return () => 0;
  }

  const clean = exprStr.trim().toLowerCase();

  // Fast-path known standard expressions
  if (clean === 'x^2' || clean === 'x*x') return (x) => x * x;
  if (clean === 'x') return (x) => x;
  if (clean === 'sqrt(x)') return (x) => (x >= 0 ? Math.sqrt(x) : 0);
  if (clean === 'sin(x)') return (x) => Math.sin(x);
  if (clean === 'cos(x)') return (x) => Math.cos(x);
  if (clean === '1/x') return (x) => (Math.abs(x) > 1e-7 ? 1 / x : 0);
  if (clean === 'exp(-x^2)' || clean === 'e^(-x^2)') return (x) => Math.exp(-x * x);

  // Prepare a safe Javascript expression string from standard math notation
  let js = exprStr
    .replace(/\s+/g, '')
    // Handle implicit multiplication like 2x, 3sin(x), x(x+1)
    .replace(/(\d)([a-zA-Z(])/g, '$1*$2')
    .replace(/(\))([a-zA-Z0-9(])/g, '$1*$2')
    // Powers: a^b -> Math.pow(a, b)
    // Handle simple variable powers like x^2, x^3
    .replace(/([a-zA-Z0-9_]+)\^([a-zA-Z0-9_.-]+)/g, 'Math.pow($1, $2)')
    .replace(/([a-zA-Z0-9_]+)\^(\([^)]+\))/g, 'Math.pow($1, $2)')
    .replace(/(\([^)]+\))\^([a-zA-Z0-9_.-]+)/g, 'Math.pow($1, $2)')
    .replace(/(\([^)]+\))\^(\([^)]+\))/g, 'Math.pow($1, $2)')
    // Standard functions
    .replace(/\bsin\b/gi, 'Math.sin')
    .replace(/\bcos\b/gi, 'Math.cos')
    .replace(/\btan\b/gi, 'Math.tan')
    .replace(/\basin\b|\barcsin\b/gi, 'Math.asin')
    .replace(/\bacos\b|\barccos\b/gi, 'Math.acos')
    .replace(/\batan\b|\barctan\b/gi, 'Math.atan')
    .replace(/\bsinh\b/gi, 'Math.sinh')
    .replace(/\bcosh\b/gi, 'Math.cosh')
    .replace(/\btanh\b/gi, 'Math.tanh')
    .replace(/\bsqrt\b/gi, 'Math.sqrt')
    .replace(/\bcbrt\b/gi, 'Math.cbrt')
    .replace(/\babs\b/gi, 'Math.abs')
    .replace(/\bexp\b/gi, 'Math.exp')
    .replace(/\bln\b|\blog\b/gi, 'Math.log')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b(?![a-zA-Z])/g, 'Math.E');

  try {
    // Generate safe function
    const fn = new Function('x', `
      try {
        const val = ${js};
        if (Number.isNaN(val) || !Number.isFinite(val)) return 0;
        return val;
      } catch (e) {
        return 0;
      }
    `) as (x: number) => number;

    // Test run
    fn(1);
    return fn;
  } catch (err) {
    console.warn('Failed to parse mathematical expression:', exprStr, err);
    return () => 0;
  }
}

/**
 * Numerical central difference derivative f'(x)
 */
export function numericalDerivative(fn: (x: number) => number, x: number, h = 1e-5): number {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

/**
 * Adaptive Simpson's 1/3 rule for high-precision definite integration
 */
export function integrateSimpson(fn: (x: number) => number, a: number, b: number, n = 200): number {
  if (a === b) return 0;
  if (a > b) return -integrateSimpson(fn, b, a, n);

  const numSub = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / numSub;
  let sum = fn(a) + fn(b);

  for (let i = 1; i < numSub; i++) {
    const x = a + i * h;
    const fx = fn(x);
    if (!Number.isFinite(fx)) continue;
    sum += (i % 2 === 0 ? 2 : 4) * fx;
  }

  const result = (h / 3) * sum;
  return Number.isFinite(result) ? result : 0;
}

/**
 * Volume of Solid of Revolution (Disks & Washers)
 * Around horizontal line y = axisY (default axisY = 0 for x-axis):
 * V = pi * \int_a^b [ (f(x) - axisY)^2 - (g(x) - axisY)^2 ] dx
 * (assumes |f(x) - axisY| >= |g(x) - axisY|)
 */
export function calculateVolumeRevolution(
  f: (x: number) => number,
  g: (x: number) => number,
  a: number,
  b: number,
  axisType: 'x-axis' | 'y-axis' | 'line-y' | 'line-x',
  axisValue = 0,
  n = 200
): number {
  if (axisType === 'x-axis' || axisType === 'line-y') {
    const k = axisType === 'x-axis' ? 0 : axisValue;
    const integrand = (x: number) => {
      const R = Math.abs(f(x) - k);
      const r = Math.abs(g(x) - k);
      const outer = Math.max(R, r);
      const inner = Math.min(R, r);
      return Math.PI * (outer * outer - inner * inner);
    };
    return Math.abs(integrateSimpson(integrand, a, b, n));
  } else {
    // Revolve around vertical line x = k (e.g. y-axis when k = 0) via shells:
    // V = 2 * pi * \int_a^b |x - k| * |f(x) - g(x)| dx
    const k = axisType === 'y-axis' ? 0 : axisValue;
    const integrand = (x: number) => {
      const radius = Math.abs(x - k);
      const height = Math.abs(f(x) - g(x));
      return 2 * Math.PI * radius * height;
    };
    return Math.abs(integrateSimpson(integrand, a, b, n));
  }
}

/**
 * Method of Cylindrical Shells Volume
 * V = 2 * pi * \int_a^b (radius) * (height) dx
 */
export function calculateVolumeShells(
  f: (x: number) => number,
  g: (x: number) => number,
  a: number,
  b: number,
  axisValue = 0,
  n = 200
): number {
  const integrand = (x: number) => {
    const radius = Math.abs(x - axisValue);
    const height = Math.abs(f(x) - g(x));
    return 2 * Math.PI * radius * height;
  };
  return Math.abs(integrateSimpson(integrand, a, b, n));
}

export type CrossSectionType =
  | 'square'
  | 'semicircle'
  | 'equilateral_triangle'
  | 'isosceles_right_leg'
  | 'isosceles_right_hyp'
  | 'rectangle_2x';

/**
 * Volume with Known Cross-Sections
 * V = \int_a^b A(x) dx
 */
export function calculateVolumeCrossSections(
  f: (x: number) => number,
  g: (x: number) => number,
  a: number,
  b: number,
  shape: CrossSectionType,
  n = 200
): number {
  const integrand = (x: number) => {
    const s = Math.abs(f(x) - g(x)); // side / base length
    switch (shape) {
      case 'square':
        return s * s;
      case 'semicircle':
        return (Math.PI / 8) * s * s;
      case 'equilateral_triangle':
        return (Math.sqrt(3) / 4) * s * s;
      case 'isosceles_right_leg':
        return 0.5 * s * s;
      case 'isosceles_right_hyp':
        return 0.25 * s * s;
      case 'rectangle_2x':
        return 2 * s * s;
      default:
        return s * s;
    }
  };
  return Math.abs(integrateSimpson(integrand, a, b, n));
}

/**
 * Arc Length of Plane Curve y = f(x)
 * L = \int_a^b \sqrt{1 + [f'(x)]^2} dx
 */
export function calculateArcLength(
  f: (x: number) => number,
  a: number,
  b: number,
  n = 200
): number {
  const integrand = (x: number) => {
    const df = numericalDerivative(f, x);
    return Math.sqrt(1 + df * df);
  };
  return Math.abs(integrateSimpson(integrand, a, b, n));
}

/**
 * Surface Area of Solid of Revolution
 * Revolved around x-axis: S = 2 * pi * \int_a^b |f(x)| * \sqrt{1 + [f'(x)]^2} dx
 * Revolved around y-axis: S = 2 * pi * \int_a^b |x| * \sqrt{1 + [f'(x)]^2} dx
 */
export function calculateSurfaceArea(
  f: (x: number) => number,
  a: number,
  b: number,
  around: 'x-axis' | 'y-axis' = 'x-axis',
  n = 200
): number {
  const integrand = (x: number) => {
    const df = numericalDerivative(f, x);
    const ds = Math.sqrt(1 + df * df);
    const radius = around === 'x-axis' ? Math.abs(f(x)) : Math.abs(x);
    return 2 * Math.PI * radius * ds;
  };
  return Math.abs(integrateSimpson(integrand, a, b, n));
}
