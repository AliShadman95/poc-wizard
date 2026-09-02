import { SECTIONS } from '../sections';
import { STEP_IDS, STEP_TITLES } from '../domain/types';
import type { ResolvedSection, StepId, Tenant } from '../domain/types';

/** The Sections of a Step for one Tenant, in the order declared in SECTIONS. */
export function sectionsFor(tenant: Tenant, step: StepId): ResolvedSection[] {
  return SECTIONS.filter((s) => s.step === step)
    .map((s) => {
      const shape = s.byTenant[tenant];
      return shape ? { id: s.id, step: s.step, title: s.title, shape } : null;
    })
    .filter((s): s is ResolvedSection => s !== null);
}

export interface ResolvedStep {
  id: StepId;
  title: string;
  index: number;
  sections: ResolvedSection[];
}

/**
 * The full composition of the Wizard for one Tenant. This is the function to read
 * to answer "what does the wizard look like for ES?", given that Sections declare
 * their own position. See ADR 0002.
 */
export function wizardFor(tenant: Tenant): ResolvedStep[] {
  return STEP_IDS.map((id, index) => ({
    id,
    title: STEP_TITLES[id],
    index,
    sections: sectionsFor(tenant, id),
  }));
}

export const isStepId = (value: string | undefined): value is StepId =>
  STEP_IDS.includes(value as StepId);

export const pathForStep = (step: StepId) => `/listing/${step}`;
