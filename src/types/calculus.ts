export type TopicCategory =
  | 'numerical_methods'
  | 'definite_integrals'
  | 'direct'
  | 'substitution'
  | 'inverse_trig_hyperbolic'
  | 'trinomials'
  | 'parts';

export interface TheoryFormula {
  name: string;
  latexFormula: string;
  explanation: string;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latexMath: string;
  sideCalculations?: string[];
}

export interface NumericalNodeRow {
  i: number;
  xi: string;
  fxi: string;
  weight: number;
  weightedValue: string;
}

export interface VerificationInfo {
  type: string;
  latexMath: string;
  explanation: string;
}

export interface SolutionResult {
  problemStatementLatex: string;
  mainTopic: string;
  subTopic: string;
  theoryAndFormulas: TheoryFormula[];
  methodJustification: string;
  steps: SolutionStep[];
  verification: VerificationInfo;
  finalAnswerLatex: string;
  decimalApproximation?: string;
  commonPitfalls: string[];
  numericalTable?: NumericalNodeRow[];
}

export interface TopicInfo {
  id: TopicCategory;
  title: string;
  badge: string;
  summary: string;
  subtopics: string[];
  keyFormulas: { name: string; latex: string }[];
  overview: string;
}

export interface CuratedExample {
  id: string;
  topic: TopicCategory;
  title: string;
  subTopic: string;
  problemLatex: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  precomputedSolution: SolutionResult;
  numericalPreset?: {
    funcStr: string;
    a: number;
    b: number;
    n: number;
    method: 'left_riemann' | 'right_riemann' | 'midpoint' | 'trapezoidal' | 'simpson';
    exactValue?: number;
  };
}

export interface QuizOption {
  id: string;
  label: string;
  mathFormula?: string;
  isCorrect: boolean;
  feedback: string;
}

export interface PracticeProblem {
  id?: string;
  problemLatex: string;
  topic: string;
  subTopic: string;
  difficulty: string;
  hint1: string;
  hint2: string;
  finalAnswerLatex: string;
  quizQuestion?: string;
  quizOptions?: QuizOption[];
  solutionSteps: {
    stepNumber: number;
    title: string;
    latexMath: string;
    explanation: string;
  }[];
}
