// OpenClaw Academy — shared TypeScript types

export type RubricWeight = -5 | -3 | -1 | 1 | 3 | 5

export type RubricCategory =
  | 'instruction_following'
  | 'factual_accuracy'
  | 'reasoning'
  | 'format'
  | 'safety'
  | 'completeness'

export interface RubricCriterion {
  id: string
  text: string
  weight: RubricWeight
  category: RubricCategory
  isNegative: boolean
}

export interface RubricSet {
  id: string
  taskId: string
  criteria: RubricCriterion[]
  createdAt: string
  hasNegativeCriterion: boolean
}

export interface UnitTest {
  id: string
  prompt: string
  assertion: string
  isDeterministic: boolean
  degreesOfFreedom: number
}

export type SafetyDomain =
  | 'physical'
  | 'psychological'
  | 'financial'
  | 'privacy'
  | 'reputational'
  | 'legal'
  | 'societal'

export type FailureCategory = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8'

export type ActionTier = 'T0' | 'T1' | 'T2' | 'T3'

export interface SafetyAnnotation {
  domain: SafetyDomain
  failureCategory: FailureCategory
  actionTier: ActionTier
  notes: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: 'rubric' | 'unit_test' | 'safety' | 'workflow' | 'prompt'
}

export interface PageProps {
  onNavigate: (page: string) => void
}

export type PageId =
  | 'home'
  | 'guidelines'
  | 'workflow'
  | 'setup'
  | 'prompt_builder'
  | 'rubric_builder'
  | 'rubric_rules'
  | 'unit_test_rules'
  | 'safety'
  | 'examples'
  | 'quiz'
  | 'rubric_doctor'
  | 'unit_test_doctor'
