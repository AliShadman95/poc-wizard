import type * as Yup from 'yup';

export const TENANTS = ['IT', 'ES'] as const;
export type Tenant = (typeof TENANTS)[number];

export const STEP_IDS = ['multimedia', 'features', 'publication'] as const;
export type StepId = (typeof STEP_IDS)[number];

/** Display strings stay in the market's language: this is product copy, not code. */
export const STEP_TITLES: Record<StepId, string> = {
  multimedia: 'Multimedia',
  features: 'Caratteristiche',
  publication: 'Pubblicazione',
};

/**
 * Closed sets of domain values. Adding one breaks compilation in every total map
 * keyed by it — branches, dependencies and option constraints alike — until the new
 * value's behaviour is declared. See docs/adr/0003.
 */
export const CONTRACT_TYPES = ['sale', 'rent'] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const PROPERTY_TYPES = ['apartment', 'house', 'office'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type SectionId =
  | 'photos'
  | 'floorPlans'
  | 'mainDetails'
  | 'address'
  | 'contractAndPrice'
  | 'landRegistry'
  | 'visibility';

export type FieldKind = 'text' | 'number' | 'select' | 'radio' | 'textarea' | 'files';

export interface Option {
  value: string;
  label: string;
}

/** Points at a Field, possibly in a different Section of the same Step. */
export interface FieldRef {
  section: SectionId;
  name: string;
}

/**
 * Restricts which of a Field's options remain selectable, based on the value of a
 * Field elsewhere. `allowed` is a TOTAL map over the controlling Field's values, so
 * a new value cannot silently leave every option available.
 */
export interface OptionConstraint<V extends string> {
  on: FieldRef;
  allowed: Record<V, string[]>;
}

export interface FieldDescriptor {
  /** Name relative to the Section. The full path is `${sectionId}.${name}`. */
  name: string;
  label: string;
  kind: FieldKind;
  options?: Option[];
  help?: string;
  schema: Yup.Schema;
  constrainedBy?: OptionConstraint<string>;
}

/**
 * A Field OF THIS SECTION whose value selects which other Fields of this Section
 * exist. `branches` is a TOTAL map over the admissible values. See docs/adr/0003.
 */
export interface Discriminant<V extends string> {
  field: FieldDescriptor;
  branches: Record<V, FieldDescriptor[]>;
}

/**
 * The same idea, but the controlling Field lives in ANOTHER Section of the same Step:
 * choosing "office" in Main details reveals a Field in Contract and price. Kept
 * separate from Discriminant precisely because the controlling Field is not ours to
 * render or clear — we only react to it.
 */
export interface Dependency<V extends string> {
  on: FieldRef;
  branches: Record<V, FieldDescriptor[]>;
}

export interface SectionShape {
  /** Fields always present, rendered after the conditional blocks. */
  fields: FieldDescriptor[];
  discriminant?: Discriminant<string>;
  dependencies?: Dependency<string>[];
}

/**
 * `null` means: this Section does not exist for that Tenant (type C variation).
 * The map is total over Tenants, so adding one forces every Section to declare
 * explicitly either its shape or its absence. See docs/adr/0002.
 */
export interface SectionDescriptor {
  id: SectionId;
  step: StepId;
  title: string;
  byTenant: Record<Tenant, SectionShape | null>;
}

/** A Section resolved for one Tenant: it exists and it has a shape. */
export interface ResolvedSection {
  id: SectionId;
  step: StepId;
  title: string;
  shape: SectionShape;
}

export type SectionValues = Record<string, unknown>;
export type StepValues = Record<string, SectionValues>;
export type Draft = Partial<Record<StepId, StepValues>>;
