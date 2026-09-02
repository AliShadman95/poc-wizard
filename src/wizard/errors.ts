import type { ResolvedSection, SectionId, StepValues } from '../domain/types';
import { activeFields } from './schema';

export interface ErrorEntry {
  path: string;
  fieldId: string;
  label: string;
  sectionTitle: string;
  message: string;
}

/** The DOM id the Error summary moves focus to. */
export const fieldId = (sectionId: SectionId, name: string) => `f-${sectionId}-${name}`;

/**
 * Flattens Formik's errors in descriptor order — Sections in rendering order, Fields
 * in declaration order. Formik's `errors` is a nested object of messages only:
 * without the descriptors you would have neither the label to display nor an order
 * matching what the user sees on screen.
 */
export function collectErrors(
  sections: ResolvedSection[],
  values: StepValues,
  errors: Record<string, unknown>,
): ErrorEntry[] {
  const entries: ErrorEntry[] = [];
  for (const section of sections) {
    const sectionErrors = errors[section.id] as Record<string, string> | undefined;
    if (!sectionErrors) continue;
    for (const field of activeFields(section, values)) {
      const message = sectionErrors[field.name];
      if (typeof message !== 'string') continue;
      entries.push({
        path: `${section.id}.${field.name}`,
        fieldId: fieldId(section.id, field.name),
        label: field.label,
        sectionTitle: section.title,
        message,
      });
    }
  }
  return entries;
}

export function focusField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  (el as HTMLElement).focus({ preventScroll: true });
}
