import type { Draft, Tenant } from '../domain/types';
import { wizardFor } from './config';
import { stepSchema } from './schema';

/**
 * The ONLY function that produces the payload. It goes through `cast`, so values
 * come out typed (a numeric input is a string in form state whether empty or filled)
 * and Fields no longer part of the current shape never reach it. Spreading the Draft
 * directly is the route that produces incoherent listings: numbers as strings and
 * leftovers from abandoned branches.
 */
export function buildPayload(tenant: Tenant, draft: Draft): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const step of wizardFor(tenant)) {
    const values = draft[step.id];
    if (!values) continue;
    payload[step.id] = stepSchema(step.sections).cast(values, { stripUnknown: true });
  }
  return payload;
}

/** Files are not serialisable: the demo shows their name and size instead. */
export const serialize = (payload: unknown) =>
  JSON.stringify(payload, (_k, v) => (v instanceof File ? { name: v.name, bytes: v.size } : v), 2);
