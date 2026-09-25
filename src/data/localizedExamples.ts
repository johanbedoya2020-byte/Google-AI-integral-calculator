import { SupportedLanguage } from '../i18n/translations';
import { CuratedExample } from '../types/calculus';
import { CURATED_EXAMPLES } from './curriculumData';

// Deep clone helper
function cloneExamples(examples: CuratedExample[]): CuratedExample[] {
  return JSON.parse(JSON.stringify(examples));
}

// Spanish translation of curated examples
function getSpanishExamples(): CuratedExample[] {
  const list = cloneExamples(CURATED_EXAMPLES);

  // 1. Simpson's Rule
  if (list[0]) {
    list[0].title = "Regla de Simpson: ∫_0^2 e^{-x²} dx";
    list[0].subTopic = "Regla de Simpson (Aproximación Parabólica)";
    list[0].difficulty = "Intermediate";
    list[0].description = "Aproxima la integral gaussiana en [0, 2] usando la Regla de Simpson con 4 subintervalos.";
    const sol = list[0].precomputedSolution;
    sol.problemStatementLatex = "\\int_0^2 e^{-x^2} dx \\quad \\text{con } n = 4 \\text{ usando la Regla de Simpson}";
    sol.mainTopic = "Métodos Numéricos";
    sol.subTopic = "Regla de Simpson (n = 4)";
    sol.theoryAndFormulas = [
      {
        name: "Fórmula de la Regla de Simpson",
        latexFormula: "S_n = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]",
        explanation: "Aproxima la función mediante arcos parabólicos en pares adyacentes de subintervalos.",
      },
      {
        name: "Tamaño del Paso (Delta x)",
        latexFormula: "\\Delta x = \\frac{b-a}{n} = \\frac{2 - 0}{4} = 0.5",
        explanation: "El ancho constante de cada subintervalo en [0, 2].",
      },
    ];
    sol.methodJustification = "El integrando f(x) = e^{-x^2} carece de antiderivada elemental (función de error erf(x)). La Regla de Simpson ofrece precisión de 4º orden O(\\Delta x^4), siendo óptima para aproximaciones de alta exactitud.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Calcular espaciado de malla y nodos de partición",
        explanation: "Calcula \\Delta x y halla todos los nodos x_i = a + i\\Delta x para i = 0, 1, 2, 3, 4.",
        latexMath: "\\Delta x = \\frac{2 - 0}{4} = 0.5 \\implies x_0 = 0.0, \\, x_1 = 0.5, \\, x_2 = 1.0, \\, x_3 = 1.5, \\, x_4 = 2.0",
      },
      {
        stepNumber: 2,
        title: "Evaluar los valores de la función f(x_i) = e^{-x_i^2}",
        explanation: "Calcula f(x) en cada nodo con 6 cifras decimales.",
        latexMath: "f(0) = 1.0, \\, f(0.5) \\approx 0.778801, \\, f(1.0) \\approx 0.367879, \\, f(1.5) \\approx 0.105399, \\, f(2.0) \\approx 0.018316",
      },
      {
        stepNumber: 3,
        title: "Aplicar el patrón de coeficientes de Simpson [1, 4, 2, 4, 1]",
        explanation: "Pondera los nodos interiores alternando entre 4 y 2, y los extremos con 1.",
        latexMath: "\\sum w_i f(x_i) = 1.000000 + 4(0.778801) + 2(0.367879) + 4(0.105399) + 0.018316 = 5.290874",
      },
      {
        stepNumber: 4,
        title: "Multiplicar por Delta x / 3",
        explanation: "Escala la suma ponderada por \\Delta x / 3 = 0.5 / 3 = 1/6.",
        latexMath: "S_4 = \\frac{0.5}{3} \\times 5.290874 \\approx 0.881812",
      },
    ];
    sol.verification = {
      type: "Estimación de Cota de Error",
      latexMath: "|E_S| \\le \\frac{M(b-a)^5}{180 n^4} \\approx 0.0004",
      explanation: "El valor analítico exacto es \\frac{\\sqrt{\\pi}}{2}\\operatorname{erf}(2) \\approx 0.882081. El error absoluto es |0.881812 - 0.882081| = 0.000269, dentro de la cota teórica.",
    };
    sol.finalAnswerLatex = "S_4 \\approx 0.881812 \\quad (\\text{Exacto } \\approx 0.882081)";
    sol.commonPitfalls = [
      "Aplicar la regla de Simpson cuando n es impar (requiere un número par de subintervalos).",
      "Confundir la alternancia de pesos: los índices impares llevan 4 y los pares interiores llevan 2.",
      "Multiplicar por \\Delta x / 2 en vez de \\Delta x / 3 (lo cual correspondería a la regla trapezoidal).",
    ];
  }

  // 2. Trapezoidal Rule
  if (list[1]) {
    list[1].title = "Regla Trapezoidal: ∫_1^3 (1/x) dx";
    list[1].subTopic = "Aproximación por Regla Trapezoidal";
    list[1].difficulty = "Beginner";
    list[1].description = "Aproxima el logaritmo natural ln(3) aplicando la regla de los trapecios con 4 subintervalos.";
    const sol = list[1].precomputedSolution;
    sol.problemStatementLatex = "\\int_1^3 \\frac{1}{x} dx \\quad \\text{con } n = 4 \\text{ usando la Regla Trapezoidal}";
    sol.mainTopic = "Métodos Numéricos";
    sol.subTopic = "Regla Trapezoidal (n = 4)";
    sol.theoryAndFormulas = [
      {
        name: "Regla Trapezoidal",
        latexFormula: "T_n = \\frac{\\Delta x}{2} [f(x_0) + 2f(x_1) + 2f(x_2) + 2f(x_3) + f(x_4)]",
        explanation: "Une puntos consecutivos con rectas secantes formando trapecios.",
      },
      {
        name: "Paso del Intervalo",
        latexFormula: "\\Delta x = \\frac{3-1}{4} = 0.5",
        explanation: "Ancho de la base de cada trapecio.",
      },
    ];
    sol.methodJustification = "La regla aproxima el área de f(x) = 1/x con trapecios. Como f''(x) = 2/x^3 > 0 (cóncava hacia arriba), las secantes quedan por encima de la curva, generando una ligera sobreestimación.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Calcular los nodos de la partición",
        explanation: "Divide [1, 3] en 4 partes con paso 0.5.",
        latexMath: "x_0 = 1.0, \\, x_1 = 1.5, \\, x_2 = 2.0, \\, x_3 = 2.5, \\, x_4 = 3.0",
      },
      {
        stepNumber: 2,
        title: "Evaluar f(x) = 1/x en todos los nodos",
        explanation: "Halla los valores funcionales en cada frontera.",
        latexMath: "f(1) = 1, \\, f(1.5) = \\frac{2}{3}, \\, f(2) = \\frac{1}{2}, \\, f(2.5) = \\frac{2}{5}, \\, f(3) = \\frac{1}{3}",
      },
      {
        stepNumber: 3,
        title: "Calcular la suma ponderada [1, 2, 2, 2, 1]",
        explanation: "Los nodos interiores se multiplican por 2 y los extremos por 1.",
        latexMath: "1 + 2\\left(\\frac{2}{3}\\right) + 2\\left(\\frac{1}{2}\\right) + 2\\left(\\frac{2}{5}\\right) + \\frac{1}{3} = \\frac{67}{15} \\approx 4.466667",
      },
      {
        stepNumber: 4,
        title: "Multiplicar por Delta x / 2",
        explanation: "Multiplica por la mitad del paso: 0.5 / 2 = 0.25.",
        latexMath: "T_4 = \\frac{0.5}{2} \\times \\frac{67}{15} = \\frac{67}{60} \\approx 1.116667",
      },
    ];
    sol.verification = {
      type: "Comparación Analítica Exacta",
      latexMath: "\\int_1^3 \\frac{1}{x} dx = [\\ln(x)]_1^3 = \\ln(3) - \\ln(1) = \\ln(3) \\approx 1.098612",
      explanation: "El error de sobreestimación es 1.116667 - 1.098612 = +0.018055, congruente con la concavidad de la función.",
    };
    sol.finalAnswerLatex = "T_4 = \\frac{67}{60} \\approx 1.116667 \\quad (\\text{Exacto } \\ln(3) \\approx 1.098612)";
    sol.commonPitfalls = [
      "Olvidar el factor 1/2 delante de Delta x: T_n = (Delta x / 2)[...]",
      "Multiplicar los extremos con peso 2 en lugar de peso 1.",
    ];
  }

  // 3. Substitution Powers
  if (list[2]) {
    list[2].title = "u-Sustitución con Potencias: ∫ x² √(x³ + 5) dx";
    list[2].subTopic = "Sustitución en Potencias y Radicales";
    list[2].difficulty = "Beginner";
    list[2].description = "Integra una función compuesta donde la derivada del radicando cúbico aparece como factor externo.";
    const sol = list[2].precomputedSolution;
    sol.mainTopic = "Método de Sustitución";
    sol.subTopic = "Sustitución con Potencias y Radicales";
    sol.theoryAndFormulas = [
      {
        name: "Regla General de Sustitución",
        latexFormula: "\\int f(g(x)) g'(x) dx = \\int f(u) du \\quad (u = g(x))",
        explanation: "Invierte la regla de la cadena para transformar la integral en una variable u más simple.",
      },
      {
        name: "Regla de la Potencia",
        latexFormula: "\\int u^n du = \\frac{u^{n+1}}{n+1} + C \\quad (n \\neq -1)",
        explanation: "Antiderivada básica para potencias.",
      },
    ];
    sol.methodJustification = "El integrando contiene la expresión interna x^3 + 5 bajo la raíz. Su derivada es 3x^2, que coincide con el factor x^2 salvo por una constante escalar 3.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Definir u y calcular el diferencial du",
        explanation: "Sea u el radicando, y diferencia con respecto a x.",
        latexMath: "u = x^3 + 5 \\implies du = 3x^2 dx \\implies x^2 dx = \\frac{1}{3} du",
      },
      {
        stepNumber: 2,
        title: "Reescribir la integral en términos de u",
        explanation: "Sustituye la raíz por u^{1/2} y x^2 dx por (1/3) du.",
        latexMath: "\\int x^2 \\sqrt{x^3 + 5} dx = \\int u^{1/2} \\cdot \\left(\\frac{1}{3} du\\right) = \\frac{1}{3} \\int u^{1/2} du",
      },
      {
        stepNumber: 3,
        title: "Integrar mediante la regla de potencias",
        explanation: "Suma 1 al exponente: 1/2 + 1 = 3/2, y divide entre 3/2.",
        latexMath: "\\frac{1}{3} \\left( \\frac{u^{3/2}}{3/2} \\right) + C = \\frac{2}{9} u^{3/2} + C",
      },
      {
        stepNumber: 4,
        title: "Restituir la variable original x",
        explanation: "Reemplaza u = x^3 + 5 para concluir la integral indefinida.",
        latexMath: "\\frac{2}{9} (x^3 + 5)^{3/2} + C = \\frac{2}{9} \\sqrt{(x^3 + 5)^3} + C",
      },
    ];
    sol.verification = {
      type: "Comprobación por Derivación",
      latexMath: "\\frac{d}{dx}\\left[\\frac{2}{9}(x^3+5)^{3/2} + C\\right] = \\frac{2}{9} \\cdot \\frac{3}{2}(x^3+5)^{1/2} \\cdot (3x^2) = x^2 \\sqrt{x^3+5}",
      explanation: "La derivada coincide exactamente con el integrando inicial, demostrando la validez.",
    };
    sol.finalAnswerLatex = "\\frac{2}{9}(x^3 + 5)^{3/2} + C";
    sol.commonPitfalls = [
      "Olvidar el escalar 1/3 al despejar x^2 dx = du / 3.",
      "Dejar la respuesta en función de u sin regresar a la variable original x.",
      "Omitir la constante de integración + C.",
    ];
  }

  // 4. Substitution Exponentials
  if (list[3]) {
    list[3].title = "u-Sustitución con Exponenciales: ∫ e^{2x} / (1 + e^{2x}) dx";
    list[3].subTopic = "Exponenciales y Derivada Logarítmica";
    list[3].difficulty = "Intermediate";
    list[3].description = "Integra un cociente con exponenciales sustituyendo el denominador.";
    const sol = list[3].precomputedSolution;
    sol.mainTopic = "Método de Sustitución";
    sol.subTopic = "Formas Exponenciales y Logarítmicas";
    sol.theoryAndFormulas = [
      {
        name: "Regla de Integración Logarítmica",
        latexFormula: "\\int \\frac{g'(x)}{g(x)} dx = \\ln|g(x)| + C",
        explanation: "Válida cuando el numerador es proporcional a la derivada del denominador.",
      },
    ];
    sol.methodJustification = "El denominador es g(x) = 1 + e^{2x}. Su derivada es g'(x) = 2e^{2x}. El numerador e^{2x} coincide con g'(x) salvo por un factor 1/2.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Sustituir el denominador u = 1 + e^{2x}",
        explanation: "Asigna u a todo el denominador para convertir la integral a 1/u.",
        latexMath: "u = 1 + e^{2x} \\implies du = 2e^{2x} dx \\implies e^{2x} dx = \\frac{1}{2} du",
      },
      {
        stepNumber: 2,
        title: "Transformar la integral al espacio u",
        explanation: "Sustituye u y du en la expresión.",
        latexMath: "\\int \\frac{e^{2x}}{1 + e^{2x}} dx = \\frac{1}{2} \\int \\frac{1}{u} du",
      },
      {
        stepNumber: 3,
        title: "Evaluar la antiderivada logarítmica",
        explanation: "Aplica ∫ 1/u du = ln|u| + C.",
        latexMath: "\\frac{1}{2} \\ln|u| + C",
      },
      {
        stepNumber: 4,
        title: "Restituir u = 1 + e^{2x}",
        explanation: "Como 1 + e^{2x} > 0 para todo x real, el valor absoluto se sustituye por paréntesis.",
        latexMath: "\\frac{1}{2} \\ln(1 + e^{2x}) + C",
      },
    ];
    sol.verification = {
      type: "Comprobación por Derivación",
      latexMath: "\\frac{d}{dx}\\left[\\frac{1}{2}\\ln(1+e^{2x}) + C\\right] = \\frac{1}{2} \\cdot \\frac{2e^{2x}}{1+e^{2x}} = \\frac{e^{2x}}{1+e^{2x}}",
      explanation: "La derivación recupera el integrando.",
    };
    sol.finalAnswerLatex = "\\frac{1}{2} \\ln(1 + e^{2x}) + C";
    sol.commonPitfalls = [
      "Intentar separar el denominador: 1 / (1 + e^{2x}) no es 1/1 + 1/e^{2x}.",
      "Olvidar el factor 1/2 al despejar du.",
    ];
  }

  // 9. Trinomial Completing Square
  if (list[8]) {
    list[8].title = "Trinomio por Completar Cuadrado: ∫ 1 / (x² + 6x + 13) dx";
    list[8].subTopic = "Completar el Cuadrado y Arcotangente";
    list[8].difficulty = "Intermediate";
    list[8].description = "Resuelve un denominador cuadrático irreducible completando el cuadrado.";
    const sol = list[8].precomputedSolution;
    sol.mainTopic = "Trinomios ax² + bx + c";
    sol.subTopic = "Completar el Cuadrado y Arcotangente";
    sol.theoryAndFormulas = [
      {
        name: "Completar el Cuadrado",
        latexFormula: "x^2 + bx + c = \\left(x + \\frac{b}{2}\\right)^2 + \\left(c - \\frac{b^2}{4}\\right)",
        explanation: "Reescribe el trinomio como suma de cuadrados cuando el discriminante b² - 4ac < 0.",
      },
    ];
    sol.methodJustification = "El discriminante de x^2 + 6x + 13 es 36 - 52 = -16 < 0. Al carecer de raíces reales, completar el cuadrado conduce directamente a la forma u^2 + a^2 de arcotangente.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Completar el cuadrado en el trinomio",
        explanation: "Toma la mitad del coeficiente lineal (6/2 = 3), elévala al cuadrado (9) y compensa.",
        latexMath: "x^2 + 6x + 13 = (x^2 + 6x + 9) + 4 = (x + 3)^2 + 2^2",
      },
      {
        stepNumber: 2,
        title: "Aplicar la sustitución lineal u = x + 3",
        explanation: "Como du = dx, la integral pasa a ser inmediata.",
        latexMath: "u = x + 3 \\implies \\int \\frac{dx}{(x+3)^2 + 2^2} = \\int \\frac{du}{u^2 + 2^2}",
      },
      {
        stepNumber: 3,
        title: "Integrar según la fórmula de arcotangente con a = 2",
        explanation: "Aplica (1/a) arctan(u/a) con a = 2.",
        latexMath: "\\frac{1}{2} \\arctan\\left(\\frac{u}{2}\\right) + C",
      },
      {
        stepNumber: 4,
        title: "Restituir u = x + 3",
        explanation: "Vuelve a la variable original x.",
        latexMath: "\\frac{1}{2} \\arctan\\left(\\frac{x + 3}{2}\\right) + C",
      },
    ];
    sol.verification = {
      type: "Comprobación por Derivación",
      latexMath: "\\frac{d}{dx}\\left[\\frac{1}{2}\\arctan\\left(\\frac{x+3}{2}\\right)\\right] = \\frac{1}{2} \\cdot \\frac{1}{1+\\left(\\frac{x+3}{2}\\right)^2} \\cdot \\frac{1}{2} = \\frac{1}{x^2+6x+13}",
      explanation: "La derivada coincide perfectamente con el integrando original.",
    };
    sol.finalAnswerLatex = "\\frac{1}{2}\\arctan\\left(\\frac{x + 3}{2}\\right) + C";
    sol.commonPitfalls = [
      "Errores aritméticos al completar el cuadrado.",
      "Olvidar el factor 1/a = 1/2 inicial de la fórmula del arcotangente.",
    ];
  }

  // 11. Parts with LIATE
  if (list[10]) {
    list[10].title = "Integración por Partes: ∫ x e^{3x} dx";
    list[10].subTopic = "Regla LIATE: Algebraica × Exponencial";
    list[10].difficulty = "Beginner";
    list[10].description = "Aplica la jerarquía LIATE para elegir u y dv, cancelando el factor algebraico polinomial.";
    const sol = list[10].precomputedSolution;
    sol.mainTopic = "Integración por Partes";
    sol.subTopic = "Regla de Selección LIATE";
    sol.theoryAndFormulas = [
      {
        name: "Fórmula de Integración por Partes",
        latexFormula: "\\int u \\, dv = u v - \\int v \\, du",
        explanation: "Proviene de integrar ambos miembros de la regla del producto de la derivación.",
      },
      {
        name: "Prioridad LIATE",
        latexFormula: "\\text{L (Log) } > \\text{ I (Trig Inv) } > \\text{ A (Alg) } > \\text{ T (Trig) } > \\text{ E (Exp)}",
        explanation: "Elige como u la función que figure antes en la sigla LIATE.",
      },
    ];
    sol.methodJustification = "El integrando es producto de una función algebraica x y una exponencial e^{3x}. Según LIATE, Algebraica precede a Exponencial; elegimos u = x y dv = e^{3x} dx.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Asignar u y dv según LIATE",
        explanation: "Diferencia u para reducirlo a 1 e integra dv.",
        latexMath: "u = x \\implies du = dx, \\quad dv = e^{3x} dx \\implies v = \\frac{1}{3}e^{3x}",
      },
      {
        stepNumber: 2,
        title: "Aplicar la fórmula: uv - ∫ v du",
        explanation: "Sustituye en la identidad fundamental.",
        latexMath: "\\int x e^{3x} dx = \\frac{1}{3}x e^{3x} - \\int \\frac{1}{3}e^{3x} dx",
      },
      {
        stepNumber: 3,
        title: "Calcular la integral elemental restante",
        explanation: "Integra (1/3) e^{3x} dx.",
        latexMath: "\\frac{1}{3} x e^{3x} - \\frac{1}{9} e^{3x} + C",
      },
      {
        stepNumber: 4,
        title: "Factorizar términos comunes",
        explanation: "Extrae (1/9) e^{3x} como factor común.",
        latexMath: "\\frac{1}{9} e^{3x}(3x - 1) + C",
      },
    ];
    sol.verification = {
      type: "Derivación por Regla del Producto",
      latexMath: "\\frac{d}{dx}\\left[\\frac{1}{3}xe^{3x} - \\frac{1}{9}e^{3x}\\right] = \\frac{1}{3}e^{3x} + x e^{3x} - \\frac{1}{3}e^{3x} = x e^{3x}",
      explanation: "La derivación recupera fielmente el integrando.",
    };
    sol.finalAnswerLatex = "\\frac{1}{9} e^{3x}(3x - 1) + C";
    sol.commonPitfalls = [
      "Invertir u y dv (elegir u = e^{3x} aumentaría la potencia de x a x²).",
      "Olvidar el coeficiente 1/3 de la regla de la cadena al integrar e^{3x}.",
    ];
  }

  return list;
}

// Portuguese translation of curated examples
function getPortugueseExamples(): CuratedExample[] {
  const list = cloneExamples(CURATED_EXAMPLES);

  if (list[0]) {
    list[0].title = "Regra de Simpson: ∫_0^2 e^{-x²} dx";
    list[0].subTopic = "Regra de Simpson (Aproximação Parabólica)";
    list[0].difficulty = "Intermediate";
    list[0].description = "Aproxima a integral gaussiana em [0, 2] usando a Regra de Simpson com 4 subintervalos.";
    const sol = list[0].precomputedSolution;
    sol.problemStatementLatex = "\\int_0^2 e^{-x^2} dx \\quad \\text{com } n = 4 \\text{ pela Regra de Simpson}";
    sol.mainTopic = "Métodos Numéricos";
    sol.subTopic = "Regra de Simpson (n = 4)";
    sol.theoryAndFormulas = [
      {
        name: "Fórmula da Regra de Simpson",
        latexFormula: "S_n = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]",
        explanation: "Aproxima a função por parábolas em pares consecutivos de subintervalos.",
      },
    ];
    sol.methodJustification = "O integrando f(x) = e^{-x^2} não possui primitiva elementar. A Regra de Simpson confere precisão de ordem 4 O(\\Delta x^4), ideal para alta exatidão.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Calcular o passo da partição e nós x_i",
        explanation: "Determine \\Delta x e os pontos da malha em [0, 2].",
        latexMath: "\\Delta x = \\frac{2 - 0}{4} = 0.5 \\implies x_0 = 0.0, \\, x_1 = 0.5, \\, x_2 = 1.0, \\, x_3 = 1.5, \\, x_4 = 2.0",
      },
      {
        stepNumber: 2,
        title: "Calcular os valores funcionais f(x_i)",
        explanation: "Calcule f(x) em cada nó com 6 casas decimais.",
        latexMath: "f(0) = 1.0, \\, f(0.5) \\approx 0.778801, \\, f(1.0) \\approx 0.367879, \\, f(1.5) \\approx 0.105399, \\, f(2.0) \\approx 0.018316",
      },
      {
        stepNumber: 3,
        title: "Aplicar os pesos de Simpson [1, 4, 2, 4, 1]",
        explanation: "Multiplique os nós internos alternando entre 4 e 2.",
        latexMath: "\\sum w_i f(x_i) = 1 + 4(0.778801) + 2(0.367879) + 4(0.105399) + 0.018316 = 5.290874",
      },
      {
        stepNumber: 4,
        title: "Multiplicar por Delta x / 3",
        explanation: "Multiplique a soma por \\Delta x / 3 = 0.5 / 3.",
        latexMath: "S_4 = \\frac{0.5}{3} \\times 5.290874 \\approx 0.881812",
      },
    ];
    sol.verification = {
      type: "Estimativa do Limite de Erro",
      latexMath: "|E_S| \\le \\frac{M(b-a)^5}{180 n^4} \\approx 0.0004",
      explanation: "O valor exato é \\approx 0.882081. O erro absoluto de 0.000269 está dentro do limite teórico.",
    };
    sol.finalAnswerLatex = "S_4 \\approx 0.881812 \\quad (\\text{Exato } \\approx 0.882081)";
    sol.commonPitfalls = [
      "Aplicar Simpson com n ímpar (Simpson exige número par de subintervalos).",
      "Trocar a ordem dos pesos 4 e 2.",
    ];
  }

  if (list[10]) {
    list[10].title = "Integração por Partes: ∫ x e^{3x} dx";
    list[10].subTopic = "Regra LIATE: Algébrica × Exponencial";
    list[10].difficulty = "Beginner";
    list[10].description = "Use a regra LIATE para escolher u e dv e eliminar o fator polinomial.";
    const sol = list[10].precomputedSolution;
    sol.mainTopic = "Integração por Partes";
    sol.subTopic = "Regra de Seleção LIATE";
    sol.finalAnswerLatex = "\\frac{1}{9} e^{3x}(3x - 1) + C";
  }

  return list;
}

// French translation of curated examples
function getFrenchExamples(): CuratedExample[] {
  const list = cloneExamples(CURATED_EXAMPLES);

  if (list[0]) {
    list[0].title = "Formule de Simpson : ∫_0^2 e^{-x²} dx";
    list[0].subTopic = "Formule de Simpson (Approximation Parabolique)";
    list[0].difficulty = "Intermediate";
    list[0].description = "Approximation de l'intégrale gaussienne sur [0, 2] par la méthode de Simpson à 4 sous-intervalles.";
    const sol = list[0].precomputedSolution;
    sol.problemStatementLatex = "\\int_0^2 e^{-x^2} dx \\quad \\text{avec } n = 4 \\text{ par Simpson}";
    sol.mainTopic = "Méthodes Numériques";
    sol.subTopic = "Formule de Simpson (n = 4)";
    sol.theoryAndFormulas = [
      {
        name: "Formule de Simpson",
        latexFormula: "S_n = \\frac{\\Delta x}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]",
        explanation: "Approche la fonction par des arcs paraboliques sur des paires d'intervalles adjacents.",
      },
    ];
    sol.methodJustification = "L'intégrande f(x) = e^{-x^2} n'admet pas de primitive élémentaire. La méthode de Simpson assure une convergence d'ordre 4 O(\\Delta x^4), idéale pour une haute précision.";
    sol.steps = [
      {
        stepNumber: 1,
        title: "Calcul du pas et des nœuds x_i",
        explanation: "Déterminez \\Delta x et les points d'échantillonnage.",
        latexMath: "\\Delta x = \\frac{2 - 0}{4} = 0.5 \\implies x_0 = 0.0, \\, x_1 = 0.5, \\, x_2 = 1.0, \\, x_3 = 1.5, \\, x_4 = 2.0",
      },
      {
        stepNumber: 2,
        title: "Calcul des valeurs de la fonction f(x_i)",
        explanation: "Calculez f(x) en chaque nœud à 6 décimales.",
        latexMath: "f(0) = 1.0, \\, f(0.5) \\approx 0.778801, \\, f(1.0) \\approx 0.367879, \\, f(1.5) \\approx 0.105399, \\, f(2.0) \\approx 0.018316",
      },
      {
        stepNumber: 3,
        title: "Application des coefficients de Simpson [1, 4, 2, 4, 1]",
        explanation: "Pondération alternée 4 et 2 sur les points intérieurs.",
        latexMath: "\\sum w_i f(x_i) = 1 + 4(0.778801) + 2(0.367879) + 4(0.105399) + 0.018316 = 5.290874",
      },
      {
        stepNumber: 4,
        title: "Multiplication par Delta x / 3",
        explanation: "Multipliez par le tiers du pas : 0.5 / 3.",
        latexMath: "S_4 = \\frac{0.5}{3} \\times 5.290874 \\approx 0.881812",
      },
    ];
    sol.verification = {
      type: "Estimation de Majoration d'Erreur",
      latexMath: "|E_S| \\le \\frac{M(b-a)^5}{180 n^4} \\approx 0.0004",
      explanation: "La valeur exacte est \\approx 0.882081. L'erreur absolue de 0.000269 respecte la majoration théorique.",
    };
    sol.finalAnswerLatex = "S_4 \\approx 0.881812 \\quad (\\text{Exact } \\approx 0.882081)";
    sol.commonPitfalls = [
      "Appliquer Simpson avec un nombre impair de sous-intervalles.",
      "Inverser l'alternance des poids 4 et 2.",
    ];
  }

  if (list[10]) {
    list[10].title = "Intégration par Parties : ∫ x e^{3x} dx";
    list[10].subTopic = "Règle ALPET / LIATE : Algébrique × Exponentielle";
    list[10].difficulty = "Beginner";
    list[10].description = "Utilisez la règle ALPET / LIATE pour éliminer le terme polynomial.";
    const sol = list[10].precomputedSolution;
    sol.mainTopic = "Intégration par Parties";
    sol.subTopic = "Règle de Sélection ALPET / LIATE";
    sol.finalAnswerLatex = "\\frac{1}{9} e^{3x}(3x - 1) + C";
  }

  return list;
}

export function getCuratedExamplesByLanguage(lang: SupportedLanguage): CuratedExample[] {
  switch (lang) {
    case 'es':
      return getSpanishExamples();
    case 'pt':
      return getPortugueseExamples();
    case 'fr':
      return getFrenchExamples();
    case 'en':
    default:
      return CURATED_EXAMPLES;
  }
}
