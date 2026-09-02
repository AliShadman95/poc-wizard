import { emptyValue } from '../domain/fields';
import type { ResolvedSection, SectionShape, SectionValues, StepValues } from '../domain/types';
import { activeFields } from './schema';

const emptySection = (shape: SectionShape): SectionValues =>
  Object.fromEntries(activeFields(shape, undefined).map((f) => [f.name, emptyValue(f)]));

/** A Step's initial values: whatever is already in the Draft, otherwise empty. */
export function initialStepValues(sections: ResolvedSection[], saved: StepValues | undefined): StepValues {
  return Object.fromEntries(
    sections.map((s) => {
      const base = emptySection(s.shape);
      const previous = saved?.[s.id];
      return [s.id, previous ? { ...base, ...previous } : base];
    }),
  );
}

/**
 * Discriminant change: the abandoned branch's Fields leave the Section, the incoming
 * branch's Fields enter empty, and the base Fields keep their values. Rebuilding the
 * object rather than clearing individual keys is what makes it impossible to forget
 * one. See ADR 0003.
 */
export function applyDiscriminantChange(
  shape: SectionShape,
  previous: SectionValues,
  nextValue: string,
): SectionValues {
  const discriminantName = shape.discriminant?.field.name;
  const next = activeFields(shape, { ...(discriminantName ? { [discriminantName]: nextValue } : {}) });
  return Object.fromEntries(
    next.map((f) => [
      f.name,
      f.name === discriminantName ? nextValue : (previous[f.name] ?? emptyValue(f)),
    ]),
  );
}

/** The same cut applied to `touched`: without it, a stale error survives on an unmounted Field. */
export function pruneTouched(
  shape: SectionShape,
  previousTouched: Record<string, boolean> | undefined,
  nextValue: string,
): Record<string, boolean> {
  const discriminantName = shape.discriminant?.field.name;
  const keep = new Set(
    activeFields(shape, { ...(discriminantName ? { [discriminantName]: nextValue } : {}) }).map((f) => f.name),
  );
  return Object.fromEntries(Object.entries(previousTouched ?? {}).filter(([k]) => keep.has(k)));
}

/** Marks every Field present in the Step as touched, so inline errors become visible. */
export function touchedForStep(sections: ResolvedSection[], values: StepValues): Record<string, Record<string, boolean>> {
  return Object.fromEntries(
    sections.map((s) => [
      s.id,
      Object.fromEntries(activeFields(s.shape, values[s.id]).map((f) => [f.name, true])),
    ]),
  );
}
