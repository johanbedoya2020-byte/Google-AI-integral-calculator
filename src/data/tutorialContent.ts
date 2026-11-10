import { SupportedLanguage } from '../i18n/translations';

export interface TutorialTopicItem {
  id: string;
  label: string;
  title: string;
  intro: string;
  blocks: {
    heading?: string;
    text?: string;
    latex?: string;
    alert?: string;
    subgrid?: { label: string; formula: string }[];
  }[];
  cards?: {
    icon: 'box' | 'rotate' | 'layers' | 'sparkles';
    title: string;
    desc: string;
  }[];
}

export const TUTORIAL_CONTENT: Record<SupportedLanguage, TutorialTopicItem[]> = {
  en: [
    {
      id: 'revolution',
      label: 'Solids of Revolution (Disks & Washers)',
      title: 'Solids of Revolution: The Disk and Washer Method',
      intro:
        'When a plane region is rotated around an axis of revolution, each infinitesimal rectangular strip perpendicular to the axis sweeps out a thin circular disk or washer.',
      blocks: [
        {
          heading: '1. Disk Method (Solid without holes):',
          text: 'When the region touches the axis of revolution throughout the interval:',
          latex: 'V = \\pi \\int_a^b [R(x)]^2 \\, dx',
        },
        {
          heading: '2. Washer Method (Hollow core):',
          text: 'When there is a gap between the region and the axis, with outer radius R(x) and inner radius r(x):',
          latex: 'V = \\pi \\int_a^b \\left([R(x)]^2 - [r(x)]^2\\right) dx',
          alert:
            '⚠️ Key Pitfall: Never compute \\pi \\int (R - r)^2 dx! The area of a washer is the difference of areas: \\pi R^2 - \\pi r^2.',
        },
      ],
    },
    {
      id: 'shells',
      label: 'Method of Cylindrical Shells',
      title: 'Method of Cylindrical Shells',
      intro:
        'The shell method uses representative strips parallel to the axis of revolution instead of perpendicular. When rotated, each strip creates an empty cylindrical shell of radius r, height h, and thickness dx.',
      blocks: [
        {
          heading: 'Unwrapping the Shell Intuition:',
          text: 'If you cut a cylindrical shell along its height and flatten it out, it forms a thin rectangular prism of dimensions 2π r by h by dx:',
          latex: 'V = 2\\pi \\int_a^b (\\text{radius})(\\text{height}) \\, dx',
        },
        {
          heading: 'When to prefer Shells over Washers:',
          text: 'When solving for x in terms of y is algebraically difficult (e.g. y = 2x² - x³), or when revolving around a vertical axis while integrating naturally with respect to x.',
        },
      ],
    },
    {
      id: 'cross_sections',
      label: 'Solids with Known Cross-Sections',
      title: 'Volume of Solids with Known Cross-Sections',
      intro:
        'Unlike solids of revolution which are circularly symmetric, solids with known cross-sections have an arbitrary base in the xy-plane, and cross-sections of a fixed geometric shape perpendicular to an axis.',
      blocks: [
        {
          heading: 'General Slicing Principle:',
          latex: 'V = \\int_a^b A(x) \\, dx',
          subgrid: [
            { label: 'Square:', formula: 'A = s^2' },
            { label: 'Semicircle:', formula: 'A = \\frac{\\pi}{8} s^2' },
            { label: 'Equilateral Triangle:', formula: 'A = \\frac{\\sqrt{3}}{4} s^2' },
            { label: 'Isosceles Right (Leg):', formula: 'A = \\frac{1}{2} s^2' },
          ],
        },
      ],
    },
    {
      id: 'arc_length',
      label: 'Arc Length of Curves',
      title: 'Arc Length of Plane Curves',
      intro:
        'To find the continuous length of a curved function y = f(x), we partition the interval into small segments and approximate the curve with straight secant chords.',
      blocks: [
        {
          heading: 'Infinitesimal Pythagorean Differentials:',
          latex: 'ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} dx',
        },
        {
          heading: 'Definite Arc Length Formula:',
          latex: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'surface_area',
      label: 'Surface Area of Revolution',
      title: 'Surface Area of Solids of Revolution',
      intro:
        'Rotating a curve y = f(x) around an axis produces a 2D surface in 3D space. Each infinitesimal arc segment ds sweeps out a conical frustum band of radius r and slant height ds.',
      blocks: [
        {
          heading: 'Differential Frustum Surface Band:',
          latex: 'S = 2\\pi \\int_a^b r \\, ds = 2\\pi \\int_a^b |f(x)| \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'phase2_methods',
      label: 'Phase 2 Integration Methods',
      title: 'Phase 2 Advanced Integration Methods',
      intro:
        'Essential analytical techniques for irrational, trigonometric, and transcendental integrals required in university calculus.',
      blocks: [
        {
          heading: '1. Integration of Irrational Functions:',
          text: 'Radical roots ⁿ√(ax + b) are rationalized using u = ⁿ√(ax + b) ⟹ uⁿ = ax + b, eliminating fractional exponents.',
        },
        {
          heading: '2. Trigonometric Integrals:',
          text: 'Evaluates ∫ sinᵐ(x) cosⁿ(x) dx using Pythagorean identities (sin²x + cos²x = 1) or half-angle power reductions.',
        },
        {
          heading: '3. Trigonometric Substitution:',
          text: 'Eliminates quadratic radicals: √(a² - x²) ⟹ x = a sin(θ), √(a² + x²) ⟹ x = a tan(θ), √(x² - a²) ⟹ x = a sec(θ).',
        },
        {
          heading: '4. Universal Weierstrass Substitution:',
          text: 'Sets t = tan(x/2), converting any trigonometric rational integrand into standard algebraic fractions: sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), dx = 2dt/(1+t²).',
        },
      ],
    },
    {
      id: 'geogebra_controls',
      label: 'GeoGebra 2D & 3D Controls Guide',
      title: 'How to Use the GeoGebra 2D & 3D Interactive Controls',
      intro:
        'The interactive studio features real-time 2D Cartesian inspection and full 3D WebGL orbit navigation.',
      blocks: [],
      cards: [
        {
          icon: 'box',
          title: '3D OrbitControls',
          desc: 'Left click & drag to rotate in 3D space. Right click & drag to pan the viewport. Scroll wheel to zoom in and out.',
        },
        {
          icon: 'rotate',
          title: 'Revolution Angle Slider',
          desc: 'Drag the angle slider from 0° to 360° to watch the 3D solid sweep and revolve smoothly in real time.',
        },
        {
          icon: 'layers',
          title: 'Representative Slice Slider',
          desc: 'Move the x-slice slider to inspect the exact differential element dx, disk, washer, or shell at any coordinate.',
        },
        {
          icon: 'sparkles',
          title: 'AI Step-by-Step Solver',
          desc: 'Click "Send to Step-by-Step Solver" to transfer the active formula to the tutor for rigorous derivations and proofs.',
        },
      ],
    },
  ],

  es: [
    {
      id: 'revolution',
      label: 'Sólidos de Revolución (Discos y Arandelas)',
      title: 'Sólidos de Revolución: Método de los Discos y las Arandelas',
      intro:
        'Al rotar una región plana alrededor de un eje de revolución, cada rectángulo infinitesimal perpendicular al eje barre un delgado disco circular o una arandela cilíndrica.',
      blocks: [
        {
          heading: '1. Método de los Discos (Sólido macizo sin huecos):',
          text: 'Cuando la región toca el eje de revolución a lo largo de todo el intervalo:',
          latex: 'V = \\pi \\int_a^b [R(x)]^2 \\, dx',
        },
        {
          heading: '2. Método de las Arandelas (Núcleo hueco):',
          text: 'Cuando existe un espacio entre la región y el eje, con radio exterior R(x) y radio interior r(x):',
          latex: 'V = \\pi \\int_a^b \\left([R(x)]^2 - [r(x)]^2\\right) dx',
          alert:
            '⚠️ Error común crítico: ¡Nunca calcules \\pi \\int (R - r)^2 dx! El área de una arandela es la diferencia de áreas: \\pi R^2 - \\pi r^2.',
        },
      ],
    },
    {
      id: 'shells',
      label: 'Método de los Casquetes Cilíndricos',
      title: 'Método de los Casquetes Cilíndricos (Capas)',
      intro:
        'El método de casquetes utiliza franjas representativas paralelas al eje de revolución en lugar de perpendiculares. Al rotar, cada franja engendra una capa cilíndrica hueca de radio r, altura h y grosor dx.',
      blocks: [
        {
          heading: 'Intuición al Desenrollar el Casquete:',
          text: 'Si cortas un casquete cilíndrico a lo largo de su altura y lo extiendes, forma un prisma rectangular plano de volumen 2π r · h · dx:',
          latex: 'V = 2\\pi \\int_a^b (\\text{radio})(\\text{altura}) \\, dx',
        },
        {
          heading: '¿Cuándo preferir Casquetes sobre Arandelas?',
          text: 'Cuando despejar x en términos de y resulta algebraicamente engorroso (por ejemplo, y = 2x² - x³), o al rotar alrededor de un eje vertical manteniendo la integración natural respecto a x.',
        },
      ],
    },
    {
      id: 'cross_sections',
      label: 'Secciones Transversales Conocidas',
      title: 'Volumen de Sólidos con Secciones Transversales Conocidas',
      intro:
        'A diferencia de los sólidos de revolución (que poseen simetría circular), estos sólidos tienen una base arbitraria en el plano xy y secciones transversales de forma geométrica fija perpendiculares a un eje.',
      blocks: [
        {
          heading: 'Principio General de Rebanadas (Cavalieri):',
          latex: 'V = \\int_a^b A(x) \\, dx',
          subgrid: [
            { label: 'Cuadrado:', formula: 'A = s^2' },
            { label: 'Semicírculo:', formula: 'A = \\frac{\\pi}{8} s^2' },
            { label: 'Triángulo Equilátero:', formula: 'A = \\frac{\\sqrt{3}}{4} s^2' },
            { label: 'Triángulo Rectángulo Isósceles:', formula: 'A = \\frac{1}{2} s^2' },
          ],
        },
      ],
    },
    {
      id: 'arc_length',
      label: 'Longitud de Arco de Curvas',
      title: 'Longitud de Arco de Curvas Planas',
      intro:
        'Para calcular la longitud continua de una curva suave y = f(x), subdividimos el intervalo en tramos infinitesimales y aproximamos la curva mediante cuerdas secantes.',
      blocks: [
        {
          heading: 'Diferencial Pitagórico Infinitesimal:',
          latex: 'ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} dx',
        },
        {
          heading: 'Fórmula de Longitud de Arco:',
          latex: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'surface_area',
      label: 'Área de Superficie de Revolución',
      title: 'Área de Superficie de Sólidos de Revolución',
      intro:
        'Al rotar una curva y = f(x) alrededor de un eje, se engendra una superficie 2D en el espacio 3D. Cada segmento de arco ds barre una banda cónica de tronco de cono de área 2π r ds.',
      blocks: [
        {
          heading: 'Banda Superficial Diferencial:',
          latex: 'S = 2\\pi \\int_a^b r \\, ds = 2\\pi \\int_a^b |f(x)| \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'phase2_methods',
      label: 'Métodos de Integración de la Fase 2',
      title: 'Métodos Avanzados de Integración (Fase 2)',
      intro:
        'Técnicas analíticas indispensables para integrales irracionales, trigonométricas y trascendentes del cálculo universitario.',
      blocks: [
        {
          heading: '1. Integración de Funciones Irracionales:',
          text: 'Se racionalizan raíces ⁿ√(ax + b) haciendo el cambio u = ⁿ√(ax + b) ⟹ uⁿ = ax + b, eliminando exponentes fraccionarios.',
        },
        {
          heading: '2. Integrales Trigonométricas:',
          text: 'Resuelve ∫ sinᵐ(x) cosⁿ(x) dx usando identidades pitagóricas (sin²x + cos²x = 1) o fórmulas de reducción de ángulo mitad.',
        },
        {
          heading: '3. Sustitución Trigonométrica:',
          text: 'Elimina radicales cuadráticos: √(a² - x²) ⟹ x = a sin(θ), √(a² + x²) ⟹ x = a tan(θ), √(x² - a²) ⟹ x = a sec(θ).',
        },
        {
          heading: '4. Sustitución Universal de Weierstrass:',
          text: 'Define t = tan(x/2), transformando cualquier función racional trigonométrica en fracciones algebraicas simples: sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), dx = 2dt/(1+t²).',
        },
      ],
    },
    {
      id: 'geogebra_controls',
      label: 'Guía de Controles GeoGebra 2D y 3D',
      title: 'Cómo Utilizar los Controles Interactivos de GeoGebra',
      intro:
        'El estudio interactivo combina visualización cartesiana 2D y exploración espacial 3D completa mediante WebGL.',
      blocks: [],
      cards: [
        {
          icon: 'box',
          title: 'Controles de Órbita 3D',
          desc: 'Clic izquierdo y arrastrar para rotar en 3D. Clic derecho y arrastrar para desplazar la cámara. Rueda del ratón para zoom.',
        },
        {
          icon: 'rotate',
          title: 'Deslizador de Ángulo de Revolución',
          desc: 'Mueve el control de 0° a 360° para observar cómo el sólido 3D se genera y se cierra en tiempo real.',
        },
        {
          icon: 'layers',
          title: 'Corte Representativo x',
          desc: 'Ajusta la posición del corte para inspeccionar el elemento diferencial dx, disco, arandela o casquete en cualquier coordenada.',
        },
        {
          icon: 'sparkles',
          title: 'Solucionador Paso a Paso con IA',
          desc: 'Haz clic en "Enviar al Solucionador Paso a Paso" para transferir la fórmula y obtener una demostración analítica formal.',
        },
      ],
    },
  ],

  pt: [
    {
      id: 'revolution',
      label: 'Sólidos de Revolução (Discos e Arruelas)',
      title: 'Sólidos de Revolução: Método dos Discos e das Arruelas',
      intro:
        'Quando uma região plana é rotacionada em torno de um eixo de revolução, cada retângulo infinitesimal perpendicular ao eixo gera um disco circular ou uma arruela oca.',
      blocks: [
        {
          heading: '1. Método dos Discos (Sólido maciço sem furos):',
          text: 'Quando a região toca o eixo de revolução ao longo de todo o intervalo:',
          latex: 'V = \\pi \\int_a^b [R(x)]^2 \\, dx',
        },
        {
          heading: '2. Método das Arruelas (Núcleo oco):',
          text: 'Quando há um espaço entre a região e o eixo, com raio externo R(x) e raio interno r(x):',
          latex: 'V = \\pi \\int_a^b \\left([R(x)]^2 - [r(x)]^2\\right) dx',
          alert:
            '⚠️ Erro conceitual frequente: Nunca calcule \\pi \\int (R - r)^2 dx! A área da arruela é a diferença de áreas: \\pi R^2 - \\pi r^2.',
        },
      ],
    },
    {
      id: 'shells',
      label: 'Método das Cascas Cilíndricas',
      title: 'Método das Cascas Cilíndricas',
      intro:
        'O método das cascas utiliza faixas representativas paralelas ao eixo de revolução em vez de perpendiculares. Ao girar, cada faixa cria uma casca cilíndrica oca de raio r, altura h e espessura dx.',
      blocks: [
        {
          heading: 'Intuição do Desenrolar da Casca:',
          text: 'Se você cortar uma casca cilíndrica ao longo da altura e planificá-la, ela forma um paralelepípedo retangular fino de volume 2π r · h · dx:',
          latex: 'V = 2\\pi \\int_a^b (\\text{raio})(\\text{altura}) \\, dx',
        },
        {
          heading: 'Quando escolher Cascas em vez de Arruelas?',
          text: 'Quando isolar x em termos de y for algebricamente complexo (ex.: y = 2x² - x³), ou ao girar em torno de um eixo vertical integrando naturalmente em relação a x.',
        },
      ],
    },
    {
      id: 'cross_sections',
      label: 'Seções Transversais Conhecidas',
      title: 'Volume de Sólidos com Seções Transversais Conhecidas',
      intro:
        'Diferente dos sólidos de revolução com simetria circular, estes sólidos possuem uma base arbitrária no plano xy e seções transversais com forma geométrica fixa perpendiculares a um eixo.',
      blocks: [
        {
          heading: 'Princípio Geral de Fatiamento (Cavalieri):',
          latex: 'V = \\int_a^b A(x) \\, dx',
          subgrid: [
            { label: 'Quadrado:', formula: 'A = s^2' },
            { label: 'Semicírculo:', formula: 'A = \\frac{\\pi}{8} s^2' },
            { label: 'Triângulo Equilátero:', formula: 'A = \\frac{\\sqrt{3}}{4} s^2' },
            { label: 'Triângulo Retângulo Isósceles:', formula: 'A = \\frac{1}{2} s^2' },
          ],
        },
      ],
    },
    {
      id: 'arc_length',
      label: 'Comprimento de Arco de Curvas',
      title: 'Comprimento de Arco de Curvas Planas',
      intro:
        'Para determinar o comprimento contínuo de uma curva suave y = f(x), subdividimos o intervalo em pequenos segmentos e aproximamos a curva por cordas secantes retilíneas.',
      blocks: [
        {
          heading: 'Diferencial Pitagórico Infinitesimal:',
          latex: 'ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} dx',
        },
        {
          heading: 'Fórmula do Comprimento de Arco:',
          latex: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'surface_area',
      label: 'Área de Superfície de Revolução',
      title: 'Área de Superfície de Sólidos de Revolução',
      intro:
        'Ao girar uma curva y = f(x) em torno de um eixo, forma-se uma superfície 2D no espaço 3D. Cada segmento ds varre uma faixa cônica de tronco de cone com área 2π r ds.',
      blocks: [
        {
          heading: 'Faixa Diferencial de Superfície:',
          latex: 'S = 2\\pi \\int_a^b r \\, ds = 2\\pi \\int_a^b |f(x)| \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'phase2_methods',
      label: 'Métodos de Integração da Fase 2',
      title: 'Métodos Avançados de Integração (Fase 2)',
      intro:
        'Técnicas analíticas fundamentais para o cálculo de integrais irracionais, trigonométricas e transcendentais.',
      blocks: [
        {
          heading: '1. Integração de Funções Irracionais:',
          text: 'Raízes radicais ⁿ√(ax + b) são racionalizadas com u = ⁿ√(ax + b) ⟹ uⁿ = ax + b, eliminando expoentes fracionários.',
        },
        {
          heading: '2. Integrais Trigonométricas:',
          text: 'Avaliação de ∫ sinᵐ(x) cosⁿ(x) dx usando identidades pitagóricas (sin²x + cos²x = 1) ou redução por ângulo metade.',
        },
        {
          heading: '3. Substituição Trigonométrica:',
          text: 'Elimina radicais quadráticos: √(a² - x²) ⟹ x = a sin(θ), √(a² + x²) ⟹ x = a tan(θ), √(x² - a²) ⟹ x = a sec(θ).',
        },
        {
          heading: '4. Substituição Universal de Weierstrass:',
          text: 'Define t = tan(x/2), convertendo qualquer função racional trigonométrica em frações algébricas ordinárias: sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), dx = 2dt/(1+t²).',
        },
      ],
    },
    {
      id: 'geogebra_controls',
      label: 'Guia de Controles GeoGebra 2D e 3D',
      title: 'Como Utilizar os Controles Interativos do GeoGebra',
      intro:
        'O estúdio interativo reúne inspeção cartesiana 2D e navegação orbital 3D completa em WebGL.',
      blocks: [],
      cards: [
        {
          icon: 'box',
          title: 'Controles de Órbita 3D',
          desc: 'Clique esquerdo e arraste para girar em 3D. Clique direito e arraste para mover o plano. Roda do mouse para zoom.',
        },
        {
          icon: 'rotate',
          title: 'Controle de Ângulo de Revolução',
          desc: 'Arraste de 0° a 360° para ver o sólido 3D girar e se fechar em tempo real.',
        },
        {
          icon: 'layers',
          title: 'Fatia Representativa x',
          desc: 'Ajuste a posição para inspecionar o elemento diferencial dx, disco, arruela ou casca cilíndrica em qualquer coordenada.',
        },
        {
          icon: 'sparkles',
          title: 'Solucionador Passo a Passo com IA',
          desc: 'Clique em "Enviar ao Solucionador Passo a Passo" para transferir a fórmula e obter a demonstração analítica completa.',
        },
      ],
    },
  ],

  fr: [
    {
      id: 'revolution',
      label: 'Solides de Révolution (Disques & Rondelles)',
      title: 'Solides de Révolution : Méthode des Disques et des Rondelles',
      intro:
        'Lorsqu’une région plane tourne autour d’un axe de révolution, chaque bande rectangulaire infinitésimale perpendiculaire à l’axe balaye un mince disque circulaire ou une rondelle.',
      blocks: [
        {
          heading: '1. Méthode des Disques (Solide plein sans trou) :',
          text: 'Lorsque la région touche l’axe de révolution sur l’ensemble de l’intervalle :',
          latex: 'V = \\pi \\int_a^b [R(x)]^2 \\, dx',
        },
        {
          heading: '2. Méthode des Rondelles (Cœur évidé) :',
          text: 'Lorsqu’il existe un vide entre la région et l’axe, avec rayon externe R(x) et rayon interne r(x) :',
          latex: 'V = \\pi \\int_a^b \\left([R(x)]^2 - [r(x)]^2\\right) dx',
          alert:
            '⚠️ Erreur fréquente capitale : Ne calculez jamais \\pi \\int (R - r)^2 dx ! L’aire d’une rondelle est la différence des aires : \\pi R^2 - \\pi r^2.',
        },
      ],
    },
    {
      id: 'shells',
      label: 'Méthode des Tubes / Cylindres',
      title: 'Méthode des Tubes (Cylindres Concentriques)',
      intro:
        'La méthode des tubes utilise des bandes représentatives parallèles à l’axe de révolution. En tournant, chaque bande crée un cylindre creux de rayon r, de hauteur h et d’épaisseur dx.',
      blocks: [
        {
          heading: 'Intuition du Déroulement du Cylindre :',
          text: 'En coupant le cylindre selon sa hauteur et en l’aplatissant, il forme un pavé rectangulaire mince de volume 2π r · h · dx :',
          latex: 'V = 2\\pi \\int_a^b (\\text{rayon})(\\text{hauteur}) \\, dx',
        },
        {
          heading: 'Quand privilégier les Tubes par rapport aux Rondelles ?',
          text: 'Lorsque l’expression de x en fonction de y est difficile à obtenir (ex. y = 2x² - x³), ou lors d’une révolution autour d’un axe vertical tout en intégrant par rapport à x.',
        },
      ],
    },
    {
      id: 'cross_sections',
      label: 'Sections Transversales Connues',
      title: 'Volume de Solides à Sections Transversales Connues',
      intro:
        'Contrairement aux solides de révolution à symétrie circulaire, ces solides possèdent une base quelconque dans le plan xy et des coupes transversales géométriques fixes perpendiculaires à un axe.',
      blocks: [
        {
          heading: 'Principe Général des Tranches (Cavalieri) :',
          latex: 'V = \\int_a^b A(x) \\, dx',
          subgrid: [
            { label: 'Carré :', formula: 'A = s^2' },
            { label: 'Demi-disque :', formula: 'A = \\frac{\\pi}{8} s^2' },
            { label: 'Triangle Équilatéral :', formula: 'A = \\frac{\\sqrt{3}}{4} s^2' },
            { label: 'Triangle Rectangle Isocèle :', formula: 'A = \\frac{1}{2} s^2' },
          ],
        },
      ],
    },
    {
      id: 'arc_length',
      label: 'Longueur d’Arc de Courbes',
      title: 'Longueur d’Arc de Courbes Planes',
      intro:
        'Pour déterminer la longueur continue d’une courbe régulière y = f(x), nous subdivisons l’intervalle en segments et approchons la courbe par des cordes sécantes.',
      blocks: [
        {
          heading: 'Élément Différentiel Pythagoricien :',
          latex: 'ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} dx',
        },
        {
          heading: 'Formule de la Longueur d’Arc :',
          latex: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'surface_area',
      label: 'Aire de Surface de Révolution',
      title: 'Aire de Surface des Solides de Révolution',
      intro:
        'Faire tourner une courbe y = f(x) autour d’un axe engendre une surface 2D dans l’espace 3D. Chaque élément d’arc ds balaye un tronc de cône mince d’aire 2π r ds.',
      blocks: [
        {
          heading: 'Bande Différentielle de Surface :',
          latex: 'S = 2\\pi \\int_a^b r \\, ds = 2\\pi \\int_a^b |f(x)| \\sqrt{1 + [f\'(x)]^2} \\, dx',
        },
      ],
    },
    {
      id: 'phase2_methods',
      label: 'Méthodes d’Intégration de la Phase 2',
      title: 'Méthodes Avancées d’Intégration (Phase 2)',
      intro:
        'Techniques analytiques fondamentales pour l’intégration de fonctions irrationnelles, trigonométriques et transcendantes.',
      blocks: [
        {
          heading: '1. Intégration de Fonctions Irrationnelles :',
          text: 'Les radicaux ⁿ√(ax + b) sont rationalisés par le changement de variable u = ⁿ√(ax + b) ⟹ uⁿ = ax + b, éliminant les racines.',
        },
        {
          heading: '2. Intégrales Trigonométriques :',
          text: 'Calcul de ∫ sinᵐ(x) cosⁿ(x) dx via les identités pythagoriciennes (sin²x + cos²x = 1) ou les formules d’abaissement de degré.',
        },
        {
          heading: '3. Substitution Trigonométrique :',
          text: 'Élimine les radicaux quadratiques : √(a² - x²) ⟹ x = a sin(θ), √(a² + x²) ⟹ x = a tan(θ), √(x² - a²) ⟹ x = a sec(θ).',
        },
        {
          heading: '4. Substitution Universelle de Weierstrass :',
          text: 'Pose t = tan(x/2), transformant toute fraction rationnelle trigonométrique en fraction rationnelle algébrique : sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), dx = 2dt/(1+t²).',
        },
      ],
    },
    {
      id: 'geogebra_controls',
      label: 'Guide des Contrôles GeoGebra 2D & 3D',
      title: 'Utilisation des Contrôles Interactifs GeoGebra',
      intro:
        'Le studio interactif combine l’inspection cartésienne 2D et la navigation orbitale 3D complète sous WebGL.',
      blocks: [],
      cards: [
        {
          icon: 'box',
          title: 'Commandes Orbitales 3D',
          desc: 'Clic gauche et glisser pour pivoter en 3D. Clic droit et glisser pour déplacer la vue. Molette pour zoomer.',
        },
        {
          icon: 'rotate',
          title: 'Curseur d’Angle de Révolution',
          desc: 'Faites glisser de 0° à 360° pour voir le solide se former et s’enrouler en direct.',
        },
        {
          icon: 'layers',
          title: 'Curseur de Tranche x',
          desc: 'Déplacez la tranche pour inspecter l’élément différentiel dx, disque, rondelle ou tube cylindrique à n’importe quelle abscisse.',
        },
        {
          icon: 'sparkles',
          title: 'Solveur Étape par Étape avec IA',
          desc: 'Cliquez sur "Envoyer au Solveur Étape par Étape" pour transférer l’équation et obtenir une démonstration analytique complète.',
        },
      ],
    },
  ],
};
