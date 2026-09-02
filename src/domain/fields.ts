import * as Yup from 'yup';
import type { FieldDescriptor, Option, SectionShape, Tenant } from './types';
import { TENANTS } from './types';

type Extra = Partial<Pick<FieldDescriptor, 'help' | 'options' | 'constrainedBy'>>;

export const text = (name: string, label: string, schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'text', schema, ...extra,
});

export const num = (name: string, label: string, schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'number', schema, ...extra,
});

export const select = (name: string, label: string, options: Option[], schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'select', options, schema, ...extra,
});

export const radio = (name: string, label: string, options: Option[], schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'radio', options, schema, ...extra,
});

export const textarea = (name: string, label: string, schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'textarea', schema, ...extra,
});

export const files = (name: string, label: string, schema: Yup.Schema, extra: Extra = {}): FieldDescriptor => ({
  name, label, kind: 'files', schema, ...extra,
});

/**
 * Declares explicitly that a Section has the same shape in every market.
 * It is a claim about the domain, not a shortcut: Sections that *differ* must
 * spell the map out, so that adding a Tenant breaks them.
 */
export const sameForAllTenants = (shape: SectionShape): Record<Tenant, SectionShape | null> =>
  Object.fromEntries(TENANTS.map((t) => [t, shape])) as Record<Tenant, SectionShape | null>;

/** A Field's empty value, used to initialise and to clear abandoned branches. */
export const emptyValue = (field: FieldDescriptor): unknown => (field.kind === 'files' ? [] : '');
