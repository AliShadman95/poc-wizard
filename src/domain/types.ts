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
 * The set of Discriminant values is closed. Adding one here breaks compilation in
 * every Discriminant that uses it, until its own set of Fields is declared.
 * See docs/adr/0003.
 */
export const CONTRACT_TYPES = ['sale', 'rent'] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

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

export interface FieldDescriptor {
  /** Name relative to the Section. The full path is `${sectionId}.${name}`. */
  name: string;
  label: string;
  kind: FieldKind;
  options?: Option[];
  help?: string;
  schema: Yup.Schema;
}

/**
 * A Field whose value selects which other Fields exist in the Section.
 * `branches` is a TOTAL map over the admissible values: that totality is what makes
 * adding a new value a compile error. See docs/adr/0003.
 */
export interface Discriminant<V extends string> {
  field: FieldDescriptor;
  branches: Record<V, FieldDescriptor[]>;
}

export interface SectionShape {
  /** Fields always present, rendered after the Discriminant block. */
  fields: FieldDescriptor[];
  discriminant?: Discriminant<string>;
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
