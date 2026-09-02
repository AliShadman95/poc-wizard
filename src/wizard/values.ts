import type { ResolvedSection, StepValues } from '../domain/types';
import { normaliseValues } from './normalise';

/**
 * A Step's initial values: whatever is already in the Draft, otherwise empty.
 * The result is normalised, so a Draft saved under different conditions cannot
 * reintroduce Fields that the current values no longer allow.
 */
export function initialStepValues(
  sections: ResolvedSection[],
  saved: StepValues | undefined,
): StepValues {
  const seeded = Object.fromEntries(sections.map((s) => [s.id, { ...(saved?.[s.id] ?? {}) }]));
  return normaliseValues(sections, seeded);
}
