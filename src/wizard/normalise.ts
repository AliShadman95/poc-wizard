import { emptyValue } from '../domain/fields';
import type { ResolvedSection, SectionValues, StepValues } from '../domain/types';
import { activeFields, availableOptions } from './schema';

/**
 * Brings the Step's values back in line with what the descriptors currently allow:
 * Fields no longer active are dropped, Fields newly active enter empty, and a value
 * that is no longer among a Field's available options is cleared.
 *
 * Doing this as one pass over the descriptors — rather than as bespoke onChange
 * handlers on each controlling Field — is what makes it impossible to forget a case.
 * With a Discriminant in one Section and a Dependency reaching in from another, the
 * number of hand-written handlers needed would grow with every new relationship.
 * See ADR 0007.
 *
 * One pass can enable the next: clearing Contract type because "office" forbids
 * "rent" also removes that branch's Fields. Hence the loop to a fixed point, which
 * terminates because every pass only ever removes Fields or empties values.
 */
export function normaliseValues(sections: ResolvedSection[], values: StepValues): StepValues {
  let current = values;
  for (let pass = 0; pass < 5; pass++) {
    const next = onePass(sections, current);
    if (sameValues(next, current)) return next;
    current = next;
  }
  return current;
}

function onePass(sections: ResolvedSection[], values: StepValues): StepValues {
  return Object.fromEntries(
    sections.map((section) => {
      const previous = values[section.id] ?? {};
      const entries = activeFields(section, values).map((field) => {
        const held = previous[field.name];
        const allowed = availableOptions(field, values);
        const stillSelectable =
          !field.options || held === '' || held === undefined || allowed.some((o) => o.value === held);
        return [field.name, stillSelectable ? (held ?? emptyValue(field)) : emptyValue(field)];
      });
      return [section.id, Object.fromEntries(entries) as SectionValues];
    }),
  );
}

/** The same cut applied to `touched`: without it a stale error survives on an unmounted Field. */
export function normaliseTouched(
  sections: ResolvedSection[],
  values: StepValues,
  touched: Record<string, Record<string, boolean> | undefined>,
): Record<string, Record<string, boolean>> {
  return Object.fromEntries(
    sections.map((section) => {
      const keep = new Set(activeFields(section, values).map((f) => f.name));
      const previous = touched[section.id] ?? {};
      return [section.id, Object.fromEntries(Object.entries(previous).filter(([k]) => keep.has(k)))];
    }),
  );
}

/** Marks every Field present in the Step as touched, so inline errors become visible. */
export function touchedForStep(
  sections: ResolvedSection[],
  values: StepValues,
): Record<string, Record<string, boolean>> {
  return Object.fromEntries(
    sections.map((section) => [
      section.id,
      Object.fromEntries(activeFields(section, values).map((f) => [f.name, true])),
    ]),
  );
}

/** Values are two levels deep with primitive or File[] leaves, so this comparison suffices. */
export function sameValues(a: StepValues, b: StepValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const left = a[key] ?? {};
    const right = b[key] ?? {};
    const fields = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const field of fields) {
      if (!Object.is(left[field], right[field])) return false;
    }
  }
  return true;
}
