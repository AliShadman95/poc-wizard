import type { AnyObjectSchema } from 'yup';
import { fieldId } from './domain';

/**
 * The schema is the single source for the error summary too: `describe()` hands back
 * the sections and fields in the order they were declared, each with the label set by
 * `.label()`. So there is no parallel list of fields to keep in step — write the schema
 * in the same order as the JSX and the summary follows the screen.
 */
interface Described {
  label?: string;
  fields?: Record<string, Described>;
}

export interface ErrorEntry {
  path: string;
  id: string;
  sectionTitle: string;
  label: string;
  message: string;
}

export function summarise(schema: AnyObjectSchema, errors: unknown): ErrorEntry[] {
  const described = schema.describe() as Described;
  const all = errors as Record<string, Record<string, string> | undefined> | undefined;
  const entries: ErrorEntry[] = [];

  for (const [sectionKey, section] of Object.entries(described.fields ?? {})) {
    for (const [fieldKey, field] of Object.entries(section.fields ?? {})) {
      const message = all?.[sectionKey]?.[fieldKey];
      if (typeof message !== 'string') continue;
      entries.push({
        path: `${sectionKey}.${fieldKey}`,
        id: fieldId(sectionKey, fieldKey),
        sectionTitle: section.label ?? sectionKey,
        label: field.label ?? fieldKey,
        message,
      });
    }
  }
  return entries;
}

/** Marks every field of the current schema as touched, so inline errors become visible. */
export function allTouched(schema: AnyObjectSchema): Record<string, Record<string, boolean>> {
  const described = schema.describe() as Described;
  return Object.fromEntries(
    Object.entries(described.fields ?? {}).map(([sectionKey, section]) => [
      sectionKey,
      Object.fromEntries(Object.keys(section.fields ?? {}).map((f) => [f, true])),
    ]),
  );
}

export function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus({ preventScroll: true });
}
