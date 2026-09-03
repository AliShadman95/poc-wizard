import type { Draft, Tenant } from './domain';
import { getFeaturesSchema } from './steps/features/schema';
import { multimediaSchema } from './steps/multimedia/schema';
import { publicationSchema } from './steps/publication/schema';

/**
 * The only function that produces the payload, one line per Step. It goes through the
 * schemas' `cast`, so numbers come out as numbers (in form state they are strings) and
 * fields the current schema does not declare — the rent figures after switching to a
 * sale, the land registry in Spain — never reach it. Spreading the draft directly would
 * let them through.
 */
export function buildPayload(tenant: Tenant, draft: Draft) {
  const features = getFeaturesSchema(tenant);
  const featureValues = draft.features ?? {};

  return {
    multimedia: multimediaSchema().cast(draft.multimedia ?? {}, { stripUnknown: true }),
    features: features(featureValues).cast(featureValues, { stripUnknown: true }),
    publication: publicationSchema().cast(draft.publication ?? {}, { stripUnknown: true }),
  };
}

/** Files are not serialisable: the demo shows their name and size instead. */
export const serialize = (payload: unknown) =>
  JSON.stringify(payload, (_k, v) => (v instanceof File ? { name: v.name, bytes: v.size } : v), 2);
