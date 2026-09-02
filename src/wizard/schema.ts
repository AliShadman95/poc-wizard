import * as Yup from 'yup';
import type { FieldDescriptor, ResolvedSection, SectionShape, SectionValues } from '../domain/types';

/**
 * The Fields actually present in a Section, given the current state of its
 * Discriminant. This is the single source of truth: rendering, the validation
 * schema, value initialisation and the Error summary all read from it. See ADR 0003.
 */
export function activeFields(shape: SectionShape, values: SectionValues | undefined): FieldDescriptor[] {
  if (!shape.discriminant) return shape.fields;
  const { field, branches } = shape.discriminant;
  const chosen = values?.[field.name];
  const branch = typeof chosen === 'string' && chosen in branches ? branches[chosen] : [];
  return [field, ...branch, ...shape.fields];
}

/**
 * A Section's schema depends on its Discriminant's value, so it has to be resolved
 * at validation time: that is what `Yup.lazy` is for, receiving the value of the
 * node it is mounted on.
 */
const sectionSchema = (shape: SectionShape) =>
  Yup.lazy((values: SectionValues | undefined) =>
    Yup.object(Object.fromEntries(activeFields(shape, values).map((f) => [f.name, f.schema]))),
  );

/**
 * A Step's schema: one key per Section, so Field paths are nested
 * (`address.postalCode`) and every error knows which Section it came from without
 * needing a separate lookup table.
 */
export const stepSchema = (sections: ResolvedSection[]) =>
  Yup.object(Object.fromEntries(sections.map((s) => [s.id, sectionSchema(s.shape)])));
