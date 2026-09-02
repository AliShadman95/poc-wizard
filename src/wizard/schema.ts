import * as Yup from 'yup';
import type {
  FieldDescriptor,
  FieldRef,
  Option,
  ResolvedSection,
  StepValues,
} from '../domain/types';

/** Reads a Field's current value from anywhere in the Step. */
export const valueAt = (values: StepValues, ref: FieldRef): string | undefined => {
  const raw = values?.[ref.section]?.[ref.name];
  return typeof raw === 'string' ? raw : undefined;
};

/**
 * The Fields actually present in a Section, given the whole Step's current values.
 * It reads the whole Step and not just the Section because a Field can be revealed
 * by a Discriminant of its own Section OR by a Dependency on another Section.
 *
 * This is the single source of truth: rendering, the validation schema, value
 * normalisation and the Error summary all read from it. See ADR 0003.
 */
export function activeFields(section: ResolvedSection, values: StepValues): FieldDescriptor[] {
  const { shape } = section;
  const result: FieldDescriptor[] = [];

  if (shape.discriminant) {
    const { field, branches } = shape.discriminant;
    result.push(field);
    const chosen = valueAt(values, { section: section.id, name: field.name });
    if (chosen && chosen in branches) result.push(...branches[chosen]);
  }

  for (const dependency of shape.dependencies ?? []) {
    const chosen = valueAt(values, dependency.on);
    if (chosen && chosen in dependency.branches) result.push(...dependency.branches[chosen]);
  }

  result.push(...shape.fields);
  return result;
}

/**
 * The options still selectable for a Field, once any constraint from elsewhere is
 * applied: choosing "office" in Main details removes "rent" from Contract type.
 */
export function availableOptions(field: FieldDescriptor, values: StepValues): Option[] {
  const options = field.options ?? [];
  const constraint = field.constrainedBy;
  if (!constraint) return options;
  const chosen = valueAt(values, constraint.on);
  if (!chosen || !(chosen in constraint.allowed)) return options;
  const allowed = new Set(constraint.allowed[chosen]);
  return options.filter((o) => allowed.has(o.value));
}

/**
 * A Step's schema. It is resolved lazily against the whole Step's values because a
 * Section's shape can depend on a Field in another Section — so, unlike before, the
 * laziness has to sit at Step level rather than per Section.
 *
 * One key per Section keeps Field paths nested (`address.postalCode`), so every error
 * knows which Section it came from without a separate lookup table.
 */
export const stepSchema = (sections: ResolvedSection[]) =>
  Yup.lazy((values: StepValues) =>
    Yup.object(
      Object.fromEntries(
        sections.map((section) => [
          section.id,
          Yup.object(
            Object.fromEntries(
              activeFields(section, values ?? {}).map((f) => [f.name, f.schema]),
            ),
          ),
        ]),
      ),
    ),
  );
