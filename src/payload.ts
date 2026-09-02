import type { Draft, Tenant } from './domain';
import { featuresSchemaES } from './steps/features/schema.es';
import { featuresSchemaIT } from './steps/features/schema.it';
import { multimediaSchema } from './steps/multimedia/schema';
import { publicationSchema } from './steps/publication/schema';

/**
 * L'unica funzione che produce il payload, una riga per Step. Passa dal `cast` degli
 * schemi, quindi i numeri escono numeri (nel form sono stringhe) e i campi che lo
 * schema corrente non prevede — il canone di un ufficio, i dati catastali in Spagna —
 * non ci finiscono. Fare lo spread diretto della bozza li lascerebbe passare.
 */
export function buildPayload(tenant: Tenant, draft: Draft) {
  const features = tenant === 'IT' ? featuresSchemaIT : featuresSchemaES;
  const featureValues = draft.features ?? {};

  return {
    multimedia: multimediaSchema().cast(draft.multimedia ?? {}, { stripUnknown: true }),
    features: features(featureValues).cast(featureValues, { stripUnknown: true }),
    publication: publicationSchema().cast(draft.publication ?? {}, { stripUnknown: true }),
  };
}

/** I File non sono serializzabili: nella demo ne mostriamo nome e peso. */
export const serialize = (payload: unknown) =>
  JSON.stringify(payload, (_k, v) => (v instanceof File ? { name: v.name, bytes: v.size } : v), 2);
