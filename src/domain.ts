export const TENANTS = ['IT', 'ES'] as const;
export type Tenant = (typeof TENANTS)[number];

export const STEP_IDS = ['multimedia', 'features', 'publication'] as const;
export type StepId = (typeof STEP_IDS)[number];

export const STEPS: { id: StepId; title: string }[] = [
  { id: 'multimedia', title: 'Multimedia' },
  { id: 'features', title: 'Caratteristiche' },
  { id: 'publication', title: 'Pubblicazione' },
];

export type ContractType = 'sale' | 'rent';

/** Values of one Step, keyed by section then by field. */
export type StepValues = Record<string, Record<string, unknown>>;
export type Draft = Partial<Record<StepId, StepValues>>;

export const isStepId = (v: string | undefined): v is StepId => STEP_IDS.includes(v as StepId);
export const pathForStep = (step: StepId) => `/listing/${step}`;
export const stepIndex = (step: StepId) => STEPS.findIndex((s) => s.id === step);

/** The DOM id of a field, shared by the input and the error summary that jumps to it. */
export const fieldId = (section: string, field: string) => `f-${section}-${field}`;
